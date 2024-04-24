const ApiError = require("../api-error");
const TicketService = require("../services/ticket.service");
const MongoDB = require("../utils/mongodb.utils");

exports.create = async (req, res, next) => {
    try {
        const service = new TicketService(MongoDB.client);
        const document = await service.create(req.body);
        return res.send(document);
    } catch(e) {
        return next(new ApiError(500, "An error occured while creating new ticket"));
    }
}

exports.update = async (req, res, next) => {
    try {
        const service = new TicketService(MongoDB.client);
        const document = await service.update(req.params.id, req.body);
        return res.send(document);
    } catch(e) {
        return next(new ApiError(500, "An error occured while creating new ticket"));
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const service = new TicketService(MongoDB.client);
        const document = await service.findAll();
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, error)
        );
    }
}

exports.findByReaderId = async (req, res, next) => {
    try {
        const service = new TicketService(MongoDB.client);
        const document = await service.findByReaderId(req.params.readerId);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Cannot find matching result for ticket with name = ${req.params.name}`
            )
        );
    }
}

exports.findById = async (req, res, next) => {
    try {
        const service = new TicketService(MongoDB.client);
        const document = await service.findById(req.params.id);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Cannot find matching result for ticket with id = ${req.params.id}`
            )
        );
    }
}

exports.delete = async (req, res, next) => {
    try {
        const service = new TicketService(MongoDB.client);
        const document = await service.delete(req.params.id);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete ticket with id = ${req.params.id}`
            )
        );
    }
}
