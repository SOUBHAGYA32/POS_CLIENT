import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
//Spinner
import { ClipLoader } from "react-spinners";

//CSS
import "./Registerpage.css";

//Components
import Authleft from "../../components/Auth/Authleft";

function Registerpage() {
  const [sloading, setSloading] = useState(false);
  const [username, setUsername] = useState("");
  const [retailname, setRetailname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfpassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Register Function
  const registerUser = async (e) => {
    e.preventDefault();
    if (password != confpassword) {
      Swal.fire({
        title: "Oops..!",
        text: "Password did not match!",
        icon: "error",
        confirmButtonText: "Retry",
      });
    } else {
      const userData = {
        userId: username,
        rname: retailname,
        email: email,
        password: password,
      };
      try {
        dispatch({ type: "showLoading" });
        setSloading(true);
        axios
          .post("/api/v1/auth/register", userData)
          .then((res) => {
            localStorage.setItem("pos-user", JSON.stringify(res.data));
            dispatch({ type: "hideLoading" });
            setSloading(false);
            Swal.fire({
              title: "Success..",
              text: "Registration Success Please Wait for verification!",
              icon: "success",
              confirmButtonText: "OK",
            });
            setEmail('');
            setConfpassword('');
            setPassword('');
            setRetailname('');
            setUsername('');
            navigate('/plan');
          })
          .catch((error) => {
            console.log(error);
            dispatch({ type: "hideLoading" });
            setSloading(false);
            Swal.fire({
              title: "Oops..!",
              text: "Something went wrong!",
              icon: "error",
              confirmButtonText: "Retry",
            });
          });
      } catch (error) {
        console.log("Error");
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 leftcontainer">
          <Authleft />
        </div>
        <div className="col-md-8 rightregistercontainer">
          <div className="registerForm">
            <div className="loginHead">
              <h1>Sign up into POS Application</h1>
            </div>
            <hr />
            <form className="registerInputForm mt-5" onSubmit={registerUser}>
              <div className="nameSec">
                <div className="form-group mb-2">
                  <label htmlFor="User ID">User ID</label>
                  <input
                    type="text"
                    placeholder="User ID.."
                    className="form-control"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group mb-2">
                  <label htmlFor="Retailname">Retail Name</label>
                  <input
                    type="text"
                    placeholder="Retail Name.."
                    className="form-control"
                    required
                    value={retailname}
                    onChange={(e) => {
                      setRetailname(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="UserEmail">Email</label>
                <input
                  type="text"
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
                <label htmlFor="UserPassword">Password</label>
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
              <div className="form-group mb-2">
                <label htmlFor="UserConfPwd">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your Password.."
                  className="form-control"
                  required
                  value={confpassword}
                  onChange={(e) => {
                    setConfpassword(e.target.value);
                  }}
                />
              </div>
              <button className="btn loginBtn" type="submit">
                Sign up
              </button>
              <h4 className="not_account">
                Have an account?
                <Link className="signup__link" to="/">
                  <b>Sign in</b>
                </Link>
              </h4>
            </form>
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

export default Registerpage;
