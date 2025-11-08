import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  InputNumber,
  Empty,
  Divider,
  Space,
  message,
} from 'antd';
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from '../../redux/slice/cartSlice';

const { Title, Text } = Typography;

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const { items, total, itemCount } = useSelector((state) => state.cart);

  // Format currency
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  // Calculate cart total from items
  const numericTotal = items.reduce((sum, item) => {
    const itemPrice =
      typeof item.price === 'string' ? parseInt(item.price) : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  // Calculate shipping and tax
  const shippingFee = numericTotal > 500000 ? 0 : 30000;
  const tax = Math.floor(numericTotal * 0.08); // Use floor to avoid floating point issues
  const finalTotal = Math.floor(numericTotal + shippingFee + tax); // Ensure clean integer

  const handleQuantityChange = (vaccineId, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ vaccineId, quantity }));
    }
  };

  const handleRemoveItem = (vaccineId) => {
    dispatch(removeFromCart(vaccineId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để thanh toán');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="py-16 text-center">
            <Empty
              image={
                <ShoppingOutlined className="text-4xl text-gray-300 sm:text-6xl" />
              }
              description={
                <div>
                  <Text className="mb-2 block text-lg text-gray-600 sm:text-xl">
                    Your cart is empty
                  </Text>
                  <Text type="secondary" className="text-sm sm:text-base">
                    Discover amazing products and start shopping today!
                  </Text>
                </div>
              }
            >
              <Button
                type="primary"
                size="large"
                icon={<ShoppingOutlined />}
                onClick={() => navigate('/market')}
                className="mt-4 h-12 px-8 text-base font-medium"
              >
                Start Shopping
              </Button>
            </Empty>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Mobile-optimized header */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-2 sm:gap-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/products')}
              className="flex-shrink-0"
              size="small"
            >
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <Title level={2} className="mb-0 text-lg sm:text-2xl">
              <span className="hidden sm:inline">
                Shopping Cart ({itemCount} items)
              </span>
              <span className="sm:hidden">Cart ({itemCount})</span>
            </Title>
          </div>

          {/* Mobile cart summary bar */}
          <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm sm:hidden">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-sm text-gray-600">
                  Total ({itemCount} items)
                </Text>
                <Title level={4} className="mb-0 text-blue-600">
                  {formatter.format(finalTotal)}
                </Title>
              </div>
              <Button
                type="primary"
                onClick={handleCheckout}
                className="h-10 px-6 font-medium"
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="mb-4 flex items-center justify-between">
              <Text strong className="text-base sm:text-lg">
                Giỏ hàng của bạn
              </Text>
              <Button
                type="text"
                danger
                onClick={handleClearCart}
                disabled={items.length === 0}
                size="small"
                className="text-xs sm:text-sm"
              >
                Clear Cart
              </Button>
            </div>

            {items.map((item) => (
              <Card
                key={item.id}
                className="mb-4 rounded-xl border-0 shadow-sm"
              >
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  <div className="mb-3 flex gap-3">
                    <img
                      src={
                        'https://imgs.search.brave.com/X2P6JpAcCoCU0k2B3ViLw9MVrwH-7MM-8Tobl4C52lE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/c2NpZW5jZWFsZXJ0/LmNvbS9pbWFnZXMv/MjAyNS8wOC92YXJp/Y2VsbGFfdmFjY2lu/ZV82NDIuanBn'
                      }
                      alt={item.name}
                      className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Title
                        level={5}
                        className="mb-1 text-sm leading-tight"
                        ellipsis={{ rows: 2 }}
                      >
                        {item.name}
                      </Title>
                      <Text type="secondary" className="mb-1 block text-xs">
                        {item.category}
                      </Text>
                      <Text className="text-sm font-semibold text-blue-600">
                        {formatter.format(item.price)}
                      </Text>
                    </div>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveItem(item.vaccineId)}
                      size="small"
                      className="flex-shrink-0 p-1"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Text className="text-sm">Qty:</Text>
                      <InputNumber
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(value) =>
                          handleQuantityChange(item.vaccineId, value)
                        }
                        className="w-16"
                        size="small"
                      />
                    </div>
                    <Text className="text-lg font-semibold text-blue-600">
                      {formatter.format(item.price * item.quantity)}
                    </Text>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden items-start sm:flex">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
                  />

                  <div className="ml-4 flex-1">
                    <Title level={5} className="mb-2">
                      {item.name}
                    </Title>
                    <Text type="secondary" className="mb-2 block">
                      {item.category}
                    </Text>
                    <Text
                      className="mb-2 block text-sm text-gray-600"
                      ellipsis={{ rows: 2 }}
                    >
                      {item.description.slice(0, 50)}
                    </Text>
                    <Text className="text-lg font-semibold text-blue-600">
                      {formatter.format(item.price)}
                    </Text>
                  </div>

                  <div className="ml-4 flex flex-col items-end gap-3">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveItem(item.vaccineId)}
                      size="small"
                    >
                      Remove
                    </Button>

                    <Space align="center">
                      <Text>Qty:</Text>
                      <InputNumber
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(value) =>
                          handleQuantityChange(item.vaccineId, value)
                        }
                        className="w-20"
                      />
                    </Space>

                    <Text className="text-lg font-semibold text-blue-600">
                      {formatter.format(item.price * item.quantity)}
                    </Text>
                  </div>
                </div>
              </Card>
            ))}
          </Col>

          <Col xs={24} lg={8}>
            {/* Desktop Order Summary */}
            <Card
              title="Order Summary"
              className="sticky top-6 hidden rounded-xl border-0 shadow-sm sm:block"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Text className="text-gray-600">
                    Subtotal ({itemCount} items)
                  </Text>
                  <Text className="font-medium">
                    {formatter.format(numericTotal)}
                  </Text>
                </div>

                <div className="flex items-center justify-between">
                  <Text className="text-gray-600">Shipping</Text>
                  <Text className="font-medium">
                    {numericTotal > 500000 ? (
                      <span className="text-green-600">Miễn phí</span>
                    ) : (
                      formatter.format(shippingFee)
                    )}
                  </Text>
                </div>

                <div className="flex items-center justify-between">
                  <Text className="text-gray-600">Tax (8%)</Text>
                  <Text className="font-medium">{formatter.format(tax)}</Text>
                </div>

                {numericTotal > 500000 && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <Text className="text-sm text-green-700">
                      🎉 Bạn đã tiết kiệm {formatter.format(30000)} phí vận
                      chuyển!
                    </Text>
                  </div>
                )}

                <Divider className="my-4" />

                <div className="flex items-center justify-between">
                  <Title level={4} className="mb-0">
                    Total
                  </Title>
                  <Title level={4} className="mb-0 text-blue-600">
                    {formatter.format(finalTotal)}
                  </Title>
                </div>

                <Button
                  type="primary"
                  onClick={handleCheckout}
                  className="mt-4 h-12 w-full rounded-lg text-base font-semibold"
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-3 text-center">
                  <Text type="secondary" className="text-sm">
                    🔒 Secure checkout with SSL encryption
                  </Text>
                </div>
              </div>
            </Card>

            {/* Mobile Sticky Bottom Summary */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg sm:hidden">
              <div className="mx-auto max-w-6xl">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <Text className="text-sm text-gray-600">
                      Total ({itemCount} items)
                    </Text>
                    <div className="flex items-center gap-2">
                      <Title level={4} className="mb-0 text-blue-600">
                        {formatter.format(finalTotal)}
                      </Title>
                      {numericTotal > 500000 && (
                        <Text className="rounded bg-green-50 px-2 py-1 text-xs text-green-600">
                          Free shipping
                        </Text>
                      )}
                    </div>
                  </div>
                  <Button
                    type="primary"
                    onClick={handleCheckout}
                    className="h-12 rounded-lg px-8 text-base font-semibold"
                  >
                    Checkout
                  </Button>
                </div>

                {/* Mobile expandable summary */}
                <details className="text-sm">
                  <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                    View order details
                  </summary>
                  <div className="mt-2 space-y-2 border-t border-gray-100 pt-2">
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Subtotal</Text>
                      <Text>{formatter.format(numericTotal)}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Shipping</Text>
                      <Text>
                        {numericTotal > 500000
                          ? 'Free'
                          : formatter.format(shippingFee)}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-gray-600">Tax</Text>
                      <Text>{formatter.format(tax)}</Text>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </Col>
        </Row>

        {/* Mobile bottom spacing to prevent content being hidden behind sticky footer */}
        <div className="h-32 sm:hidden" />
      </div>
    </div>
  );
};

export default CartPage;
