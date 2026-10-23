import { parseSegment } from './dartMath';
import type { BullRule } from '../types/darts';
import type { BoardSignal, BluetoothConnectionState } from '../types/bluetooth';

export const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
export const NOTIFY_CHAR_UUID = '6e40fff6-b5a3-f393-e0a9-e50e24dcca9e';

type SignalListener = (signal: BoardSignal) => void;
type StateListener = (state: BluetoothConnectionState, deviceName: string | null, error: string | null) => void;

class BleConnector {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  private state: BluetoothConnectionState = 'disconnected';
  private deviceName: string | null = null;
  private errorMessage: string | null = null;

  private signalListeners: Set<SignalListener> = new Set();
  private stateListeners: Set<StateListener> = new Set();
  private bullRule: BullRule = 'fat';

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  public setBullRule(rule: BullRule) {
    this.bullRule = rule;
  }

  public getState() {
    return {
      state: this.state,
      deviceName: this.deviceName,
      errorMessage: this.errorMessage,
    };
  }

  public onSignal(listener: SignalListener) {
    this.signalListeners.add(listener);
    return () => this.signalListeners.delete(listener);
  }

  public onStateChange(listener: StateListener) {
    this.stateListeners.add(listener);
    listener(this.state, this.deviceName, this.errorMessage);
    return () => this.stateListeners.delete(listener);
  }

  private updateState(state: BluetoothConnectionState, error: string | null = null) {
    this.state = state;
    this.errorMessage = error;
    if (state === 'disconnected') {
      this.deviceName = null;
    }
    this.stateListeners.forEach((listener) => listener(this.state, this.deviceName, this.errorMessage));
  }

  public async connect(): Promise<boolean> {
    if (!this.isSupported()) {
      this.updateState('error', 'お使いのブラウザはWeb Bluetooth APIに対応していません。ChromeまたはEdgeをご利用ください。');
      return false;
    }

    try {
      this.updateState('connecting');

      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [SERVICE_UUID] },
          { namePrefix: 'DARTSLIVE' },
          { namePrefix: 'DartsLive' },
          { namePrefix: 'dartslive' },
        ],
        optionalServices: [SERVICE_UUID],
      });

      this.device = device;
      this.deviceName = device.name || 'DARTSLIVE HOME';

      device.addEventListener('gattserverdisconnected', this.handleDisconnect);

      if (!device.gatt) {
        throw new Error('GATTサーバーが見つかりませんでした。');
      }

      const server = await device.gatt.connect();
      this.server = server;

      const service = await server.getPrimaryService(SERVICE_UUID);

      let notifyCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;

      try {
        notifyCharacteristic = await service.getCharacteristic(NOTIFY_CHAR_UUID);
      } catch (_e) {
        // Fallback: search all characteristics for notify property
        const characteristics = await service.getCharacteristics();
        notifyCharacteristic = characteristics.find((c) => c.properties.notify) || null;
      }

      if (!notifyCharacteristic) {
        throw new Error('通知対応キャラクタリスティックが見つかりませんでした。');
      }

      this.characteristic = notifyCharacteristic;
      this.characteristic.addEventListener('characteristicvaluechanged', this.handleCharacteristicValue);
      await this.characteristic.startNotifications();

      this.updateState('connected');
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn('Bluetooth connection failed:', err);
      // If user cancelled, don't show scary error
      if (errorMsg.includes('cancelled') || errorMsg.includes('canceled') || errorMsg.includes('User cancelled')) {
        this.updateState('disconnected');
      } else {
        this.updateState('error', errorMsg);
      }
      return false;
    }
  }

  public disconnect() {
    if (this.characteristic) {
      try {
        this.characteristic.removeEventListener('characteristicvaluechanged', this.handleCharacteristicValue);
      } catch (_e) {
        // Ignore
      }
    }

    if (this.device) {
      try {
        this.device.removeEventListener('gattserverdisconnected', this.handleDisconnect);
      } catch (_e) {
        // Ignore
      }
    }

    if (this.server && this.server.connected) {
      this.server.disconnect();
    }

    this.server = null;
    this.device = null;
    this.characteristic = null;
    this.updateState('disconnected');
  }

  private handleDisconnect = () => {
    console.log('Bluetooth device disconnected');
    this.updateState('disconnected');
  };

  private handleCharacteristicValue = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    if (!target || !target.value) return;

    const data = target.value;
    if (data.byteLength < 3) return;

    // Check header if present: 0xA1, 0x03
    const segmentId = data.getUint8(2);
    this.emitSegment(segmentId);
  };

  /**
   * Emit a segment manually (used by VirtualBoard or internal parser)
   */
  public emitSegment(segmentId: number) {
    if (segmentId === 0x54) {
      // Change Button
      this.emitSignal({ type: 'change' });
      return;
    }

    const hit = parseSegment(segmentId, this.bullRule);
    if (hit) {
      this.emitSignal({ type: 'hit', hit });
    }
  }

  public emitSignal(signal: BoardSignal) {
    this.signalListeners.forEach((listener) => listener(signal));
  }
}

export const bleConnector = new BleConnector();
