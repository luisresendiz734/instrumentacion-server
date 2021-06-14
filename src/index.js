const express = require("express");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// settings
app.set("port", process.env.PORT || 4000);

// middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use(require("./routes/index"));

// static files
app.use(express.static(path.join(__dirname, "public")));

// listen
app.listen(app.get("port"), () =>
  console.log("http://localhost:" + app.get("port"))
);
