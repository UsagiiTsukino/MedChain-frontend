import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import MonthView from '../../components/calendar/MonthView';
import WeekView from '../../components/calendar/WeekView';
import DayView from '../../components/calendar/DayView';
import AppointmentListModal from '../../components/calendar/AppointmentListModal';
import AppointmentDetailModal from '../../components/calendar/AppointmentDetailModal';
import './calendar.scss';
import { callFetchAppointmentOfCenter } from '../../config/api.appointment';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

const CalendarStaff = () => {
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (viewMode === 'month') {
      const startOfMonth = selectedDate.startOf('month').format('YYYY-MM-DD');
      const endOfMonth = selectedDate.endOf('month').format('YYYY-MM-DD');
      const getScheduleForMonth = async () => {
        const response = await callFetchAppointmentOfCenter(
          `filter=scheduledDate >= '${startOfMonth}' AND scheduledDate <= '${endOfMonth}'`
        );
        setAppointments(response.data.result);
      };
      getScheduleForMonth();
    } else if (viewMode === 'week') {
      const startOfWeek = selectedDate.startOf('isoWeek').format('YYYY-MM-DD');
      const endOfWeek = selectedDate.endOf('isoWeek').format('YYYY-MM-DD');
      const getScheduleForWeek = async () => {
        const response = await callFetchAppointmentOfCenter(
          `filter=scheduledDate >= '${startOfWeek}' AND scheduledDate <= '${endOfWeek}'`
        );
        setAppointments(response.data.result);
      };
      getScheduleForWeek();
    } else if (viewMode === 'day') {
      console.log(selectedDate.format('YYYY-MM-DD'))
      const getScheduleForDay = async () => {
        const response = await callFetchAppointmentOfCenter(
          `filter=scheduledDate ~ '${selectedDate.format('YYYY-MM-DD')}'`
        );
        setAppointments(response.data.result);
      };
      getScheduleForDay();
    }
  }, [viewMode, selectedDate]);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleCellClick = (date) => {
    setModalDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className="calendar-staff-container">
      {viewMode === 'month' && (
        <MonthView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onCellClick={handleCellClick}
        />
      )}
      {viewMode === 'week' && (
        <WeekView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setViewMode={setViewMode}
          onAppointmentClick={handleAppointmentClick}
        />
      )}
      {viewMode === 'day' && (
        <DayView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setViewMode={setViewMode}
          onAppointmentClick={handleAppointmentClick}
        />
      )}

      <AppointmentListModal
        isOpen={isModalOpen}
        modalDate={modalDate}
        onClose={() => setIsModalOpen(false)}
        onAppointmentClick={handleAppointmentClick}
      />

      <AppointmentDetailModal
        isOpen={isDetailModalOpen}
        appointment={selectedAppointment}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

export default CalendarStaff;
