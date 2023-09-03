import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectModelById } from "./ModelsApiSlice";

import React from "react";

export default function Model({ modelId }) {
  const model = useSelector((state) => selectModelById(state, modelId));

  const navigate = useNavigate();
  if (model) {
    const handleEdit = () => navigate(`/dash/models/${modelId}`);
    const cellStatus = model.active ? "" : "table__cell--inactive";
    const bookings = model.bookings.length;
    const activeBookings = model.bookings.filter(
      (booking) => !booking.completed
    );
    return (
      <tr className="table__row model">
        <td className={`table__cell ${cellStatus}`}>{model.name}</td>
        <td className={`table__cell ${cellStatus}`}>{model.price}</td>
        <td className={`table__cell ${cellStatus}`}>{bookings}</td>
        <td className={`table__cell ${cellStatus}`}>
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
