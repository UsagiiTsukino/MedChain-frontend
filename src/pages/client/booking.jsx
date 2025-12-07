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
      <Card className="mb-4" size="small">
        <Descriptions
          title="Thông tin đặt lịch"
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Vaccine">
            <Tag color="blue">{bookingSummary.vaccine.name}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Giá">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(bookingSummary.vaccine.price)}{' '}
            <Tag color="blue">{ethEquivalent} ETH</Tag>
          </Descriptions.Item>
          {bookingSummary.date && bookingSummary.time && (
            <Descriptions.Item label="Thời gian">
              <Tag icon={<CalendarOutlined />} color="green">
                {dayjs(bookingSummary.date).format('DD/MM/YYYY')} -{' '}
                {bookingSummary.time}
              </Tag>
            </Descriptions.Item>
          )}
          {bookingSummary.center && (
            <Descriptions.Item label="Cơ sở tiêm chủng">
              <Tag color="purple">{bookingSummary.center.name}</Tag>
            </Descriptions.Item>
          )}
          {bookingSummary.payment && (
            <Descriptions.Item label="Phương thức thanh toán">
              <Tag icon={<CreditCardOutlined />} color="orange">
                {bookingSummary.payment}
              </Tag>
            </Descriptions.Item>
          )}
        </Descriptions>
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
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Đặt lịch tiêm chủng
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Chọn vaccine, phương thức thanh toán và thời gian tiêm phù hợp
        </p>
      </div>

      {renderSummary()}

      <Steps
        current={current}
        items={steps.map((item) => ({ key: item.title, title: item.title }))}
        className="mb-8"
      />

      <Form form={form} layout="vertical">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {renderStepContent(steps[current].content)}
        </div>

        <div className="flex justify-between">
          {current > 0 && (
            <Button size="large" onClick={prev} disabled={loading}>
              Quay lại
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              type="primary"
              size="large"
              onClick={next}
              disabled={loading}
            >
              Tiếp tục
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              size="large"
              onClick={handleFinish}
              loading={loading}
            >
              Hoàn tất đặt lịch
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default BookingPage;
