/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Form,
  DatePicker,
  Radio,
  Select,
  Row,
  Col,
  Typography,
  Alert,
  Badge,
} from 'antd';
import {
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { fetchCenter as fetchCenterAction } from '../../../redux/slice/centerSlice';
import queryString from 'query-string';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dayjs from 'dayjs';

const { Group: RadioGroup } = Radio;
const { Text, Title } = Typography;

const Confirmation = ({ form, bookingSummary }) => {
  const [doseForms, setDoseForms] = useState([]);
  const [firstDoseDate, setFirstDoseDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([16.047079, 108.20623]);

  const dispatch = useDispatch();
  const centers = useSelector((state) => state.center.result);
  const isFetchingCenters = useSelector((state) => state.center.isFetching);

  // Define timeSlots at the top to avoid initialization errors
  const timeSlots = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'];

  useEffect(() => {
    loadCenters();
  }, [dispatch]);

  // Tính toán lịch tiêm khi ngày đầu tiên thay đổi
  useEffect(() => {
    if (!firstDoseDate || !bookingSummary?.vaccine) return;

    // Ensure firstDoseDate is a valid dayjs object
    if (!dayjs.isDayjs(firstDoseDate) || !firstDoseDate.isValid()) {
      // eslint-disable-next-line no-console
      console.error(
        '[Confirmation] firstDoseDate is not valid:',
        firstDoseDate,
        'isValid:',
        firstDoseDate?.isValid()
      );
      return;
    }

    const { dosage, duration } = bookingSummary.vaccine;
    const dates = [firstDoseDate];

    // Tính ngày cho các mũi tiếp theo, tránh thứ 7 và chủ nhật
    for (let i = 1; i < dosage; i++) {
      let nextDate = dates[i - 1].add(duration, 'day');

      // Điều chỉnh nếu rơi vào cuối tuần
      while (nextDate.day() === 0 || nextDate.day() === 6) {
        nextDate = nextDate.add(1, 'day');
      }

      dates.push(nextDate);
    }

    // Tạo form cho các mũi tiêm
    const centerId = form.getFieldValue('centerId');
    const forms = [];
    for (let i = 1; i < dosage; i++) {
      forms.push({
        doseNumber: i + 1,
        date: dates[i],
        time: timeSlots[0], // Mặc định chọn khung giờ đầu tiên
        centerId: centerId || null,
      });
    }
    setDoseForms(forms);

    // Set giá trị cho form.List - chỉ set một lần khi khởi tạo
    const currentSchedules = form.getFieldValue('doseSchedules');
    if (!currentSchedules || currentSchedules.length === 0) {
      const validForms = forms.map((f) => {
        const isValid = dayjs.isDayjs(f.date) && f.date.isValid();
        // eslint-disable-next-line no-console
        console.log('[Confirmation] Setting dose form:', {
          doseNumber: f.doseNumber,
          date: f.date,
          isValidDayjs: isValid,
          formatted: isValid ? f.date.format('DD/MM/YYYY') : 'INVALID',
        });

        return {
          date: isValid ? f.date : undefined,
          time: f.time,
          centerId: f.centerId,
        };
      });

      form.setFieldsValue({
        doseSchedules: validForms,
      });
    }
  }, [firstDoseDate, bookingSummary, form, timeSlots]);

  const handleDoseDateChange = (index, value) => {
    // Update local state
    const updatedForms = [...doseForms];
    updatedForms[index].date = value;
    setDoseForms(updatedForms);

    // Get current form values and only update the specific field
    const currentSchedules = form.getFieldValue('doseSchedules') || [];
    const newSchedules = [...currentSchedules];
    newSchedules[index] = {
      ...newSchedules[index],
      date: value,
    };

    form.setFieldsValue({
      doseSchedules: newSchedules,
    });
  };

  const handleDoseTimeChange = (index, value) => {
    // Update local state
    const updatedForms = [...doseForms];
    updatedForms[index].time = value;
    setDoseForms(updatedForms);

    // Get current form values and only update the specific field
    const currentSchedules = form.getFieldValue('doseSchedules') || [];
    const newSchedules = [...currentSchedules];
    newSchedules[index] = {
      ...newSchedules[index],
      time: value,
    };

    form.setFieldsValue({
      doseSchedules: newSchedules,
    });
  };

  const disabledWeekendDate = (current) => {
    const isPast = current && current < dayjs().startOf('day');
    const isWeekend = current && (current.day() === 0 || current.day() === 6);
    return isPast || isWeekend;
  };

  const loadCenters = () => {
    const query = queryString.stringify({
      page: 0,
      size: 100,
    });
    dispatch(fetchCenterAction({ query }));
  };

  const getDefaultLatitude = (address) => {
    if (address?.toLowerCase().includes('hải châu')) return 16.067627;
    if (address?.toLowerCase().includes('thanh khê')) return 16.064857;
    return 16.047079;
  };

  const getDefaultLongitude = (address) => {
    if (address?.toLowerCase().includes('hải châu')) return 108.221146;
    if (address?.toLowerCase().includes('thanh khê')) return 108.213514;
    return 108.20623;
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if not already initialized
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(mapCenter, 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    // Create clinic icon
    const clinicIcon = L.divIcon({
      html: '<i class="fas fa-hospital text-blue-600 text-2xl"></i>',
      iconSize: [24, 24],
      className: 'custom-div-icon',
    });

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add markers for each center
    centers.forEach((center) => {
      if (center.latitude && center.longitude) {
        const marker = L.marker([center.latitude, center.longitude], {
          icon: clinicIcon,
        })
          .addTo(mapInstanceRef.current)
          .bindPopup(
            `
            <div class="text-sm">
              <strong>${center.name}</strong><br/>
              ${center.address || 'Địa chỉ chưa cập nhật'}<br/>
              <small>Số điện thoại: ${
                center.phoneNumber || 'Chưa cập nhật'
              }</small><br/>
              <small>Sức chứa: ${
                center.capacity || 'Chưa cập nhật'
              } người/ngày</small>
            </div>
          `
          )
          .on('click', () => {
            form.setFieldsValues({ centerId: center.centerId });
            form.setFieldValue('centerInfo', center);
            setMapCenter([center.latitude, center.longitude]);
          });

        // Open popup if this is the selected center
        const selectedCenterId = form.getFieldValue('centerId');
        if (selectedCenterId === center.centerId) {
          marker.openPopup();
        }
      }
    });

    // Update map view if center changes
    mapInstanceRef.current.setView(mapCenter, 14);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centers, form, mapCenter]);

  const handleFirstDoseDateChange = (date) => {
    setFirstDoseDate(date);
  };

  const handleCenterChange = (centerId) => {
    const selectedCenter = centers.find((c) => c.centerId === centerId);
    if (selectedCenter) {
      form.setFieldsValue({ centerInfo: selectedCenter });
      // Update map position
      const lat =
        selectedCenter.latitude || getDefaultLatitude(selectedCenter.address);
      const lng =
        selectedCenter.longitude || getDefaultLongitude(selectedCenter.address);
      setMapCenter([lat, lng]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([lat, lng], 15);
      }
    }
  };

  const disabledDate = (current) => {
    const isPast = current && current < dayjs().startOf('day');
    const isWeekend = current && (current.day() === 0 || current.day() === 6);
    return isPast || isWeekend;
  };

  return (
    <div className="space-y-6">
      {/* Modern Header with Gradient Icon */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <CalendarOutlined className="text-white text-2xl" />
            </div>
          </div>
          <div className="flex-1">
            <Title level={4} className="!mb-2 !text-gray-800">
              Chọn thời gian và địa điểm
            </Title>
            {bookingSummary?.vaccine && (
              <div className="flex items-center gap-3 flex-wrap">
                <Badge
                  count={
                    <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {bookingSummary.vaccine.name}
                    </span>
                  }
                />
                <Text className="text-gray-600 text-sm">
                  <MedicineBoxOutlined className="mr-1" />
                  {bookingSummary.vaccine.dosage} mũi tiêm
                </Text>
                <Text className="text-gray-600 text-sm">
                  <ClockCircleOutlined className="mr-1" />
                  Cách nhau {bookingSummary.vaccine.duration} ngày
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden field to store center info */}
      <Form.Item name="centerInfo" hidden>
        <input type="hidden" />
      </Form.Item>

      <Row gutter={24}>
        {/* Left Column: Date & Time Selection */}
        <Col xs={24} lg={12}>
          <div className="space-y-6">
            {/* First Dose Card */}
            <Card
              className="shadow-sm rounded-xl border-blue-100 hover:shadow-md transition-shadow"
              bordered
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <Text strong className="text-lg">
                    Mũi tiêm đầu tiên
                  </Text>
                </div>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium">
                      <CalendarOutlined className="mr-2" />
                      Chọn ngày tiêm
                    </span>
                  }
                  name="firstDoseDate"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn ngày cho mũi tiêm đầu tiên',
                    },
                  ]}
                >
                  <DatePicker
                    className="w-full h-11 rounded-lg hover:border-blue-400 focus:border-blue-500"
                    locale={locale}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày tiêm"
                    disabledDate={disabledDate}
                    onChange={handleFirstDoseDateChange}
                    suffixIcon={<CalendarOutlined className="text-blue-500" />}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium">
                      <ClockCircleOutlined className="mr-2" />
                      Chọn giờ tiêm
                    </span>
                  }
                  name="time"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
                >
                  <RadioGroup
                    className="w-full"
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <Row gutter={[12, 12]}>
                      {timeSlots.map((time) => (
                        <Col span={8} key={time}>
                          <Radio.Button
                            value={time}
                            className="w-full text-center h-11 rounded-lg flex items-center justify-center font-medium hover:scale-105 transition-transform"
                            style={{
                              background:
                                selectedTime === time
                                  ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
                                  : 'white',
                              color:
                                selectedTime === time ? 'white' : '#374151',
                              border:
                                selectedTime === time
                                  ? 'none'
                                  : '1px solid #e5e7eb',
                            }}
                          >
                            <ClockCircleOutlined className="mr-1" />
                            {time}
                          </Radio.Button>
                        </Col>
                      ))}
                    </Row>
                  </RadioGroup>
                </Form.Item>
              </div>
            </Card>

            {/* Multi-Dose Timeline */}
            {doseForms.length > 0 &&
              form.getFieldValue('doseSchedules')?.length > 0 && (
                <Card
                  className="shadow-sm rounded-xl border-indigo-100 hover:shadow-md transition-shadow"
                  bordered
                >
                  <div className="mb-4 flex items-center gap-2">
                    <CheckCircleOutlined className="text-green-500 text-xl" />
                    <Text strong className="text-lg">
                      Lịch tiêm các mũi tiếp theo
                    </Text>
                  </div>

                  <Alert
                    message="Lịch trình được tối ưu hóa"
                    description="Các mũi tiêm được tự động lên lịch theo khoảng cách khuyến nghị. Bạn có thể điều chỉnh nếu cần."
                    type="info"
                    className="mb-6 rounded-lg"
                    showIcon
                    icon={<MedicineBoxOutlined />}
                  />

                  <Form.List name="doseSchedules">
                    {(fields) => (
                      <div className="relative">
                        {/* Timeline Connector */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 via-indigo-300 to-purple-300" />

                        <div className="space-y-6">
                          {fields.map(({ key, name }, index) => {
                            // Safety check for doseForms array
                            if (!doseForms[index]) return null;

                            return (
                              <div key={key} className="relative pl-12">
                                {/* Timeline Dot */}
                                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg z-10">
                                  <span className="text-white text-sm font-bold">
                                    {doseForms[index].doseNumber}
                                  </span>
                                </div>

                                <Card
                                  className="shadow-sm rounded-lg border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all bg-gradient-to-br from-white to-gray-50"
                                  size="small"
                                >
                                  <div className="mb-3">
                                    <Text strong className="text-base">
                                      Mũi tiêm thứ {doseForms[index].doseNumber}
                                    </Text>
                                  </div>

                                  <Row gutter={12}>
                                    <Col span={12}>
                                      <Form.Item
                                        label={
                                          <span className="text-gray-700 text-sm">
                                            <CalendarOutlined className="mr-1" />
                                            Ngày tiêm
                                          </span>
                                        }
                                        name={[name, 'date']}
                                        getValueProps={(value) => ({
                                          value:
                                            value &&
                                            dayjs.isDayjs(value) &&
                                            value.isValid()
                                              ? value
                                              : undefined,
                                        })}
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Vui lòng chọn ngày',
                                          },
                                        ]}
                                        className="mb-0"
                                      >
                                        <DatePicker
                                          className="w-full h-10 rounded-lg hover:border-indigo-400"
                                          locale={locale}
                                          format="DD/MM/YYYY"
                                          placeholder="Chọn ngày"
                                          disabledDate={disabledWeekendDate}
                                          onChange={(value) =>
                                            handleDoseDateChange(index, value)
                                          }
                                        />
                                      </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                      <Form.Item
                                        label={
                                          <span className="text-gray-700 text-sm">
                                            <ClockCircleOutlined className="mr-1" />
                                            Giờ tiêm
                                          </span>
                                        }
                                        name={[name, 'time']}
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Vui lòng chọn giờ',
                                          },
                                        ]}
                                        className="mb-0"
                                      >
                                        <Select
                                          className="w-full"
                                          placeholder="Chọn giờ"
                                          options={timeSlots.map((time) => ({
                                            value: time,
                                            label: (
                                              <span>
                                                <ClockCircleOutlined className="mr-1" />
                                                {time}
                                              </span>
                                            ),
                                          }))}
                                          onChange={(value) =>
                                            handleDoseTimeChange(index, value)
                                          }
                                          size="large"
                                        />
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Card>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </Form.List>
                </Card>
              )}

            {/* Helper Message */}
            {!firstDoseDate && (
              <Alert
                message="Bắt đầu đặt lịch"
                description="Chọn ngày cho mũi tiêm đầu tiên để hệ thống tự động đề xuất lịch trình tối ưu cho các mũi tiếp theo."
                type="info"
                showIcon
                icon={<CalendarOutlined />}
                className="rounded-lg border-blue-200 bg-blue-50"
              />
            )}
          </div>
        </Col>

        {/* Right Column: Location & Map */}
        <Col xs={24} lg={12}>
          <div className="space-y-6">
            {/* Location Selection Card */}
            <Card
              className="shadow-sm rounded-xl border-green-100 hover:shadow-md transition-shadow"
              bordered
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-sm">
                    <EnvironmentOutlined className="text-white text-xl" />
                  </div>
                  <Text strong className="text-lg">
                    Địa điểm tiêm chủng
                  </Text>
                </div>

                <Form.Item
                  label={
                    <span className="text-gray-700 font-medium">
                      <EnvironmentOutlined className="mr-2" />
                      Chọn cơ sở y tế
                    </span>
                  }
                  name="centerId"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn cơ sở tiêm chủng',
                    },
                  ]}
                >
                  <Select
                    className="w-full"
                    size="large"
                    options={centers?.map((center) => ({
                      label: center.name || 'Không có tên',
                      value: center.centerId,
                      disabled: !center.centerId,
                    }))}
                    placeholder="Chọn cơ sở tiêm chủng"
                    suffixIcon={
                      <EnvironmentOutlined className="text-green-500" />
                    }
                    onChange={handleCenterChange}
                    notFoundContent={
                      centers?.length === 0 ? 'Không có cơ sở nào' : null
                    }
                    loading={isFetchingCenters}
                  />
                </Form.Item>
              </div>
            </Card>

            {/* Interactive Map Card */}
            <Card
              className="shadow-sm rounded-xl border-gray-200 overflow-hidden"
              bordered
              bodyStyle={{ padding: 0 }}
            >
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <EnvironmentOutlined className="text-blue-500 text-lg" />
                  <Text strong className="text-base">
                    Vị trí trên bản đồ
                  </Text>
                </div>
                <Text className="text-xs text-gray-500 mt-1 block">
                  Nhấp vào marker để xem thông tin chi tiết
                </Text>
              </div>
              <div
                ref={mapRef}
                className="w-full"
                style={{ height: '400px', zIndex: 1 }}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Confirmation;
