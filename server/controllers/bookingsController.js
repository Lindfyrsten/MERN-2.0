import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Model from "../models/Model.js";
import asyncHandler from "express-async-handler";

// @desc    Get all bookings
// @route   GET /bookings
// @access  Private/Admin/Model
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find().lean();
  if (!bookings?.length) {
    return res.status(400).json({ message: "No bookings found" });
  }

  // Add username and model names to each booking before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop

  const bookingsWithUser = await Promise.all(
    bookings.map(async (booking) => {
      const user = await User.findById(booking.user).lean().exec();
      const models = await Model.find({ _id: { $in: booking.models } });
      const modelNames = models.map((model) => model.name);
      return { ...booking, username: user.username, modelnames: modelNames };
    })
  );
  res.json(bookingsWithUser);
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
  const userFound = await User.findById(user);
  if (!userFound) {
    return res.status(400).json({ message: "User not found" });
  }

  // look for models
  const modelsFound = await Model.find({ _id: { $in: models } }).exec();
  if (!modelsFound?.length) {
    return res.status(400).json({ message: "Models not found" });
  }

  const bookingObject = { user, models, totalprice, text };

  // create and store new booking
  const booking = await Booking.create(bookingObject);

  // add booking to user
  userFound.bookings.push(booking._id);
  await userFound.save();
  // add booking to models
  modelsFound.forEach(async (model) => {
    model.bookings.push(booking._id);
    await model.save();
  });
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
  const {
    id,
    user,
    modelsList: models,
    totalprice,
    text,
    completed,
  } = req.body;
  if (
    !id ||
    !user ||
    !Array.isArray(models) ||
    !models.length ||
    !text ||
    typeof totalprice !== "number" ||
    typeof completed !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const booking = await Booking.findById(id).exec();
  if (!booking) {
    return res.status(400).json({ message: "Booking not found" });
  }

  // TODO: if user or models are different, remove booking from old values and and them to the new

  booking.user = user;
  booking.models = models;
  booking.text = text;
  booking.totalprice = totalprice;
  booking.completed = completed;

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

  // remove booking from user
  const userFound = await User.findById(booking.user).exec();
  userFound.bookings = userFound.bookings.filter(
    (bookingId) => bookingId.toString() !== booking._id.toString()
  );
  await userFound.save();

  // remove booking from models
  const modelsFound = await Model.find({ _id: { $in: booking.models } });
  modelsFound.forEach(async (model) => {
    model.bookings = model.bookings.filter(
      (bookingId) => bookingId.toString() !== booking._id.toString()
    );
    await model.save();
  });
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
