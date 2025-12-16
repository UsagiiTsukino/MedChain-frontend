import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { notification } from 'antd';

const SOCKET_URL = 'http://localhost:3000/chat';

/**
 * Global socket hook for notifications
 * Should be used in App or Layout component
 */
export const useGlobalSocket = (currentUser) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!currentUser?.walletAddress) return;

    console.log('[useGlobalSocket] Connecting...', currentUser.walletAddress);

    // Create socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('[useGlobalSocket] Connected');
      socket.emit('register', { walletAddress: currentUser.walletAddress });
    });

    socket.on('disconnect', () => {
      console.log('[useGlobalSocket] Disconnected');
    });

    // Listen for direct notifications
    socket.on('newMessageNotification', (data) => {
      console.log('[useGlobalSocket] New message notification:', data);

      notification.info({
        message: '💬 Tin nhắn mới',
        description: `${data.from}: ${data.message.content.substring(0, 80)}${
          data.message.content.length > 80 ? '...' : ''
        }`,
        placement: 'topRight',
        duration: 5,
        onClick: () => {
          console.log(
            'Notification clicked for appointment:',
            data.appointmentId
          );
          // Could navigate to appointment here
        },
      });
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [currentUser?.walletAddress]);

  return socketRef.current;
};
