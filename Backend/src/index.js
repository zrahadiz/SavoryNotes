const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const postRoutes = require("./routes/post.routes");
const aiRoutes = require("./routes/ai.routes");

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World 222!");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
