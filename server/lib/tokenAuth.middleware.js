import jwt from "jsonwebtoken";
import {getResponseJSON} from "./db";
import authConfig from "../config/auth.config";

/**
 * Using token authentication, handle auth in Express route middleware
 * @param req
 * @param res
 * @param next
 * @returns {*|Request|undefined|void}
 */
export default function authMiddleware(req, res, next) {

  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, authConfig.secret, function(err, decoded) {
      if (err) {
        return res.json(getResponseJSON("Failed authentication", true));
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  }
  else {
    // bounce if no token
    return res.status(401).send(getResponseJSON("No token provided.", true));
  }
}