const express = require("express");
const publisher = require("../controllers/publisher.controller");

const router = express.Router();

router.route('/')
    .get(publisher.findAll)
    .post(publisher.create);

router.route('/:id')
    .put(publisher.update)
    .delete(publisher.delete)
    .get(publisher.findById);

router.route('/name/:name')
    .get(publisher.findByName);

router.route('/id/:id')
    .get(publisher.findByPublisherId);

module.exports = router;
