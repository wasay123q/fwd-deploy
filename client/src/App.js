import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

// IMPORT THE NEW COMPONENT
import Navigation from "./components/Navigation"; 

// --- Pages ---
import Home from "./pages/core/Home";
import Destinations from "./pages/destinations/Destinations";
import Booking from "./pages/core/Booking";
import PaymentGateway from "./pages/core/PaymentGateway";
import PaymentStatus from "./pages/core/PaymentStatus";
import Planning from "./pages/core/Planning";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Destinations
import Multan from "./pages/destinations/Multan";
import Islamabad from "./pages/destinations/Islamabad";
import Karachi from "./pages/destinations/Karachi";
import Lahore from "./pages/destinations/Lahore";
import Peshawar from "./pages/destinations/Peshawar";
import Quetta from "./pages/destinations/Quetta";
import SkarduPage from "./pages/destinations/SkarduPage";
import HunzaPage from "./pages/destinations/Hunzapage";
import BadshahiPage from "./pages/destinations/BadshahiPage";
import SaifulPage from "./pages/destinations/SaifulPage";
import "./App.css";

function AuthErrorNotification() {
  const { authError } = useContext(AuthContext);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (authError) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  if (!show || !authError) return null;

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
      <div className="alert alert-warning alert-dismissible fade show">
        <strong>⚠️ Session Notice:</strong> {authError}
        <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AuthErrorNotification />
          
          {/* USE THE NEW NAVIGATION COMPONENT */}
          <Navigation />
          
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />
              
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/multan" element={<Multan />} />
              <Route path="/islamabad" element={<Islamabad />} />
              <Route path="/karachi" element={<Karachi />} />
              <Route path="/lahore" element={<Lahore />} />
              <Route path="/peshawar" element={<Peshawar />} />
              <Route path="/quetta" element={<Quetta />} />
              <Route path="/skardu" element={<SkarduPage />} />
              <Route path="/hunza" element={<HunzaPage />} />
              <Route path="/badshahi" element={<BadshahiPage />} />
              <Route path="/saiful" element={<SaifulPage />} />

              <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
              <Route path="/paymentgateway" element={<PrivateRoute><PaymentGateway /></PrivateRoute>} />
              <Route path="/payment-status" element={<PrivateRoute><PaymentStatus /></PrivateRoute>} />
              <Route path="/planning" element={<PrivateRoute><Planning /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;