import { USERS } from './db.js';

export const authorizationMiddleware = (req, res, next) => {
 const { headers } = req;

 const token = headers.authorization;

 if (!token) {
  return res.status(401).send({ message: "token was not found" });
 }

 const user = USERS.find(el => el.token === token);
 if (!user) {
  return res.status(400).send({ message: `User was not found by token: ${token}` });
 }

 req.user = user;

 next();
};