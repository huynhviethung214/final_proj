const ApiError = require("../api-error");
const ReaderService = require("../services/reader.service");
const MongoDB = require("../utils/mongodb.utils");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name cannot be empty"));
    }

    try {
        const service = new ReaderService(MongoDB.client);
        const document = await service.create(req.body);
        return res.send(document);
    } catch(e) {
        return next(new ApiError(500, "An error occured while creating new reader"));
    }
}

exports.delete = async (req, res, next) => {
    try {
        const service = new ReaderService(MongoDB.client);
        await service.delete(req.params.id);
        return res.send({ message: "Reader has been removed successfully"});

    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete book with id = ${req.params.id}`
            )
        );
    }
}

exports.update = async (req, res, next) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const document = await service.update(req.params.id, req.body);
        return res.send(document);
    } catch(e) {
        return next(new ApiError(500, "An error occured while creating new reader"));
    }
}

exports.findAll = async (req, res, next) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const document = await service.findAll();
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, error)
        );
    }
}

exports.findByName = async (req, res, next) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const document = await service.findByName(req.params.name);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Cannot find matching result for reader with name = ${req.params.name}`
            )
        );
    }
}

exports.findById = async (req, res, next) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const document = await service.findById(req.params.id);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Cannot find matching result for reader with id = ${req.params.id}`
            )
        );
    }
}

exports.findByAccountId = async (req, res, next) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const document = await service.findByAccountId(req.params.accountId);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Cannot find matching result for account with id = ${req.params.id}`
            )
        );
    }
}
