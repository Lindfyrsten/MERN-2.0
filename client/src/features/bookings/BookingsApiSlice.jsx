import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const bookingsAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});
const initialState = bookingsAdapter.getInitialState({});

export const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: () => "/bookings",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5, // keep unused data for 5 seconds - change to 60 in production
      transformResponse: (responseData) => {
        const loadedBookings = responseData.map((booking) => {
          booking.id = booking._id;
          return booking;
        });
        return bookingsAdapter.setAll(initialState, loadedBookings);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "booking", id: "LIST" },
            ...result.ids.map((id) => ({ type: "booking", id })),
          ];
        } else return [{ type: "booking", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetBookingsQuery } = bookingsApiSlice;

// returns the query result object
export const selectBookingsResult =
  bookingsApiSlice.endpoints.getBookings.select();

// creates memoized selector
const selectBookingsData = createSelector(
  selectBookingsResult,
  (bookingsResult) => bookingsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllbookings,
  selectById: selectBookingById,
  selectIds: selectBookingIds,
  // Pass in a selector that returns the bookings slice of state
} = bookingsAdapter.getSelectors(
  (state) => selectBookingsData(state) ?? initialState
);
