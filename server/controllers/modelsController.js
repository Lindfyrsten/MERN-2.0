import Booking from "../models/Booking.js";
import Model from "../models/Model.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

// @desc    Get all models
// @route   GET /users
// @access  Private/Admin
const getAllModels = asyncHandler(async (req, res) => {
  const models = await Model.find().lean();
  if (!models?.length) {
    return res.status(400).json({ message: "No models found" });
  }
  res.json(models);
});

// @desc    Create new model
// @route   POST /users
// @access  Private/Admin
const createNewModel = asyncHandler(async (req, res) => {
  const { name, price, bookings } = req.body;

  // confirm data
  if (!name || typeof price !== "number") {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Model.findOne({ name }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Model already exists" });
  }

  const modelObject = { name, price, bookings };

  const model = await Model.create(modelObject);
  if (model) {
    res.status(201).json({ message: `New model ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid model data received" });
  }
});

// @desc    Update a model
// @route   PATCH /users
// @access  Private/Admin
const updateModel = asyncHandler(async (req, res) => {
  const { id, name, price } = req.body;
  if (!id || !name || typeof price !== "number") {
    return res.status(400).json({ message: "All fields are required" });
  }

  const model = await Model.findById(id).exec();
  if (!model) {
    return res.status(400).json({ message: "Model not found" });
  }

  // check for duplicate
  const duplicate = await Model.findOne({ name }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate model name" });
  }

  model.name = name;
  model.price = price;

  const updatedModel = await model.save();
  res.json({ message: `${updatedModel.name} updated` });
});

// @desc    Delete a model
// @route   DELETE /users
// @access  Private/Admin
const deleteModel = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Model ID required" });
  }
  const booking = await Booking.findOne({ models: id }).lean().exec();
  if (booking) {
    return res.status(400).json({ message: "Model has bookings" });
  }

  const model = await Model.findById(id).exec();
  if (!model) {
    return res.status(400).json({ message: "Model not found" });
  }
  const deletedModel = await model.deleteOne();
  const reply = `Model ${deletedModel.name} deleted`;
  res.json(reply);
});

export default { getAllModels, createNewModel, updateModel, deleteModel };
