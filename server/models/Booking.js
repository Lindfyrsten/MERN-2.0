import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    models: [{ type: Schema.Types.ObjectId, ref: "Model", required: true }],
    totalprice: { type: Number, required: true },
    text: String,
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
