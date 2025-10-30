import { Col, Form, message, notification, Row } from 'antd';
import { useEffect, useState } from 'react';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormTimePicker,
} from '@ant-design/pro-components';
import { useSelector } from 'react-redux';

import '../../styles/reset.scss';

import { callAddAppointmentMetaMark } from '../../config/api.appointment';
import { callFetchCenter } from '../../config/api.center';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-named-as-default
import Web3 from 'web3';

const ModalOrder = (props) => {
  const navigate = useNavigate();
  const [displayCenter, setDisplayCenter] = useState(null);
  const [animation, setAnimation] = useState('open');
  const { openModal, setOpenModal, vaccine } = props;
  const [form] = Form.useForm();
  const web3Instance = new Web3(window.ethereum);
  const user = useSelector((state) => state.account.user);

  const handleReset = async () => {
    form.resetFields();

    setAnimation('close');
    await new Promise((r) => setTimeout(r, 400));
    setOpenModal(false);
    setAnimation('open');
  };

  const sendETH = async () => {
    try {
      const amount = 10;
      const wallet = '0xef9fDC1e465E658ABfc0625A54fb1859B18d67C8';
      const amountInWei = web3Instance.utils.toWei(amount, 'ether');

      const tx = {
        from: user.walletAddress,
        to: wallet,
        value: amountInWei,
        gas: 21000,
      };

      const receipt = await web3Instance.eth.sendTransaction(tx);
      return receipt.status; // Return the transaction status directly
    } catch (error) {
      console.error('Transaction failed:', error);
      return false;
    }
  };

  const submitOrder = async (valuesForm) => {
    const { date, time, center, paymentType } = valuesForm;

    if (paymentType === 'METAMASK') {
      // const transactionSuccess = await sendETH(); // Await here

      // if (transactionSuccess) {
      const res = await callAddAppointmentMetaMark(
        vaccine.vaccineId,
        user.walletAddress,
        center,
        date,
        time
      );
      console.log(res);
      //   if (res.statusCode === 200) {
      //     message.success('Appointment booked successfully');
      //     handleReset();
      //     navigate('/success?transaction=true&paymentId=' + res.data.paymentId);
      //   } else {
      //     handleReset();
      //     navigate('/success?transaction=false');
      //   }
      // } else {
      //   handleReset();
      //   navigate('/success?transaction=false');
      //   message.error('Payment transaction failed');
      // }
    }
  };

  const paymentType = [{ type: 'METAMASK', name: 'MetaMask' }];

  useEffect(() => {
    fetchCenter();
  }, []);

  const fetchCenter = async () => {
    const res = await callFetchCenter();
    if (res && res.data) {
      setDisplayCenter(res.data.result);
    }
  };

  return (
    <>
      {openModal && (
        <ModalForm
          title="Book Vaccination Appointment"
          open={openModal}
          scrollToFirstError={true}
          preserve={false}
          form={form}
          submitter={{
            searchConfig: {
              submitText: 'Book Appointment',
              resetText: 'Cancel',
            },
          }}
          onFinish={submitOrder}
          modalProps={{
            onCancel: () => {
              handleReset();
            },
            afterClose: () => handleReset(),
            destroyOnClose: true,
            footer: null,
            keyboard: false,
            maskClosable: false,
            className: `modal-company ${animation}`,
            rootClassName: `modal-company-root ${animation}`,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <ProFormDatePicker
                colProps={{ xl: 12, md: 24 }}
                width="md"
                label="Vaccination Date"
                name="date"
                placeholder="Select vaccination date"
                rules={[
                  {
                    required: true,
                    message: 'Please select a vaccination date!',
                  },
                  {
                    validator: (_, value) => {
                      if (value && value.isBefore(new Date(), 'day')) {
                        return Promise.reject(
                          'Vaccination date cannot be in the past!'
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <ProFormTimePicker
                colProps={{ xl: 12, md: 24 }}
                width="md"
                label="Vaccination Time"
                name="time"
                placeholder="Select vaccination time"
                fieldProps={{
                  format: 'HH:mm',
                }}
                rules={[
                  {
                    required: true,
                    message: 'Please select a vaccination time!',
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                colProps={{ xl: 12, md: 24 }}
                width="md"
                name="center"
                label="Vaccination Center"
                placeholder="Select vaccination center"
                rules={[
                  {
                    required: true,
                    message: 'Please select a vaccination location!',
                  },
                ]}
                options={
                  displayCenter &&
                  displayCenter.map((center) => {
                    return {
                      label: center.name,
                      value: center.centerId,
                    };
                  })
                }
              />
            </Col>
            <Col span={12}>
              <ProFormSelect
                colProps={{ xl: 12, md: 24 }}
                width="md"
                name="paymentType"
                label="Payment Method"
                placeholder="Select payment method"
                rules={[
                  {
                    required: true,
                    message: 'Please select a payment method!',
                  },
                ]}
                options={
                  paymentType &&
                  paymentType.map((item) => {
                    return {
                      label: item.name,
                      value: item.type,
                    };
                  })
                }
              />
            </Col>
          </Row>
        </ModalForm>
      )}
    </>
  );
};
export default ModalOrder;
