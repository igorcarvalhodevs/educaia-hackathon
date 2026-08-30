const express = require("express");

const planningController = require(
  "./planning.controller"
);

const requireAuth = require(
  "../../middlewares/requireAuth"
);

const router = express.Router();

router.use(requireAuth);

router.post(
  "/generate",
  planningController.generate
);

router.post(
  "/",
  planningController.create
);

router.get(
  "/",
  planningController.list
);

router.get(
  "/:id",
  planningController.getById
);

router.put(
  "/:id",
  planningController.update
);

router.delete(
  "/:id",
  planningController.remove
);

module.exports = router;