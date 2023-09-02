import mongoose from "mongoose";

const ModelSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  price: { type: Number, required: true },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
});

const Model = mongoose.model("Model", ModelSchema);

export default Model;
