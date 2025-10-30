import { useState, useEffect } from 'react';
import {
  Select,
  Tag,
  Pagination,
  Form,
  Button,
  Row,
  Col,
  Card,
  Empty,
  message,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVaccine } from '../../redux/slice/vaccineSlice';
import queryString from 'query-string';
import { sfLike } from 'spring-filter-query-builder';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart } from '../../redux/slice/cartSlice';

const { Option } = Select;

const MarketPage = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const vaccines = useSelector((state) => state.vaccine.result);
  const meta = useSelector((state) => state.vaccine.meta);
  const loading = useSelector((state) => state.vaccine.isFetching);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [filters, setFilters] = useState({
    disease: 'all',
    target: 'all',
    priceRange: 'all',
    manufacturer: 'all',
  });

  useEffect(() => {
    fetchVaccines();
  }, [currentPage, pageSize, filters]);

  const fetchVaccines = () => {
    const query = buildQuery();
    dispatch(fetchVaccine({ query }));
  };

  const buildQuery = () => {
    let filter = '';

    if (filters.disease !== 'all') {
      filter = `${sfLike('disease', filters.disease)}`;
    }
    if (filters.target !== 'all') {
      filter = filter
        ? `${filter} and ${sfLike('target', filters.target)}`
        : `${sfLike('target', filters.target)}`;
    }
    if (filters.manufacturer !== 'all') {
      filter = filter
        ? `${filter} and ${sfLike('manufacturer', filters.manufacturer)}`
        : `${sfLike('manufacturer', filters.manufacturer)}`;
    }
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filter = filter
        ? `${filter} and (price >= ${min} and price < ${max})`
        : `price >= ${min} and price < ${max}`;
    }

    const params = {
      page: currentPage,
      size: pageSize,
      ...(filter && { filter }),
    };

    return queryString.stringify(params);
  };

  const handleFilterChange = (value, type) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const defaultFilters = {
      disease: 'all',
      target: 'all',
      priceRange: 'all',
      manufacturer: 'all',
    };
    setFilters(defaultFilters);
    setCurrentPage(1);
    form.setFieldsValue({
      disease: 'all',
      target: 'all',
      priceRange: 'all',
      manufacturer: 'all',
    });
  };

  const handleAddToCart = (vaccine) => {
    dispatch(addToCart(vaccine));
  };

  const handleBooking = (vaccine) => {
    if (!isAuthenticated) {
      return message.warning('Đăng nhập để đặt lịch');
    }
    return navigate(`/booking?sku=${vaccine.sku}`);
  };

  const diseases = [
    { value: 'all', label: 'Tất cả bệnh' },
    { value: 'COVID-19', label: 'COVID-19' },
    { value: 'Viêm màng não', label: 'Viêm màng não' },
    { value: 'HPV', label: 'HPV' },
    { value: 'Cúm mùa', label: 'Cúm mùa' },
    { value: 'Sốt rét', label: 'Sốt rét' },
    { value: 'Viêm gan', label: 'Viêm gan' },
    { value: 'Thương hàn', label: 'Thương hàn' },
    { value: 'Zona', label: 'Zona' },
    { value: 'Dại', label: 'Dại' },
  ];

  const targetGroups = [
    { value: 'all', label: 'Tất cả đối tượng' },
    { value: 'Trẻ em', label: 'Trẻ em' },
    { value: 'Người lớn', label: 'Người lớn' },
  ];

  const priceRanges = [
    { value: 'all', label: 'Tất cả giá' },
    { value: '0-500000', label: 'Dưới 500,000 VND' },
    { value: '500000-2000000', label: '500,000 - 2,000,000 VND' },
    { value: '2000000-5000000', label: '2,000,000 - 5,000,000 VND' },
    { value: '5000000-999999999', label: 'Trên 5,000,000 VND' },
  ];

  const manufacturers = [
    { value: 'all', label: 'Tất cả nhà sản xuất' },
    { value: 'Pfizer', label: 'Pfizer/BioNTech' },
    { value: 'GlaxoSmithKline', label: 'GlaxoSmithKline (GSK)' },
    { value: 'Moderna', label: 'Moderna' },
    { value: 'Merck', label: 'Merck' },
    { value: 'Sanofi Pasteur', label: 'Sanofi Pasteur' },
    { value: 'Serum Institute', label: 'Serum Institute of India' },
    { value: 'CanSino', label: 'CanSino Biologics' },
  ];

  return (
    <>
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Danh sách Vaccine
            </h1>
            <nav className="flex mt-2" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1 text-sm text-gray-500">
                <li>
                  <Link to="/" className="hover:text-gray-700">
                    Trang chủ
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-1">/</span>
                  <span className="text-gray-900">Vaccine</span>
                </li>
              </ol>
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                disease: 'all',
                target: 'all',
                priceRange: 'all',
                manufacturer: 'all',
              }}
            >
              <div className="border-b pb-4 mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Bộ lọc tìm kiếm
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Tìm kiếm vaccine phù hợp với nhu cầu của bạn
                </p>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Loại bệnh" name="disease">
                    <Select
                      style={{ width: '100%' }}
                      onChange={(value) => handleFilterChange(value, 'disease')}
                    >
                      {diseases.map((disease) => (
                        <Option key={disease.value} value={disease.value}>
                          {disease.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Đối tượng" name="target">
                    <Select
                      style={{ width: '100%' }}
                      onChange={(value) => handleFilterChange(value, 'target')}
                    >
                      {targetGroups.map((target) => (
                        <Option key={target.value} value={target.value}>
                          {target.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Mức giá" name="priceRange">
                    <Select
                      style={{ width: '100%' }}
                      onChange={(value) =>
                        handleFilterChange(value, 'priceRange')
                      }
                    >
                      {priceRanges.map((range) => (
                        <Option key={range.value} value={range.value}>
                          {range.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Form.Item label="Nhà sản xuất" name="manufacturer">
                    <Select
                      style={{ width: '100%' }}
                      onChange={(value) =>
                        handleFilterChange(value, 'manufacturer')
                      }
                    >
                      {manufacturers.map((mfr) => (
                        <Option key={mfr.value} value={mfr.value}>
                          {mfr.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <div className="flex justify-end">
                    <Button onClick={resetFilters} className="mr-2">
                      Đặt lại
                    </Button>
                    <Button type="primary">Áp dụng</Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>

          {vaccines.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vaccines.map((vaccine) => (
                  <Card
                    key={vaccine.vaccineId}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    loading={loading}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <i className="fas fa-syringe text-brand-primary text-xl" />
                      </div>
                      <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                        <i className="fas fa-link text-green-500 text-xs mr-1" />
                        <span className="text-xs font-medium text-green-700">
                          {vaccine.disease}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {vaccine.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {vaccine.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Nhà sản xuất</p>
                        <p className="text-sm font-medium">
                          {vaccine.manufacturer}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Xuất xứ</p>
                        <p className="text-sm font-medium">{vaccine.country}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Đối tượng</p>
                        <div className="flex items-center">
                          <UserOutlined className="text-brand-primary mr-1" />
                          <Tag
                            color={
                              vaccine.target === 'Trẻ em' ? 'cyan' : 'blue'
                            }
                          >
                            {vaccine.target}
                          </Tag>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Hiệu quả</p>
                        <p className="text-sm font-medium">
                          {vaccine.efficacy}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Liều lượng</p>
                        <p className="text-sm font-medium">
                          {vaccine.schedule}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Số lượng</p>
                        <p className="text-sm font-medium">
                          {vaccine.stockQuantity} liều
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Giá</p>
                        <p className="text-lg font-semibold text-brand-primary">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(vaccine.price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <Button
                        type="primary"
                        className="bg-brand-primary"
                        onClick={() => handleBooking(vaccine)}
                      >
                        Đặt lịch tiêm
                      </Button>
                      <Button
                        type="primary"
                        className="bg-brand-primary"
                        onClick={() => handleAddToCart(vaccine)}
                      >
                        Thêm giỏ hàng
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Pagination
                  current={currentPage}
                  onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setPageSize(pageSize);
                  }}
                  total={meta.total}
                  pageSize={pageSize}
                  showSizeChanger={true}
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} vaccine`
                  }
                />
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Không tìm thấy vaccine
                    </h3>
                    <p className="text-gray-500">
                      Không tìm thấy vaccine phù hợp với tiêu chí tìm kiếm của
                      bạn. Vui lòng thử lại với các bộ lọc khác.
                    </p>
                    <Button onClick={resetFilters} type="primary">
                      Đặt lại bộ lọc
                    </Button>
                  </div>
                }
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MarketPage;
