const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validation");
const user = require("../models/user");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      username,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    const check = await user.findOne({ email });
    if (check) {
      return res.status(400).json({
        message:
          "The email address already exists, try with a different email address",
      });
    }

    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        message: "Firstname must be be between 3 and 30 characters",
      });
    }

    if (!validateLength(last_name, 3, 30)) {
      return res.status(400).json({
        message: "Lastname must be be between 3 and 30 characters",
      });
    }

    if (!validateLength(password, 6, 30)) {
      return res.status(400).json({
        message: "Password must be be between 6 and 30 characters",
      });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);

    let tempUsername = first_name + last_name;
    let newUsername = await validateUsername(tempUsername);
    return;
    const user = await new user({
      first_name,
      last_name,
      email,
      password: cryptedPassword,
      username: newUsername,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();
    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "30m"
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
