const express = require("express");
const { getHealth } = require("../controllers/healthController");
const { handleChat } = require("../controllers/chatController");

const router = express.Router();

router.get("/health", getHealth);
router.post("/chat", handleChat);

module.exports = router;
