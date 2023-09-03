import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectModelById } from "./ModelsApiSlice";
import EditModelForm from "./EditModelForm";

const EditModel = () => {
  const { id } = useParams();

  const model = useSelector((state) => selectModelById(state, id));

  const content = model ? <EditModelForm model={model} /> : <p>Loading...</p>;

  return content;
};
export default EditModel;
