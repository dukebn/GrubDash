const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

/* ---------- Middleware ---------- */

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

// Reads req.body.data once so later functions only use res.locals
function hasData(req, res, next) {
  const { data } = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Request body must contain data" });
  }

  res.locals.data = data;
  next();
}

// Shared by create and update
function hasValidFields(req, res, next) {
  const { name, description, image_url, price } = res.locals.data;

  if (!name) {
    return res.status(400).json({ error: "Dish must include a name" });
  }

  if (!description) {
    return res.status(400).json({ error: "Dish must include a description" });
  }

  if (!image_url) {
    return res.status(400).json({ error: "Dish must include a image_url" });
  }

  if (typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      error: "Dish must include a price greater than zero",
    });
  }

  next();
}

// Only needed for update
function idMatchesRoute(req, res, next) {
  const { id } = res.locals.data;
  const { dish } = res.locals;

  if (id && id !== dish.id) {
    return res.status(400).json({
      error: `Dish id ${id} does not match route id ${dish.id}`,
    });
  }

  next();
}

/* ---------- Route handlers ---------- */

// GET /dishes
function list(req, res) {
  res.json({ data: dishes });
}

// GET /dishes/:dishId
function read(req, res) {
  res.json({ data: res.locals.dish });
}

// POST /dishes
function create(req, res) {
  const { data } = res.locals;

  const newDish = {
    ...data,
    id: nextId(),
  };

  dishes.push(newDish);

  res.status(201).json({ data: newDish });
}

// PUT /dishes/:dishId
function update(req, res) {
  const { dish, data } = res.locals;

  const index = dishes.findIndex((d) => d.id === dish.id);

  dishes[index] = { ...data, id: dish.id };

  res.json({ data: dishes[index] });
}

module.exports = {
  list,
  read: [dishExists, read],
  create: [hasData, hasValidFields, create],
  update: [dishExists, hasData, idMatchesRoute, hasValidFields, update],
};