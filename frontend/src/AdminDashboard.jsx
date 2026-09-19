import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import "./admin-dashboard.css";

function AdminDashboard() {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

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
        console.error("Admin dashboard error:", err);
        setError("Unable to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_role");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loader"></div>
        <h2>Loading Admin Dashboard...</h2>
        <p>Preparing your parking overview</p>
      </div>
    );
  }

  const totalSlots = parkingLot?.total_slots || slots.length;

  const availableSlots = slots.filter(
    (slot) => slot.is_available
  ).length;

  const occupiedSlots = slots.filter(
    (slot) => !slot.is_available
  ).length;

  const occupancyPercentage =
    totalSlots > 0
      ? Math.round((occupiedSlots / totalSlots) * 100)
      : 0;

  const bikeSlots = slots.filter(
    (slot) => slot.vehicle_type === "BIKE"
  ).length;

  const carSlots = slots.filter(
    (slot) => slot.vehicle_type === "CAR"
  ).length;

  const truckSlots = slots.filter(
    (slot) => slot.vehicle_type === "TRUCK"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "CANCELLED"
  ).length;

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-brand-icon">P</div>

          <div>
            <strong>Smart</strong>Park
            <span>ADMIN PANEL</span>
          </div>
        </div>

        <nav className="admin-nav">

          <button className="admin-nav-item active">
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <span>▣</span>
            User View
          </button>

          <button
            className="admin-nav-item"
            onClick={() => navigate("/bookings")}
          >
            <span>▤</span>
            Bookings
          </button>

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-account">

            <div className="admin-avatar">
              {username
                ? username.charAt(0).toUpperCase()
                : "A"}
            </div>

            <div>
              <strong>{username || "Admin"}</strong>
              <span>Administrator</span>
            </div>

          </div>

          <button
            className="admin-logout"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="admin-main">

        {/* TOP BAR */}

        <header className="admin-topbar">

          <div>
            <p className="admin-eyebrow">
              SMART PARKING / ADMIN
            </p>

            <h1>Good day, {username || "Admin"} 👋</h1>

            <p>
              Monitor your parking operations from one place.
            </p>
          </div>

          <div className="admin-top-actions">

            <div className="admin-status">
              <span></span>
              System Online
            </div>

            <div className="admin-top-avatar">
              {username
                ? username.charAt(0).toUpperCase()
                : "A"}
            </div>

          </div>

        </header>

        {error && (
          <div className="admin-error">
            <strong>Notice:</strong> {error}
          </div>
        )}

        {/* STAT CARDS */}

        <section className="admin-stats">

          <div className="admin-stat-card blue">
            <div className="stat-card-top">
              <span>Total Capacity</span>
              <div className="stat-card-icon">P</div>
            </div>

            <strong>{totalSlots}</strong>

            <p>parking spaces</p>
          </div>

          <div className="admin-stat-card green">
            <div className="stat-card-top">
              <span>Available</span>
              <div className="stat-card-icon">✓</div>
            </div>

            <strong>{availableSlots}</strong>

            <p>ready for booking</p>
          </div>

          <div className="admin-stat-card red">
            <div className="stat-card-top">
              <span>Occupied</span>
              <div className="stat-card-icon">×</div>
            </div>

            <strong>{occupiedSlots}</strong>

            <p>currently occupied</p>
          </div>

          <div className="admin-stat-card purple">
            <div className="stat-card-top">
              <span>Bookings</span>
              <div className="stat-card-icon">▤</div>
            </div>

            <strong>{bookings.length}</strong>

            <p>{confirmedBookings} confirmed</p>
          </div>

        </section>

        {/* MAIN GRID */}

        <section className="admin-content-grid">

          {/* PARKING OVERVIEW */}

          <div className="admin-panel parking-overview">

            <div className="panel-heading">

              <div>
                <span>LIVE OVERVIEW</span>
                <h2>Parking Occupancy</h2>
              </div>

              <div className="active-badge">
                <span></span>
                {parkingLot?.is_active
                  ? "Active"
                  : "Inactive"}
              </div>

            </div>

            <div className="occupancy-layout">

              <div
                className="occupancy-circle"
                style={{
                  "--occupancy": `${occupancyPercentage}%`,
                }}
              >
                <div>
                  <strong>{occupancyPercentage}%</strong>
                  <span>Occupied</span>
                </div>
              </div>

              <div className="occupancy-details">

                <div>
                  <span className="legend-green"></span>
                  <div>
                    <strong>{availableSlots}</strong>
                    <small>Available</small>
                  </div>
                </div>

                <div>
                  <span className="legend-red"></span>
                  <div>
                    <strong>{occupiedSlots}</strong>
                    <small>Occupied</small>
                  </div>
                </div>

              </div>

            </div>

            {parkingLot && (
              <div className="parking-location">

                <div className="location-symbol">⌖</div>

                <div>
                  <small>Parking Location</small>
                  <strong>{parkingLot.name}</strong>
                  <span>{parkingLot.location}</span>
                </div>

              </div>
            )}

          </div>

          {/* VEHICLE DISTRIBUTION */}

          <div className="admin-panel vehicle-panel">

            <div className="panel-heading">
              <div>
                <span>VEHICLE MIX</span>
                <h2>Vehicle Distribution</h2>
              </div>
            </div>

            <div className="vehicle-bars">

              <div className="vehicle-row">
                <div className="vehicle-label">
                  <span>🏍️</span>
                  <strong>Bike</strong>
                  <small>{bikeSlots} slots</small>
                </div>

                <div className="bar-track">
                  <div
                    className="bar bike-bar"
                    style={{
                      width: `${totalSlots ? (bikeSlots / totalSlots) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="vehicle-row">
                <div className="vehicle-label">
                  <span>🚗</span>
                  <strong>Car</strong>
                  <small>{carSlots} slots</small>
                </div>

                <div className="bar-track">
                  <div
                    className="bar car-bar"
                    style={{
                      width: `${totalSlots ? (carSlots / totalSlots) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="vehicle-row">
                <div className="vehicle-label">
                  <span>🚚</span>
                  <strong>Truck</strong>
                  <small>{truckSlots} slots</small>
                </div>

                <div className="bar-track">
                  <div
                    className="bar truck-bar"
                    style={{
                      width: `${totalSlots ? (truckSlots / totalSlots) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

            </div>

            <div className="vehicle-summary">
              <span>Total registered slot types</span>
              <strong>{bikeSlots + carSlots + truckSlots}</strong>
            </div>

          </div>

        </section>

        {/* BOOKINGS */}

        <section className="admin-panel bookings-panel">

          <div className="panel-heading">

            <div>
              <span>RECENT ACTIVITY</span>
              <h2>Recent Bookings</h2>
            </div>

            <div className="booking-summary">
              <span>{confirmedBookings} confirmed</span>
              <span>{cancelledBookings} cancelled</span>
            </div>

          </div>

          {bookings.length === 0 ? (

            <div className="empty-bookings">
              <div>▤</div>
              <h3>No bookings found</h3>
              <p>Bookings will appear here when users reserve slots.</p>
            </div>

          ) : (

            <div className="table-wrapper">

              <table className="admin-booking-table">

                <thead>
                  <tr>
                    <th>BOOKING</th>
                    <th>USER</th>
                    <th>SLOT</th>
                    <th>VEHICLE</th>
                    <th>LOCATION</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>

                  {bookings.slice(0, 8).map((booking) => (

                    <tr key={booking.id}>

                      <td>
                        <strong>#{booking.id}</strong>
                      </td>

                      <td>
                        <div className="table-user">
                          <div>
                            {booking.username
                              ? booking.username
                                  .charAt(0)
                                  .toUpperCase()
                              : "U"}
                          </div>

                          <span>
                            {booking.username || "User"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="slot-pill">
                          {String(
                            booking.slot_number
                          ).padStart(2, "0")}
                        </span>
                      </td>

                      <td>{booking.vehicle_type}</td>

                      <td>
                        {booking.parking_location || "Chennai"}
                      </td>

                      <td>
                        <strong>
                          ₹{booking.amount}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`booking-status ${
                            booking.status?.toLowerCase()
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* FOOTER */}

        <footer className="admin-footer">

          <span>
            SmartPark Admin Console
          </span>

          <span>
            © 2026 SmartPark
          </span>

        </footer>

      </main>

    </div>
  );
}

export default AdminDashboard;