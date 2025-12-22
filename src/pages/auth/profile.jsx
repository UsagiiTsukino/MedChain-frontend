import { useEffect, useState } from 'react';
import { Tabs, notification, Card } from 'antd';
import {
  CalendarOutlined,
  WalletOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useAccount, useBalance } from 'wagmi';
import ModalProfile from '../../components/modal/modal.profile';
import ModalAvatar from '../../components/modal/modal.avatar';
import { fetchAccount } from '../../redux/slice/accountSlide';
import { callMyBookings } from '../../config/api.auth';
import { callCancelAppointment } from '../../config/api.appointment';

import UserInfoCard from './profile/UserInfoCard';
import WalletCard from './profile/WalletCard';
import AppointmentHistory from './profile/AppointmentHistory';
import ConversationsList from '../../components/chat/ConversationsList';
import Web3 from 'web3';
import TransactionHistory from './profile/TransactionHistory';
import useLoadingData from '../../utils/withLoadingData';

const { TabPane } = Tabs;

const ProfilePage = () => {
  const { address } = useAccount();
  const web3Instance = new Web3(window.ethereum);
  const user = useSelector((state) => state.account.user);
  const dispatch = useDispatch();

  console.log('[ProfilePage] Current user from Redux:', user);
  console.log('[ProfilePage] Wallet address from wagmi:', address);

  const [openModal, setOpenModal] = useState(false);
  const [openAvatarModal, setOpenAvatarModal] = useState(false);
  const { data } = useBalance({ address });
  const formattedValue = data?.formatted ? Number(data.formatted) : 0;

  // Use the loading data hook for appointments
  const {
    loading: loadingAppointments,
    data: appointments,
    fetchData: fetchAppointments,
  } = useLoadingData(
    async () => {
      const response = await callMyBookings();
      // Response is direct array of bookings
      return response || [];
    },
    {
      errorMessage: 'Không thể tải lịch sử đăng ký',
      timeout: 1000,
    }
  );

  const reloadData = async () => {
    // Always fetch the latest user data after update
    try {
      await dispatch(fetchAccount()).unwrap();
    } catch (error) {
      console.error('Failed to reload user data:', error);
    }
  };

  const reloadAppointment = () => {
    fetchAppointments();
  };

  useEffect(() => {
    if (user?.walletAddress && !user.walletAddress.includes(address)) {
      reloadData();
    }
  }, [user?.walletAddress, address]);

  const handleCancel = async (id) => {
    if (id) {
      const res = await callCancelAppointment(id);
      if (res) {
        reloadAppointment();
        message.success('Appointment cancelled successfully');
      } else {
        notification.error({
          message: res.error,
          description: res.message,
        });
      }
    }
  };

  const [sender, setSender] = useState([]);
  const [receiver, setReceiver] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    fetchAppointments();

    const fetchTransactions = async (address) => {
      const sender = await getSenderByAddress(address);
      const receiver = await getReceiverByAddress(address);
      const allTransactions = await getAllTransactions();
      setSender(sender);
      setReceiver(receiver);
      setAllTransactions(allTransactions);
    };

    if (address) {
      fetchTransactions(address);
    }
  }, [address]);

  async function getAllTransactions() {
    const latestBlock = await web3Instance.eth.getBlockNumber();

    let txs = [];

    for (let i = 0; i <= latestBlock; i++) {
      let block = await web3Instance.eth.getBlock(i, true);
      if (block && block.transactions) {
        let filteredTx = block.transactions
          .filter((tx) => typeof tx !== 'string')
          .filter(
            (tx) =>
              tx.value && web3Instance.utils.fromWei(tx.value, 'ether') > 0
          )
          .map((tx) => ({
            ...tx,
            value: `${web3Instance.utils.fromWei(tx.value, 'ether')} ETH`,
            key: tx.hash,
          }));
        txs.push(...filteredTx);
      }
    }

    return txs;
  }

  async function getSenderByAddress(address) {
    const latestBlock = await web3Instance.eth.getBlockNumber();

    let txs = [];

    for (let i = 0; i <= latestBlock; i++) {
      let block = await web3Instance.eth.getBlock(i, true);
      if (block && block.transactions) {
        let filteredTx = block.transactions
          .filter((tx) => typeof tx !== 'string')
          .filter(
            (tx) =>
              tx.value && web3Instance.utils.fromWei(tx.value, 'ether') > 0
          )
          .filter((tx) => tx.from?.toLowerCase() === address.toLowerCase())
          .map((tx) => ({
            ...tx,
            value: `${web3Instance.utils.fromWei(tx.value, 'ether')} ETH`,
            key: tx.hash,
          }));
        txs.push(...filteredTx);
      }
    }

    return txs;
  }

  async function getReceiverByAddress(address) {
    const latestBlock = await web3Instance.eth.getBlockNumber();

    let txs = [];

    for (let i = 0; i <= latestBlock; i++) {
      let block = await web3Instance.eth.getBlock(i, true);
      if (block && block.transactions) {
        let filteredTx = block.transactions
          .filter((tx) => typeof tx !== 'string')
          .filter(
            (tx) =>
              tx.value && web3Instance.utils.fromWei(tx.value, 'ether') > 0
          )
          .filter((tx) => tx.to?.toLowerCase() === address.toLowerCase())
          .map((tx) => ({
            ...tx,
            value: `${web3Instance.utils.fromWei(tx.value, 'ether')} ETH`,
            key: tx.hash,
          }));
        txs.push(...filteredTx);
      }
    }

    return txs;
  }

  const getRole = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'PATIENT':
        return 'Người dùng';
      case 'DOCTOR':
        return 'Bác sĩ';
      case 'CASHIER':
        return 'Nhân viên thu ngân';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="mt-2 text-lg text-gray-600">
            Quản lý thông tin và lịch sử tiêm chủng của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <UserInfoCard
              user={user}
              onEdit={() => setOpenModal(true)}
              onAvatarClick={() => setOpenAvatarModal(true)}
              getRole={getRole}
            />
            <WalletCard
              address={user?.metamaskWallet}
              balance={formattedValue}
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg">
              <Tabs defaultActiveKey="1">
                {user?.role === 'PATIENT' && (
                  <TabPane
                    tab={
                      <span className="flex items-center gap-2">
                        <CalendarOutlined />
                        <span className="font-medium">
                          Lịch sử đăng ký tiêm chủng
                        </span>
                      </span>
                    }
                    key="2"
                  >
                    <AppointmentHistory
                      user={user}
                      appointments={appointments}
                      loadingAppointments={loadingAppointments}
                      handleCancel={handleCancel}
                    />
                  </TabPane>
                )}
                {(user?.role === 'PATIENT' || user?.role === 'DOCTOR') && (
                  <TabPane
                    tab={
                      <span className="flex items-center gap-2">
                        <MessageOutlined />
                        <span className="font-medium">Tin nhắn</span>
                      </span>
                    }
                    key="4"
                  >
                    <ConversationsList
                      currentUser={{
                        walletAddress: user?.walletAddress,
                        fullName: user?.fullName,
                        role: user?.role,
                      }}
                    />
                  </TabPane>
                )}
                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <WalletOutlined />
                      <span className="font-medium">Lịch sử giao dịch</span>
                    </span>
                  }
                  key="3"
                >
                  <TransactionHistory
                    allTransactions={allTransactions}
                    sender={sender}
                    receiver={receiver}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      <ModalProfile
        openModal={openModal}
        setOpenModal={setOpenModal}
        reloadData={reloadData}
        user={user}
      />

      <ModalAvatar
        open={openAvatarModal}
        setOpen={setOpenAvatarModal}
        onSuccess={(avatarUrl) => {
          // Reload user data to get updated avatar
          reloadData();
        }}
      />
    </div>
  );
};

export default ProfilePage;
