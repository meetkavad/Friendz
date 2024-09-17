import { React, useState } from "react";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import { colors } from "../values/colors";
import { useNavigate } from "react-router-dom";

function LoginSignupPage() {
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
  const [action, setAction] = useState("Login"); // for toggling login-signup states
  const [errorMessage, setErrorMessage] = useState(""); // for displaying error messages
  // to store the form data :
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
  });

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/Friendz/v1/forgotPassword");
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { username, password } = formData;
    try {
      const response = await fetch(`http://localhost:5000/Friendz/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.status === 404) {
        setErrorMessage(data.msg);
      } else if (response.status === 401) {
        setErrorMessage(data.msg);
      } else if (response.status === 200) {
        console.log("login successful");
        localStorage.setItem("jwt_token", data.token);
        // localStorage.setItem("userData", JSON.stringify(data.userData));
        navigate(`/Friendz/v1/home`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    var { username, email, password } = formData;

    try {
      const response = await fetch("http://localhost:5000/Friendz/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();

      // retrieving json web token :
      if (response.status === 200) {
        setErrorMessage("");
        localStorage.setItem("jwt_token", data.jwt_token);
        localStorage.setItem("OnEmailVerification", "homepage");
        navigate(`/Friendz/v1/verificationCode`);
      } else if (response.status === 409) {
        setErrorMessage(data.msg);
      } else if (response.status === 400) {
        setErrorMessage(data.msg);
      }
    } catch (error) {
      console.log(error);
    }
    console.log();
  };

  return (
    <div style={linkStyle.upperDiv}>
      <div style={linkStyle.container}>
        <div style={linkStyle.header}>
          <div style={linkStyle.txt}>{action}</div>
          <div style={linkStyle.underline}></div>
        </div>

        {/* for displaying input fields */}
        <div style={linkStyle.inputs}>
          <div style={linkStyle.input}>
            <img style={linkStyle.inputImg} src={user_icon} alt="" />
            <input
              style={linkStyle.inputFields}
              type="text"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {action === "Login" ? (
            <></>
          ) : (
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
          )}
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
        </div>

        {/* for displaying error messages :  */}
        <div style={{ color: "red", fontSize: "13px", margin: "0px auto" }}>
          <p>{errorMessage}</p>
        </div>

        {/* for displaying forgot password link */}
        {action === "Sign Up" ? (
          <> </>
        ) : (
          <div style={linkStyle.forgotPassword}>
            Lost Password?{" "}
            <span style={linkStyle.fpSpan} onClick={handleForgotPassword}>
              Click Here!
            </span>
          </div>
        )}

        {/* for displaying login-signup toggle link */}
        {action === "Sign Up" ? (
          <div style={linkStyle.forgotPassword}>
            Already have an account?{" "}
            <span
              style={linkStyle.fpSpan}
              onClick={() => {
                setErrorMessage("");
                setAction("Login");
              }}
            >
              Log In!
            </span>
          </div>
        ) : (
          <div style={linkStyle.forgotPassword}>
            Don't have an account?{" "}
            <span
              style={linkStyle.fpSpan}
              onClick={() => {
                setErrorMessage("");
                setAction("Sign Up");
              }}
            >
              Sign Up!
            </span>
          </div>
        )}

        {/* form submit buttons */}
        <div style={linkStyle.submitContainer}>
          {action === "Login" ? (
            <div style={linkStyle.submit} onClick={handleLogin}>
              Login
            </div>
          ) : (
            <div style={linkStyle.submit} onClick={handleSignup}>
              Sign Up
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginSignupPage;
