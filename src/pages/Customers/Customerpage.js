import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import ReactToPrint, { useReactToPrint } from "react-to-print";

//Sidebar
import Sidebar from "../../components/Sidenavbar/Sidebar";

function Customerpage() {
  const componentRef = useRef();
  const [billsData, setBillsData] = useState([]);
  const dispatch = useDispatch();
  const posuser = JSON.parse(localStorage.getItem("pos-user"));
  const token = posuser.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  //Bill gate
  const getAllBills = () => {
    dispatch({ type: "showLoading" });
    axios
      .get("https://pos-retailapp.herokuapp.com/api/v1/bill/get-all-bills", config)
      .then((response) => {
        dispatch({ type: "hideLoading" });
        const data = response.data;
        data.reverse();
        setBillsData(data);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "customerName",
    },
    {
      title: "Phone Number",
      dataIndex: "customerPhoneNumber",
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
      render: (value) => <span>{value.toString().substring(0, 10)}</span>,
    },
  ];

  //Function to Bills
  useEffect(() => {
    getAllBills();
  }, []);
  return (
    <Sidebar>
      <div className="d-flex justify-content-between">
        <h3>Customers</h3>
      </div>
      <Table columns={columns} dataSource={billsData} bordered />
    </Sidebar>
  );
}

export default Customerpage;
