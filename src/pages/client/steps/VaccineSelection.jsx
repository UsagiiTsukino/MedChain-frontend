import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Input, Pagination, Skeleton } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { fetchVaccine } from '../../../redux/slice/vaccineSlice';
import {
  ExperimentOutlined,
  MedicineBoxOutlined,
  BugOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ReloadOutlined,
  HeartOutlined,
  SafetyOutlined,
  MedicineBoxFilled,
} from '@ant-design/icons';
import { sfLike } from 'spring-filter-query-builder';

const VaccineSelection = ({
  currentPage,
  setCurrentPage,
  setBookingSummary,
}) => {
  const dispatch = useDispatch();
  const vaccines = useSelector((state) => state.vaccine.result);
  const meta = useSelector((state) => state.vaccine.meta);
  const loading = useSelector((state) => state.vaccine.isFetching);
  const location = useLocation();
  const [form] = Form.useForm();
  const selectedVaccineRef = useRef(null);
  const [selectedVaccineInfo, setSelectedVaccineInfo] = useState(null);
  const [pageSize, setPageSize] = useState(9);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    disease: 'all',
    target: 'all',
    priceRange: 'all',
  });

  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params.vaccineId) {
      const selectedVaccine = vaccines.find(
        (v) => v.vaccineId === params.vaccineId
      );
      if (selectedVaccine) {
        setSelectedVaccineInfo(selectedVaccine);
        setTimeout(() => {
          if (selectedVaccineRef.current) {
            selectedVaccineRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }, 100);
      }
    }
  }, [location.search, vaccines]);

  useEffect(() => {
    fetchVaccines();
  }, [currentPage, pageSize, filters, searchText]);

  const fetchVaccines = () => {
    const query = buildQuery();
    dispatch(fetchVaccine({ query }));
  };

  const buildQuery = () => {
    let filter = '';

    if (searchText) {
      filter = `${sfLike('name', searchText)}`;
    }

    if (filters.disease !== 'all') {
      filter = filter
        ? `${filter} and ${sfLike('disease', filters.disease)}`
        : `${sfLike('disease', filters.disease)}`;
    }
    if (filters.target !== 'all') {
      filter = filter
        ? `${filter} and ${sfLike('target', filters.target)}`
        : `${sfLike('target', filters.target)}`;
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
    setFilters({
      disease: 'all',
      target: 'all',
      priceRange: 'all',
    });
    setSearchText('');
    setCurrentPage(1);
  };

  const diseases = [
    { value: 'all', label: 'Tất cả' },
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
    { value: 'all', label: 'Tất cả' },
    { value: 'Trẻ em', label: 'Trẻ em' },
    { value: 'Người lớn', label: 'Người lớn' },
  ];

  const priceRanges = [
    { value: 'all', label: 'Tất cả' },
    { value: '0-500000', label: '< 500K' },
    { value: '500000-2000000', label: '500K - 2M' },
    { value: '2000000-5000000', label: '2M - 5M' },
    { value: '5000000-999999999', label: '> 5M' },
  ];

  const handleVaccineSelect = (vaccineId) => {
    const selectedVaccine = vaccines.find((v) => v.vaccineId === vaccineId);
    setSelectedVaccineInfo(selectedVaccine);

    form.setFieldsValue({
      vaccine: vaccineId,
    });

    if (setBookingSummary) {
      setBookingSummary((prev) => ({
        ...prev,
        vaccine: selectedVaccine,
      }));
    }
  };

  const getVaccineIcon = (type) => {
    switch (type) {
      case 'virus':
        return <ExperimentOutlined className="text-4xl" />;
      case 'bacteria':
        return <BugOutlined className="text-4xl" />;
      default:
        return <MedicineBoxOutlined className="text-4xl" />;
    }
  };

  const getStockColor = (quantity) => {
    if (quantity > 50) return 'bg-green-100 text-green-700 border-green-300';
    if (quantity >= 20)
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  const renderSelectedVaccineInfo = () => {
    if (!selectedVaccineInfo) return null;

    return (
      <div className="mb-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
        <div className="flex items-start gap-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
            {getVaccineIcon(selectedVaccineInfo.type)}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedVaccineInfo.name}
                  </h3>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-semibold shadow-md">
                    <CheckCircleOutlined />
                    Đã chọn
                  </span>
                </div>
                <p className="text-gray-700 text-base">
                  {selectedVaccineInfo.description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                <p className="text-xs text-gray-600 mb-1">Nhà sản xuất</p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedVaccineInfo.manufacturer}
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                <p className="text-xs text-gray-600 mb-1">Xuất xứ</p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedVaccineInfo.country}
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                <p className="text-xs text-gray-600 mb-1">Đối tượng</p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedVaccineInfo.target}
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/40">
                <p className="text-xs text-gray-600 mb-1">Liều lượng</p>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedVaccineInfo.schedule}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <DollarOutlined className="text-2xl text-green-600" />
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(selectedVaccineInfo.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHeader = () => (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
        <MedicineBoxOutlined className="text-5xl text-white" />
      </div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Chọn Vaccine
      </h2>
      <p className="text-gray-600 text-lg">
        Tìm và chọn vaccine phù hợp với nhu cầu của bạn
      </p>
    </div>
  );

  const renderSearchBar = () => (
    <div className="mb-8">
      <div className="relative">
        <Input
          size="large"
          placeholder="Tìm kiếm vaccine theo tên..."
          prefix={<SearchOutlined className="text-gray-400 text-xl" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="rounded-2xl border-2 border-transparent focus:border-blue-500 shadow-sm hover:shadow-md transition-all duration-300"
          style={{
            background:
              'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box',
            padding: '12px 20px',
            fontSize: '16px',
          }}
        />
      </div>
    </div>
  );

  const renderFilters = () => (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Disease Filter */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <SafetyOutlined className="text-xl text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-800">Loại bệnh</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {diseases.map((disease) => (
              <button
                key={disease.value}
                onClick={() => handleFilterChange(disease.value, 'disease')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filters.disease === disease.value
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                {disease.label}
              </button>
            ))}
          </div>
        </div>

        {/* Target Group Filter */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <UserOutlined className="text-xl text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-800">Đối tượng</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {targetGroups.map((target) => (
              <button
                key={target.value}
                onClick={() => handleFilterChange(target.value, 'target')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filters.target === target.value
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                {target.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-2 mb-3">
            <DollarOutlined className="text-xl text-green-600" />
            <h3 className="text-sm font-semibold text-gray-800">Mức giá</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handleFilterChange(range.value, 'priceRange')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filters.priceRange === range.value
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 hover:bg-green-100 border border-green-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center">
          <button
            onClick={resetFilters}
            className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-slate-700 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-slate-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <ReloadOutlined className="text-lg" />
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
    </div>
  );

  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="rounded-2xl shadow-md">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-16 text-center border-2 border-dashed border-blue-300">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6">
        <MedicineBoxFilled className="text-6xl text-blue-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        Không tìm thấy vaccine
      </h3>
      <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
        Không có vaccine nào phù hợp với bộ lọc của bạn. Vui lòng thử điều chỉnh
        tiêu chí tìm kiếm.
      </p>
      <button
        onClick={resetFilters}
        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Đặt lại bộ lọc
      </button>
    </div>
  );

  const renderVaccineGrid = () => {
    if (loading) {
      return renderSkeletonCards();
    }

    if (!vaccines || vaccines.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaccines.map((vaccine) => {
          const isSelected =
            selectedVaccineInfo?.vaccineId === vaccine.vaccineId;
          return (
            <div
              key={vaccine.vaccineId}
              ref={
                vaccine.vaccineId ===
                queryString.parse(location.search).vaccineId
                  ? selectedVaccineRef
                  : null
              }
              className={`group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-blue-500 shadow-xl shadow-blue-200 scale-[1.02]'
                  : 'border-gray-200 shadow-md hover:shadow-xl hover:scale-[1.02] hover:border-blue-300'
              }`}
              onClick={() => handleVaccineSelect(vaccine.vaccineId)}
            >
              {/* Glow effect for selected card */}
              {isSelected && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
              )}

              <div className="relative">
                {/* Header with Icon and Disease Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        : 'bg-gradient-to-br from-blue-400 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-600'
                    }`}
                  >
                    <div className="text-white">
                      {getVaccineIcon(vaccine.type)}
                    </div>
                  </div>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-semibold rounded-full shadow-md">
                    {vaccine.disease}
                  </span>
                </div>

                {/* Vaccine Name and Description */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {vaccine.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {vaccine.description}
                </p>

                {/* Details Grid */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <UserOutlined className="text-purple-600" />
                      <span className="text-xs text-gray-600">Đối tượng</span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                        vaccine.target === 'Trẻ em'
                          ? 'bg-cyan-100 text-cyan-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {vaccine.target}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CalendarOutlined className="text-orange-600" />
                      <span className="text-xs text-gray-600">Liều lượng</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {vaccine.schedule}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <SafetyOutlined className="text-blue-600" />
                      <span className="text-xs text-gray-600">Tồn kho</span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-lg border ${getStockColor(
                        vaccine.stockQuantity
                      )}`}
                    >
                      {vaccine.stockQuantity} liều
                    </span>
                  </div>
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <DollarOutlined className="text-green-600" />
                      <span className="text-xs text-gray-600">Giá</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(vaccine.price)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVaccineSelect(vaccine.vaccineId);
                    }}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                      isSelected
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                    }`}
                  >
                    {isSelected ? (
                      <span className="flex items-center gap-2">
                        <CheckCircleOutlined />
                        Đã chọn
                      </span>
                    ) : (
                      'Chọn vaccine'
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPagination = () => {
    if (!vaccines || vaccines.length === 0) return null;

    return (
      <div className="mt-12 flex justify-center">
        <Pagination
          current={currentPage}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          total={meta.total}
          pageSize={pageSize}
          showSizeChanger
          showTotal={(total, range) => (
            <span className="text-gray-600 font-medium">
              Hiển thị {range[0]}-{range[1]} trong tổng số {total} vaccine
            </span>
          )}
          className="custom-pagination"
          itemRender={(page, type, originalElement) => {
            if (type === 'prev') {
              return (
                <button className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                  Trước
                </button>
              );
            }
            if (type === 'next') {
              return (
                <button className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                  Sau
                </button>
              );
            }
            if (type === 'page') {
              return (
                <button className="w-10 h-10 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                  {page}
                </button>
              );
            }
            return originalElement;
          }}
        />
      </div>
    );
  };

  return (
    <div className="w-full">
      <Form form={form}>
        {/* Hidden form field to store selected vaccine */}
        <Form.Item name="vaccine" hidden>
          <Input />
        </Form.Item>

        {/* Header */}
        {renderHeader()}

        {/* Selected Vaccine Info */}
        {renderSelectedVaccineInfo()}

        {/* Search Bar */}
        {renderSearchBar()}

        {/* Filters */}
        {renderFilters()}

        {/* Vaccine Grid */}
        {renderVaccineGrid()}

        {/* Pagination */}
        {renderPagination()}
      </Form>
    </div>
  );
};

export default VaccineSelection;
