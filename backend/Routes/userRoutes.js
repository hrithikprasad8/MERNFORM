const express = require("express");
const router = express.Router();
const {
  registerData,
  updateData,
  deleteData,
  Uservalidation,
  loginValidation,
  PasswordStore,
} = require("../Controllers/userControllers");

router.post("/save", registerData);
router.put("/update", updateData);
router.delete("/delete", deleteData);
router.get("/login", Uservalidation);
router.post("/submitCredentials", loginValidation);
router.put("/createNewPassword", PasswordStore);

module.exports = router;
