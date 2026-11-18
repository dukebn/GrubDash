const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assign IDs when necessary
const nextId = require("../utils/nextId");


// TODO: Implement the /orders handlers needed to make the tests pass

const VALID_STATUSES = ["pending", "preparing", "out-for-delivery", "delivered"];

/* ---------- Middleware ---------- */

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const order = orders.find((order) => order.id === orderId);

  if (!order) {
    return res.status(404).json({
      error: `Order cannot be found: ${orderId}`,
    });
  }

  res.locals.order = order;
  next();
}

// Pulls req.body.data once so later handlers never touch req.body directly
function hasData(req, res, next) {
  const { data } = req.body;

  if (!data || typeof data !== "object") {
    return res.status(400).json({ error: "Request body must contain data" });
  }

  res.locals.data = data;
  next();
}

function hasValidFields(req, res, next) {
  const { deliverTo, mobileNumber, dishes } = res.locals.data;

  if (typeof deliverTo !== "string" || !deliverTo.trim()) {
    return res.status(400).json({ error: "deliverTo is required" });
  }

  if (typeof mobileNumber !== "string" || !mobileNumber.trim()) {
    return res.status(400).json({ error: "mobileNumber is required" });
  }

  if (!Array.isArray(dishes) || dishes.length === 0) {
    return res.status(400).json({
      error: "Order must contain at least one dish",
    });
  }

  for (let i = 0; i < dishes.length; i++) {
    const { quantity } = dishes[i];

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        error: `Dish at index ${i} must have a valid quantity`,
      });
    }
  }

  next();
}

function hasValidStatus(req, res, next) {
  const { status } = res.locals.data;

  if (typeof status !== "string" || !status.trim()) {
    return res.status(400).json({ error: "status is required" });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status: ${status}` });
  }

  next();
}

function idMatchesRoute(req, res, next) {
  const { id } = res.locals.data;
  const { order } = res.locals;

  if (id && id !== order.id) {
    return res.status(400).json({
      error: `Order id does not match route id. Order: ${id}, Route: ${order.id}`,
    });
  }

  next();
}

function isPending(req, res, next) {
  const { order } = res.locals;

  if (order.status !== "pending") {
    return res.status(400).json({
      error: `Order cannot be deleted unless pending. Current status: ${order.status}`,
    });
  }

  next();
}

/* ---------- Route handlers ---------- */

// GET /orders
function list(req, res) {
  res.json({ data: orders });
}

// GET /orders/:orderId
function read(req, res) {
  res.json({ data: res.locals.order });
}

// POST /orders
function create(req, res) {
  const { data } = res.locals;

  const newOrder = {
    ...data,
    id: nextId(),
  };

  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

// PUT /orders/:orderId
function update(req, res) {
  const { order, data } = res.locals;
  const index = orders.findIndex((order) => order.id === res.locals.order.id);

  const updatedOrder = {
    ...order,
    ...data,
    id: order.id,
  };

  orders[index] = updatedOrder;
  res.json({ data: updatedOrder });
}

// DELETE /orders/:orderId
function destroy(req, res) {
  const { order } = res.locals;

  const index = orders.findIndex((order) => order.id === res.locals.order.id);
  orders.splice(index, 1);

  res.sendStatus(204);
}

module.exports = {
  list,
  read: [orderExists, read],
  create: [hasData, hasValidFields, create],
  update: [orderExists, hasData, hasValidFields, hasValidStatus, idMatchesRoute, update],
  delete: [orderExists, isPending, destroy],
};