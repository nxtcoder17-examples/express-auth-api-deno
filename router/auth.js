import { Router } from "express";
import { userDB } from "../domain/user.js";
import { sessionDB } from "../domain/session.js";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const user = await userDB.createUser(req.body);
  res.send(user);
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userDB.loginUser(email, password);

  const session = await sessionDB.createSession(user._id);
  res.cookie("session", session._id, { maxAge: 900000, httpOnly: true });
  res.json({ "msg": "Successfully Logged In" });
});

authRouter.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  const result = await userDB.changePassword(token, password);
  res.send(result);
});

authRouter.post("/request-reset-password", async (req, res) => {
  const { email } = req.body;
  const data = await userDB.requestResetPassword(email);
  res.send(data);
});

export const isLoggedIn = async (req, res, next) => {
  const { session: sessionID } = req.cookies;
  const session = await sessionDB.findSession(sessionID);
  req.sessionID = session._id;
  req.userID = session.user_id;
  next();
};

authRouter.delete("/logout", isLoggedIn, async (req, res) => {
  await sessionDB.deleteSession(req.sessionID);
  res.clearCookie("session");
  res.json({ "msg": "Successfully Logged Out" });
});

authRouter.get("/me", isLoggedIn, async (req, res) => {
  const user = await userDB.findUserByID(req.userID);
  res.send(user);
});
