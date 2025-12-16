import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000/chat';

/**
 * Custom hook for managing Socket.IO chat connection
 */
export const useSocket = (
  appointmentId,
  currentUser,
  onNewMessage,
  onMessagesRead
) => {
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!appointmentId || !currentUser?.walletAddress) return;

    console.log('[useSocket] Connecting to socket...', {
      appointmentId,
      walletAddress: currentUser.walletAddress,
    });

    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('[useSocket] Connected to socket server');

      // Register user
      socket.emit('register', { walletAddress: currentUser.walletAddress });

      // Join appointment room
      socket.emit('joinAppointment', {
        appointmentId: appointmentId.toString(),
      });
    });

    socket.on('disconnect', () => {
      console.log('[useSocket] Disconnected from socket server');
    });

    socket.on('connect_error', (error) => {
      console.error('[useSocket] Connection error:', error);
    });

    // Listen for new messages
    socket.on('newMessage', (message) => {
      console.log('[useSocket] Received new message:', message);
      if (onNewMessage) {
        onNewMessage(message);
      }
    });

    // Listen for messages read
    socket.on('messagesRead', (data) => {
      console.log('[useSocket] Messages marked as read:', data);
      if (onMessagesRead) {
        onMessagesRead(data);
      }
    });

    // Cleanup on unmount
    return () => {
      console.log('[useSocket] Cleaning up socket connection');
      if (socket) {
        socket.emit('leaveAppointment', {
          appointmentId: appointmentId.toString(),
        });
        socket.disconnect();
      }
    };
  }, [appointmentId, currentUser?.walletAddress, onNewMessage, onMessagesRead]);

  // Method to manually disconnect
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  }, []);

  return {
    socket: socketRef.current,
    disconnect,
  };
};
