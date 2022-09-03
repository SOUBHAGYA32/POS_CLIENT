import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
//CSS
import "./Loginpage.css";

//Components
import Authleft from "../../components/Auth/Authleft";

function Loginpage() {
  const [sloading, setSloading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("pos-user")) navigate("/home");
  }, []);
  const user = JSON.parse(localStorage.getItem("pos-user"));
  //Login Function
  const loginUser = async () => {
    if (email == "" && password == "") {
      Swal.fire({
        title: "Oops..!",
        text: "Please fill out the form!",
        icon: "error",
        confirmButtonText: "Retry",
      });
    } else {
      const userData = {
        email: email,
        password: password,
      };
      try {
        dispatch({ type: "showLoading" });
        setSloading(true);
        axios
          .post("/api/v1/auth/login", userData)
          .then((res) => {
            console.log(res.data);
            dispatch({ type: "hideLoading" });
            setSloading(false);
            localStorage.setItem("pos-user", JSON.stringify(res.data));
            Swal.fire({
              title: "Success..",
              text: res.statusText,
              icon: "success",
              confirmButtonText: "OK",
            });
            setEmail("");
            setPassword("");
            if(res.data.plan === "none"){
              navigate('/plan');
            } else {
              navigate('/home');
            }
          })
          .catch((error) => {
            setSloading(false);
            Swal.fire({
              title: "Oops..!",
              text: "Something Went Wrong!",
              icon: "error",
              confirmButtonText: "Retry",
            });
            setEmail("");
            setPassword("");
            console.log(error);
          });
      } catch (error) {
        setSloading(false);
        console.log(error);
      }
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 leftcontainer">
          <Authleft />
        </div>
        <div className="col-md-8 rightcontainer">
          <div className="formLogin">
            <div className="loginHead">
              <h1>Sign in into POS Application</h1>
            </div>
            <hr />
            <div className="inputSignin mt-5">
              <div className="form-group mb-2">
                <label htmlFor="UserId">User ID</label>
                <input
                  type="email"
                  placeholder="Enter your Email.."
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="form-group mb-2">
                <label htmlFor="Password">Password</label>
                <input
                  type="password"
                  placeholder="Enter your Password.."
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <button
                className="btn loginBtn"
                onClick={loginUser}
                type="submit"
              >
                Sign in
              </button>
              <h4 className="not_account">
                Not an account?
                <Link className="signup__link" to="/register">
                  <b>Sign up</b>
                </Link>
              </h4>
            </div>
            <div className="loaderClass">
              <ClipLoader
                size={35}
                loading={sloading}
                color="#00152B"
                cssOverride={{
                  position: "absolute",
                  zIndex: "999",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginpage;
