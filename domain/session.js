import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
});

const sessionModel = mongoose.model("sessions", sessionSchema);

const createSession = async (userID) => {
  return sessionModel.create({ user_id: userID });
};

const findSession = async (sessionID) => {
  return sessionModel.findById(sessionID);
};

const deleteSession = async (sessionID) => {
  return sessionModel.deleteOne({ _id: sessionID });
};

export const sessionDB = {
  createSession,
  deleteSession,
  findSession,
};
