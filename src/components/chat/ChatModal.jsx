import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  Input,
  Button,
  Avatar,
  Badge,
  Spin,
  Empty,
  message as antdMessage,
  notification,
  Tooltip,
} from 'antd';
import {
  SendOutlined,
  CloseOutlined,
  UserOutlined,
  MessageOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import {
  callGetMessages,
  callSendMessage,
  callMarkMessagesAsRead,
} from '../../config/api.message';
import { useSocket } from '../../hooks/useSocket';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { TextArea } = Input;

/**
 * Chat Modal Component for Patient-Doctor Communication
 */
const ChatModal = ({
  visible,
  onClose,
  appointment,
  currentUser,
  otherUser,
}) => {
  console.log('[ChatModal] Component render with props:', {
    visible,
    appointmentId: appointment?.appointmentId,
    currentUser: currentUser?.walletAddress,
    otherUser: otherUser?.walletAddress,
  });

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Callback for new message from Socket.IO
  const handleNewMessage = useCallback(
    (message) => {
      console.log('[ChatModal] New message received via socket:', message);

      // Check if this is from the other user (not from me)
      const isFromOtherUser =
        message.senderId !== currentUser?.walletAddress &&
        message.senderId !== currentUser?.email;

      setMessages((prev) => {
        // Check if message already exists (avoid duplicates)
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });

      // Show notification if message is from other user and modal is not focused
      if (isFromOtherUser) {
        notification.info({
          message: 'Tin nhắn mới',
          description: `${
            message.sender?.fullName || 'Người dùng'
          }: ${message.content.substring(0, 50)}${
            message.content.length > 50 ? '...' : ''
          }`,
          placement: 'topRight',
          duration: 4,
        });

        // Mark as read if modal is open
        if (visible && otherUser?.walletAddress) {
          callMarkMessagesAsRead(
            appointment?.appointmentId,
            otherUser.walletAddress
          ).catch((err) => console.error('Error marking as read:', err));
        }
      }
    },
    [currentUser, visible, appointment, otherUser]
  );

  // Callback for messages read notification
  const handleMessagesRead = useCallback((data) => {
    console.log('[ChatModal] Messages read notification:', data);
    // Update UI to show messages as read
    setMessages((prev) =>
      prev.map((msg) =>
        msg.receiverId === data.readerId ? { ...msg, isRead: true } : msg
      )
    );
  }, []);

  // Initialize Socket.IO connection
  useSocket(
    visible ? appointment?.appointmentId : null,
    visible ? currentUser : null,
    handleNewMessage,
    handleMessagesRead
  );

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      antdMessage.warning('Vui lòng nhập nội dung tin nhắn');
      return;
    }

    console.log('[ChatModal] handleSendMessage called');
    console.log('[ChatModal] otherUser:', otherUser);
    console.log('[ChatModal] appointment:', appointment);
    console.log('[ChatModal] currentUser:', currentUser);

    if (!otherUser?.walletAddress) {
      console.error(
        '[ChatModal] otherUser.walletAddress is missing:',
        otherUser
      );
      antdMessage.error('Không tìm thấy thông tin người nhận');
      return;
    }

    if (!appointment?.appointmentId) {
      console.error(
        '[ChatModal] appointment.appointmentId is missing:',
        appointment
      );
      antdMessage.error('Không tìm thấy thông tin cuộc hẹn');
      return;
    }

    try {
      setSending(true);
      const payload = {
        appointmentId: appointment.appointmentId.toString(),
        receiverId: otherUser.walletAddress,
        content: newMessage.trim(),
        messageType: 'text',
      };

      console.log('[ChatModal] Sending message with payload:', payload);

      const res = await callSendMessage(payload);

      console.log('[ChatModal] Message sent response:', res);

      if (res?.data) {
        // Don't add message here - let Socket.IO handle it
        // This prevents duplicate messages
        setNewMessage('');
        antdMessage.success('Đã gửi tin nhắn');
      }
    } catch (error) {
      console.error('[ChatModal] Error sending message:', error);
      console.error('[ChatModal] Error response:', error.response?.data);
      antdMessage.error(
        error.response?.data?.message ||
          'Không thể gửi tin nhắn. Vui lòng thử lại.'
      );
    } finally {
      setSending(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Load initial messages when modal opens
  useEffect(() => {
    if (!visible || !appointment?.appointmentId) {
      console.log('[ChatModal] Modal not visible or no appointment ID');
      return;
    }

    console.log(
      '[ChatModal] Modal opened, loading all messages from database...'
    );
    console.log('[ChatModal] Appointment ID:', appointment.appointmentId);
    console.log('[ChatModal] Current user:', currentUser);
    console.log('[ChatModal] Other user:', otherUser);

    const loadInitialMessages = async () => {
      try {
        console.log('[ChatModal] Calling API to get messages...');
        const res = await callGetMessages(appointment.appointmentId);
        console.log('[ChatModal] API response:', res);

        if (res && Array.isArray(res) && res.length > 0) {
          console.log(
            '[ChatModal] Successfully loaded messages from database:',
            res.length,
            'messages'
          );
          console.log('[ChatModal] First message structure:', res[0]);
          console.log(
            '[ChatModal] Current user wallet:',
            currentUser?.walletAddress
          );
          console.log('[ChatModal] Current user email:', currentUser?.email);
          console.log('[ChatModal] Current user id:', currentUser?.id);
          console.log('[ChatModal] Messages:', res);
          console.log('[ChatModal] Setting messages state...');
          setMessages(res);
          console.log('[ChatModal] Messages state set complete');

          // Scroll to bottom after loading
          setTimeout(() => {
            console.log('[ChatModal] Auto-scrolling to bottom');
            scrollToBottom();
          }, 100);

          // Mark messages as read
          if (otherUser?.walletAddress) {
            console.log(
              '[ChatModal] Marking messages as read for:',
              otherUser.walletAddress
            );
            await callMarkMessagesAsRead(
              appointment.appointmentId,
              otherUser.walletAddress
            ).catch((err) =>
              console.error('[ChatModal] Error marking as read:', err)
            );
          }
        } else {
          console.log('[ChatModal] No messages found or empty response');
          setMessages([]);
        }
      } catch (error) {
        console.error('[ChatModal] Error loading messages:', error);
        console.error('[ChatModal] Error details:', error.response?.data);
        antdMessage.error(
          error.response?.data?.message ||
            'Không thể tải tin nhắn. Vui lòng thử lại.'
        );
      } finally {
        console.log('[ChatModal] Finished loading messages');
      }
    };

    // Load messages asynchronously without blocking modal render
    // Using requestIdleCallback or setTimeout to defer loading
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => loadInitialMessages());
    } else {
      setTimeout(() => loadInitialMessages(), 50);
    }
  }, [
    visible,
    appointment?.appointmentId,
    otherUser?.walletAddress,
    currentUser,
  ]);

  // Mark messages as read when modal is visible
  useEffect(() => {
    if (visible && messages.length > 0 && otherUser?.walletAddress) {
      const timer = setTimeout(() => {
        callMarkMessagesAsRead(
          appointment?.appointmentId,
          otherUser.walletAddress
        ).catch((err) => console.error('Error marking as read:', err));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    visible,
    messages.length,
    otherUser?.walletAddress,
    appointment?.appointmentId,
  ]);

  // Scroll to bottom when messages change
  useEffect(() => {
    console.log('[ChatModal] messages state changed:', {
      length: messages.length,
      messages: messages,
    });
    scrollToBottom();
  }, [messages]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={650}
      closeIcon={
        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-xl hover:bg-gray-50 hover:shadow-2xl transition-all duration-200 border border-gray-100">
          <CloseOutlined className="text-gray-600 text-xl font-bold hover:text-gray-800" />
        </div>
      }
      styles={{
        body: { padding: 0, borderRadius: '16px', overflow: 'hidden' },
      }}
      className="chat-modal"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-5 shadow-lg">
        <div className="flex items-center gap-4">
          <Badge dot status="success" offset={[-8, 40]}>
            <Avatar
              size={56}
              className="bg-white/20 shadow-lg border-2 border-white/30"
              icon={<UserOutlined className="text-white" />}
            >
              {otherUser?.fullName?.charAt(0) || 'U'}
            </Avatar>
          </Badge>
          <div className="flex-1">
            <div className="font-bold text-xl mb-1">
              {otherUser?.fullName || 'Người dùng'}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/90 mb-1">
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                {otherUser?.role === 'DOCTOR' ? '👨‍⚕️ Bác sĩ' : '👤 Bệnh nhân'}
              </span>
              <span>•</span>
              <span className="font-medium">
                {appointment?.vaccine?.name || 'Vaccine'} - Mũi{' '}
                {appointment?.doseNumber || '1'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <CalendarOutlined />
              <span>
                {dayjs(appointment?.appointmentDate).format('DD/MM/YYYY')}
              </span>
              <span>•</span>
              <ClockCircleOutlined />
              <span>{appointment?.appointmentTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="p-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100"
        style={{ height: '450px', maxHeight: '60vh' }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : messages.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <MessageOutlined className="text-4xl text-gray-300 mb-2" />
                <div className="text-gray-500">
                  Chưa có tin nhắn nào. Hãy bắt đầu cuộc hội thoại!
                </div>
              </div>
            }
          />
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => {
              console.log(`[ChatModal] Rendering message ${index}:`, msg);
              const isSentByMe =
                (msg.sender?.walletAddress &&
                  msg.sender.walletAddress === currentUser?.walletAddress) ||
                (msg.senderId &&
                  currentUser?.walletAddress &&
                  msg.senderId === currentUser.walletAddress) ||
                (msg.senderId &&
                  currentUser?.email &&
                  msg.senderId === currentUser.email);

              console.log(
                `[ChatModal] Message ${index} isSentByMe:`,
                isSentByMe,
                {
                  msgSenderWallet: msg.sender?.walletAddress,
                  msgSenderId: msg.senderId,
                  currentUserWallet: currentUser?.walletAddress,
                  currentUserEmail: currentUser?.email,
                }
              );

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isSentByMe ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex items-start gap-3 max-w-[80%] ${
                      isSentByMe ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <Avatar
                      size={36}
                      className={
                        isSentByMe
                          ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md border-2 border-white'
                          : 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-md border-2 border-white'
                      }
                    >
                      {msg.sender?.fullName?.charAt(0) || 'U'}
                    </Avatar>
                    <div className="flex-1">
                      <div
                        className={`rounded-2xl px-5 py-3 shadow-md transition-all hover:shadow-lg ${
                          isSentByMe
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-sm'
                            : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                        }`}
                      >
                        <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </div>
                      </div>
                      <Tooltip
                        title={dayjs(msg.createdAt).format(
                          'DD/MM/YYYY HH:mm:ss'
                        )}
                      >
                        <div
                          className={`text-xs text-gray-500 mt-1.5 px-2 ${
                            isSentByMe ? 'text-right' : 'text-left'
                          }`}
                        >
                          {dayjs(msg.createdAt).fromNow()}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-6 py-5 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex gap-3 items-end">
          <TextArea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn của bạn..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="flex-1 rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 px-4 py-2 text-[15px] transition-all"
            disabled={sending}
          />
          <Button
            type="primary"
            icon={<SendOutlined className="text-lg" />}
            onClick={handleSendMessage}
            loading={sending}
            disabled={!newMessage.trim() || sending}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-0 rounded-2xl h-auto px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            style={{ minHeight: '44px' }}
          >
            Gửi
          </Button>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-3">
          <span className="text-blue-500">💡</span>
          <span>
            Nhấn{' '}
            <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
              Enter
            </kbd>{' '}
            để gửi,{' '}
            <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">
              Shift+Enter
            </kbd>{' '}
            để xuống dòng
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;
