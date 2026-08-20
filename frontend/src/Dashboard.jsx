import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "./api";
import hospitalParking from "./assets/hospital-parking.png";
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
        }
      } catch (err) {
        console.error(err);
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
      <div className="loading">
        Loading Smart Parking...
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* NAVBAR */}

      <nav className="dashboard-navbar">

        <div className="brand">
          🚗 Smart Parking
        </div>

        <div className="navbar-right">

          <Link to="/bookings" className="bookings-link">
            My Bookings
          </Link>

          <span className="user-name">
            👤 {username}
          </span>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ERROR */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* HERO */}

      {parkingLot && (
        <section className="hero-section">

          <div className="hero-text">

            <p className="hero-label">
              SMART PARKING SYSTEM
            </p>

            <h1>
              Find Your Perfect
              <br />
              Parking Spot
            </h1>

            <p>
              Convenient and secure parking
              at City Care Hospital.
            </p>

            <div className="location">
              📍 {parkingLot.location}
            </div>

          </div>

          <div className="hero-image-container">

            <img
              src={hospitalParking}
              alt="City Care Hospital Parking"
              className="hero-image"
            />

          </div>

        </section>
      )}

      {/* PARKING STATS */}

      <section className="stats-container">

        <div className="stat-card available-stat">

          <div className="stat-icon">
            🟢
          </div>

          <div>
            <h2>{availableSlots}</h2>
            <p>Available Slots</p>
          </div>

        </div>

        <div className="stat-card occupied-stat">

          <div className="stat-icon">
            🔴
          </div>

          <div>
            <h2>{occupiedSlots}</h2>
            <p>Occupied Slots</p>
          </div>

        </div>

        <div className="stat-card total-stat">

          <div className="stat-icon">
            🅿️
          </div>

          <div>
            <h2>
              {parkingLot?.total_slots || 0}
            </h2>

            <p>Total Slots</p>
          </div>

        </div>

      </section>

      {/* SLOT SELECTION */}

      <section className="slots-section">

        <div className="section-heading">

          <div>

            <h2>
              Select Your Parking Slot
            </h2>

            <p>
              Choose your vehicle type and select
              an available slot.
            </p>

          </div>

          {/* LEGEND */}

          <div className="legend">

            <span>
              <span className="legend-dot available-dot"></span>
              Available
            </span>

            <span>
              <span className="legend-dot occupied-dot"></span>
              Occupied
            </span>

            <span>
              <span className="legend-dot selected-dot"></span>
              Selected
            </span>

          </div>

        </div>

        {/* VEHICLE FILTER */}

        <div className="vehicle-filter">

          <button
            className={
              vehicleFilter === "ALL"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() => handleVehicleFilter("ALL")}
          >
            All
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

        {/* SLOTS */}

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

                <div className="slot-number">
                  {String(
                    slot.slot_number
                  ).padStart(2, "0")}
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

        {/* NO SLOTS MESSAGE */}

        {filteredSlots.length === 0 && (
          <p className="no-slots">
            No parking slots available for this
            vehicle type.
          </p>
        )}

        {/* SELECTED SLOT */}

        {selectedSlot && (

          <div className="selected-slot-panel">

            <div>

              <p>
                Selected Parking Slot
              </p>

              <h3>
                Slot{" "}
                {String(
                  selectedSlot.slot_number
                ).padStart(2, "0")}
              </h3>

              <span>
                Vehicle Type:{" "}
                {selectedSlot.vehicle_type}
              </span>

            </div>

            <button
              className="book-slot-button"
              onClick={handleBookSlot}
            >
              Book This Slot →
            </button>

          </div>

        )}

      </section>

    </div>
  );
}

export default Dashboard;