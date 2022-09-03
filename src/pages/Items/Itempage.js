import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import axios from "axios";
//Import Sidebar
import Sidebar from "../../components/Sidenavbar/Sidebar";

//Item Category
import itemCategoryData from "./ItemData";

function Itempage() {
  const [itemsData, setItemsData] = useState([]);
  const [addEditModalVisibilty, setAddEditModalVisibilty] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const dispatch = useDispatch();
  const posuser = JSON.parse(localStorage.getItem("pos-user"));
  const token = posuser.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(itemsData);
  //Get all items API
  const getAllItems = async () => {
    try {
      dispatch({ type: "showLoading" });
      await axios
        .get("https://pos-retailapp.herokuapp.com/api/v1/item/getall-items", config)
        .then((res) => {
          console.log(res.data.items);
          setItemsData(res.data.items);
          dispatch({ type: "hideLoading" });
        })
        .catch((err) => {
          dispatch({ type: "hideLoading" });
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  //Get all Items
  useEffect(() => {
    getAllItems();
  }, []);

  //Delete Items
  const deleteItem = async (record) => {
    try {
      dispatch({ type: "showLoading" });
      await axios
        .post("https://pos-retailapp.herokuapp.com/api/v1/item/delete-item", { itemId: record._id }, config)
        .then((res) => {
          dispatch({ type: "hideLoading" });
          message.success("Item deleted successdully");
          getAllItems();
        })
        .catch((err) => {
          dispatch({ type: "hideLoading" });
          message.error("Something went wrong");
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  //Table Coulmns
  const tableData = [
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
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div className="d-flex">
          <EditOutlined
            className="mx-2"
            onClick={() => {
              setEditingItem(record);
              setAddEditModalVisibilty(true);
            }}
          />
          <DeleteOutlined className="mx-2" onClick={() => deleteItem(record)} />
        </div>
      ),
    },
  ];

  //Add Items API
  const onFinish = async (values) => {
    dispatch({ type: "showLoading" });
    if (editingItem === null) {
      await axios
        .post("https://pos-retailapp.herokuapp.com/api/v1/item/add-item", values, config)
        .then((res) => {
          dispatch({ type: "hideLoading" });
          message.success("Item added Successfully😀");
          setAddEditModalVisibilty(false);
          console.log(res);
          getAllItems();
        })
        .catch((err) => {
          dispatch({ type: "hideLoading" });
          message.error("Something went Wrong!");
          console.error(err);
        });
    } else {
      await axios
        .post("https://pos-retailapp.herokuapp.com/api/v1/item/edit-item", { ...values, itemId: editingItem._id }, config)
        .then((res) => {
          dispatch({ type: "hideLoading" });
          message.success("Item edited successfully");
          setEditingItem(null);
          setAddEditModalVisibilty(false);
          getAllItems();
        })
        .catch((err) => {
          dispatch({ type: "hideLoading" });
          message.error("Something went wrong");
          console.log(err);
        });
    }
  };
  return (
    <Sidebar>
      <div className="d-flex justify-content-between">
        <h3>Items</h3>
        <Button type="primary" onClick={() => setAddEditModalVisibilty(true)}>
          Add Items
        </Button>
      </div>
      <Table columns={tableData} dataSource={itemsData} bordered />
      {addEditModalVisibilty && (
        <Modal
          onCancel={() => {
            setEditingItem(null);
            setAddEditModalVisibilty(false);
          }}
          visible={addEditModalVisibilty}
          title={`${editingItem !== null ? "Edit Item" : "Add New Item"}`}
          footer={false}
        >
          <Form
            initialValues={editingItem}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input />
            </Form.Item>
            <Form.Item name="imageUrl" label="Image URL">
              <Input />
            </Form.Item>

            <Form.Item name="category" label="Category">
              <Select>
                {itemCategoryData.map((items) => {
                  return (
                    <Select.Option value={items.values}>
                      {items.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button htmlType="submit" type="primary">
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </Sidebar>
  );
}

export default Itempage;
