import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "./api";
import "./Payment.css";

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await API.get("bookings/");

        const bookings =
          response.data.results || response.data;

        const selectedBooking = bookings.find(
          (item) => item.id === Number(bookingId)
        );

        if (!selectedBooking) {
          setError("Booking not found.");
          return;
        }

        setBooking(selectedBooking);
      } catch (err) {
        console.error(err);
        setError("Unable to load booking details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handlePayment = async () => {
    if (!booking) {
      return;
    }

    setPaying(true);
    setError("");

    try {
      await API.post("payments/", {
        booking: booking.id,
        payment_method: "UPI",
      });

      alert("Payment successful!");

      navigate("/bookings");
    } catch (err) {
      console.error(err);

      const data = err.response?.data;

      setError(
        data?.detail ||
        data?.booking?.[0] ||
        "Payment failed. Please try again."
      );
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <div className="payment-card">
          <h2>Loading payment details...</h2>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="payment-page">
        <div className="payment-card">
          <h2>Payment</h2>

          <p className="payment-error">
            {error}
          </p>

          <button
            onClick={() => navigate("/bookings")}
            className="back-button"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">

      <div className="payment-card">

        <div className="payment-header">
          <div className="payment-icon">
            💳
          </div>

          <h1>Complete Payment</h1>

          <p>
            City Care Hospital Parking
          </p>
        </div>

        <div className="booking-summary">

          <h2>Booking Summary</h2>

          <div className="summary-row">
            <span>Booking ID</span>
            <strong>#{booking.id}</strong>
          </div>

          <div className="summary-row">
            <span>Parking Slot</span>
            <strong>
              Slot {String(booking.slot).padStart(2, "0")}
            </strong>
          </div>

          <div className="summary-row">
            <span>Start Time</span>
            <strong>{booking.start_time}</strong>
          </div>

          <div className="summary-row">
            <span>End Time</span>
            <strong>{booking.end_time}</strong>
          </div>

          <div className="summary-row total-row">
            <span>Total Amount</span>
            <strong>₹{booking.amount}</strong>
          </div>

        </div>

        <div className="payment-method">

          <h3>Payment Method</h3>

          <div className="upi-option">
            <span>📱</span>

            <div>
              <strong>UPI Payment</strong>
              <p>Secure test payment</p>
            </div>
          </div>

        </div>

        {error && (
          <div className="payment-error">
            {error}
          </div>
        )}

        <button
          className="pay-button"
          onClick={handlePayment}
          disabled={paying}
        >
          {paying
            ? "Processing Payment..."
            : `Pay ₹${booking.amount}`}
        </button>

        <button
          className="back-button"
          onClick={() => navigate("/bookings")}
          disabled={paying}
        >
          Cancel
        </button>

      </div>

    </div>
  );
}

export default Payment;