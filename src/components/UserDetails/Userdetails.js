import React from "react";
import { UserOutlined } from "@ant-design/icons";
//CSS
import "./Userdetails.css";

function Userdetails() {
  const userdetails = JSON.parse(localStorage.getItem('pos-user'));
  return (
    <div className="userDetails">
      <div className="userImg">
      <img className="profileImg" src="https://res.cloudinary.com/muvi/image/upload/v1660475232/Profile%20Icon/user_ury2qk.png"/>
      </div>
      <div className="userTxt">
        <h3>I'm a Cashier</h3>
        <p className="userName">{userdetails.rname}</p>
      </div>
    </div>
  );
}

export default Userdetails;
