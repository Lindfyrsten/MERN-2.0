import { useState, useEffect } from "react";
import { useAddNewModelMutation } from "./ModelsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const MODEL_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

export default function NewModelForm() {
  const [addNewModel, { isLoading, isSuccess, isError, error }] =
    useAddNewModelMutation();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [price, setPrice] = useState(0);
  const [validPrice, setValidPrice] = useState(false);

  useEffect(() => {
    setValidName(MODEL_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidPrice(price >= 0);
  }, [price]);

  useEffect(() => {
    if (isSuccess) {
      setName("");
      setPrice(0);
      navigate("/dash/models");
    }
  }, [isSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);
  const onPriceChanged = (e) => {
    const price = Number(e.target.value);
    setPrice(price);
  };

  const canSave = [validName, validPrice].every(Boolean) && !isLoading;

  const onSaveModelClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewModel({ name, price });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validModelClass = !validName ? "form__input--incomplete" : "";
  const validPriceClass = !validPrice ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveModelClicked}>
        <div className="form__title-row">
          <h2>New Model</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="Name">
          Model name: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validModelClass}`}
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          value={name}
          onChange={onNameChanged}
        />

        <label className="form__label" htmlFor="price">
          Price:
        </label>
        <input
          className={`form__input ${validPriceClass}`}
          id="price"
          name="price"
          type="number"
          value={price}
          onChange={onPriceChanged}
        />
      </form>
    </>
  );

  return content;
}
