const express = require("express");
const employee = require("../controllers/employee.controller");

const router = express.Router();

router.route('/')
    .get(employee.findAll)
    .post(employee.create);

router.route('/:id')
    .put(employee.update)
    .delete(employee.delete)
    .get(employee.findById);

router.route('/name/:name')
    .get(employee.findByName);

module.exports = router;
