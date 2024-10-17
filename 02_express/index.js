import express from "express";
import "dotenv/config";
import morgan from "morgan";
import logger from "./logger.js";

// create a new instance of express called app
const app = express();

// Set up logging middleware
const morganFormat = ":method :url :status :response-time ms";

// set up port number
const PORT = process.env.PORT ?? 3000;

// use json format to parse response headers
app.use(express.json());

// create a middleware for morgan
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// empty array to store tea data
let teaData = [];

// create a id for the tea data
let nextId = 1;

// Create a new tea
app.post("/teas", (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    logger.warn("Missing name or price in the request body");
    return res.status(400).send("Name and price are required");
  }

  const newTea = {
    id: nextId++,
    name,
    price,
  };

  teaData.push(newTea);
  res.status(201).send(newTea);
});

// get all teas
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

// get tea by id
app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));

  if (!tea) {
    return res.status(404).send("Tea not found");
  }

  res.status(200).send(tea);
});

// update tea by id
app.put("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));

  if (!tea) {
    return res.status(404).send("Tea not found");
  }

  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;

  res.status(200).send("Updated");
});

// delete tea by id
app.delete("/teas/:id", (req, res) => {
  const teaIndex = teaData.findIndex((t) => t.id === parseInt(req.params.id));

  if (teaIndex === -1) {
    return res.status(404).send("Tea not found");
  }

  teaData.splice(teaIndex, 1);
  res.status(200).send("Deleted");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
