import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import Login from "./login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import BookSlot from "./BookSlot";
import Bookings from "./Bookings";
import Payment from "./Payment";
import AdminDashboard from "./AdminDashboard";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/book-slot/:slotId" element={<BookSlot />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/payment/:bookingId" element={<Payment />} />

        {/* Admin Route */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;