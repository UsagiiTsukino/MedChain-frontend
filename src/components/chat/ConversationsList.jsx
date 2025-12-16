import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Avatar,
  Badge,
  Empty,
  Spin,
  message as antdMessage,
  Typography,
} from 'antd';
import {
  MessageOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { callGetConversations } from '../../config/api.message';
import ChatModal from './ChatModal';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Text } = Typography;

/**
 * Conversations List Component
 * Display all conversations with unread count badges
 */
const ConversationsList = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);

  // Load conversations
  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await callGetConversations();
      if (res?.data) {
        setConversations(res.data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      antdMessage.error('Không thể tải danh sách hội thoại');
    } finally {
      setLoading(false);
    }
  };

  // Handle open chat
  const handleOpenChat = (conversation) => {
    setSelectedConversation({
      appointmentId: conversation.appointmentId,
      doseNumber: conversation.doseNumber,
      appointmentDate: conversation.appointmentDate,
      appointmentTime: conversation.appointmentTime,
      vaccine: conversation.vaccine,
      otherUser: conversation.otherUser,
    });
    setChatVisible(true);
  };

  // Handle close chat and reload conversations
  const handleCloseChat = () => {
    setChatVisible(false);
    setSelectedConversation(null);
    loadConversations(); // Reload to update unread counts
  };

  useEffect(() => {
    loadConversations();
    // Refresh conversations every 10 seconds
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="shadow-lg">
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card
        title={
          <div className="flex items-center gap-2">
            <MessageOutlined className="text-blue-600" />
            <span>Tin nhắn</span>
            {conversations.length > 0 && (
              <Badge
                count={conversations.reduce(
                  (acc, conv) => acc + (conv.unreadCount || 0),
                  0
                )}
                overflowCount={99}
              />
            )}
          </div>
        }
        className="shadow-lg"
      >
        {conversations.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có tin nhắn nào"
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={conversations}
            renderItem={(conversation) => {
              const isUnread = (conversation.unreadCount || 0) > 0;
              const isSentByMe =
                conversation.lastMessage?.senderId ===
                currentUser?.walletAddress;

              return (
                <List.Item
                  className={`cursor-pointer transition-all hover:bg-gray-50 rounded-lg px-4 ${
                    isUnread ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleOpenChat(conversation)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge
                        count={conversation.unreadCount}
                        offset={[-5, 5]}
                        size="small"
                      >
                        <Avatar
                          size={48}
                          className="bg-gradient-to-br from-purple-500 to-indigo-600"
                          icon={<UserOutlined />}
                        >
                          {conversation.otherUser?.fullName?.charAt(0) || 'U'}
                        </Avatar>
                      </Badge>
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`${
                              isUnread ? 'font-bold' : 'font-medium'
                            }`}
                          >
                            {conversation.otherUser?.fullName || 'Người dùng'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {conversation.otherUser?.role === 'DOCTOR'
                              ? '👨‍⚕️ Bác sĩ'
                              : '👤 Bệnh nhân'}
                          </span>
                        </div>
                        <Text type="secondary" className="text-xs">
                          {dayjs(conversation.lastMessage?.createdAt).fromNow()}
                        </Text>
                      </div>
                    }
                    description={
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MedicineBoxOutlined />
                          <span>{conversation.vaccine?.name || 'Vaccine'}</span>
                          <span>• Mũi {conversation.doseNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <CalendarOutlined />
                          <span>
                            {dayjs(conversation.appointmentDate).format(
                              'DD/MM/YYYY'
                            )}
                          </span>
                          <span>• {conversation.appointmentTime}</span>
                        </div>
                        <div
                          className={`text-sm truncate ${
                            isUnread
                              ? 'font-semibold text-gray-900'
                              : 'text-gray-500'
                          }`}
                        >
                          {isSentByMe && 'Bạn: '}
                          {conversation.lastMessage?.content ||
                            'Chưa có tin nhắn'}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>

      {/* Chat Modal */}
      {selectedConversation && (
        <ChatModal
          visible={chatVisible}
          onClose={handleCloseChat}
          appointment={selectedConversation}
          currentUser={currentUser}
          otherUser={selectedConversation.otherUser}
        />
      )}
    </>
  );
};

export default ConversationsList;
