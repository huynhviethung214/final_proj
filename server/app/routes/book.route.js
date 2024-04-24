const express = require("express");
const book = require("../controllers/book.controller");

const router = express.Router();

router.route('/')
    .get(book.findAll)
    .post(book.create);

router.route('/:id')
    .get(book.findById)
    .put(book.update)
    .delete(book.delete);

router.route('/name/:name')
    .get(book.findByName);

module.exports = router;
