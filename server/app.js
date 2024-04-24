const express = require('express');
const cors = require('cors');
const ApiError = require('./app/api-error');

const bookRouter = require('./app/routes/book.route');
const pubRouter = require('./app/routes/publisher.route');
const empRouter = require('./app/routes/employee.route');
const readerRouter = require('./app/routes/reader.route');
const ticketRouter = require('./app/routes/ticket.route');
const accountRouter = require('./app/routes/account.route');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/book', bookRouter);
app.use('/api/pub', pubRouter);
app.use('/api/employee', empRouter);
app.use('/api/reader', readerRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/account', accountRouter);

app.get('/', (req, res) => {
    res.json({ message: "Welcome to contact book application." })
});

app.use((req, res, next) => {
    return next(new ApiError(404, 'Resource not found'));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    })
});

module.exports = app;
