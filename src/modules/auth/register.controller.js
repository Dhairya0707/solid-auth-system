import userModel from "../../model/user.model.js";
import bcrypt from "bcrypt";

async function registerController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailexits = await userModel.findOne({ email });

    if (emailexits) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    await userModel.create({ name, email, password: hashpassword });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default registerController;
