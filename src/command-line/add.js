"use strict";

const colors = require("colors/safe");
const program = require("commander");
const fs = require("fs");
const Helper = require("../helper");

program
	.command("add <name>")
	.description("Add a new user")
	.action(function(name) {
		if (!fs.existsSync(Helper.USERS_PATH)) {
			log.error(`${Helper.USERS_PATH} does not exist.`);
			return;
		}

		prompt(name);
	});

function prompt(name, callback) {
	const ClientManager = require("../clientManager");

	var manager = new ClientManager();
	var users = manager.getUsers();

	if (users.indexOf(name) !== -1) {
		log.error(`User ${colors.bold(name)} already exists.`);
		return;
	}

	log.prompt({
		text: "Enter password:",
		silent: true
	}, function(err, password) {
		if (!password) {
			log.error("Password cannot be empty.");
			return;
		}

		if (err) {
			return;
		}

		log.prompt({
			text: "Save logs to disk?",
			default: "yes"
		}, function(err2, enableLog) {
			if (err2) {
				return;
			}

			add(
				manager,
				name,
				password,
				enableLog.charAt(0).toLowerCase() === "y"
			);

			if (callback) {
				callback();
			}
		});
	});
}

function add(manager, name, password, enableLog) {
	var hash = Helper.password.hash(password);
	manager.addUser(name, hash, enableLog);

	log.info(`User ${colors.bold(name)} created.`);
	log.info(`User file located at ${colors.green(Helper.getUserConfigPath(name))}.`);
}

module.exports.prompt = prompt;
