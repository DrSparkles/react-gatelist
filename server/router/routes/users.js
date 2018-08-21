/**
 * User Routes
 * @type {*|exports|module.exports}
 */

const express = require('express');
const router = express.Router();
import usersModule from '../../modules/users';
import authMiddleware from '../../lib/tokenAuth.middleware';
import { errorHandler } from "../../lib/db";


/**
 * OPEN ROUTES
 */
router.route('/authenticate')
  .post((req, res) => {
    const { body } = req;
    usersModule.authenticate(body, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

router.route('/')
  .post((req, res) => {
    const { body } = req;
    usersModule.createNew(body, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });


/**
 * APPLY AUTH MIDDLEWARE; ALL FOLLOWING ROUTES ARE PROTECTED
 */
router.use(authMiddleware);

/**
 * Routes at /api/users
 */

/**
 * Get user account
 */
router.route('/user')
  .get((req, res) => {
    const userToken = req.get('x-access-token');
    usersModule.getUserByToken(userToken, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

/**
 * Get all users
 */
router.route('/all')
  .get((req, res) => {
    usersModule.getAll((err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

module.exports = router;