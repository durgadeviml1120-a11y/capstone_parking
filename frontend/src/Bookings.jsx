import { useEffect, useState } from "react";
import API from "./api";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("Loading bookings...");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await API.get("bookings/");

        setBookings(response.data);
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

    fetchBookings();
  }, []);

  return (
    <div>
      <h1>My Bookings</h1>

      {message && <p>{message}</p>}

      {bookings.map((booking) => (
        <div key={booking.id}>
          <p>Booking ID: {booking.id}</p>
          <p>Slot: {booking.slot}</p>
          <p>Start: {booking.start_time}</p>
          <p>End: {booking.end_time}</p>
          <p>Amount: ₹{booking.amount}</p>
          <p>Status: {booking.status}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Bookings;