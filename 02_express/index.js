import express from "express";

const app = express();

const PORT = 3000;
app.use(express.json());

let teaData = [];
let nextId = 1;

// Create a new tea
app.post("/teas", (req, res) => {
  const { name, price } = req.body;

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
  res.status(204).send("Deleted");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
