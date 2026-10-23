import { useState, useEffect, useCallback } from 'react';
import { bleConnector } from '../services/bleConnector';
import type { BluetoothConnectionState, BoardSignal } from '../types/bluetooth';
import type { BullRule } from '../types/darts';

export function useBluetoothBoard(bullRule: BullRule, onSignal: (signal: BoardSignal) => void) {
  const [state, setState] = useState<BluetoothConnectionState>('disconnected');
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isSupported = bleConnector.isSupported();

  useEffect(() => {
    bleConnector.setBullRule(bullRule);
  }, [bullRule]);

  useEffect(() => {
    const unsubState = bleConnector.onStateChange((newState, newName, error) => {
      setState(newState);
      setDeviceName(newName);
      setErrorMessage(error);
    });

    const unsubSignal = bleConnector.onSignal((signal) => {
      onSignal(signal);
    });

    return () => {
      unsubState();
      unsubSignal();
    };
  }, [onSignal]);

  const connect = useCallback(async () => {
    return await bleConnector.connect();
  }, []);

  const disconnect = useCallback(() => {
    bleConnector.disconnect();
  }, []);

  const emitMockSegment = useCallback((segmentId: number) => {
    bleConnector.emitSegment(segmentId);
  }, []);

  return {
    state,
    deviceName,
    errorMessage,
    isSupported,
    connect,
    disconnect,
    emitMockSegment,
  };
}
