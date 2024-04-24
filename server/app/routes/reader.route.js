const express = require("express");
const reader = require("../controllers/reader.controller");

const router = express.Router();

router.route('/')
    .get(reader.findAll)
    .post(reader.create);

router.route('/:id')
    .put(reader.update)
    .delete(reader.delete)
    .get(reader.findById);

router.route('/name/:name')
    .get(reader.findByName);

router.route('/account/:accountId')
    .get(reader.findByAccountId);

module.exports = router;
