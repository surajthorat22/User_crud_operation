import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { body } from "express-validator";

const router = express.Router();

const validateUser = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isAlpha().withMessage("Name must contain only letters")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

  body("middlename")
    .optional()
    .trim()
    .isAlpha().withMessage("Middle name must contain only letters"),

  body("lastname")
    .trim()
    .notEmpty().withMessage("Last Name is required")
    .isAlpha().withMessage("Last Name must contain only letters"),

  body("phoneno")
    .matches(/^[6-9]\d{9}$/).withMessage("Phone number must be 10 digits starting with 6-9"),

  body("age")
    .isInt({ min: 1, max: 130 }).withMessage("Age must be between 1 and 130"),

  body("bloodgroup")
    .isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]).withMessage("Invalid blood group"),

  body("dob")
    .isISO8601().withMessage("DOB must be a valid date")
    .custom((dob) => {
      const age = new Date().getFullYear() - new Date(dob).getFullYear();
      if (age < 1) throw new Error("DOB must be at least 1 year ago");
      return true;
    }),

  // ✅ address must be an array with at least one element
  body("address")
    .isArray({ min: 1 }).withMessage("At least one address is required"),

  // ✅ each address object must have all three fields
  body("address.*.line1")
    .notEmpty().withMessage("line1 is required"),
  body("address.*.line2")
    .notEmpty().withMessage("line2 is required"),
  body("address.*.city")
    .notEmpty().withMessage("city is required"),
];

router
  .route("/")
  .post(validateUser, createUser)
  .get(getUsers);

router
  .route("/:id")
  .get(getUserById)
  .put(validateUser, updateUser)
  .delete(deleteUser);

export default router;
