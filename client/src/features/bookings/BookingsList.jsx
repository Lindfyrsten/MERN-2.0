import React from "react";

import { useGetBookingsQuery } from "./BookingsApiSlice";
import Booking from "./Booking";

const BookingsList = () => {
  const {
    data: bookings,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetBookingsQuery(undefined, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = bookings;

    const tableContent = ids?.length
      ? ids.map((bookingId) => (
          <Booking key={bookingId} bookingId={bookingId} />
        ))
      : null;

    content = (
      <table className="table table--bookings">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th booking__status">
              Status
            </th>
            <th scope="col" className="table__th booking__username">
              User
            </th>
            <th scope="col" className="table__th booking__username">
              Models
            </th>
            <th scope="col" className="table__th booking__username">
              Price
            </th>
            <th scope="col" className="table__th booking__title">
              Note
            </th>
            <th scope="col" className="table__th booking__created">
              Created
            </th>
            <th scope="col" className="table__th booking__updated">
              Updated
            </th>
            <th scope="col" className="table__th booking__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};
export default BookingsList;
