import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
//Layout
import Sidebar from "../../components/Sidenavbar/Sidebar";
 
import './Cartpage.css';

function Cartpage() {
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [billChargeModal, setBillChargeModal] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const posuser = JSON.parse(localStorage.getItem("pos-user"));
  const token = posuser.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const increaseQuantity = (record) => {
    dispatch({
      type: "updateCart",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };
  const decreaseQuantity = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "updateCart",
        payload: { ...record, quantity: record.quantity + -1 },
      });
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (image, record) => (
        <img src={image} alt="" height="60" width="60" />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            onClick={() => increaseQuantity(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            onClick={() => decreaseQuantity(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          onClick={() => dispatch({ type: "deleteFromCart", payload: record })}
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => {
      temp = temp + item.price * item.quantity;
    });

    setSubTotal(temp);
  }, [cartItems]);

  //API Call
  const onFinish = (values) => {
    const reqObject = {
      ...values,
      subTotal,
      cartItems,
      tax: Number(((subTotal / 100) * 10).toFixed(2)),
      totalAmount: Number(
        subTotal + Number(((subTotal / 100) * 10).toFixed(2))
      ),
      userId: JSON.parse(localStorage.getItem("pos-user"))._id,
    };
    axios
      .post("https://pos-retailapp.herokuapp.com/api/v1/bill/charge-bill", reqObject,config)
      .then(() => {
        message.success("Bill Charged Successfully");
        navigate("/bills");
      })
      .catch(() => {
        message.error("Something went wrong!");
      });
  };
  return (
    <Sidebar>
      <h3>Cart</h3>
      <Table columns={columns} bordered pagination={false} dataSource={cartItems} />
      <hr />
      <div className="d-flex justify-content-end flex-column align-items-end">
        <div className="subtotal">
          <h3>
            SUB TOTAL : <b>{subTotal} $/-</b>
          </h3>
        </div>

        <Button type="primary" onClick={() => setBillChargeModal(true)}>
          CHARGE BILL
        </Button>
      </div>

      <Modal
        title="Charge Bill"
        visible={billChargeModal}
        footer={false}
        onCancel={() => setBillChargeModal(false)}
      >
        {" "}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="customerName" label="Customer Name">
            <Input />
          </Form.Item>
          <Form.Item name="customerPhoneNumber" label="Phone Number">
            <Input />
          </Form.Item>

          <Form.Item name="paymentMode" label="Payment Mode">
            <Select>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item>

          <div className="charge-bill-amount">
            <h5>
              SubTotal : <b>{subTotal}</b>
            </h5>
            <h5>
              Tax : <b>{((subTotal / 100) * 10).toFixed(2)}</b>
            </h5>
            <hr />
            <h2>
              Grand Total : <b>{subTotal + (subTotal / 100) * 10}</b>
            </h2>
          </div>

          <div className="d-flex justify-content-end">
            <Button htmlType="submit" type="primary">
              GENERATE BILL
            </Button>
          </div>
        </Form>{" "}
      </Modal>
    </Sidebar>
  );
}

export default Cartpage;
