import userModel from "../../model/user.model.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";

async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userexists = await userModel.findOne({ email }).select("+password");

    if (!userexists) {
      return res.status(401).json({ message: "User not found" });
    }

    const passwordmatch = await bcrypt.compare(password, userexists.password);

    if (!passwordmatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = generateAccessToken(userexists);
    const refreshToken = generateRefreshToken(userexists);

    userexists.refreshToken = refreshToken;
    await userexists.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({ accessToken }); // not refrehstoken here
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default loginController;
