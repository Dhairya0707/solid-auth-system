import jwt from "jsonwebtoken";
import userModel from "../../model/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/token.js";

async function refreshController(req, res) {
  try {
    // const { refreshToken } = req.body;
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    let decode;
    try {
      decode = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Session expired, please login again",
      });
    }

    if (decode.type !== "refresh") {
      return res.status(400).json({
        message: "Invalid token type",
      });
    }

    const user = await userModel
      .findById(decode.userId)
      .select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        message: "Invalid session",
      });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      accessToken: newAccessToken,
      // refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default refreshController;
