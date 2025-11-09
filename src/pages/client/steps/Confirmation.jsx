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
  Divider,
} from 'antd';
import { EnvironmentOutlined, CalendarOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { fetchCenter as fetchCenterAction } from '../../../redux/slice/centerSlice';
import queryString from 'query-string';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dayjs from 'dayjs';

const { Group: RadioGroup } = Radio;
const { Text } = Typography;

const Confirmation = ({ form, bookingSummary }) => {
  const [doseForms, setDoseForms] = useState([]);
  const [firstDoseDate, setFirstDoseDate] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([16.047079, 108.20623]);

  const dispatch = useDispatch();
  const centers = useSelector((state) => state.center.result);
  const isFetchingCenters = useSelector((state) => state.center.isFetching);

  useEffect(() => {
    loadCenters();
  }, [dispatch]);

  // Tính toán lịch tiêm khi ngày đầu tiên thay đổi
  useEffect(() => {
    if (!firstDoseDate || !bookingSummary?.vaccine) return;

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
    const forms = [];
    for (let i = 1; i < dosage; i++) {
      forms.push({
        doseNumber: i + 1,
        date: dates[i],
        time: timeSlots[0], // Mặc định chọn khung giờ đầu tiên
      });
    }
    setDoseForms(forms);

    // Cập nhật giá trị form
    form.setFieldsValue({
      date: firstDoseDate,
      doseSchedules: forms,
    });
  }, [firstDoseDate, bookingSummary]);

  const handleDoseDateChange = (index, value) => {
    const updatedForms = [...doseForms];
    updatedForms[index].date = value;
    setDoseForms(updatedForms);
    form.setFieldsValue({
      doseSchedules: updatedForms,
    });
  };

  const handleDoseTimeChange = (index, value) => {
    const updatedForms = [...doseForms];
    updatedForms[index].time = value;
    setDoseForms(updatedForms);
    form.setFieldsValue({
      doseSchedules: updatedForms,
    });
  };

  const disabledWeekendDate = (current) => {
    return current && (current.day() === 0 || current.day() === 6);
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
            form.setFieldsValue({ centerId: center.centerId });
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

  const handleCenterChange = (value) => {
    const selectedCenter = centers.find((center) => center.centerId === value);
    if (selectedCenter) {
      form.setFieldValue('centerInfo', selectedCenter);
      if (selectedCenter.latitude && selectedCenter.longitude) {
        setMapCenter([selectedCenter.latitude, selectedCenter.longitude]);
      }
    }
  };

  const handleFirstDoseDateChange = (date) => {
    setFirstDoseDate(date);
  };

  const timeSlots = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'];

  const disabledDate = (current) => {
    const isPast = current && current < dayjs().startOf('day');
    const isWeekend = current && (current.day() === 0 || current.day() === 6);
    return isPast || isWeekend;
  };

  return (
    <Card title="Chọn thời gian và địa điểm" className="mb-8">
      <Row gutter={24}>
        <Col span={12}>
          {/* Hiển thị thông tin vaccine */}
          {bookingSummary?.vaccine && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <Text strong>{bookingSummary.vaccine.name}</Text>
              <div className="mt-1">
                <Text type="secondary">
                  Số mũi: {bookingSummary.vaccine.dosage} | Khoảng cách:{' '}
                  {bookingSummary.vaccine.duration} ngày/mũi
                </Text>
              </div>
            </div>
          )}

          <Form.Item
            label="Chọn ngày cho mũi tiêm đầu tiên"
            name="firstDoseDate"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn ngày cho mũi tiêm đầu tiên',
              },
            ]}
          >
            <DatePicker
              className="w-full"
              locale={locale}
              disabledDate={disabledDate}
              onChange={handleFirstDoseDateChange}
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>

          <Form.Item
            label="Chọn giờ"
            name="time"
            rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}
          >
            <RadioGroup>
              <Row gutter={[8, 8]}>
                {timeSlots.map((time) => (
                  <Col span={8} key={time}>
                    <Radio.Button value={time} className="w-full text-center">
                      {time}
                    </Radio.Button>
                  </Col>
                ))}
              </Row>
            </RadioGroup>
          </Form.Item>

          {/* Form cho các mũi tiêm tiếp theo */}
          {doseForms.length > 0 && (
            <div className="mt-6">
              <Divider orientation="left">Lịch tiêm các mũi tiếp theo</Divider>
              <Alert
                message="Các mũi tiêm tiếp theo được đề xuất dựa trên khoảng cách giữa các mũi. Bạn có thể điều chỉnh nếu cần."
                type="info"
                className="mb-4"
                showIcon
              />

              <Form.List name="doseSchedules">
                {(fields) => (
                  <>
                    {fields.map(({ key, name, fieldKey }, index) => (
                      <Card
                        key={key}
                        size="small"
                        title={`Mũi tiêm thứ ${doseForms[index].doseNumber}`}
                        className="mb-4"
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              label="Ngày tiêm"
                              name={[name, 'date']}
                              fieldKey={[fieldKey, 'date']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng chọn ngày',
                                },
                              ]}
                            >
                              <DatePicker
                                className="w-full"
                                locale={locale}
                                disabledDate={disabledWeekendDate}
                                value={doseForms[index].date}
                                onChange={(value) =>
                                  handleDoseDateChange(index, value)
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="Giờ tiêm"
                              name={[name, 'time']}
                              fieldKey={[fieldKey, 'time']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng chọn giờ',
                                },
                              ]}
                            >
                              <Select
                                options={timeSlots.map((time) => ({
                                  value: time,
                                  label: time,
                                }))}
                                value={doseForms[index].time}
                                onChange={(value) =>
                                  handleDoseTimeChange(index, value)
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </>
                )}
              </Form.List>
            </div>
          )}
        </Col>

        <Col span={12}>
          <Form.Item
            label="Chọn cơ sở tiêm chủng"
            name="centerId"
            rules={[
              { required: true, message: 'Vui lòng chọn cơ sở tiêm chủng' },
            ]}
          >
            <Select
              options={centers?.map((center) => ({
                label: center.name || 'Không có tên',
                value: center.centerId,
                disabled: !center.centerId,
              }))}
              placeholder="Chọn cơ sở tiêm chủng"
              suffixIcon={<EnvironmentOutlined />}
              onChange={handleCenterChange}
              notFoundContent={
                centers?.length === 0 ? 'Không có cơ sở nào' : null
              }
              loading={isFetchingCenters}
            />
          </Form.Item>

          <div className="mt-4">
            <div
              ref={mapRef}
              className="h-48 w-full rounded-lg shadow-sm"
              style={{ zIndex: 1 }}
            />
          </div>

          {/* Thông báo hướng dẫn */}
          {!firstDoseDate && (
            <Alert
              message="Hướng dẫn"
              description="Vui lòng chọn ngày cho mũi tiêm đầu tiên, hệ thống sẽ tự động đề xuất lịch cho các mũi tiếp theo."
              type="info"
              className="mt-4"
              showIcon
            />
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default Confirmation;
