require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require('morgan');

require("./models/index");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const port = process.env.PORT || 7000;

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/auth", authRoutes);
app.use("/blog", blogRoutes);

app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.send("Hello from the server");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});