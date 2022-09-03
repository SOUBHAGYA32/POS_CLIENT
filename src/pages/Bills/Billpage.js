import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {  EyeOutlined } from "@ant-design/icons";
import { Button,  Modal,  Table } from "antd";
import  { useReactToPrint } from "react-to-print";

//Side bar
//Import Sidebar
import Sidebar from "../../components/Sidenavbar/Sidebar";

function Billpage() {
  const componentRef = useRef();
  const [billsData, setBillsData] = useState([]);
  const [printBillModalVisibility, setPrintBillModalVisibilty] =
    useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const dispatch = useDispatch();
  const posuser = JSON.parse(localStorage.getItem("pos-user"));
  const token = posuser.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  //Get all Bills
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
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
    },
    {
      title: "SubTotal",
      dataIndex: "subTotal",
    },
    {
      title: "Tax",
      dataIndex: "tax",
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EyeOutlined
            className="mx-2"
            onClick={() => {
              setSelectedBill(record);
              setPrintBillModalVisibilty(true);
            }}
          />
        </div>
      ),
    },
  ];

  //cart Couloms
  const cartcolumns = [
    {
      title: "Name",
      dataIndex: "name",
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
          <b>{record.quantity}</b>
        </div>
      ),
    },
    {
      title: "Total fare",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <b>{record.quantity * record.price}</b>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAllBills();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const user = JSON.parse(localStorage.getItem('pos-user'));
  return (
    <Sidebar>
      {" "}
      <div className="d-flex justify-content-between">
        <h3>Items</h3>
      </div>
      <Table columns={columns} dataSource={billsData} bordered />
      {printBillModalVisibility && (
        <Modal
          onCancel={() => {
            setPrintBillModalVisibilty(false);
          }}
          visible={printBillModalVisibility}
          title="Bill Details"
          footer={false}
          width={800}
        >
          <div className="bill-model p-3" ref={componentRef}>
            <div className="d-flex justify-content-between bill-header pb-2">
              <div>
                <h1>
                  <b>{user.rname} MARKET</b>
                </h1>
              </div>
              <div>
                <p>BHUBANESWAR</p>
                <p>ODISHA, PALASUNI, 751010</p>
                <p>9337026578</p>
              </div>
            </div>
            <div className="bill-customer-details my-2">
              <p>
                <b>Name</b> : {selectedBill.customerName}
              </p>
              <p>
                <b>Phone Number</b> : {selectedBill.customerPhoneNumber}
              </p>
              <p>
                <b>Date</b> :{" "}
                {selectedBill.createdAt.toString().substring(0, 10)}
              </p>
            </div>
            <Table
              dataSource={selectedBill.cartItems}
              columns={cartcolumns}
              pagination={false}
            />

            <div className="dotted-border">
              <p>
                <b>SUB TOTAL</b> : {selectedBill.subTotal}
              </p>
              <p>
                <b>Tax</b> : {selectedBill.tax}
              </p>
            </div>

            <div>
              <h2>
                <b>GRAND TOTAL : {selectedBill.totalAmount}</b>
              </h2>
            </div>
            <div className="dotted-border"></div>

            <div className="text-center">
              <p>Thanks</p>
              <p>Visit Again :)</p>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <Button type="primary" onClick={handlePrint}>
              Print Bill
            </Button>
          </div>
        </Modal>
      )}
    </Sidebar>
  );
}

export default Billpage;
