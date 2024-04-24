const ApiError = require("../api-error");
const AccountService = require("../services/account.service");
const MongoDB = require("../utils/mongodb.utils");

exports.login = async (req, res, next) => {
	try {
		const service = new AccountService(MongoDB.client);
		const document = await service.login(req.body);
		return res.send(document);
	} catch(e) {
		return next(new ApiError(500, "Failed To Login"));
	}
}

exports.create = async (req, res, next) => {
	if (!req.body?.username) {
		return next(new ApiError(400, "Name cannot be empty"));
	}

	try {
		const service = new AccountService(MongoDB.client);
		const document = await service.create(req.body);
		return res.send(document);
	} catch(e) {
		return next(new ApiError(500, "An error occured while creating new account"));
	}
}

exports.update = async (req, res, next) => {
	try {
		const service = new AccountService(MongoDB.client);
		const document = await service.update(req.params.id, req.body);
		return res.send(document);
	} catch(e) {
		return next(new ApiError(500, "An error occured while creating new account"));
	}
}

exports.findAll = async (req, res, next) => {
	try {
		const service = new AccountService(MongoDB.client);
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
		const service = new AccountService(MongoDB.client);
		const document = await service.findByName(req.params.name);
		return res.send(document);
	} catch (error) {
		return next(
			new ApiError(
				500,
				`Cannot find matching result for account with name = ${req.params.name}`
			)
		);
	}
}

exports.findById = async (req, res, next) => {
	try {
		const service = new AccountService(MongoDB.client);
		const document = await service.findById(req.params.id);
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

exports.delete = async (req, res, next) => {
	try {
		const service = new AccountService(MongoDB.client);
		await service.delete(req.params.id);
		return res.send({ message: "Account has been deleted successfully"});
	} catch (error) {
		return next(
			new ApiError(
				500,
				`Could not delete account with id = ${req.params.id}`
			)
		);
	}
}
