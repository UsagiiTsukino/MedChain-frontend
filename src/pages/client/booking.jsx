import { useState, useEffect, useMemo } from 'react';
import { Steps, Form, Button, message, Tag, Card, Descriptions } from 'antd';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ExperimentOutlined,
  MedicineBoxOutlined,
  BugOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import VaccineSelection from './steps/VaccineSelection';
import PaymentMethod from './steps/PaymentMethod';
import Confirmation from './steps/Confirmation';
import { callFetchVaccineBySku } from '../../config/api.vaccine';
import {
  callCreateBooking,
  updatePaymentMetaMask,
} from '../../config/api.appointment';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Web3 } from 'web3';
import { useAccount } from 'wagmi';

const BookingPage = () => {
  const user = useSelector((state) => state.account.user);
  const { address: connectedWalletAddress, isConnected } = useAccount();
  const navigate = useNavigate();
  const location = useLocation();
  // Create Web3 instance only once using useMemo
  const web3Instance = useMemo(() => {
    if (window.ethereum) {
      return new Web3(window.ethereum);
    }
    return null;
  }, []);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [bookingSummary, setBookingSummary] = useState({
    vaccine: null,
    firstDoseDate: null,
    time: null,
    center: null,
    payment: null,
  });
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    ageGroup: [],
    priceRange: [],
  });
  const [paymentStatus, setPaymentStatus] = useState('');
  const [ethAmount, setEthAmount] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verify session with backend
        const response = await fetch('http://localhost:3000/auth/account', {
          credentials: 'include',
        });
        const data = await response.json();

        if (!data || !data.walletAddress) {
          message.warning({
            content: 'Vui lòng đăng nhập để đặt lịch tiêm chủng',
            duration: 3,
            onClose: () => navigate('/login'),
          });
        }
      } catch {
        message.error({
          content: 'Không thể xác thực. Vui lòng đăng nhập lại.',
          duration: 3,
          onClose: () => navigate('/login'),
        });
      }
    };

    if (!user || !user.walletAddress) {
      checkAuth();
    }
  }, [user, navigate]);

  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params.sku) {
      fetchVaccineBySku(params.sku);
    }
  }, [location.search]);

  const fetchVaccineBySku = async (sku) => {
    if (!sku || sku === 'undefined' || sku === 'null') {
      console.warn('[Booking] Invalid SKU provided:', sku);
      message.error('Không tìm thấy thông tin vaccine');
      navigate('/market');
      return;
    }

    try {
      setLoading(true);
      const response = await callFetchVaccineBySku(sku);

      if (!response?.data) {
        throw new Error('No vaccine data received');
      }

      setSelectedVaccine(response.data);
      setBookingSummary((prev) => ({ ...prev, vaccine: response.data }));
      form.setFieldsValue({
        vaccine: sku,
      });
    } catch (error) {
      console.error('[Booking] Error fetching vaccine:', error);
      message.error('Không thể tải thông tin vaccine. Vui lòng thử lại.');
      navigate('/market');
    } finally {
      setLoading(false);
    }
  };

  const getVaccineIcon = (type) => {
    switch (type) {
      case 'virus':
        return <ExperimentOutlined className="text-blue-600 text-xl" />;
      case 'bacteria':
        return <BugOutlined className="text-blue-600 text-xl" />;
      default:
        return <MedicineBoxOutlined className="text-blue-600 text-xl" />;
    }
  };

  const renderSelectedVaccineInfo = () => {
    if (!selectedVaccine) return null;

    // Calculate ETH equivalent
    const ethEquivalent = selectedVaccine.price / 10000;

    return (
      <Card className="mb-6 border-2 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-lg bg-blue-50 flex items-center justify-center">
            {getVaccineIcon(selectedVaccine.type)}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedVaccine.name}
                </h3>
                <p className="text-gray-600">{selectedVaccine.description}</p>
              </div>
              <Tag color="green" icon={<CheckCircleOutlined />}>
                Đã chọn
              </Tag>
            </div>
            <Descriptions
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
              <Descriptions.Item label="Nhà sản xuất">
                {selectedVaccine.manufacturer}
              </Descriptions.Item>
              <Descriptions.Item label="Xuất xứ">
                {selectedVaccine.country}
              </Descriptions.Item>
              <Descriptions.Item label="Đối tượng">
                {selectedVaccine.target}
              </Descriptions.Item>
              <Descriptions.Item label="Liều lượng">
                {selectedVaccine.schedule}
              </Descriptions.Item>
              <Descriptions.Item label="Giá">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(selectedVaccine.price)}
                <br />
                <small className="text-blue-500">({ethEquivalent} ETH)</small>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>
    );
  };

  const renderSummary = () => {
    if (!bookingSummary.vaccine) return null;

    // Calculate ETH equivalent
    const ethEquivalent = bookingSummary.vaccine.price / 10000;

    return (
      <Card
        className="mb-8 shadow-lg border-0 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div className="flex items-center gap-6 text-white p-2">
          <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <MedicineBoxOutlined className="text-4xl text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1">
              {bookingSummary.vaccine.name}
            </h3>
            <p className="text-purple-100 mb-2">
              {bookingSummary.vaccine.manufacturer}
            </p>
            <div className="flex flex-wrap gap-3">
              <Tag className="bg-white/90 text-gray-900 font-semibold px-3 py-1 rounded-lg border-0">
                {bookingSummary.vaccine.dosage} mũi tiêm
              </Tag>
              <Tag className="bg-white/90 text-gray-900 font-semibold px-3 py-1 rounded-lg border-0">
                {bookingSummary.vaccine.price?.toLocaleString()} VNĐ
              </Tag>
              <Tag className="bg-white/90 text-gray-900 font-semibold px-3 py-1 rounded-lg border-0">
                {ethEquivalent} ETH
              </Tag>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderStepContent = (step) => {
    const commonProps = {
      form,
      currentPage,
      setCurrentPage,
      searchText,
      setSearchText,
      selectedFilters,
      setSelectedFilters,
    };

    switch (step) {
      case 'vaccine-selection':
        return queryString.parse(location.search).vaccineId ? (
          renderSelectedVaccineInfo()
        ) : (
          <VaccineSelection
            {...commonProps}
            setBookingSummary={setBookingSummary}
          />
        );

      case 'confirmation':
        return (
          <Confirmation {...commonProps} bookingSummary={bookingSummary} />
        );

      case 'payment-method':
        return (
          <PaymentMethod
            {...commonProps}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            form={form}
          />
        );

      default:
        return null;
    }
  };

  const validateStep = async () => {
    try {
      const values = await form.validateFields();
      switch (current) {
        case 0:
          if (!values.vaccine && !selectedVaccine && !bookingSummary.vaccine) {
            message.warning('Vui lòng chọn vaccine');
            return false;
          }
          break;
        case 1: {
          if (!values.firstDoseDate || !values.time || !values.centerId) {
            message.error('Vui lòng chọn đầy đủ thông tin thời gian và cơ sở');
            return false;
          }
          const centerInfo = await form.getFieldValue('centerInfo');
          const doseSchedules = values.doseSchedules || [];
          let allDosesValid = true;

          if (bookingSummary.vaccine && bookingSummary.vaccine.dosage > 1) {
            for (let i = 0; i < doseSchedules.length; i++) {
              if (!doseSchedules[i]?.date || !doseSchedules[i]?.time) {
                message.error(
                  `Vui lòng chọn đầy đủ thông tin cho mũi tiêm thứ ${i + 2}`
                );
                allDosesValid = false;
                break;
              }
            }
          }

          if (!allDosesValid) return false;

          setBookingSummary((prev) => ({
            ...prev,
            firstDoseDate: values.firstDoseDate,
            time: values.time,
            center: centerInfo,
            doseSchedules: doseSchedules, // Lưu thông tin các mũi tiếp theo
          }));
          break;
        }
        case 2: {
          if (!values.payment && !selectedPayment) {
            message.error('Vui lòng chọn phương thức thanh toán');
            return false;
          }

          // Use form value if available, otherwise use selectedPayment
          const paymentMethod = values.payment || selectedPayment;
          setSelectedPayment(paymentMethod);

          setBookingSummary((prev) => ({
            ...prev,
            payment: paymentMethod,
          }));
          break;
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const next = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
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
      // Network chưa được thêm vào MetaMask
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
      // Treasury wallet - nơi nhận thanh toán
      const treasuryWallet = '0xcC177e1F003856d9d5c6870cAFfA798B50431ea6';

      // Kiểm tra ví đã kết nối chưa
      if (!isConnected || !connectedWalletAddress) {
        message.error('Vui lòng kết nối ví MetaMask trước khi thanh toán!');
        return false;
      }

      // Kiểm tra và chuyển sang Ganache network
      const currentChainId = await web3Instance.eth.getChainId();
      if (currentChainId !== 1337n && currentChainId !== 5777n) {
        message.loading('Đang chuyển sang Ganache network...', 0);
        const switched = await switchToGanache();
        message.destroy();
        if (!switched) {
          message.error('Vui lòng chuyển sang Ganache network trong MetaMask!');
          return false;
        }
        // Đợi một chút để network chuyển xong
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const amountInWei = web3Instance.utils.toWei(amount.toString(), 'ether');

      const tx = {
        from: connectedWalletAddress, // Sử dụng ví đã kết nối từ wagmi
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

  const handleFinish = async () => {
    try {
      setLoading(true);
      console.log('[Booking] Handle finish started');

      const isValid = await validateStep();
      console.log('[Booking] Validation result:', isValid);
      if (!isValid) {
        setLoading(false);
        return;
      }

      // Get values directly from form to avoid stale state
      const formValues = form.getFieldsValue();
      const payment = formValues.payment || selectedPayment;

      const { time, firstDoseDate, center, vaccine, doseSchedules } =
        bookingSummary;

      console.log('[Booking] Booking summary:', bookingSummary);
      console.log('[Booking] Payment from form:', payment);

      // Validate required fields
      if (!vaccine || !vaccine.vaccineId) {
        message.error('Thông tin vaccine không hợp lệ. Vui lòng chọn lại.');
        setLoading(false);
        return;
      }

      if (!center || !center.centerId) {
        message.error('Thông tin trung tâm không hợp lệ. Vui lòng chọn lại.');
        setLoading(false);
        return;
      }

      // Double check payment is not null
      if (!payment) {
        message.error('Phương thức thanh toán không được để trống');
        setLoading(false);
        return;
      }

      // Format doseSchedules for API
      const formattedSchedules = (doseSchedules || []).map((schedule) => ({
        date: dayjs(schedule.date).format('YYYY-MM-DD'),
        time: schedule.time,
        centerId: center.centerId,
      }));

      console.log('[Booking] Calling API with:', {
        vaccineId: vaccine.vaccineId,
        centerId: center.centerId,
        time,
        date: dayjs(firstDoseDate).format('YYYY-MM-DD'),
        amount: vaccine.price * vaccine.dosage,
        schedules: formattedSchedules,
        payment,
      });

      const response = await callCreateBooking(
        vaccine.vaccineId,
        center.centerId,
        time,
        dayjs(firstDoseDate).format('YYYY-MM-DD'),
        vaccine.price * vaccine.dosage,
        formattedSchedules,
        payment
      );

      console.log('[Booking] API Response:', response);

      // Check if data is in response.data or directly in response
      const responseData = response.data || response;

      if (responseData && responseData.bookingId) {
        console.log('[Booking] Payment method:', responseData.method);
        console.log('[Booking] Booking ID:', responseData.bookingId);
        console.log('[Booking] Payment ID:', responseData.paymentId);

        const paymentMethod = responseData.method?.toUpperCase();

        if (paymentMethod === 'CASH') {
          // Navigate to success page with booking info
          console.log('[Booking] Navigating to success page for CASH payment');
          navigate(
            `/success?booking=${responseData.bookingId}&payment=${responseData.paymentId}`
          );
        } else if (paymentMethod === 'PAYPAL') {
          console.log('[Booking] Redirecting to PayPal');
          window.location.href = responseData.paymentURL;
        } else if (paymentMethod === 'METAMASK') {
          console.log('[Booking] Processing MetaMask transaction');
          const transaction = await sendETH(responseData.amount);
          if (transaction) {
            await updatePaymentMetaMask(
              responseData.paymentId,
              responseData.bookingId
            );
            navigate(
              '/success?booking=' +
                responseData.bookingId +
                '&payment=' +
                responseData.paymentId
            );
          }
        } else {
          console.error('[Booking] Unknown payment method:', paymentMethod);
          message.error('Phương thức thanh toán không hợp lệ');
        }
      } else {
        console.error('[Booking] Invalid response structure:', response);
        message.error('Phản hồi từ server không hợp lệ');
      }
    } catch (error) {
      console.error('[Booking] Error:', error);
      console.error('[Booking] Error details:', error.response?.data);
      setPaymentStatus('error');

      // Check if it's authentication error
      if (
        error.message?.includes('not authenticated') ||
        error.response?.data?.message?.includes('not authenticated')
      ) {
        message.error({
          content: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          key: 'paymentMessage',
          duration: 3,
          onClose: () => {
            navigate('/login');
          },
        });
      } else {
        message.error({
          content: error.message || 'Có lỗi xảy ra, vui lòng thử lại sau',
          key: 'paymentMessage',
          duration: 3,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const steps = [
    {
      title: 'Chọn vaccine',
      content: 'vaccine-selection',
    },
    {
      title: 'Thời gian tiêm chủng',
      content: 'confirmation',
    },
    {
      title: 'Phương thức thanh toán',
      content: 'payment-method',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <CalendarOutlined className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Đặt lịch tiêm chủng
          </h1>
          <p className="text-gray-600 text-lg">
            Quy trình đặt lịch nhanh chóng và an toàn với MedChainAI
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <Steps
            current={current}
            items={steps.map((item, index) => ({
              key: item.title,
              title: item.title,
              icon:
                index === 0 ? (
                  <MedicineBoxOutlined />
                ) : index === 1 ? (
                  <CalendarOutlined />
                ) : (
                  <CreditCardOutlined />
                ),
            }))}
            className="custom-steps"
            style={{
              '--ant-color-primary': '#2563eb',
              '--ant-color-primary-hover': '#1d4ed8',
            }}
          />
        </div>

        {/* Summary Card (if vaccine selected) */}
        {renderSummary()}

        {/* Main Content Card */}
        <Form form={form} layout="vertical">
          <Card
            className="shadow-xl border-0 rounded-2xl overflow-hidden mb-8"
            bodyStyle={{ padding: '2rem' }}
            style={{
              background:
                'linear-gradient(to bottom right, rgba(255,255,255,0.9), rgba(255,255,255,0.8))',
              backdropFilter: 'blur(20px)',
            }}
          >
            {renderStepContent(steps[current].content)}
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            {current > 0 && (
              <Button
                size="large"
                onClick={prev}
                disabled={loading}
                className="h-12 px-8 rounded-xl text-base font-medium hover:scale-105 transition-transform"
              >
                ← Quay lại
              </Button>
            )}
            <div className="flex-1" />
            {current < steps.length - 1 && (
              <Button
                type="primary"
                size="large"
                onClick={next}
                disabled={loading}
                className="h-12 px-8 rounded-xl text-base font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  border: 'none',
                }}
              >
                Tiếp tục →
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                type="primary"
                size="large"
                onClick={handleFinish}
                loading={loading}
                className="h-12 px-8 rounded-xl text-base font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{
                  background:
                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                }}
              >
                <CheckCircleOutlined /> Hoàn tất đặt lịch
              </Button>
            )}
          </div>
        </Form>
      </div>

      {/* Custom CSS for Steps */}
      <style jsx>{`
        .custom-steps :global(.ant-steps-item-process .ant-steps-item-icon) {
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          border-color: #3b82f6;
        }
        .custom-steps :global(.ant-steps-item-finish .ant-steps-item-icon) {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-color: #10b981;
        }
        .custom-steps
          :global(.ant-steps-item-finish .ant-steps-item-tail::after) {
          background: linear-gradient(90deg, #10b981 0%, #3b82f6 100%);
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
