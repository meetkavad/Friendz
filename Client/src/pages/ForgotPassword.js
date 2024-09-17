import { React, useState } from "react";
import email_icon from "../assets/email.png";
import { colors } from "../values/colors";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage(props) {
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
      marginBottom: "25px",
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

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();

    const { email } = formData;
    try {
      const response = await fetch(
        `http://localhost:5000/Friendz/v1/forgotPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.status === 404) {
        setErrorMessage(data.msg);
      } else if (response.status === 500) {
        setErrorMessage(data.msg);
      } else if (response.status === 200) {
        console.log("email sent successfully");
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("OnEmailVerification", "resetPassword");
        navigate(`/Friendz/v1/verificationCode`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={linkStyle.upperDiv}>
      <div style={linkStyle.container}>
        <div style={linkStyle.header}>
          <div style={linkStyle.txt}>Forgot Password</div>
          <div style={linkStyle.underline}></div>
        </div>

        <div style={linkStyle.input}>
          <img style={linkStyle.inputImg} src={email_icon} alt="" />
          <input
            style={linkStyle.inputFields}
            type="email"
            name="email"
            placeholder="Email Id"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* for displaying error messages :  */}
        <div style={{ color: "red", fontSize: "16px", margin: "0px auto" }}>
          <p>{errorMessage}</p>
        </div>

        <div style={linkStyle.submitContainer}>
          <div style={linkStyle.submit} onClick={handleSubmit}>
            Submit
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
