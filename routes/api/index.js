const router = require("express").Router();
const userRoutes = require("./user-routes");
// const thoughtRoutes = require("./thought-routes");

// add prefix of `/api` to all of the api routes imported from the `api` directory
router.use("/user", userRoutes);
// router.use("/thought", thoughtRoutes);

module.exports = router;
