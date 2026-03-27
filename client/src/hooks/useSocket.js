// import { useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';

// // ── Singleton socket instance ─────────────────────────────────────────────────
// // One connection shared across all components, created lazily on first use.
// let _socket = null;

// function getSocket() {
//   if (!_socket) {
//     const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
//     _socket = io(SERVER_URL, {
//       autoConnect: true,
//       reconnection: true,
//       reconnectionAttempts: 10,
//       reconnectionDelay: 1000,
//       transports: ['websocket', 'polling'],
//     });

//     _socket.on('connect', () =>
//       console.log('[Socket] Connected:', _socket.id)
//     );
//     _socket.on('disconnect', (reason) =>
//       console.log('[Socket] Disconnected:', reason)
//     );
//     _socket.on('connect_error', (err) =>
//       console.warn('[Socket] Connection error:', err.message)
//     );
//   }
//   return _socket;
// }

// /**
//  * Returns the shared socket.io-client instance.
//  * Safe to call from any component — always returns the same socket.
//  */
// export const useSocket = () => {
//   const socket = getSocket();

//   // No cleanup needed — singleton lives for the entire app session
//   useEffect(() => {}, []);

//   return { socket };
// };

// /**
//  * Convenience hook: { socket, emitWithDelay }
//  * emitWithDelay wraps socket.emit with an optional delay for UX smoothness.
//  */
// export const useSocketEmit = () => {
//   const { socket } = useSocket();

//   const emitWithDelay = (eventName, data, delayMs = 0) => {
//     if (delayMs > 0) {
//       setTimeout(() => socket.emit(eventName, data), delayMs);
//     } else {
//       socket.emit(eventName, data);
//     }
//   };

//   return { socket, emitWithDelay };
// };

// /**
//  * Helper hook: subscribe to a socket event and auto-cleanup on unmount.
//  * Usage: useSocketOn('order:statusUpdate', (data) => { ... });
//  */
// export const useSocketOn = (eventName, handler) => {
//   const { socket } = useSocket();
//   const handlerRef = useRef(handler);
//   handlerRef.current = handler; // always latest handler without re-subscribing

//   useEffect(() => {
//     const fn = (...args) => handlerRef.current(...args);
//     socket.on(eventName, fn);
//     return () => socket.off(eventName, fn);
//   }, [socket, eventName]);
// };

// export default useSocket;


import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// ── Singleton socket instance ─────────────────────────────────────────────────
let _socket = null;

function getSocket() {
  if (!_socket) {
    const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    _socket = io(SERVER_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
    });

    _socket.on('connect', () => console.log('[Socket] Connected:', _socket.id));
    _socket.on('disconnect', (r) => console.log('[Socket] Disconnected:', r));
    _socket.on('connect_error', (e) => console.warn('[Socket] Error:', e.message));
  }
  return _socket;
}

/**
 * Returns the shared socket instance directly.
 * Usage: const socket = useSocket();  →  socket?.on(...) / socket?.emit(...)
 */
export const useSocket = () => {
  useEffect(() => { }, []);
  return getSocket(); // ← returns socket directly, not { socket }
};

/**
 * Usage: const { socket, emitWithDelay } = useSocketEmit();
 */
export const useSocketEmit = () => {
  const socket = useSocket();

  const emitWithDelay = (eventName, data, delayMs = 0) => {
    if (delayMs > 0) {
      setTimeout(() => socket.emit(eventName, data), delayMs);
    } else {
      socket.emit(eventName, data);
    }
  };

  return { socket, emitWithDelay };
};

/**
 * Auto-subscribes to a socket event and cleans up on unmount.
 * Usage: useSocketOn('order:new', (data) => { ... });
 */
export const useSocketOn = (eventName, handler) => {
  const socket = useSocket();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const fn = (...args) => handlerRef.current(...args);
    socket.on(eventName, fn);
    return () => socket.off(eventName, fn);
  }, [socket, eventName]);
};

export default useSocket;