import { store } from "../../app/store";
import { bookingsApiSlice } from "../bookings/BookingsApiSlice";
import { usersApiSlice } from "../users/UsersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import React from "react";
import { modelsApiSlice } from "../models/ModelsApiSlice";

export default function Prefetch() {
  useEffect(() => {
    console.log("subscribing");
    const bookings = store.dispatch(
      bookingsApiSlice.endpoints.getBookings.initiate()
    );
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate());
    const models = store.dispatch(
      modelsApiSlice.endpoints.getModels.initiate()
    );

    return () => {
      console.log("unsubscribing");
      bookings.unsubscribe();
      users.unsubscribe();
      models.unsubscribe();
    };
  }, []);
  return <Outlet />;
}
