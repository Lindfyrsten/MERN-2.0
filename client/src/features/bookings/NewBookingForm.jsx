import { useState, useEffect } from "react";
import { useAddNewBookingMutation } from "./BookingsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

export default function NewBookingForm({ users }, { models }) {
  const [addNewBooking, { isLoading, isSuccess, isError, error }] =
    useAddNewBookingMutation();

  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [modelsList, setModelsList] = useState([]);
  const [totalprice, setTotalprice] = useState("");
  const [validPrice, setValidPrice] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    setValidPrice(totalprice >= 0);
  }, [totalprice]);

  useEffect(() => {
    if (isSuccess) {
      setUser("");
      setModelsList([]);
      setTotalprice(0);
      navigate("/dash/bookings");
    }
  }, [isSuccess, navigate]);

  const onUserChanged = (e) => setUser(e.target.value);
  const onNoteChanged = (e) => setNote(e.target.value);

  const onTotalpriceChanged = (e) => {
    const totalprice = Number(e.target.value);
    setTotalprice(totalprice);
  };

  const onModelsChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setModelsList(values);
  };

  let canSave =
    [modelsList.length, user, validPrice].every(Boolean) && !isLoading;

  const onSaveBookingClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewBooking({
        user,
        modelsList,
        totalprice,
        note,
      });
    }
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

  const errClass = isError ? "errmsg" : "offscreen";
  const validPriceClass = !validPrice ? "form__input--incomplete" : "";
  const validModelsClass = !Boolean(modelsList.length)
    ? "form__input--incomplete"
    : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveBookingClicked}>
        <div className="form__title-row">
          <h2>New Booking</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="user">
          USER:
        </label>
        <select
          id="user"
          name="user"
          className={`form__select`}
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

        <label className="form__label" htmlFor="note">
          Booking Note:
        </label>
        <input
          className={`form__input`}
          id="note"
          name="note"
          type="note"
          autoComplete="off"
          value={note}
          onChange={onNoteChanged}
        />
      </form>
    </>
  );

  return content;
}
