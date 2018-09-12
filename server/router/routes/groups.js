const express = require('express');
const router = express.Router();
import groupsModule from '../../modules/groups';
import authMiddleware from '../../lib/tokenAuth.middleware';
import { errorHandler } from "../../lib/db";

/**
 * APPLY AUTH MIDDLEWARE; ALL FOLLOWING ROUTES ARE PROTECTED
 */
router.use(authMiddleware);

router.route('/')
  /**
   * Create New
   */
  .post((req, res) => {
    const { body } = req;
    const userId = req.decoded._id;
    groupsModule.createNew(userId, body, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  /**
   * Get user's groups
   */
  .get((req, res) => {
    groupsModule.getUsersGroups(req.decoded._id, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

/**
 * Get all groups
 */
router.route('/all')
  .get((req, res) => {
    groupsModule.getAllGroups((err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

router.route('/:_id')
  /**
   * Get by group id
   */
  .get((req, res) => {
    const groupId = req.params._id;
    groupsModule.getGroupByKeyValue('groupId', groupId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  /**
   * Delete by group id
   */
  .delete((req, res) => {
    const groupId = req.params._id;
    groupsModule.deleteGroup(groupId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  /**
   * Edit by group id
   */
  .put((req, res) => {
    const { _id }  = req.params;
    const update = req.body;
    groupsModule.updateGroup(_id, update, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

//module.exports = router;
export { router };