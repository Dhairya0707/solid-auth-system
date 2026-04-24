import userModel from "../../model/user.model.js";

async function meController(req, res) {
  try {
    const userId = req.user.userId;

    const user = await userModel
      .findById(userId)
      .select("-password -refreshToken -__v -_id -updatedAt -createdAt");

    return res.status(200).json({
      message: "User fetched successfully",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export default meController;
