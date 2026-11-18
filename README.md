# GrubDash Backend Project - Development Reflection

## 1. Justification of Design Decisions

The GrubDash application is structured using in a way to keep the project organized, maintainable, and easy to understand.

The application is separated into controllers, routers, data files, and error-handling middleware. This allowed each component to have a specific responsibility rather than placing all application logic in one file.

Some of my key design decisions included:

- **Controllers:** I implemented separate controllers for dishes and orders. These handle the application logic for creating, retrieving, updating, and deleting records.
- **Routers:** I used Express Router to organize API endpoints and connect HTTP methods to their corresponding controller functions.
- **Data separation:** I kept dishes and orders in separate data files so that the application logic would not be tightly coupled to the stored data.
- **Unique identifiers:** I used a reusable `nextId()` utility that generates unique identifiers using Node.js's built-in crypto module.
- **Centralized error handling:** I implemented separate middleware for handling missing routes, unsupported HTTP methods, and application errors.
- **Consistent responses:** I used JSON responses with a `data` property for successful requests and an `error` property for unsuccessful requests.

These decisions helped create a backend structure that is easier to maintain, test, and expand.

## 2. Explanation of My Debugging Approach and Reasoning

My debugging approach involved identifying the expected behavior of each endpoint, comparing it with the actual application behavior, and correcting the implementation based on the results.

I used the provided test files to verify the API endpoints.

My general debugging process was:

1. Review the test requirements to understand what each endpoint was expected to do.
2. Examine the relevant controller and router to identify missing or incorrect functionality.
3. Implement the necessary logic.
4. Run the tests to identify failing scenarios.
5. Read the error messages and assertions to understand what was failing.
6. Modify the implementation and run the tests again.

For example, when implementing order creation, I needed to ensure that an order could not be created without a delivery address, mobile number, or valid list of dishes.

I added validation checks to the controller and used HTTP 400 responses when required information was missing or invalid.

Another example involved updating orders. I implemented checks to ensure that the order status was one of the supported values: `pending`, `preparing`, `out-for-delivery`, or `delivered`.

I also used the test results to identify edge cases involving missing properties, empty values, incorrect data types, and invalid order quantities.

## 3. How My Solution Handles Errors and Edge Cases

I implemented validation and error handling to prevent invalid requests from being processed.

### Dish endpoints

The dish controller handles several situations:

- Returns HTTP 404 when a requested dish cannot be found.
- Returns HTTP 400 when a dish is missing its name, description, image URL, or a valid positive price.
- Prevents updates when the supplied dish ID conflicts with the ID in the URL.
- Returns HTTP 201 when a dish is successfully created.
- Returns HTTP 200 when a dish is successfully retrieved or updated.

### Order endpoints

The order controller includes additional validation because orders contain multiple pieces of information.

It handles:

- Missing or empty delivery addresses.
- Missing or empty mobile numbers.
- Missing, empty, or incorrectly structured dish arrays.
- Missing, zero, negative, or non-integer dish quantities.
- Missing or invalid order statuses.
- Attempts to retrieve or update nonexistent orders.
- Attempts to update an order using an ID that conflicts with the route ID.
- Attempts to delete orders that are not pending.

For example, an order can only be deleted when its current status is `pending`. If an order is already being prepared, out for delivery, or delivered, the API returns HTTP 400 rather than allowing the deletion.

### Centralized error handling

I also implemented reusable middleware:

- `notFound.js` handles requests to routes that do not exist.
- `methodNotAllowed.js` handles unsupported HTTP methods.
- `errorHandler.js` provides a consistent JSON error response.

This approach keeps error handling consistent throughout the application.

## 4. Development Process Log and Key Milestones

The following log summarizes the major implementation stages. It represents the development workflow rather than a timestamped Git history.

**Milestone 1 – Project structure and setup**

- Reviewed the existing GrubDash project structure.
- Examined the provided data files and test requirements.
- Identified the responsibilities of the controllers, routers, and middleware.

**Milestone 2 – Dish API implementation**

- Implemented dish listing and retrieval.
- Added functionality for creating dishes.
- Implemented validation for required dish properties.
- Added dish update functionality and identifier validation.

**Milestone 3 – Order API implementation**

- Implemented order listing and retrieval.
- Added order creation with required-field validation.
- Implemented quantity validation for individual dishes.
- Added order update functionality.
- Implemented supported order-status validation.
- Added restrictions preventing deletion of orders that are not pending.

**Milestone 4 – Routing and error handling**

- Connected controller functions to their respective routes.
- Implemented unsupported-method handling.
- Connected centralized error-handling middleware to the Express application.

**Milestone 5 – Testing and debugging**

- Used Jest and Supertest to test API behavior.
- Reviewed failed assertions and error messages.
- Corrected validation and response-handling logic based on test requirements.
- Reviewed edge cases involving invalid data and nonexistent records.

**Milestone 6 – Final review**

- Reviewed the application structure.
- Checked the relationship between routes and controllers.
- Reviewed error responses and validation behavior.
- Identified remaining implementation issues for further correction.

## 5. Evidence of My Individual and Original Contributions

My individual contributions are demonstrated through the implementation of application logic and the organization of the backend functionality.

Specific examples include:

**Dish controller – `src/dishes/dishes.controller.js`**

- Implemented the `list()` function to retrieve all dishes.
- Implemented the `read()` function to retrieve a specific dish.
- Implemented `create()` with required-field and price validation.
- Implemented `update()` with identifier and property validation.

**Order controller – `src/orders/orders.controller.js`**

- Implemented order retrieval and listing.
- Added validation for delivery information.
- Added validation for dish arrays and quantities.
- Implemented supported order-status validation.
- Added restrictions on deleting orders that are not pending.

**Routing – `src/orders/orders.router.js` and `src/dishes/dishes.router.js`**

- Connected HTTP methods to their respective controller functions.
- Organized endpoints using Express Router.
- Integrated method-not-allowed middleware.

**Utility and error-handling components**

- Used the reusable `nextId()` utility for generating identifiers.
- Integrated centralized error-handling middleware.
- Used consistent JSON response structures.

These implementations demonstrate my understanding of Express routing, request handling, validation, middleware, JavaScript functions, and REST API design.

## 6. Disclosure of AI Tools Used

AI assistance was used as a supplementary learning and development resource.

I used ChatGPT to help explain programming concepts, interpret test failures, discuss debugging strategies, and review implementation decisions.

AI assistance was used to support my understanding of the code rather than replace the need to understand how the application works.

I reviewed the implementation and used the project requirements and test results to evaluate the application's behavior.

I take responsibility for understanding, explaining, and verifying the submitted implementation.

## 7. Authenticity and Understanding of My Implementation

I understand the purpose and functionality of my GrubDash application's main components.

I can explain how an incoming HTTP request reaches an Express router, how the router invokes a controller, how the controller validates the request, and how the application returns an appropriate response.

For example, when a client submits a POST request to `/orders`, the Express router directs the request to the order creation controller. The controller checks the required delivery information, verifies that the dishes array is valid, checks each dish quantity, generates a unique ID, and adds the new order to the existing data.

The application then returns HTTP 201 with the newly created order.

I also understand the importance of validating incoming data, handling errors consistently, and testing both successful and unsuccessful requests.

My goal throughout this project was not simply to make the tests pass, but to understand the reasoning behind the implementation and how the different components work together to create a functional backend API.
