const express = require("express");
const ticket = require("../controllers/ticket.controller");

const router = express.Router();

router.route('/')
    .get(ticket.findAll)
    .post(ticket.create);

router.route('/reader/:readerId')
    .get(ticket.findByReaderId);

router.route('/:id')
    .put(ticket.update)
    .delete(ticket.delete)
    .get(ticket.findById);

module.exports = router;
