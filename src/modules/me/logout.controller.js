import userModel from "../../model/user.model.js";

async function logoutController(req, res) {
  try {
    const userId = req.user.userId;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $set: { refreshToken: null } },

      { returnDocument: "after" },
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.clearCookie("refreshToken");
    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default logoutController;
