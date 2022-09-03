import React, { useState, useEffect } from "react";
import axios from "axios";
import { useStripe } from "@stripe/react-stripe-js";
//Sidebar
import Sidebar from "../../components/Sidenavbar/Sidebar";
import { Divider, Badge, Card, Button } from "antd";
//CSS
import "./Account.css";
const { Meta } = Card;
function Account() {
  const[planload, setPlanload] = useState(false);
  const [customerlength, setCustomerlength] = useState(0);
  const [plan, setPlan] = useState("");
  const [itemlength, setItemlength] = useState(0);
  const [saleitem, setSaleitem] = useState([0]);
  const posuser = JSON.parse(localStorage.getItem("pos-user"));
  const token = posuser.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  var sum = saleitem.reduce((x, y) => x + y);
  const stripe = useStripe();
  //Customer API
  const custApi = async () => {
    try {
      await axios
        .get("https://pos-retailapp.herokuapp.com/api/v1/bill/get-all-bills", config)
        .then((res) => {
          setCustomerlength(res.data.length);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  //Get all Product length
  const getProduct = async () => {
    try {
      await axios
        .get("https://pos-retailapp.herokuapp.com/api/v1/item/getall-items", config)
        .then((res) => {
          setItemlength(res.data.items.length);
        })
        .catch((err) => console.error(err));
    } catch (error) {
      console.log(error);
    }
  };

  //Get all Purchase Items
  const purchaseItems = async () => {
    try {
      await axios
        .get("https://pos-retailapp.herokuapp.com/api/v1/bill/purchase", config)
        .then((res) => {
          setSaleitem(res.data.cart);
        })
        .catch((err) => console.error(err));
    } catch (error) {
      console.log(error);
    }
  };

  //Get User Details
  const userDetails = async ()=>{
    const email = posuser.email;
    try {
      await axios.post("https://pos-retailapp.herokuapp.com/api/v1/auth/userdetails",{email}).then((res)=>{
       console.log(res.data.user);
       setPlan(res.data.user.plan);
      }).catch((err)=>{
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    custApi();
    getProduct();
    purchaseItems();
    userDetails();
  }, []);

  //Update Plan
  const updatePlan = async ()=>{
    const customer = posuser.billingID;
    setPlanload(true);
    try {
      await axios.post("https://pos-retailapp.herokuapp.com/api/v1/auth/billing",{
        headers: {
          "Content-Type": "application/json",
        },
        customer
      }).then((res)=>{
        setPlanload(false);
        window.location.replace(res.data.url);
      }).catch((err)=>{
        setPlanload(false);
        console.log(err);
      })
    } catch (error) {
      setPlanload(false);
      console.log(error);
    }
  }

  return (
    <Sidebar>
      <div className="container-fluid">
        <div className="accountHeader">
          <h2>Account Dashboard</h2>
        </div>
        <Divider plain>Customers Details</Divider>
        <div className="cardContainer">
          <div className="card customer dcard">
            <div className="card-body">
              <div className="rotate">
                <i className="fa-solid fa-users fa-5x"></i>
              </div>
              <h2 className="cardHead">Customers</h2>
              <p className="dcardBody">{customerlength}</p>
            </div>
          </div>
          <div className="card product dcard">
            <div className="card-body">
              <div className="rotate">
                <i className="fa-solid fa-list fa-5x"></i>
              </div>
              <h2 className="cardHead">Products</h2>
              <p className="dcardBody">{itemlength}</p>
            </div>
          </div>
          <div className="card purchase dcard">
            <div className="card-body">
              <div className="rotate">
                <i className="fa-solid fa-cart-shopping fa-5x"></i>
              </div>
              <h2 className="cardHead">purchase</h2>
              <p className="dcardBody">{sum}</p>
            </div>
          </div>
          <div className="card stock dcard">
            <div className="card-body">
              <div className="rotate">
                <i className="fa-solid fa-store fa-5x"></i>
              </div>
              <h2></h2>
              <p>{}</p>
            </div>
          </div>
        </div>
        <Divider plain>Plan Details</Divider>
        <div className="planDetails">
          <div className="accountHead">
            <Badge.Ribbon text={`${plan}`} color="pink">
              <Card title={`Hi, ${posuser.email}`} size="small">
                <Meta
                  title={`You are using the ${plan} Plan`}
                  description={`The ${plan} membership is among the most popular services offered by the e-commerce giant to consumers in India.`}
                />
              </Card>
              <Button type="primary" className="updateBtn" size="small" loading={planload} onClick={updatePlan}>
                Update Plan
              </Button>
            </Badge.Ribbon>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

export default Account;
