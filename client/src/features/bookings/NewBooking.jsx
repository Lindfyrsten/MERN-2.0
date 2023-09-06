import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/UsersApiSlice";
import NewBookingForm from "./NewBookingForm";
import { selectAllModels } from "../models/ModelsApiSlice";

const NewBooking = () => {
  const users = useSelector(selectAllUsers);
  const models = useSelector(selectAllModels);

  if (!users?.length || !models?.length) return <p>Not Currently Available</p>;

  const content = <NewBookingForm users={users} models={models} />;

  return content;
};
export default NewBooking;
