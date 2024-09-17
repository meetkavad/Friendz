import logo from "./logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/Landing";
import LoginSignupPage from "./pages/LoginSignup";
import HomePage from "./pages/main/Home";
import VerificationPage from "./pages/VerificationCode";
import ResetPasswordPage from "./pages/ResetPassword";
import ForgotPasswordPage from "./pages/ForgotPassword";
import RequestPage from "./pages/main/Request";
import ProfilePage from "./pages/main/Profile";
import SearchPage from "./pages/main/Search";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Friendz/v1/landing" element={<LandingPage />} />
        <Route path="/Friendz/v1/login" element={<LoginSignupPage />} />
        <Route path="/Friendz/v1/home" element={<HomePage />} />
        <Route
          path="/Friendz/v1/verificationCode"
          element={<VerificationPage />}
        />
        <Route
          path="/Friendz/v1/resetPassword"
          element={<ResetPasswordPage />}
        />
        <Route
          path="/Friendz/v1/forgotPassword"
          element={<ForgotPasswordPage />}
        />
        <Route path="/Friendz/v1/search" element={<SearchPage />} />
        <Route path="/Friendz/v1/profile" element={<ProfilePage />} />
        <Route path="/Friendz/v1/request" element={<RequestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
