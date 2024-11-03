import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = mongoose.model("users", userSchema);

const passwordResetTokenModel = mongoose.model(
  "password_reset_tokens",
  new mongoose.Schema({
    user_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  }),
);

const findUserByEmail = async (email) => {
  return userModel.findOne({ email });
};

const findUserByID = async (userID) => {
  return userModel.findById(userID);
};

const hashPassword = async (pass) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(pass, 8, function (err, hash) {
      if (err) {
        return reject(err);
      }
      return resolve(hash);
    });
  });
};

const createUser = async ({ name, email, password }) => {
  const exUser = await findUserByEmail(email);
  if (exUser) {
    throw new Error("user already exists");
  }

  const hashedPassword = await hashPassword(password);

  return userModel.create({ name, email, password: hashedPassword });
};

const requestResetPassword = async (email) => {
  const exUser = await findUserByEmail(email);
  if (!exUser) {
    throw new Error("user does not exist");
  }

  const record = await passwordResetTokenModel.create({
    user_id: exUser._id,
    email: exUser.email,
  });

  return { "token": record._id };
};

const changePassword = async (token, password) => {
  const tokenRecord = await passwordResetTokenModel.findById(token);
  return userModel.findByIdAndUpdate(tokenRecord.user_id, {
    $set: {
      password: await hashPassword(password),
    },
  });
};

const loginUser = async (email, password) => {
  const exUser = await findUserByEmail(email);
  if (!exUser) {
    throw new Error("invalid credentials");
  }

  const passwordMatched = await bcrypt.compare(password, exUser.password);
  if (!passwordMatched) {
    throw new Error("invalid credentials");
  }

  return exUser;
};

export const userDB = {
  createUser,
  findUserByEmail,
  findUserByID,
  requestResetPassword,
  changePassword,
  loginUser,
};
