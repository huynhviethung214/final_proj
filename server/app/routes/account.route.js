const express = require("express");
const account = require("../controllers/account.controller");

const router = express.Router();

router.route('/')
    .get(account.findAll)
    .post(account.create);

router.route('/login')
    .post(account.login);

router.route('/:id')
    .delete(account.delete)
    .put(account.update)
    .get(account.findById);

router.route('/name/:name')
    .get(account.findByName);

module.exports = router;
