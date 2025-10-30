import PropTypes from 'prop-types';

const LayoutApp = (props) => {
  const { children } = props;

  return <>{children}</>;
};

LayoutApp.propTypes = {
  children: PropTypes.node.isRequired, // Đảm bảo children là bắt buộc và là một node hợp lệ
};

export default LayoutApp;