import { useState, useEffect } from "react";
import {
  useUpdateModelMutation,
  useDeleteModelMutation,
} from "./ModelsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const MODEL_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

const EditModelForm = ({ model }) => {
  const [updateModel, { isLoading, isSuccess, isError, error }] =
    useUpdateModelMutation();

  const [
    deleteModel,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteModelMutation();

  const navigate = useNavigate();

  const [name, setName] = useState(model.name);
  const [validName, setValidName] = useState(true);
  const [price, setPrice] = useState(model.price);
  const [validPrice, setValidPrice] = useState(true);

  useEffect(() => {
    setValidName(MODEL_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidPrice(price >= 0);
  }, [price]);

  useEffect(() => {
    console.log(isSuccess);
    if (isSuccess || isDelSuccess) {
      setName("");
      setPrice(0);
      navigate("/dash/models");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onNameChanged = (e) => setName(e.target.value);
  const onPriceChanged = (e) => {
    const price = Number(e.target.value);
    setPrice(price);
  };

  const onSaveModelClicked = async (e) => {
    await updateModel({ id: model.id, name, price });
  };

  const onDeleteModelClicked = async () => {
    await deleteModel({ id: model.id });
  };

  let canSave = [validName, validPrice].every(Boolean) && !isLoading;

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validModelClass = !validName ? "form__input--incomplete" : "";
  const validPriceClass = !validPrice ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Model</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveModelClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteModelClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>
        <label className="form__label" htmlFor="name">
          Name:
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
};
export default EditModelForm;
