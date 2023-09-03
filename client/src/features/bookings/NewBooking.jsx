import { useSelector } from "react-redux";
import { selectAllBookings } from "./BookingsApiSlice";
import NewBookingForm from "./NewBookingForm";

export default function NewBooking() {
  const bookings = useSelector(selectAllBookings);

  const content = bookings ? (
    <NewBookingForm bookings={bookings} />
  ) : (
    <div>Loading...</div>
  );
  return content;
}
