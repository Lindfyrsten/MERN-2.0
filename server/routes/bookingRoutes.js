import express from "express";
const router = express.Router();
import bookingsController from "../controllers/bookingsController.js";
import verifyJWT from "../middleware/verifyJWT.js";

router.use(verifyJWT);

router
  .route("/")
  .get(bookingsController.getAllBookings)
  .post(bookingsController.createNewBooking)
  .patch(bookingsController.updateBooking)
  .delete(bookingsController.deleteBooking);

export default router;
