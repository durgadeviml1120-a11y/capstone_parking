
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";
import "./bookings.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("Loading bookings...");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const response = await API.get("bookings/");

      const data = response.data.results || response.data;

      setBookings(data);
      setMessage("");
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        setMessage("Authentication failed. Please login again.");
      } else {
        setMessage("Unable to load bookings.");
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancellingId(bookingId);

      await API.patch(`bookings/${bookingId}/cancel/`);

      alert("Booking cancelled successfully!");

      await fetchBookings();
    } catch (error) {
      console.error(error);

      const detail =
        error.response?.data?.detail ||
        "Unable to cancel this booking.";

      alert(detail);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="bookings-page">

      <nav className="bookings-navbar">

        <Link to="/dashboard" className="bookings-brand">
          🚗 Smart Parking
        </Link>

        <Link to="/dashboard" className="dashboard-link">
          ← Dashboard
        </Link>

      </nav>

      <main className="bookings-container">

        <div className="bookings-header">
          <p className="bookings-label">
            SMART PARKING SYSTEM
          </p>

          <h1>My Bookings</h1>

          <p>
            View and manage your parking reservations.
          </p>
        </div>

        {message && (
          <div className="bookings-message">
            {message}
          </div>
        )}

        {!message && bookings.length === 0 && (
          <div className="empty-bookings">
            <div className="empty-icon">🅿️</div>

            <h2>No Bookings Yet</h2>

            <p>
              You haven't made any parking reservations.
            </p>

            <Link
              to="/dashboard"
              className="find-parking-button"
            >
              Find a Parking Slot
            </Link>
          </div>
        )}

        <div className="booking-list">

          {bookings.map((booking) => {

            const statusClass =
              booking.status.toLowerCase();

            return (
              <div
                className="booking-card"
                key={booking.id}
              >

                <div className="booking-card-top">

                  <div>
                    <span className="booking-number">
                      BOOKING #{booking.id}
                    </span>

                    <h2>
                      Parking Slot{" "}
                      {String(booking.slot).padStart(2, "0")}
                    </h2>
                  </div>

                  <span
                    className={`status-badge ${statusClass}`}
                  >
                    {booking.status}
                  </span>

                </div>

                <div className="booking-details">

                  <div className="detail-item">
                    <span>📅</span>
                    <div>
                      <small>Start Time</small>
                      <strong>
                        {new Date(
                          booking.start_time
                        ).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span>⏰</span>
                    <div>
                      <small>End Time</small>
                      <strong>
                        {new Date(
                          booking.end_time
                        ).toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-item">
                    <span>💰</span>
                    <div>
                      <small>Amount</small>
                      <strong>
                        ₹{booking.amount}
                      </strong>
                    </div>
                  </div>

                </div>

                <div className="booking-card-bottom">

                  <span className="booking-location">
                    📍 City Care Hospital Parking
                  </span>

                  {booking.status === "CONFIRMED" && (
                    <button
                      className="cancel-booking-button"
                      onClick={() =>
                        handleCancel(booking.id)
                      }
                      disabled={
                        cancellingId === booking.id
                      }
                    >
                      {cancellingId === booking.id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}

                  {booking.status === "CANCELLED" && (
                    <span className="cancelled-text">
                      Booking cancelled
                    </span>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      </main>

    </div>
  );
}

export default Bookings;
