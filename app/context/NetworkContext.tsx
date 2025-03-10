import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from './ToastContext';

// Queue for storing operations to be performed when back online
interface QueuedOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'content' | 'focusArea' | 'category' | 'setting';
  data: any;
  timestamp: number;
}

// Network context type
interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  queueOperation: (operation: Omit<QueuedOperation, 'id' | 'timestamp'>) => void;
  processQueue: () => Promise<void>;
  clearQueue: () => Promise<void>;
  queueSize: number;
}

// Create network context
const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  isInternetReachable: true,
  queueOperation: () => {},
  processQueue: async () => {},
  clearQueue: async () => {},
  queueSize: 0,
});

// Hook to use network context
export const useNetwork = () => useContext(NetworkContext);

// Storage key for queued operations
const QUEUE_STORAGE_KEY = '@1000Months:operationQueue';

// Network provider props
interface NetworkProviderProps {
  children: ReactNode;
}

// Network provider component
export function NetworkProvider({ children }: NetworkProviderProps) {
  const [netInfo, setNetInfo] = useState<NetInfoState>({
    type: NetInfoStateType.unknown,
    isConnected: true,
    isInternetReachable: null,
    details: null,
  });
  const [operationQueue, setOperationQueue] = useState<QueuedOperation[]>([]);
  const { showToast } = useToast();
  
  // Load queued operations from storage
  const loadQueue = async () => {
    try {
      const queueJson = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (queueJson) {
        const queue = JSON.parse(queueJson);
        setOperationQueue(queue);
        
        // Show toast if there are pending operations
        if (queue.length > 0) {
          showToast(`${queue.length} operations pending sync`, 'info');
        }
      }
    } catch (error) {
      console.error('Error loading operation queue:', error);
    }
  };
  
  // Save queued operations to storage
  const saveQueue = async (queue: QueuedOperation[]) => {
    try {
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error saving operation queue:', error);
    }
  };
  
  // Add operation to queue
  const queueOperation = (operation: Omit<QueuedOperation, 'id' | 'timestamp'>) => {
    const newOperation: QueuedOperation = {
      ...operation,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
    };
    
    const newQueue = [...operationQueue, newOperation];
    setOperationQueue(newQueue);
    saveQueue(newQueue);
    
    // Show toast
    showToast('Operation queued for sync', 'info');
  };
  
  // Process queued operations
  const processQueue = async () => {
    if (operationQueue.length === 0) return;
    
    if (!netInfo.isConnected || !netInfo.isInternetReachable) {
      showToast('Cannot sync while offline', 'warning');
      return;
    }
    
    showToast('Syncing data...', 'info');
    
    try {
      // Here you would implement the actual sync logic with your backend
      // For now, we'll just simulate a successful sync
      
      // Sort operations by timestamp
      const sortedQueue = [...operationQueue].sort((a, b) => a.timestamp - b.timestamp);
      
      // Process each operation
      for (const operation of sortedQueue) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Log operation
        console.log(`Processed operation: ${operation.type} ${operation.entity}`);
      }
      
      // Clear queue after successful sync
      await clearQueue();
      showToast('Data synced successfully', 'success');
    } catch (error) {
      console.error('Error processing queue:', error);
      showToast('Sync failed. Will retry later.', 'error');
    }
  };
  
  // Clear operation queue
  const clearQueue = async () => {
    setOperationQueue([]);
    await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
  };
  
  // Subscribe to network info changes
  useEffect(() => {
    // Load queue on mount
    loadQueue();
    
    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetInfo(state);
      
      // Show toast when connection status changes
      if (state.isConnected && !netInfo.isConnected) {
        showToast('Back online', 'success');
        
        // Process queue when back online
        if (operationQueue.length > 0) {
          processQueue();
        }
      } else if (!state.isConnected && netInfo.isConnected) {
        showToast('You are offline', 'warning');
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Process queue when connection is restored
  useEffect(() => {
    if (netInfo.isConnected && netInfo.isInternetReachable && operationQueue.length > 0) {
      processQueue();
    }
  }, [netInfo.isConnected, netInfo.isInternetReachable]);
  
  return (
    <NetworkContext.Provider 
      value={{
        isConnected: netInfo.isConnected ?? true,
        isInternetReachable: netInfo.isInternetReachable,
        queueOperation,
        processQueue,
        clearQueue,
        queueSize: operationQueue.length,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
} 