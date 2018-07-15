import tasksModule from "../../modules/tasks";

const express = require('express');
const router = express.Router();
import taskListsModule from '../../modules/tasklist';
import authMiddleware from '../../lib/tokenAuth.middleware';
import { errorHandler } from "../../lib/db";

/**
 * APPLY AUTH MIDDLEWARE; ALL FOLLOWING ROUTES ARE PROTECTED
 */
router.use(authMiddleware);

router.route('/')
  .post((req, res) => {
    const { body } = req;
    const userId = req.decoded._id;
    taskListsModule.createNew(userId, body, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  .get((req, res) => {
    taskListsModule.getUsersLists(req.decoded._id, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

router.route('/:_id')
  .get((req, res) => {
    const listId = req.params._id;
    taskListsModule.getList(listId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  .delete((req, res) => {
    const listId = req.params._id;
    taskListsModule.deleteList(listId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  .put((req, res) => {
    const { _id }  = req.params;
    const update = req.body;
    taskListsModule.updateList(_id, req.decoded._id, update, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

module.exports = router;