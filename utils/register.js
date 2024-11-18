import inquirer from "inquirer";
import { getDb, insertDb } from "./db.js";

export const regsiterGuild = async (guild) => {
	const newGuild = {
		id: new Date(),
		tasks: [],
		...guild,
	};
	insertDb(newGuild, "guilds");
	return newGuild;
};

export const listGuilds = async () => {
	const db = await getDb();
	return db.guilds;
};

export const registerPrompt = async (info) => {
	const guild = await inquirer.prompt([
		{
			type: "input",
			name: "name",
			message: "Nom de la guilde",
			when: !info.name,
		},
		{
			type: "list",
			name: "rank",
			message: "Rang de la guilde",
			choices: ["A", "B", "C"],
			when: !info.rank,
		},
	]);

	if (info.name) guild.name = info.name;
	if (info.rank) guild.rank = info.rank;

	return guild;
};
