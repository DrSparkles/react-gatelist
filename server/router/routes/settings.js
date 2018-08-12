const express = require('express');
const router = express.Router();
import settingsModule from '../../modules/settings';
import authMiddleware from '../../lib/tokenAuth.middleware';
import { errorHandler } from "../../lib/db";

/**
 * APPLY AUTH MIDDLEWARE; ALL FOLLOWING ROUTES ARE PROTECTED
 */
router.use(authMiddleware);

router.route('/')
  /**
   * Get site settings
   */
  .get((req, res) => {
    settingsModule.getSiteSettings((err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

router.route('/:_id')
/**
 * Get by setting id
 */
  .get((req, res) => {
    const settingId = req.params._id;
    settingsModule.getSettingByKeyValue('settingId', settingId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  /**
   * Delete by setting id
   */
  .delete((req, res) => {
    const settingId = req.params._id;
    settingsModule.deleteSetting(settingId, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  })
  /**
   * Edit by setting id
   */
  .put((req, res) => {
    const { _id }  = req.params;
    const update = req.body;
    settingsModule.updateSetting(_id, update, (err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

module.exports = router;