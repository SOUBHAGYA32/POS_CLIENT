import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

//Categories
import categories from "./CategoryTable";
//CSS
import "./Homepage.css";
//Item
import Items from "../../components/Items/Items";
//Sidebar
import Sidebar from "../../components/Sidenavbar/Sidebar";
import Userdetails from "../../components/UserDetails/Userdetails";
import { Col, Row } from "antd";
function Homepage() {
  const [itemsData, setItemsData] = useState([]);
  const [selectedCategory, setSelectedCategoty] = useState("grocery");
  const dispatch = useDispatch();
  const posuser = JSON.parse(localStorage.getItem("pos-user"));
  const token = posuser.token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const getAllItems = () => {
    dispatch({ type: "showLoading" });
    axios
      .get("/api/v1/item/getall-items", config)
      .then((response) => {
        dispatch({ type: "hideLoading" });
        setItemsData(response.data.items);
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        console.log(error);
      });
  };
  //Get User Details
  const userDetails = async ()=>{
    const email = posuser.email;
    try {
      await axios.post("/api/v1/auth/userdetails",{email}).then((res)=>{
       console.log(res.data.user);
       localStorage.setItem("plan", res.data.user.plan);
      }).catch((err)=>{
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getAllItems();
    userDetails();
  }, []);


  return (
    <Sidebar>
      <div className="container-fluid homepageSec">
        <div className="homebodySec">
          <div className="categoryColm">
            <p className="catHeader">Choose Category</p>
            <div className="categoryContainer">
              {categories.map((item) => {
                return (
                  <div
                    className={`categoryList ${
                      selectedCategory === item.name && "selected-category"
                    }`}
                    onClick={() => setSelectedCategoty(item.name)}
                  >
                    <p className="categoryName">{item.name}</p>
                    <img
                      src={item.imageURL}
                      alt="FruitsCategory"
                      height="60"
                      width="80"
                      className="catimg"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="accountColm">
            <Userdetails />
          </div>
        </div>
        <div className="itemContainer">
          {itemsData
            .filter((i) => i.category === selectedCategory)
            .map((item) => {
              return (
                <div className="itemSec">
                  <Items item={item} />
                </div>
              );
            })}
        </div>
      </div>
    </Sidebar>
  );
}

export default Homepage;
