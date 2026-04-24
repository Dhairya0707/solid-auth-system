import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      // type: String,
      // required: true,
      // unique: true,
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Automatically converts "User@Mail.com" to "user@mail.com"
      trim: true, // Removes accidental spaces at the start/end
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      min: [6, "Password must be at least 6 characters long"],
      max: [20, "Password must be at most 20 characters long"],
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
