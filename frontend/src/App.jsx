import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Bookings from "./Bookings";
import BookSlot from "./BookSlot";
import Payment from "./Payment";
import API from "./api";

function AdminDashboard() {
  const username = localStorage.getItem("username");

  const [parkingLot, setParkingLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const parkingResponse = await API.get("parking-lots/");
        const slotsResponse = await API.get("slots/");
        const bookingsResponse = await API.get("bookings/");
        const lots =
          parkingResponse.data.results || parkingResponse.data;

        const allSlots =
          slotsResponse.data.results || slotsResponse.data;

        const allBookings =
          bookingsResponse.data.results || bookingsResponse.data;
        setBookings(allBookings);

        if (lots.length > 0) {
          const lot = lots[0];

          setParkingLot(lot);

          const parkingSlots = allSlots.filter(
            (slot) => slot.parking_lot === lot.id
          );

          setSlots(parkingSlots);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading Admin Dashboard...</h2>;
  }

  const availableSlots = slots.filter(
    (slot) => slot.is_available
  ).length;

  const occupiedSlots = slots.filter(
    (slot) => !slot.is_available
  ).length;

  const bikeSlots = slots.filter(
    (slot) => slot.vehicle_type === "BIKE"
  ).length;

  const carSlots = slots.filter(
    (slot) => slot.vehicle_type === "CAR"
  ).length;

  const truckSlots = slots.filter(
    (slot) => slot.vehicle_type === "TRUCK"
  ).length;

  return (
    <div style={{ padding: "30px" }}>

      <h1>🚗 Smart Parking</h1>

      <h2>Admin Dashboard</h2>

      <p>
        Welcome, <strong>{username}</strong>!
      </p>

      <p>You are logged in as an ADMIN.</p>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <hr />

      <h2>Parking Overview</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >

        <div
          style={{
            padding: "25px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            minWidth: "180px",
          }}
        >
          <h3>🅿️ Total Slots</h3>
          <h1>{parkingLot?.total_slots || slots.length}</h1>
        </div>

        <div
          style={{
            padding: "25px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            minWidth: "180px",
          }}
        >
          <h3>🟢 Available</h3>
          <h1>{availableSlots}</h1>
        </div>

        <div
          style={{
            padding: "25px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            minWidth: "180px",
          }}
        >
          <h3>🔴 Occupied</h3>
          <h1>{occupiedSlots}</h1>
        </div>

      </div>

      <hr />

      <h2>Parking Location</h2>

      {parkingLot && (
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            marginTop: "15px",
          }}
        >
          <h3>{parkingLot.name}</h3>

          <p>📍 {parkingLot.location}</p>

          <p>
            Total Capacity: {parkingLot.total_slots} slots
          </p>

          <p>
            Status:{" "}
            {parkingLot.is_active
              ? "Active"
              : "Inactive"}
          </p>
        </div>
      )}

      <hr />

      <h2>Vehicle Type Distribution</h2>

      <div
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          marginTop: "15px",
        }}
      >
        <p>🏍️ Bike: {bikeSlots} slots</p>

        <p>🚗 Car: {carSlots} slots</p>

        <p>🚚 Truck: {truckSlots} slots</p>
      </div>
      <hr />

<h2>Recent Bookings</h2>

<div
  style={{
    marginTop: "15px",
    overflowX: "auto",
  }}
>
  {bookings.length === 0 ? (
    <p>No bookings found.</p>
  ) : (
    <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  }}
>
  <thead>
    <tr>
      <th style={{ padding: "10px", border: "1px solid #ddd" }}>
        Booking ID
      </th>

      <th style={{ padding: "10px", border: "1px solid #ddd" }}>
        User
      </th>

      <th style={{ padding: "10px", border: "1px solid #ddd" }}>
        Slot
      </th>

      <th style={{ padding: "10px", border: "1px solid #ddd" }}>
        Vehicle
      </th>

      <th style={{ padding: "10px", border: "1px solid #ddd" }}>
        Location
      </th>

      <th style={{ padding: "10px", border: "1px solid #ddd" }}>
        Amount
      </th>

      <th style={{ padding: "10px", border: "1px solid #ddd" }}>
        Status
      </th>
    </tr>
  </thead>

  <tbody>
    {bookings.map((booking) => (
      <tr key={booking.id}>

        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
          #{booking.id}
        </td>

        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
          {booking.username}
        </td>

        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
          {String(booking.slot_number).padStart(2, "0")}
        </td>

        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
          {booking.vehicle_type}
        </td>

        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
          {booking.parking_location}
        </td>

        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
          ₹{booking.amount}
        </td>

        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
          {booking.status}
        </td>

      </tr>
    ))}
  </tbody>
</table>
  )}
</div>

    </div>
  );
}

function Home() {
  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_role");

    setToken(null);
  };

  return (
    <div>
      <h1>Smart Parking</h1>

      {token ? (
        <>
          <h2>Welcome to Smart Parking</h2>
          <p>You are logged in.</p>

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <h2>Smart Parking Management System</h2>

          <Link to="/login">
            <button>Login</button>
          </Link>

          {" "}

          <Link to="/signup">
            <button>Signup</button>
          </Link>
        </>
      )}
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/book-slot/:slotId"
          element={<BookSlot />}
        />

        <Route
          path="/bookings"
          element={<Bookings />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/payment/:bookingId"
          element={<Payment />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;