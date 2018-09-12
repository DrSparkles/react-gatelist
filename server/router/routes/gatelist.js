const express = require('express');
const router = express.Router();
import gatelistModule from '../../modules/gatelist';
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
    gatelistModule.createNew(userId, body, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  /**
   * Get user's gatelists
   */
  .get((req, res) => {
    gatelistModule.getUsersGatelists(req.decoded._id, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

router.route('/week/:week')
  /**
   * Get the entire gatelist for a given week
   */
  .get((req, res) => {
    const week = req.params.week;
    gatelistModule.getGatelistByWeek(week, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

router.route('/user/:_id')
  /**
   * Get user's gatelists
   */
  .get((req, res) => {
    gatelistModule.getUsersGatelists(req.decoded._id, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

router.route('/group/:_id')
  /**
   * Get group's gatelists
   */
  .get((req, res) => {
    const groupId = req.params._id;
    gatelistModule.getGroupsGatelists(groupId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

router.route('/group/:_id/week/:number')
/**
 * Get group's gatelists
 */
  .get((req, res) => {
    const groupId = req.params._id;
    const weekNum = req.params.number;
    gatelistModule.getGroupsGatelistsByWeek(groupId, weekNum, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

router.route('/:_id')
/**
 * Get by gatelist id
 */
  .get((req, res) => {
    const gatelistId = req.params._id;
    gatelistModule.getGatelistByKeyValue('gatelistId', gatelistId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  /**
   * Delete by gatelist id
   */
  .delete((req, res) => {
    const gatelistId = req.params._id;
    gatelistModule.deleteGatelist(gatelistId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  /**
   * Edit by gatelist id
   */
  .put((req, res) => {
    const gatelistId = req.params._id;
    const body = req.body;
    gatelistModule.updateGatelist(gatelistId, body, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

  /*
  const { body } = req;
    const userId = req.decoded._id;
    gatelistModule.createNew(userId, body, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
   */

//module.exports = router;
export { router };