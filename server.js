import app from "./src/config/app.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import AuthRouter from "./src/routes/auth.route.js";
import MeRouter from "./src/routes/me.route.js";
dotenv.config();

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", AuthRouter);

app.use("/api/user", MeRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
