import { useEffect } from 'react';

// Module-level singleton EventBus
// Persistent across component re-renders
const eventBus = new Map();

/**
 * Mock socket hook using EventBus pattern
 * Interface identical to socket.io-client for easy future swap
 * @returns {object} { on, emit, off }
 */
export const useSocket = () => {
  const socket = {
    /**
     * Register an event listener
     * @param {string} eventName - Event name
     * @param {function} callback - Callback function
     */
    on: (eventName, callback) => {
      if (!eventBus.has(eventName)) {
        eventBus.set(eventName, []);
      }
      eventBus.get(eventName).push(callback);
    },

    /**
     * Remove an event listener
     * @param {string} eventName - Event name
     * @param {function} callback - Callback function to remove
     */
    off: (eventName, callback) => {
      if (eventBus.has(eventName)) {
        const callbacks = eventBus.get(eventName);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    },

    /**
     * Emit an event
     * @param {string} eventName - Event name
     * @param {object} data - Event payload
     */
    emit: (eventName, data) => {
      if (eventBus.has(eventName)) {
        eventBus.get(eventName).forEach(callback => {
          callback(data);
        });
      }
    }
  };

  // Return cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Note: We don't clear eventBus here as other components may still need it
      // In production, use a proper cleanup strategy
    };
  }, []);

  return socket;
};

/**
 * Hook to simulate server-sent socket events
 * Wraps emit to add delay simulating network latency
 */
export const useSocketEmit = () => {
  const socket = useSocket();

  const emitWithDelay = (eventName, data, delayMs = 0) => {
    setTimeout(() => {
      socket.emit(eventName, data);
    }, delayMs);
  };

  return { socket, emitWithDelay };
};

export default useSocket;
