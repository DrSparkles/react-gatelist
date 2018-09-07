const express = require('express');
const router = express.Router();
import CoreSetup from '../../modules/coresetup';
import { errorHandler } from "../../lib/db";

router.route('/')
/**
 * Create New
 */
  .get((req, res) => {
    CoreSetup.createSuperUser((err, docs) => {
      if (err) return errorHandler(err, res);
      return res.json(docs);
    });
  });

module.exports = router;