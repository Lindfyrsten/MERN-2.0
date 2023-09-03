import { useState, useEffect } from "react";
import {
  useUpdateBookingMutation,
  useDeleteBookingMutation,
} from "./BookingsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function EditBookingForm({ booking, users, models }) {
  const [updateBooking, { isLoading, isSuccess, isError, error }] =
    useUpdateBookingMutation();

  const [
    deleteBooking,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteBookingMutation();

  const navigate = useNavigate();

  const [user, setUser] = useState(booking.user);
  const [modelsList, setModelsList] = useState(booking.models);
  const [totalprice, setTotalprice] = useState(booking.totalprice);
  const [validPrice, setValidPrice] = useState(true);
  const [completed, setCompleted] = useState(booking.completed);
  const [text, setText] = useState(booking.text);

  useEffect(() => {
    setValidPrice(totalprice >= 0);
  }, [totalprice]);

  useEffect(() => {
    console.log(isSuccess);
    if (isSuccess || isDelSuccess) {
      setUser("");
      setModelsList([]);
      setTotalprice(0);
      setCompleted(false);
      navigate("/dash/bookings");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTotalpriceChanged = (e) => {
    const totalprice = Number(e.target.value);
    setTotalprice(totalprice);
  };

  const onUserChanged = (e) => {
    console.log(e.target.value);
    setUser(e.target.value);
  };

  const onModelsChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setModelsList(values);
  };
  const onCompletedChanged = () => setCompleted((prev) => !prev);

  const onTextChanged = (e) => setText(e.target.value);

  const onSaveBookingClicked = async (e) => {
    await updateBooking({
      id: booking.id,
      user,
      modelsList,
      totalprice,
      text,
      completed,
    });
  };

  const onDeleteBookingClicked = async () => {
    await deleteBooking({ id: booking.id });
  };

  const userOptions = users.map((user) => {
    return (
      <option key={user.username} value={user._id}>
        {" "}
        {user.username}
      </option>
    );
  });

  const modelsOptions = models.map((model) => {
    return (
      <option key={model.name} value={model._id}>
        {" "}
        {model.name}
      </option>
    );
  });

  let canSave =
    [modelsList.length, user, validPrice].every(Boolean) && !isLoading;

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validPriceClass = !validPrice ? "form__input--incomplete" : "";
  const validUserClass = !user ? "form__input--incomplete" : "";
  const validModelsClass = !Boolean(modelsList.length)
    ? "form__input--incomplete"
    : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Booking</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveBookingClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteBookingClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        <label className="form__label" htmlFor="user">
          USER:
        </label>
        <select
          id="user"
          name="user"
          className={`form__select ${validUserClass}`}
          multiple={false}
          size="1"
          value={user}
          onChange={onUserChanged}
        >
          {userOptions}
        </select>

        <label className="form__label" htmlFor="models">
          MODELS:
        </label>
        <select
          id="models"
          name="models"
          className={`form__select ${validModelsClass}`}
          multiple={true}
          size="5"
          value={modelsList}
          onChange={onModelsChanged}
        >
          {modelsOptions}
        </select>

        <label className="form__label" htmlFor="totalprice">
          Price:
        </label>
        <input
          className={`form__input ${validPriceClass}`}
          id="totalprice"
          name="totalprice"
          type="number"
          value={totalprice}
          onChange={onTotalpriceChanged}
        />

        <label className="form__label" htmlFor="text">
          Booking Note:
        </label>
        <input
          className={`form__input`}
          id="text"
          name="text"
          type="text"
          autoComplete="off"
          value={text}
          onChange={onTextChanged}
        />

        <label
          className="form__label form__checkbox-container"
          htmlFor="booking-completed"
        >
          COMPLETED:
          <input
            className="form__checkbox"
            id="booking-completed"
            name="booking-completed"
            type="checkbox"
            checked={completed}
            onChange={onCompletedChanged}
          />
        </label>
      </form>
    </>
  );

  return content;
}
