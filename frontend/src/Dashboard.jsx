import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "./api";
import "./dashboard.css";

function Dashboard() {
  const [parkingLot, setParkingLot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehicleFilter, setVehicleFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const parkingResponse = await API.get("parking-lots/");
        const slotsResponse = await API.get("slots/");

        console.log("Parking lots:", parkingResponse.data);
        console.log("Slots:", slotsResponse.data);

        const lots =
          parkingResponse.data.results || parkingResponse.data;

        const allSlots =
          slotsResponse.data.results || slotsResponse.data;

        if (lots.length > 0) {
          const lot = lots[0];

          setParkingLot(lot);

          const parkingSlots = allSlots.filter(
            (slot) => slot.parking_lot === lot.id
          );

          setSlots(parkingSlots);
        } else {
          setError("No parking locations are available.");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Unable to load parking information.");
      } finally {
        setLoading(false);
      }
    };

    fetchParkingData();
  }, []);

  const availableSlots = slots.filter(
    (slot) => slot.is_available
  ).length;

  const occupiedSlots = slots.length - availableSlots;

  const filteredSlots =
    vehicleFilter === "ALL"
      ? slots
      : slots.filter(
          (slot) => slot.vehicle_type === vehicleFilter
        );

  const handleSlotClick = (slot) => {
    if (!slot.is_available) {
      return;
    }

    setSelectedSlot(slot);
  };

  const handleVehicleFilter = (type) => {
    setVehicleFilter(type);
    setSelectedSlot(null);
  };

  const handleBookSlot = () => {
    if (!selectedSlot) {
      alert("Please select an available parking slot.");
      return;
    }

    navigate(`/book-slot/${selectedSlot.id}`);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_role");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your parking dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-navbar">

        <Link to="/" className="dashboard-brand">
          <span className="brand-icon">P</span>
          <span>
            <strong>Smart</strong>Park
          </span>
        </Link>

        <div className="navbar-right">

          <Link
            to="/"
            className="dashboard-nav-link"
          >
            Home
          </Link>

          <Link
            to="/bookings"
            className="dashboard-nav-link"
          >
            My Bookings
          </Link>

          <div className="user-profile">
            <div className="user-avatar">
              {username
                ? username.charAt(0).toUpperCase()
                : "U"}
            </div>

            <span className="user-name">
              {username || "User"}
            </span>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="dashboard-error">
          <strong>Notice:</strong> {error}
        </div>
      )}

      {/* ================= WELCOME ================= */}

      <section className="welcome-section">

        <div>

          <p className="welcome-label">
            SMART PARKING
          </p>

          <h1>
            Welcome back,{" "}
            <span>{username || "User"}</span> 👋
          </h1>

          <p>
            Find an available parking space and reserve
            your spot before you arrive.
          </p>

        </div>

        <div className="destination-badge">
          <span className="destination-icon">📍</span>

          <div>
            <small>Parking at</small>

            <strong>
              {parkingLot?.name || "Parking Location"}
            </strong>
          </div>
        </div>

      </section>

      {/* ================= PARKING LOCATION ================= */}

      {parkingLot && (
        <section className="location-card">

          <div className="location-info">

            <div className="location-icon">
              🅿️
            </div>

            <div>
              <p className="location-label">
                CURRENT PARKING LOCATION
              </p>

              <h2>
                {parkingLot.name}
              </h2>

              <p className="location-address">
                📍 {parkingLot.location}
              </p>
            </div>

          </div>

          <div className="location-status">
            <span className="status-dot"></span>
            {parkingLot.is_active
              ? "Parking Available"
              : "Currently Inactive"}
          </div>

        </section>
      )}

      {/* ================= STATISTICS ================= */}

      <section className="stats-container">

        <div className="stat-card">

          <div className="stat-icon available-icon">
            ✓
          </div>

          <div>
            <p>Available</p>
            <h2>{availableSlots}</h2>
            <span>slots ready to book</span>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon occupied-icon">
            ×
          </div>

          <div>
            <p>Occupied</p>
            <h2>{occupiedSlots}</h2>
            <span>currently in use</span>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon total-icon">
            #
          </div>

          <div>
            <p>Total Capacity</p>
            <h2>
              {parkingLot?.total_slots || slots.length}
            </h2>
            <span>parking spaces</span>
          </div>

        </div>

      </section>

      {/* ================= SLOT SECTION ================= */}

      <section className="slots-section">

        <div className="section-heading">

          <div>
            <p className="section-label">
              PARKING AVAILABILITY
            </p>

            <h2>
              Choose Your Parking Slot
            </h2>

            <p>
              Select an available slot for your vehicle.
            </p>
          </div>

          <div className="legend">

            <span>
              <i className="legend-dot available-dot"></i>
              Available
            </span>

            <span>
              <i className="legend-dot occupied-dot"></i>
              Occupied
            </span>

            <span>
              <i className="legend-dot selected-dot"></i>
              Selected
            </span>

          </div>

        </div>

        {/* ================= VEHICLE FILTER ================= */}

        <div className="vehicle-filter">

          <span className="filter-label">
            Vehicle type
          </span>

          <div className="vehicle-buttons">

            <button
              className={
                vehicleFilter === "ALL"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => handleVehicleFilter("ALL")}
            >
              All Vehicles
            </button>

            <button
              className={
                vehicleFilter === "BIKE"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => handleVehicleFilter("BIKE")}
            >
              🏍️ Bike
            </button>

            <button
              className={
                vehicleFilter === "CAR"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => handleVehicleFilter("CAR")}
            >
              🚗 Car
            </button>

            <button
              className={
                vehicleFilter === "TRUCK"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => handleVehicleFilter("TRUCK")}
            >
              🚚 Truck
            </button>

          </div>

        </div>

        {/* ================= SLOT GRID ================= */}

        {filteredSlots.length > 0 ? (

          <div className="slot-grid">

            {filteredSlots.map((slot) => {

              const isSelected =
                selectedSlot?.id === slot.id;

              return (
                <button
                  key={slot.id}
                  className={`slot-card ${
                    slot.is_available
                      ? "available"
                      : "occupied"
                  } ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleSlotClick(slot)
                  }
                  disabled={!slot.is_available}
                >

                  <div className="slot-top">

                    <span className="slot-number">
                      {String(
                        slot.slot_number
                      ).padStart(2, "0")}
                    </span>

                    <span
                      className={`slot-indicator ${
                        slot.is_available
                          ? "indicator-available"
                          : "indicator-occupied"
                      }`}
                    ></span>

                  </div>

                  <div className="slot-type">
                    {slot.vehicle_type}
                  </div>

                  <div className="slot-status">
                    {isSelected
                      ? "Selected"
                      : slot.is_available
                      ? "Available"
                      : "Occupied"}
                  </div>

                </button>
              );
            })}

          </div>

        ) : (

          <div className="no-slots">
            <div className="no-slots-icon">
              🅿️
            </div>

            <h3>
              No slots found
            </h3>

            <p>
              There are currently no parking slots
              for this vehicle type.
            </p>
          </div>

        )}

        {/* ================= SELECTED SLOT ================= */}

        {selectedSlot && (

          <div className="selected-slot-panel">

            <div className="selected-info">

              <div className="selected-icon">
                ✓
              </div>

              <div>

                <p>
                  SELECTED PARKING SLOT
                </p>

                <h3>
                  Slot{" "}
                  {String(
                    selectedSlot.slot_number
                  ).padStart(2, "0")}
                </h3>

                <span>
                  Suitable for{" "}
                  {selectedSlot.vehicle_type}
                </span>

              </div>

            </div>

            <button
              className="book-slot-button"
              onClick={handleBookSlot}
            >
              Continue to Booking
              <span>→</span>
            </button>

          </div>

        )}

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="dashboard-footer">

        <div>
          <strong>SmartPark</strong>
          <span>
            Smart parking for smarter journeys.
          </span>
        </div>

        <p>
          © 2026 SmartPark. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Dashboard;