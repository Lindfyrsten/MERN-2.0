import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Model from "../models/Model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

// @desc    Get all bookings
// @route   GET /bookings
// @access  Private/Admin/Model
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().lean();
  if (!bookings?.length) {
    return res.status(400).json({ message: "No bookings found" });
  }
  res.json(bookings);
});

// @desc    Create new booking
// @route   POST /bookings
// @access  Private/Admin/Model
const createNewBooking = asyncHandler(async (req, res) => {
  const { user, models, totalprice, text } = req.body;

  // confirm data
  if (
    !user ||
    !Array.isArray(models) ||
    !models.length ||
    !text ||
    typeof totalprice !== "number"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // look for user
  const userFound = await User.findById(user).lean().exec();
  if (!userFound) {
    return res.status(400).json({ message: "User not found" });
  }

  // look for models
  const modelsFound = await Model.find({ _id: { $in: models } })
    .lean()
    .exec();
  if (!modelsFound?.length) {
    return res.status(400).json({ message: "Models not found" });
  }

  const bookingObject = { user, models, totalprice, text };

  // create and store new booking
  const booking = await Booking.create(bookingObject);
  if (booking) {
    res.status(201).json({ message: "New booking created" });
  } else {
    res.status(400).json({ message: "Invalid booking data received" });
  }
});

// @desc    Update a booking
// @route   PATCH /bookings
// @access  Private/Admin/Model
const updateBooking = asyncHandler(async (req, res) => {
  const { id, user, models, totalprice, text } = req.body;
  if (
    !id ||
    !user ||
    !Array.isArray(models) ||
    !models.length ||
    !text ||
    typeof totalprice !== "number"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const booking = await Booking.findById(id).exec();
  if (!booking) {
    return res.status(400).json({ message: "Booking not found" });
  }

  booking.user = user;
  booking.models = models;
  booking.text = text;
  booking.totalprice = totalprice;

  const updatedBooking = await booking.save();
  if (updatedBooking) {
    res.status(200).json({ message: "Booking updated" });
  } else {
    res.status(400).json({ message: "Invalid booking data received" });
  }
});

// @desc    Delete a booking
// @route   DELETE /bookings
// @access  Private/Admin/Model
const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Booking ID required" });
  }
  const booking = await Booking.findById(id).exec();
  if (!booking) {
    return res.status(400).json({ message: "Booking not found" });
  }
  const deletedBooking = await booking.deleteOne();
  const reply = `Booking ${deletedBooking._id} deleted`;
  res.json(reply);
});

export default {
  getAllBookings,
  createNewBooking,
  updateBooking,
  deleteBooking,
};
