import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Modal, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  LoginOutlined,
  ShoppingCartOutlined,
  UnderlineOutlined,
  UsergroupAddOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
//CSS
import "./Sidebar.css";
//Antd Header
const { Header, Sider, Content } = Layout;

function Sidebar({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const { cartItems, loading } = useSelector((state) => state.rootReducer);
  const navigate = useNavigate();
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  const showModal = () => {
    setVisible(true);
  };
  const logOut = () => {
    setVisible(false);
    localStorage.removeItem("pos-user");
    localStorage.removeItem("plan");
    navigate("/login");
  }
  const hideModal = () => {
    setVisible(false);
  };
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);
  return (
    <Layout>
      {loading && (
        <div className="spinner">
          <div class="spinner-border" role="status"></div>
        </div>
      )}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h3>{collapsed ? "POS" : "Retail POS"}</h3>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
        >
          <Menu.Item key="/home" icon={<HomeOutlined />}>
            <Link to="/home">Home</Link>
          </Menu.Item>
          <Menu.Item key="/cart" icon={<ShoppingCartOutlined />}>
            <Link to="/cart">Cart</Link>
          </Menu.Item>
          <Menu.Item key="/bills" icon={<CopyOutlined />}>
            <Link to="/bills">Bills</Link>
          </Menu.Item>
          <Menu.Item key="/items" icon={<UnorderedListOutlined />}>
            <Link to="/items">Items</Link>
          </Menu.Item>
          <Menu.Item key="/customers" icon={<UsergroupAddOutlined />}>
            <Link to="/customers">Customers</Link>
          </Menu.Item>
          <Menu.Item key="/account" icon={<UserOutlined />}>
            <Link to="/account">Account</Link>
          </Menu.Item>
          <Menu.Item
            key="/logout"
            icon={<LoginOutlined />}
            onClick={() => {
              showModal();
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 10 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <div
            className="cart-count d-flex align-items-center"
            onClick={() => navigate("/cart")}
          >
            <b>
              {" "}
              <p className="mt-3 mr-2">{cartItems.length}</p>
            </b>
            <ShoppingCartOutlined />
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "10px",
            paddingTop: 24,
            paddingBottom: 24,
            minHeight: "80vh",
          }}
        >
          {children}
        </Content>
        <Modal
        visible={visible}
        onOk={logOut}
        onCancel={hideModal}
        okText="Yes"
        cancelText="No"
      >
        <p className="modalText">Do you want to Logout ?</p>
      </Modal>
      </Layout>
    </Layout>
  );
}

export default Sidebar;
