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
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />
          <Route path="bookings">
            <Route index element={<BookingsList />} />
          </Route>
          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>
          <Route path="models">
            <Route index element={<ModelsList />} />
          </Route>
        </Route>
        {/* End Dash */}
      </Route>
    </Routes>
  );
}

export default App;
