import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  const date = new Date();
  const today = new Intl.DateTimeFormat("da-DK", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const content = (
    <section className="welcome">
      <p>{today}</p>
      <h1>Welcome!</h1>
      <p>
        <Link to="/dash/bookings">View Bookings</Link>
      </p>
      <p>
        <Link to="/dash/bookings/new">Add New Booking</Link>
      </p>
      <p>
        <Link to="/dash/users">View Users</Link>
      </p>
      <p>
        <Link to="/dash/users/new">Add New User</Link>
      </p>
    </section>
  );
  return content;
};

export default Welcome;
