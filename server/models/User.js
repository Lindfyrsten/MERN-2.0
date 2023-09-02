import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roles: [{ type: String, default: "Booker" }],
  active: { type: Boolean, default: true },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
});

const User = mongoose.model("User", UserSchema);

export default User;
