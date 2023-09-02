import express from "express";
const router = express.Router();
import bookingsController from "../controllers/bookingsController.js";

router
  .route("/")
  .get(bookingsController.getAllBookings)
  .post(bookingsController.createNewBooking)
  .patch(bookingsController.updateBooking)
  .delete(bookingsController.deleteBooking);

export default router;
