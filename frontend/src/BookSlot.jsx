import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "./api";
import "./BookSlot.css";

function BookSlot() {
  const { slotId } = useParams();
  const navigate = useNavigate();

  const [slot, setSlot] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSlot = async () => {
      try {
        const response = await API.get("slots/");
        const slots = response.data.results || response.data;

        const selectedSlot = slots.find(
          (item) => item.id === Number(slotId)
        );

        if (!selectedSlot) {
          setMessage("Parking slot not found.");
          return;
        }

        setSlot(selectedSlot);
      } catch (error) {
        console.error(error);
        setMessage("Unable to load parking slot.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlot();
  }, [slotId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!startTime || !endTime || !amount) {
      setMessage("Please fill all the booking details.");
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      setMessage("End time must be after start time.");
      return;
    }

    try {
      const response = await API.post("bookings/", {
        slot: slot.id,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        amount: amount,
      });

      console.log("Booking created:", response.data);

      alert("Booking successful!");
      navigate(`/payment/${response.data.id}`);

    } catch (error) {
      console.error(error);

      const errorData = error.response?.data;

      if (errorData) {
        setMessage(
          errorData.detail ||
          errorData.slot?.[0] ||
          errorData.start_time?.[0] ||
          errorData.end_time?.[0] ||
          errorData.amount?.[0] ||
          "Booking failed."
        );
      } else {
        setMessage("Unable to connect to server.");
      }
    }
  };

  if (loading) {
    return (
      <div className="booking-loading">
        Loading booking details...
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="booking-page">
        <div className="booking-card">
          <h2>Booking Error</h2>
          <p>{message}</p>

          <button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">

      <div className="booking-card">

        <div className="booking-header">
          <h1>Book Your Parking Slot</h1>
          <p>City Care Hospital Parking</p>
        </div>

        <div className="slot-information">

          <div className="slot-icon">
            🅿️
          </div>

          <div>
            <h2>
              Slot {String(slot.slot_number).padStart(2, "0")}
            </h2>

            <p>
              Vehicle Type: <strong>{slot.vehicle_type}</strong>
            </p>

            <p>
              Status:{" "}
              <strong className="available-text">
                {slot.is_available ? "Available" : "Occupied"}
              </strong>
            </p>
          </div>

        </div>

        {!slot.is_available ? (
          <div className="error-message">
            This parking slot is no longer available.
          </div>
        ) : (
          <form onSubmit={handleBooking}>

            <label>
              Start Time
            </label>

            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />

            <label>
              End Time
            </label>

            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />

            <label>
              Amount (₹)
            </label>

            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Enter booking amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            {message && (
              <div className="error-message">
                {message}
              </div>
            )}

            <div className="booking-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="confirm-button"
              >
                Confirm Booking
              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  );
}

export default BookSlot;