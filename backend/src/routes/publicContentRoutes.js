const express = require("express");
const router = express.Router();

const {
  getPublicContent,
  updatePublicContent,
} = require("../controllers/publicContentController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", getPublicContent);

router.put("/", authMiddleware, roleMiddleware("ADMIN"), updatePublicContent);

module.exports = router;
