import { Badge, Typography } from 'antd';

const { Text } = Typography;

const CalendarCell = ({ value, onClick, appointments }) => {

  // const confirmedCount = appointments.filter(
  //   (item) => item.status === 'confirmed'
  // ).length;
  // const pendingCount = appointments.filter(
  //   (item) => item.status === 'pending'
  // ).length;
  // const completedCount = appointments.filter(
  //   (item) => item.status === 'completed'
  // ).length;
  
  return (
    // <div
    //   onClick={() => onClick(value)}
    //   className="calendar-cell-content"
    // >
    //   <div className="appointment-summary">
    //     <Text strong className="total-text">
    //       {appointments.length} lịch hẹn
    //     </Text>
    //     <div className="status-summary">
    //       {confirmedCount > 0 && (
    //         <span className="status-item">
    //           <Badge status="success" />
    //           {confirmedCount} xác nhận
    //         </span>
    //       )}
    //       {pendingCount > 0 && (
    //         <span className="status-item">
    //           <Badge status="warning" />
    //           {pendingCount} chờ
    //         </span>
    //       )}
    //       {completedCount > 0 && (
    //         <span className="status-item">
    //           <Badge status="processing" />
    //           {completedCount} hoàn thành
    //         </span>
    //       )}
    //     </div>
    //   </div>
    // </div>
    <><p>Chào</p></>
  );
};

export default CalendarCell;
