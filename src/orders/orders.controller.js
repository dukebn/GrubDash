const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

function orderExists(req, res, next) {
  const { orderId } = req.params;

  const order = order.find((order) => order.id === orderId);

  if (!order) {
    return res.status(404).json({
      error: `Order cannot be found: ${orderId}`,
    });
  }

  res.locals.order = order;
  next();
}

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
  const { data = {} } = req.body;
  const { deliverTo, mobileNumber, dishes } = data;

  if (!deliverTo || !deliverTo.trim()) {
    return res.status(400).json({
      error: "deliverTo is required",
    });
  }

  if (!mobileNumber || !mobileNumber.trim()) {
    return res.status(400).json({
      error: "mobileNumber is required",
    });
  }

  if (!Array.isArray(dishes) || dishes.length === 0) {
    return res.status(400).json({
      error: "Order must contain at least one dish",
    });
  }

  for (let i = 0; i < dishes.length; i++) {
    const dish = dishes[i];

    if (
      !Number.isInteger(dish.quantity) ||
      dish.quantity <= 0
    ) {
      return res.status(400).json({
        error: `Dish at index ${i} must have a valid quantity`,
      });
    }
  }

  const newOrder = {
    id: nextId(),
    ...data,
  };

  orders.push(newOrder);

  res.status(201).json({ data: newOrder });
}


// PUT /orders/:orderId
function update(request, response) {
  const { orderId } = request.params;
  const { data = {} } = request.body;
  
  if (!data.deliverTo || !data.deliverTo.trim()) {
    return response.status(400).json({
      error: "deliverTo is required",
    });
  }
  
  if (!data.mobileNumber || !data.mobileNumber.trim()) {
    return response.status(400).json({
      error: "mobileNumber is required",
    });
  }
  
  if (!Array.isArray(data.dishes) || data.dishes.length === 0) {
    return response.status(400).json({
      error: "Order must contain at least one dish",
    });
}
  
  for (let i = 0; i < data.dishes.length; i++) {
  const dish = data.dishes[i];

  if (!Number.isInteger(dish.quantity) || dish.quantity <= 0) {
    return response.status(400).json({
      error: `Dish at index ${i} must have a valid quantity`,
    });
  }
}
  
  if (!data.status || !data.status.trim()) {
  return response.status(400).json({
    error: "status is required",
  });
}

  const index = orders.findIndex((order) => order.id === res.locals.order.id);

  if (index === -1) {
    return response.status(404).json({
      error: `Order ${orderId} cannot be found.`,
    });
  }

  if (data.id && data.id !== orderId) {
    return response.status(400).json({
      error: `Order id does not match route id: ${data.id}`,
    });
  }
  
  const validStatuses = [
  "pending",
  "preparing",
  "out-for-delivery",
  "delivered",
];
  if (!validStatuses.includes(data.status)) {
    return response.status(400).json({
      error: `Invalid status: ${data.status}`,
    });
}

  const updatedOrder = {
    ...orders[index],
    ...data,
    id: orderId,
  };

  orders[index] = updatedOrder;

  return response.json({ data: updatedOrder });
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

// DELETE /orders/:orderId
function destroy(req, res) {
  const { orderId } = req.params;

  const index = orders.findIndex((order) => order.id === res.locals.order.id);

  orders.splice(index, 1);

  res.sendStatus(204);
}

module.exports = {
  list,
  read: [orderExists, read],
  create,
  update: [orderExists, update],
  delete: [orderExists, isPending, destroy],
};

