import type { DartHit } from './darts';

export type BluetoothConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export type BoardSignal =
  | { type: 'change' }
  | { type: 'hit'; hit: DartHit };

export interface BoardConnector {
  state: BluetoothConnectionState;
  deviceName: string | null;
  errorMessage: string | null;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  isSupported: boolean;
}
