import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import BookingsList from "./features/bookings/BookingsList";
import UsersList from "./features/users/UsersList";
import ModelsList from "./features/models/ModelsList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditBooking from "./features/bookings/EditBooking";
import NewBooking from "./features/bookings/NewBooking";
import Prefetch from "./features/auth/Prefetch";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route element={<Prefetch />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Public />} />
          <Route path="login" element={<Login />} />
          <Route path="dash" element={<DashLayout />}>
            <Route index element={<Welcome />} />
            <Route path="users">
              <Route index element={<UsersList />} />
              <Route path=":id" element={<EditUser />} />
              <Route path="new" element={<NewUserForm />} />
            </Route>
            <Route path="bookings">
              <Route index element={<BookingsList />} />
              <Route path=":id" element={<EditBooking />} />
              <Route path="new" element={<NewBooking />} />
            </Route>
            <Route path="models">
              <Route index element={<ModelsList />} />
            </Route>
          </Route>
          {/* End Dash */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
