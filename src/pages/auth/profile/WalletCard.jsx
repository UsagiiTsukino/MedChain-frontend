import { useEffect } from 'react';
import { Card, Button, message } from 'antd';
import {
  WalletOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  DisconnectOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { useConnect, useDisconnect, useAccount } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useDispatch, useSelector } from 'react-redux';
import { doUpdateUserInfoAction } from '../../../redux/slice/accountSlide';
import { callLinkWallet } from '../../../config/api.auth';

const WalletCard = ({ address, balance }) => {
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { address: connectedAddress, isConnected } = useAccount();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.account.user);

  // Call backend API when wallet connects
  useEffect(() => {
    const linkWalletToBackend = async () => {
      console.log('[WalletCard] useEffect triggered:', {
        isConnected,
        connectedAddress,
        currentMetamaskWallet: user?.metamaskWallet,
        currentAddress: address,
      });

      // Only call API if:
      // 1. Wallet is connected
      // 2. Has connected address
      // 3. Connected address is different from user's current metamaskWallet in database
      if (
        isConnected &&
        connectedAddress &&
        connectedAddress !== user?.metamaskWallet
      ) {
        console.log(
          '[WalletCard] Calling API to link wallet:',
          connectedAddress
        );
        console.log(
          '[WalletCard] Current metamaskWallet in DB:',
          user?.metamaskWallet
        );
        try {
          const res = await callLinkWallet(connectedAddress);
          console.log('[WalletCard] API response:', res);
          if (res?.data) {
            // Update Redux store with new metamask wallet
            dispatch(
              doUpdateUserInfoAction({ metamaskWallet: connectedAddress })
            );
            message.success('Đã liên kết ví MetaMask thành công!');
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Link wallet error:', error);
          if (error.response?.data?.message) {
            message.error(error.response.data.message);
          } else {
            message.error('Không thể liên kết ví. Vui lòng thử lại.');
          }
          // Disconnect if linking failed
          disconnect();
        }
      } else {
        console.log('[WalletCard] Conditions not met for linking:', {
          isConnected,
          hasConnectedAddress: !!connectedAddress,
          metamaskWalletMatch: connectedAddress === user?.metamaskWallet,
        });
      }
    };

    linkWalletToBackend();
  }, [
    isConnected,
    connectedAddress,
    user?.metamaskWallet,
    dispatch,
    disconnect,
  ]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      message.success('Đã sao chép địa chỉ ví');
    } catch {
      message.error('Không thể sao chép');
    }
  };

  const handleConnectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        message.error('Vui lòng cài đặt MetaMask để kết nối ví');
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      connect({ connector: injected() });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Connect wallet error:', error);
      message.error('Không thể kết nối ví. Vui lòng thử lại.');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    message.success('Đã ngắt kết nối ví');
  };

  // Not connected state
  if (!address) {
    return (
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-md">
              <WalletOutlined className="text-white text-sm" />
            </div>
            Ví điện tử
          </h3>
          <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
            <DisconnectOutlined className="text-orange-600 text-xs" />
            <span className="text-xs font-semibold text-orange-700">
              Chưa liên kết
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-4 border border-gray-200 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <WalletOutlined className="text-white text-2xl" />
          </div>
          <p className="text-gray-600 mb-2">Bạn chưa liên kết ví MetaMask</p>
          <p className="text-sm text-gray-500">
            Liên kết ví để thanh toán bằng ETH và nhận chứng nhận NFT
          </p>
        </div>

        <Button
          type="primary"
          className="w-full h-12 font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 border-0 hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
          icon={<LinkOutlined />}
          onClick={handleConnectWallet}
          loading={isConnecting}
        >
          {isConnecting ? 'Đang kết nối...' : 'Liên kết ví MetaMask'}
        </Button>

        <p className="text-xs text-gray-400 text-center mt-3">
          Cần cài đặt MetaMask extension để sử dụng tính năng này
        </p>
      </Card>
    );
  }

  // Connected state
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
            <WalletOutlined className="text-white text-sm" />
          </div>
          Ví điện tử
        </h3>
        <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full">
          <CheckCircleOutlined className="text-green-600 text-xs" />
          <span className="text-xs font-semibold text-green-700">
            Đã kết nối
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Số dư khả dụng</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {(balance || 0).toFixed(4)}
          </span>
          <span className="text-lg font-semibold text-gray-500">ETH</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <p className="text-xs text-gray-500 mb-2">Địa chỉ ví</p>
        <div className="flex items-center gap-2">
          <code className="text-sm font-mono text-gray-900 flex-1 truncate">
            {address}
          </code>
          <div className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
            <WalletOutlined className="text-blue-600 text-xs" />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1 h-10 font-semibold rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:text-purple-600 transition-all duration-300"
          icon={<CopyOutlined />}
          onClick={copyToClipboard}
        >
          Sao chép
        </Button>
        <Button
          className="h-10 font-semibold rounded-xl border-2 border-red-200 hover:border-red-400 hover:text-red-600 transition-all duration-300"
          icon={<DisconnectOutlined />}
          onClick={handleDisconnect}
          danger
        >
          Ngắt kết nối
        </Button>
      </div>
    </Card>
  );
};

export default WalletCard;
