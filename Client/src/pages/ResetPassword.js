import { React, useState } from "react";
import password_icon from "../assets/password.png";
import { colors } from "../values/colors";
import { useNavigate } from "react-router-dom";

function ResetPasswordPage() {
  const linkStyle = {
    upperDiv: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.white,
    },
    container: {
      display: "flex",
      flexDirection: "column",
      width: "600px",
      background: "#fff",
      paddingBottom: "30px",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "9px",
      width: "100%",
      marginTop: "30px",
    },
    txt: {
      color: colors.purple,
      fontSize: "48px",
      fontWeight: "700",
    },
    underline: {
      width: "61px",
      height: "6px",
      background: colors.purple,
      borderRadius: "9px",
    },
    inputs: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
      marginTop: "55px",
    },
    input: {
      display: "flex",
      alignItems: "center",
      margin: "auto",
      width: "480px",
      height: "70px",
      background: "#eaeaea",
      borderRadius: "6px",
    },
    inputImg: {
      margin: "0px 30px",
    },
    inputFields: {
      height: "50px",
      width: "400px",
      background: "transparent",
      border: "none",
      outline: "none",
      color: "#797979",
      fontSize: "20px",
    },
    forgotPassword: {
      paddingLeft: "62px",
      marginTop: "27px",
      color: "#797979",
      fontSize: "18px",
    },
    fpSpan: {
      color: "#4c00b4",
      cursor: "pointer",
    },
    submitContainer: {
      display: "flex",
      gap: "30px",
      margin: "60px auto",
    },
    submit: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "220px",
      height: "60px",
      color: "#fff",
      background: "#4c00b4",
      borderRadius: "50px",
      fontSize: "19px",
      fontWeight: "700",
      cursor: "pointer",
    },
    gray: {
      background: "#eaeaea",
      color: "#676767",
    },
  };

  const navigate = useNavigate(); // for navigation between pages
  const [errorMessage, setErrorMessage] = useState(""); // for displaying error messages
  const jwt_token = localStorage.getItem("jwt_token");

  // to store the form data :
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      return setErrorMessage("Passwords do not match");
    }
    try {
      const response = await fetch(
        `http://localhost:5000/Friendz/v1/resetPassword`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${jwt_token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();
      if (response.status === 401) {
        console.log("Access Denied!");
      } else if (response.status === 403) {
        console.log("Session Expired  , Please login again");
      } else if (response.status === 200) {
        console.log("Password Reset Successfully");
      }
      navigate(`/Friendz/v1/login`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={linkStyle.upperDiv}>
      <div style={linkStyle.container}>
        <div style={linkStyle.header}>
          <div style={linkStyle.txt}>Reset Password</div>
          <div style={linkStyle.underline}></div>
        </div>

        {/* for displaying input fields */}
        <div style={linkStyle.inputs}>
          <div style={linkStyle.input}>
            <img style={linkStyle.inputImg} src={password_icon} alt="" />
            <input
              style={linkStyle.inputFields}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div style={linkStyle.input}>
            <img style={linkStyle.inputImg} src={password_icon} alt="" />
            <input
              style={linkStyle.inputFields}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* for displaying error messages :  */}
        <div style={{ color: "red", fontSize: "13px", margin: "0px auto" }}>
          <p>{errorMessage}</p>
        </div>

        {/* form submit buttons */}
        <div style={linkStyle.submitContainer}>
          <div style={linkStyle.submit} onClick={handleSubmit}>
            Submit
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
