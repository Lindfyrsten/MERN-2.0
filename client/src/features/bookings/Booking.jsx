import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectBookingById } from "./BookingsApiSlice";

import React from "react";

export default function Booking({ bookingId }) {
  const booking = useSelector((state) => selectBookingById(state, bookingId));

  const navigate = useNavigate();
  if (booking) {
    const created = new Date(booking.createdAt).toLocaleString("da-DK", {
      day: "numeric",
      month: "long",
    });

    const updated = new Date(booking.updatedAt).toLocaleString("da-DK", {
      day: "numeric",
      month: "long",
    });
    const modelsString = booking.modelnames.toString().replaceAll(",", ", ");
    const handleEdit = () => navigate(`/dash/bookings/${bookingId}`);
    return (
      <tr className="table__row">
        <td className="table__cell booking__status">
          {booking.completed ? (
            <span className="booking__status--completed">Completed</span>
          ) : (
            <span className="booking__status--open">Open</span>
          )}
        </td>
        <td className="table__cell booking__username">{booking.username}</td>
        <td className="table__cell booking__username">{modelsString}</td>
        <td className="table__cell booking__username">{booking.totalprice}</td>
        <td className="table__cell booking__title">{booking.text}</td>
        <td className="table__cell booking__created">{created}</td>
        <td className="table__cell booking__updated">{updated}</td>
        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else {
    return null;
  }
}
