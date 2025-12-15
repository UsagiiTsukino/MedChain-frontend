import { useState, useRef, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  LoadingOutlined,
  PhoneOutlined,
  WalletOutlined,
  DollarOutlined,
  PayCircleOutlined,
  BankOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import {
  Button,
  Input,
  Card,
  message,
  Spin,
  DatePicker,
  TimePicker,
  Select,
  Radio,
  Space,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import { callChatWithAI, callGetAIContext } from '../../config/api.ai-chatbot';
import {
  callCreateBooking,
  updatePaymentMetaMask,
} from '../../config/api.appointment';
import { Web3 } from 'web3';
import { useAccount } from 'wagmi';

const { TextArea } = Input;

// Component to render AI message with beautiful formatting
const AIMessageContent = ({ content }) => {
  // Parse and render markdown-like content beautifully
  const renderContent = () => {
    // Split content into lines for processing
    const lines = content.split('\n');
    const elements = [];
    let currentList = [];
    let listType = null; // 'numbered' or 'bullet'
    let centerBlockContent = [];

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'numbered') {
          elements.push(
            <ol key={`list-${elements.length}`} className="space-y-2 my-3 ml-1">
              {currentList}
            </ol>
          );
        } else {
          elements.push(
            <ul key={`list-${elements.length}`} className="space-y-2 my-3 ml-1">
              {currentList}
            </ul>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    const flushCenterBlock = () => {
      if (centerBlockContent.length > 0) {
        elements.push(
          <div key={`centers-${elements.length}`} className="my-3 space-y-2">
            {centerBlockContent}
          </div>
        );
        centerBlockContent = [];
      }
    };

    const formatInlineText = (text) => {
      // Handle bold text **text**
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={i} className="font-semibold text-purple-700">
              {part.slice(2, -2)}
            </span>
          );
        }
        return part;
      });
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines but add spacing
      if (!trimmedLine) {
        flushList();
        flushCenterBlock();
        if (elements.length > 0) {
          elements.push(<div key={`space-${index}`} className="h-2" />);
        }
        return;
      }

      // Check for center information pattern (contains phone number and working hours)
      if (
        trimmedLine.includes('SĐT:') &&
        trimmedLine.includes('Giờ làm việc:')
      ) {
        flushList();
        // Parse center info: **Name:** Address. Giờ làm việc: X. SĐT: Y
        const centerMatch = trimmedLine.match(
          /\*?\*?([^*:]+)\*?\*?:\s*([^.]+)\.\s*Giờ làm việc:\s*([^.]+)\.\s*SĐT:\s*(.+)/
        );
        if (centerMatch) {
          centerBlockContent.push(
            <div
              key={`center-${index}`}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 rounded-lg p-2 flex-shrink-0">
                  <EnvironmentOutlined className="text-white text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {centerMatch[1].replace(/\*/g, '').trim()}
                  </h4>
                  <p className="text-gray-600 text-xs mt-0.5">
                    {centerMatch[2].trim()}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                      <ClockCircleOutlined className="text-orange-500" />
                      {centerMatch[3].trim()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                      <PhoneOutlined className="text-green-500" />
                      {centerMatch[4].trim()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
          return;
        }
      }

      // Handle bullet points with * or -
      if (trimmedLine.match(/^[*-]\s+/)) {
        flushCenterBlock();
        if (listType !== 'bullet') {
          flushList();
          listType = 'bullet';
        }
        const itemContent = trimmedLine.replace(/^[*-]\s+/, '');
        currentList.push(
          <li key={`item-${index}`} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
            <span className="text-sm text-gray-700">
              {formatInlineText(itemContent)}
            </span>
          </li>
        );
        return;
      }

      // Handle numbered list items
      if (trimmedLine.match(/^\d+\.\s+/)) {
        flushCenterBlock();
        if (listType !== 'numbered') {
          flushList();
          listType = 'numbered';
        }
        const match = trimmedLine.match(/^(\d+)\.\s+(.+)/);
        if (match) {
          currentList.push(
            <li key={`item-${index}`} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs flex items-center justify-center font-semibold">
                {match[1]}
              </span>
              <span className="text-sm text-gray-700 pt-0.5">
                {formatInlineText(match[2])}
              </span>
            </li>
          );
        }
        return;
      }

      // Regular text
      flushList();
      flushCenterBlock();
      elements.push(
        <p key={`p-${index}`} className="text-sm text-gray-700 leading-relaxed">
          {formatInlineText(trimmedLine)}
        </p>
      );
    });

    // Flush any remaining items
    flushList();
    flushCenterBlock();

    return elements;
  };

  return <div className="space-y-1">{renderContent()}</div>;
};

const AIBookingPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.account.user);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const { address: connectedWalletAddress, isConnected } = useAccount();

  // Create Web3 instance only once using useMemo
  const web3Instance = useMemo(() => {
    if (window.ethereum) {
      return new Web3(window.ethereum);
    }
    return null;
  }, []);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        '👋 Xin chào! Tôi là trợ lý AI của MedChainAI. Tôi có thể giúp bạn:\n\n🔹 Tư vấn về các loại vaccine\n🔹 Đề xuất trung tâm tiêm chủng\n🔹 Đặt lịch tiêm chủng tự động\n\nBạn cần tôi giúp gì?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [pendingBooking, setPendingBooking] = useState(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    vaccineId: null,
    vaccineName: null,
    vaccinePrice: null,
    centerId: null,
    centerName: null,
    date: null,
    time: null,
    paymentMethod: 'CASH',
  });
  const [availableCenters, setAvailableCenters] = useState([]);
  const [availableVaccines, setAvailableVaccines] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để sử dụng dịch vụ tư vấn AI');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load centers and vaccines when component mounts
  useEffect(() => {
    const loadContext = async () => {
      try {
        const response = await callGetAIContext();
        const data = response?.data || response;
        const centersData = data?.centers || [];
        const vaccinesData = data?.vaccines || [];
        setAvailableCenters(centersData);
        setAvailableVaccines(vaccinesData);
      } catch {
        // Silently fail, user can still chat
      }
    };
    loadContext();
  }, []);

  useEffect(() => {
    // Scroll within the chat container only, not the entire page
    const timer = setTimeout(() => {
      if (!isLoading && messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await callChatWithAI(userMessage.content, {
        userId: user?.id,
        sessionId: sessionId,
      });

      // Handle both nested and non-nested response structures
      const responseData = response?.data || response;

      if (responseData && responseData.message) {
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: responseData.message,
          timestamp: new Date(),
          hasBookingIntent: responseData.hasBookingIntent,
          suggestedBooking: responseData.suggestedBooking,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setSessionId(responseData.sessionId);

        // If AI suggests booking, initialize form with suggestions
        if (responseData.hasBookingIntent && responseData.suggestedBooking) {
          const suggestion = responseData.suggestedBooking;

          // Find vaccine ID by name if AI didn't return valid ID
          let actualVaccineId = suggestion.vaccineId;
          let actualVaccineName = suggestion.vaccineName;
          let actualVaccinePrice = 0;

          if (availableVaccines.length > 0) {
            // First check if vaccineId is valid
            if (actualVaccineId) {
              const vaccineById = availableVaccines.find(
                (v) => v.id == actualVaccineId
              );
              if (vaccineById) {
                actualVaccineName = vaccineById.name;
                actualVaccinePrice = vaccineById.price;
              } else {
                // ID not found, try to find by name
                actualVaccineId = null;
              }
            }

            // If no valid ID, try to find by name
            if (!actualVaccineId && actualVaccineName) {
              const vaccineByName = availableVaccines.find((v) =>
                v.name.toLowerCase().includes(actualVaccineName.toLowerCase())
              );
              if (vaccineByName) {
                actualVaccineId = vaccineByName.id;
                actualVaccineName = vaccineByName.name;
                actualVaccinePrice = vaccineByName.price;
              }
            }
          }

          // Find center ID by name if AI returned name instead of ID
          let actualCenterId = suggestion.centerId;
          let actualCenterName = suggestion.centerName;

          if (availableCenters.length > 0 && suggestion.centerId) {
            // Try to parse as number
            const centerIdNum = parseInt(suggestion.centerId);

            // Check if centerId matches directly
            const centerById = availableCenters.find(
              (c) => c.id == suggestion.centerId || c.id == centerIdNum
            );

            if (!centerById) {
              // Try to find by name
              const centerByName = availableCenters.find((c) =>
                c.name
                  .toLowerCase()
                  .includes(suggestion.centerId.toString().toLowerCase())
              );
              if (centerByName) {
                actualCenterId = centerByName.id;
                actualCenterName = centerByName.name;
              } else {
                // Use first center as fallback
                actualCenterId = availableCenters[0].id;
                actualCenterName = availableCenters[0].name;
              }
            } else {
              actualCenterId = centerById.id;
              actualCenterName = centerById.name;
            }
          }

          setBookingForm({
            vaccineId: actualVaccineId || null,
            vaccineName: actualVaccineName || null,
            vaccinePrice: actualVaccinePrice || 0,
            centerId: actualCenterId || null,
            centerName: actualCenterName || suggestion.centerName || null,
            date: suggestion.date || null,
            time: suggestion.time || null,
            paymentMethod: 'CASH',
          });
          setPendingBooking(suggestion);
          setShowBookingForm(true);
        }
      }
    } catch {
      message.error('Đã xảy ra lỗi khi giao tiếp với AI. Vui lòng thử lại.');

      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm chuyển sang Ganache network
  const switchToGanache = async () => {
    const ganacheChainId = '0x539'; // 1337 in hex

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ganacheChainId }],
      });
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: ganacheChainId,
                chainName: 'Ganache Local',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['http://127.0.0.1:7545'],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add Ganache network:', addError);
          return false;
        }
      }
      console.error('Failed to switch network:', switchError);
      return false;
    }
  };

  const sendETH = async (amount) => {
    try {
      const treasuryWallet = '0xcC177e1F003856d9d5c6870cAFfA798B50431ea6';

      if (!isConnected || !connectedWalletAddress) {
        message.error('Vui lòng kết nối ví MetaMask trước khi thanh toán!');
        return false;
      }

      const currentChainId = await web3Instance.eth.getChainId();
      if (currentChainId !== 1337n && currentChainId !== 5777n) {
        message.loading('Đang chuyển sang Ganache network...', 0);
        const switched = await switchToGanache();
        message.destroy();
        if (!switched) {
          message.error('Vui lòng chuyển sang Ganache network trong MetaMask!');
          return false;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const amountInWei = web3Instance.utils.toWei(amount.toString(), 'ether');

      const tx = {
        from: connectedWalletAddress,
        to: treasuryWallet,
        value: amountInWei,
        gas: 21000,
      };

      const receipt = await web3Instance.eth.sendTransaction(tx);
      return receipt.transactionHash;
    } catch (error) {
      console.error('Transaction failed:', error);
      if (error.code === 4001) {
        message.error('Bạn đã từ chối giao dịch');
      } else if (error.message?.includes('insufficient funds')) {
        message.error(
          'Không đủ ETH trong ví. Vui lòng kiểm tra bạn đang ở Ganache network!'
        );
      } else {
        message.error('Giao dịch thất bại: ' + error.message);
      }
      return false;
    }
  };

  const handleConfirmBooking = async () => {
    // Check which fields are missing (handle both null and empty string)
    const missingFields = [];
    if (!bookingForm.vaccineId && bookingForm.vaccineId !== 0)
      missingFields.push('Vaccine');
    if (!bookingForm.centerId && bookingForm.centerId !== 0)
      missingFields.push('Trung tâm');
    if (!bookingForm.date) missingFields.push('Ngày tiêm');
    if (!bookingForm.time) missingFields.push('Giờ tiêm');
    if (!bookingForm.paymentMethod)
      missingFields.push('Phương thức thanh toán');

    if (missingFields.length > 0) {
      message.warning(`Vui lòng chọn: ${missingFields.join(', ')}`);
      return;
    }

    setIsCreatingBooking(true);
    try {
      // Handle MetaMask payment first if selected
      let txHash = null;
      if (bookingForm.paymentMethod === 'METAMASK') {
        if (!bookingForm.vaccinePrice) {
          message.error('Không tìm thấy giá vaccine');
          setIsCreatingBooking(false);
          return;
        }
        const ethAmount = bookingForm.vaccinePrice / 10000; // Convert VND to ETH
        message.info('Vui lòng xác nhận giao dịch trong MetaMask...');
        txHash = await sendETH(ethAmount);
        if (!txHash) {
          setIsCreatingBooking(false);
          return;
        }
        message.success('✅ Thanh toán MetaMask thành công!');
      }

      const response = await callCreateBooking(
        bookingForm.vaccineId,
        bookingForm.centerId,
        bookingForm.time,
        bookingForm.date,
        bookingForm.vaccinePrice || 0, // Send actual vaccine price
        [], // doseSchedules
        bookingForm.paymentMethod
      );

      // Handle both nested and non-nested response
      const responseData = response?.data || response;

      if (responseData) {
        // If MetaMask payment, update payment with transaction hash
        if (bookingForm.paymentMethod === 'METAMASK' && txHash) {
          try {
            await updatePaymentMetaMask(txHash, responseData.bookingId);
          } catch (error) {
            console.error('Failed to update MetaMask payment:', error);
          }
        }

        message.success(
          '✅ Đặt lịch thành công! Vui lòng kiểm tra lịch sử đặt lịch.'
        );

        const paymentMethodText = {
          CASH: 'Tiền mặt',
          METAMASK: 'MetaMask (Đã thanh toán)',
          PAYPAL: 'PayPal',
          BANK_TRANSFER: 'Chuyển khoản',
        }[bookingForm.paymentMethod];

        const confirmMessage = {
          id: Date.now(),
          role: 'assistant',
          content: `🎉 Tuyệt vời! Tôi đã đặt lịch tiêm chủng thành công cho bạn.\n\n📋 Thông tin đặt lịch:\n- Vaccine: ${
            bookingForm.vaccineName
          }\n- Trung tâm: ${bookingForm.centerName}\n- Ngày: ${
            bookingForm.date
          }\n- Giờ: ${bookingForm.time}\n- Thanh toán: ${paymentMethodText}${
            txHash ? '\n- Mã giao dịch: ' + txHash.slice(0, 10) + '...' : ''
          }\n\nVui lòng đến đúng giờ. Hẹn gặp lại bạn! 😊`,
          timestamp: new Date(),
          isSuccess: true,
        };

        setMessages((prev) => [...prev, confirmMessage]);
        setPendingBooking(null);
        setShowBookingForm(false);
        setBookingForm({
          vaccineId: null,
          vaccineName: null,
          vaccinePrice: null,
          centerId: null,
          centerName: null,
          date: null,
          time: null,
          paymentMethod: 'CASH',
        });
      }
    } catch {
      message.error(
        'Đặt lịch thất bại. Vui lòng thử lại hoặc đặt lịch thủ công.'
      );

      const errorMessage = {
        id: Date.now(),
        role: 'assistant',
        content:
          '❌ Xin lỗi, có lỗi xảy ra khi đặt lịch. Bạn có thể thử lại hoặc đặt lịch thủ công tại trang Đặt lịch.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const handleCancelBooking = () => {
    setPendingBooking(null);
    setShowBookingForm(false);
    setBookingForm({
      vaccineId: null,
      vaccineName: null,
      vaccinePrice: null,
      centerId: null,
      centerName: null,
      date: null,
      time: null,
      paymentMethod: 'CASH',
    });
    const cancelMessage = {
      id: Date.now(),
      role: 'assistant',
      content: 'Đã hủy đặt lịch. Bạn có cần tôi giúp gì thêm không?',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, cancelMessage]);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const quickQuestions = [
    'Tư vấn vaccine cho trẻ em',
    'Trung tâm gần tôi',
    'Đặt lịch tiêm COVID-19',
    'Giá vaccine',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg relative">
              <RobotOutlined className="text-white text-3xl" />
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white animate-pulse" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Tư vấn Đặt Lịch với AI
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Trợ lý thông minh hỗ trợ đặt lịch tiêm chủng tự động
              </p>
            </div>
            <Button
              onClick={() => navigate('/profile')}
              className="rounded-lg font-medium"
            >
              Xem lịch sử
            </Button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden border border-purple-100">
          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="h-[500px] overflow-y-auto p-6 bg-gradient-to-b from-gray-50/50 to-white"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <UserOutlined className="text-white text-lg" />
                    ) : (
                      <RobotOutlined className="text-white text-lg" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex flex-col gap-2">
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-md ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : msg.isSuccess
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-gray-800 border border-green-200'
                          : 'bg-white text-gray-800 border border-gray-100'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                      ) : (
                        <AIMessageContent content={msg.content} />
                      )}
                    </div>

                    {/* Interactive Booking Form */}
                    {msg.hasBookingIntent &&
                      msg.suggestedBooking &&
                      showBookingForm && (
                        <Card
                          className="rounded-xl shadow-lg border-2 border-purple-200 animate-fade-in"
                          size="small"
                        >
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                              <CheckCircleOutlined className="text-purple-600 text-lg" />
                              <span className="font-semibold text-gray-900">
                                Xác nhận thông tin đặt lịch
                              </span>
                            </div>

                            <div className="space-y-3">
                              {/* Vaccine Selector */}
                              <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">
                                  <MedicineBoxOutlined className="mr-1 text-green-600" />
                                  Vaccine{' '}
                                  {availableVaccines.length === 0 && (
                                    <span className="text-red-500">
                                      (Đang tải...)
                                    </span>
                                  )}
                                </label>
                                {availableVaccines.length > 0 ? (
                                  <Select
                                    showSearch
                                    value={bookingForm.vaccineId}
                                    onChange={(value, option) => {
                                      const selectedVaccine =
                                        availableVaccines.find(
                                          (v) => v.id === value
                                        );
                                      setBookingForm({
                                        ...bookingForm,
                                        vaccineId: value,
                                        vaccineName: option.label,
                                        vaccinePrice:
                                          selectedVaccine?.price || 0,
                                      });
                                    }}
                                    placeholder="Chọn vaccine"
                                    className="w-full"
                                    size="large"
                                    filterOption={(input, option) =>
                                      (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    options={availableVaccines.map(
                                      (vaccine) => ({
                                        value: vaccine.id,
                                        label: `${
                                          vaccine.name
                                        } - ${new Intl.NumberFormat('vi-VN', {
                                          style: 'currency',
                                          currency: 'VND',
                                        }).format(vaccine.price)}`,
                                      })
                                    )}
                                  />
                                ) : (
                                  <Input
                                    value={
                                      bookingForm.vaccineName ||
                                      'Đang tải danh sách vaccine...'
                                    }
                                    disabled
                                    size="large"
                                    className="w-full"
                                  />
                                )}
                              </div>

                              {/* Center Selector */}
                              <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">
                                  <EnvironmentOutlined className="mr-1 text-blue-600" />
                                  Trung tâm tiêm chủng{' '}
                                  {availableCenters.length === 0 && (
                                    <span className="text-red-500">
                                      (Đang tải...)
                                    </span>
                                  )}
                                </label>
                                {availableCenters.length > 0 ? (
                                  <Select
                                    showSearch
                                    value={bookingForm.centerId}
                                    onChange={(value, option) => {
                                      setBookingForm({
                                        ...bookingForm,
                                        centerId: value,
                                        centerName: option.label,
                                      });
                                    }}
                                    placeholder="Chọn trung tâm"
                                    className="w-full"
                                    size="large"
                                    filterOption={(input, option) =>
                                      (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                    }
                                    options={availableCenters.map((center) => ({
                                      value: center.id,
                                      label: center.name,
                                    }))}
                                  />
                                ) : (
                                  <Input
                                    value={
                                      bookingForm.centerName ||
                                      'Đang tải danh sách trung tâm...'
                                    }
                                    disabled
                                    size="large"
                                    className="w-full"
                                  />
                                )}
                              </div>

                              {/* Date Picker */}
                              <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">
                                  <CalendarOutlined className="mr-1 text-purple-600" />
                                  Ngày tiêm
                                </label>
                                <DatePicker
                                  value={
                                    bookingForm.date
                                      ? dayjs(bookingForm.date, 'YYYY-MM-DD')
                                      : null
                                  }
                                  onChange={(date) => {
                                    setBookingForm({
                                      ...bookingForm,
                                      date: date
                                        ? date.format('YYYY-MM-DD')
                                        : null,
                                    });
                                  }}
                                  placeholder="Chọn ngày"
                                  className="w-full"
                                  size="large"
                                  format="DD/MM/YYYY"
                                  disabledDate={(current) =>
                                    current && current < dayjs().startOf('day')
                                  }
                                />
                              </div>

                              {/* Time Picker */}
                              <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">
                                  <ClockCircleOutlined className="mr-1 text-orange-600" />
                                  Giờ tiêm
                                </label>
                                <TimePicker
                                  value={
                                    bookingForm.time
                                      ? dayjs(bookingForm.time, 'HH:mm')
                                      : null
                                  }
                                  onChange={(time) => {
                                    setBookingForm({
                                      ...bookingForm,
                                      time: time ? time.format('HH:mm') : null,
                                    });
                                  }}
                                  placeholder="Chọn giờ"
                                  className="w-full"
                                  size="large"
                                  format="HH:mm"
                                  minuteStep={15}
                                />
                              </div>

                              {/* Payment Method Selection */}
                              <div>
                                <label className="text-xs font-medium text-gray-600 mb-2 block">
                                  <CreditCardOutlined className="mr-1 text-pink-600" />
                                  Phương thức thanh toán
                                </label>
                                <Radio.Group
                                  value={bookingForm.paymentMethod}
                                  onChange={(e) => {
                                    setBookingForm({
                                      ...bookingForm,
                                      paymentMethod: e.target.value,
                                    });
                                  }}
                                  className="w-full"
                                >
                                  <Space
                                    direction="vertical"
                                    className="w-full"
                                  >
                                    <Radio
                                      value="METAMASK"
                                      className="w-full border rounded-lg p-3 hover:border-purple-400 transition-all"
                                      style={{
                                        borderColor:
                                          bookingForm.paymentMethod ===
                                          'METAMASK'
                                            ? '#a855f7'
                                            : '#e5e7eb',
                                        backgroundColor:
                                          bookingForm.paymentMethod ===
                                          'METAMASK'
                                            ? '#faf5ff'
                                            : 'white',
                                      }}
                                    >
                                      <div className="flex items-center gap-3">
                                        <WalletOutlined className="text-purple-600 text-lg" />
                                        <div className="flex-1">
                                          <div className="font-medium text-gray-900">
                                            MetaMask
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Thanh toán bằng ETH qua ví MetaMask
                                          </div>
                                          {bookingForm.vaccinePrice && (
                                            <Tag
                                              color="purple"
                                              className="mt-1"
                                            >
                                              {(
                                                bookingForm.vaccinePrice / 10000
                                              ).toFixed(4)}{' '}
                                              ETH
                                            </Tag>
                                          )}
                                        </div>
                                        {!isConnected && (
                                          <Tag
                                            color="orange"
                                            className="text-xs"
                                          >
                                            Chưa kết nối
                                          </Tag>
                                        )}
                                      </div>
                                    </Radio>

                                    <Radio
                                      value="PAYPAL"
                                      className="w-full border rounded-lg p-3 hover:border-blue-400 transition-all"
                                      style={{
                                        borderColor:
                                          bookingForm.paymentMethod === 'PAYPAL'
                                            ? '#3b82f6'
                                            : '#e5e7eb',
                                        backgroundColor:
                                          bookingForm.paymentMethod === 'PAYPAL'
                                            ? '#eff6ff'
                                            : 'white',
                                      }}
                                    >
                                      <div className="flex items-center gap-3">
                                        <PayCircleOutlined className="text-blue-600 text-lg" />
                                        <div>
                                          <div className="font-medium text-gray-900">
                                            PayPal
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Thanh toán qua tài khoản PayPal
                                          </div>
                                        </div>
                                      </div>
                                    </Radio>

                                    <Radio
                                      value="BANK_TRANSFER"
                                      className="w-full border rounded-lg p-3 hover:border-green-400 transition-all"
                                      style={{
                                        borderColor:
                                          bookingForm.paymentMethod ===
                                          'BANK_TRANSFER'
                                            ? '#10b981'
                                            : '#e5e7eb',
                                        backgroundColor:
                                          bookingForm.paymentMethod ===
                                          'BANK_TRANSFER'
                                            ? '#f0fdf4'
                                            : 'white',
                                      }}
                                    >
                                      <div className="flex items-center gap-3">
                                        <BankOutlined className="text-green-600 text-lg" />
                                        <div>
                                          <div className="font-medium text-gray-900">
                                            Chuyển khoản
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Chuyển khoản ngân hàng
                                          </div>
                                        </div>
                                      </div>
                                    </Radio>

                                    <Radio
                                      value="CASH"
                                      className="w-full border rounded-lg p-3 hover:border-orange-400 transition-all"
                                      style={{
                                        borderColor:
                                          bookingForm.paymentMethod === 'CASH'
                                            ? '#f97316'
                                            : '#e5e7eb',
                                        backgroundColor:
                                          bookingForm.paymentMethod === 'CASH'
                                            ? '#fff7ed'
                                            : 'white',
                                      }}
                                    >
                                      <div className="flex items-center gap-3">
                                        <DollarOutlined className="text-orange-600 text-lg" />
                                        <div>
                                          <div className="font-medium text-gray-900">
                                            Tiền mặt
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Thanh toán trực tiếp tại trung tâm
                                          </div>
                                        </div>
                                      </div>
                                    </Radio>
                                  </Space>
                                </Radio.Group>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                type="primary"
                                size="large"
                                block
                                icon={<CheckCircleOutlined />}
                                onClick={handleConfirmBooking}
                                loading={isCreatingBooking}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 rounded-lg font-semibold shadow-md hover:shadow-lg h-10"
                              >
                                Xác nhận đặt lịch
                              </Button>
                              <Button
                                size="large"
                                onClick={handleCancelBooking}
                                disabled={isCreatingBooking}
                                className="rounded-lg font-semibold h-10"
                              >
                                Hủy
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}

                    <span
                      className={`text-xs ${
                        msg.role === 'user' ? 'text-right' : 'text-left'
                      } text-gray-400`}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <RobotOutlined className="text-white text-lg" />
                  </div>
                  <div className="bg-white rounded-2xl px-6 py-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-2">
                      <Spin indicator={<LoadingOutlined spin />} size="small" />
                      <span className="text-sm text-gray-600">
                        AI đang suy nghĩ...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
              <p className="text-xs font-semibold text-gray-600 mb-2">
                💡 Gợi ý câu hỏi:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, idx) => (
                  <Button
                    key={idx}
                    size="small"
                    className="rounded-full text-xs bg-white border-purple-200 hover:bg-purple-50 hover:border-purple-400"
                    onClick={() => setInputValue(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-3">
              <TextArea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Nhập câu hỏi của bạn... (Shift + Enter để xuống dòng)"
                autoSize={{ minRows: 1, maxRows: 4 }}
                disabled={isLoading}
                className="flex-1 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                style={{ resize: 'none' }}
              />
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={isLoading}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 rounded-xl px-6 font-semibold shadow-md hover:shadow-lg h-auto"
              >
                Gửi
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              AI có thể mắc lỗi. Vui lòng kiểm tra thông tin quan trọng.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100 shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <MedicineBoxOutlined className="text-purple-600 text-lg" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  Tư vấn chuyên sâu
                </div>
                <div className="text-xs text-gray-600">Về các loại vaccine</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100 shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center">
                <ClockCircleOutlined className="text-pink-600 text-lg" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Nhanh chóng</div>
                <div className="text-xs text-gray-600">Đặt lịch tự động</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CheckCircleOutlined className="text-blue-600 text-lg" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Tiện lợi</div>
                <div className="text-xs text-gray-600">24/7 hỗ trợ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBookingPage;
