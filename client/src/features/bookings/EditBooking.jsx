import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectBookingById } from "./BookingsApiSlice";
import { selectAllUsers } from "../users/usersApiSlice";
import EditBookingForm from "./EditBookingForm";
import { selectAllModels } from "../models/ModelsApiSlice";

const EditBooking = () => {
  const { id } = useParams();

  const booking = useSelector((state) => selectBookingById(state, id));
  const users = useSelector(selectAllUsers);
  const models = useSelector(selectAllModels);

  const content =
    booking && users && models ? (
      <EditBookingForm booking={booking} users={users} models={models} />
    ) : (
      <p>Loading...</p>
    );

  return content;
};
export default EditBooking;
