import React, { useState } from "react";
import { Button } from "antd";
import axios from "axios";
import { useStripe } from "@stripe/react-stripe-js";
//CSS
import "./Planpage.css";

function Planpage() {
  const [loadings, setLoadings] = useState(false);
  const [sessionid, setSessionid] = useState("");
  const [priceId, setPriceId] = useState("");
  const stripe = useStripe();
  //Plan
  const planData = [
    {
      planType: "Basic",
      planPrice: "₹399/mo",
      value: "basic",
      planDesc:
        "The Basic membership is among the most popular services offered by the e-commerce giant to consumers in India.",
    },
    {
      planType: "Premium",
      planPrice: "₹899/mo",
      value: "pro",
      planDesc:
        "The Premium membership is among the most popular services offered by the e-commerce giant to consumers in India.",
    },
    {
      planType: "Business",
      planPrice: "₹2478/mo",
      value: "business",
      planDesc:
        "The Business membership is among the most popular services offered by the e-commerce giant to consumers in India.",
    },
  ];

  //Checked Radio
  const handleChange = (event) => {
    setPriceId(event.target.value);
    console.log(event.target.value);
  };
  //Stripe Payment
  const user = JSON.parse(localStorage.getItem("pos-user"));
  const paymentFunction = async () => {
    const billingId = user.billingID;
    try {
      setLoadings(true);
      await axios
        .post("https://pos-retailapp.herokuapp.com/api/v1/auth/create-subscription", {
          headers: {
            "Content-Type": "application/json",
          },
          billingId,
          priceId,
        })
        .then((res) => {
          setSessionid(res.data.sessionId);
          setLoadings(false);
          stripe.redirectToCheckout({ sessionId: sessionid });
        })
        .catch((err) => {
          setLoadings(false);
          console.error(err);
        });
    } catch (error) {
      setLoadings(false);
      console.log(error);
    }
  };
  return (
    <div className="container-fluid planpageDiv">
      <div className="pricingHead">
        <h1>
          Hi, <b className="userName">{user.email}</b>
        </h1>
        <h1>Ready to Start with POS Application?</h1>
        <p>Choose Your Package Now!</p>
      </div>
      <div className="pricingPackage">
        {planData.map((item) => {
          return (
            <label>
              <input
                type="radio"
                name="product"
                class="card-input-element"
                value={item.value}
                checked={priceId === item.value}
                onChange={handleChange}
              />
              <div className="card planCard">
                <div className="card-body">
                  <h5 class="card-title">{item.planType}</h5>
                  <h6 class="card-subtitle mb-2">{item.planPrice}</h6>
                  <p class="card-text">{item.planDesc}</p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
      <div className="planButtonsec">
        <Button type="primary" className="planBtn" loading={loadings} onClick={paymentFunction}>
          Continue
        </Button>
      </div>
    </div>
  );
}

export default Planpage;
