const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function dishExists(req, res, next) {
  const { dishId } = req.params;

  const dish = dishes.find((dish) => dish.id === dishId);

  if (!dish) {
    return res.status(404).json({
      error: `Dish cannot be found: ${dishId}`,
    });
  }

  res.locals.dish = dish;

  next();
}

function list(req, res) {
  res.json({ data: dishes });
}

function read(req, res) {
  res.json({ data: res.locals.dish });
}

function create(req, res) {
  const { data = {} } = req.body;
  
  if (!data.name) {
    return res.status(400).json({
      error: "Dish must include a name",
    });
  }
  
  if (!data.description) {
    return res.status(400).json({
      error: "Dish must include a description",
    });
  }
  if (!data.image_url) {
    return res.status(400).json({
      error: "Dish must include a image_url",
    });
  }
  
  if (data.price === undefined || data.price <= 0) {
    return res.status(400).json({
      error: "Dish must include a price greater than zero",
    });
  }
  const newDish = {
    id: nextId(),
    ...req.body.data,
  };

  dishes.push(newDish);

  res.status(201).json({ data: newDish });
}

function update(req, res){
  const { dishId } = req.params;
  const { data = {} } = req.body;
  
  const index = dishes.findIndex((dish) => dish.id === res.locals.dish.id);
  
  // Check if supplied ID matches route ID
  if (data.id && data.id !== dishId) {
    return res.status(400).json({
      error: `Dish id ${data.id} does not match routh id ${dishId}`,
    });
  }
  
  if (!data.name) {
    return res.status(400).json({
      error: "Dish must have a name",
    });
  }
  
  if (!data.description) {
    return res.status(400).json({
      error: "Dish must include a description",
    });
  }
  if (!data.image_url) {
    return res.status(400).json({
      error: "Dish must include a image_url",
    });
  }
  
  if (typeof data.price !== "number" || data.price === undefined || data.price <= 0) {
    return res.status(400).json({
      error: "Dish must include a price greater than zero",
    });
  }

  const updatedDish = {
    ...data,
    id: dishId,
  };
  
  dishes[index] = updatedDish;
  
  return res.json({ data: updatedDish });
}

function destroy(req, res) {

  const index = dishes.findIndex((dish) => dish.id === res.locals.dish.id);

  dishes.splice(index, 1);

  res.sendStatus(204);
}

module.exports = {
  list,
  read: [dishExists, read],
  create,
  update: [dishExists, update],
  delete: [dishExists, destroy]
}
