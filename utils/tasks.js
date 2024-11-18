import inquirer from "inquirer";
import { getDb, insertDb } from "./db.js";

export const registerTasks = async (tasks) => {
	const task = {
		id: Date.now(),
		completed: false,
		...tasks,
	};
	await insertDb(task, "tasks");
	return task;
};

export const listTask = async () => {
	const db = await getDb();
	return db.tasks;
};

export const registerPromptTasks = async () => {
	const data = await inquirer.prompt([
		{ type: "input", name: "title", message: "Titre de la tâche : " },
		{
			type: "list",
			name: "priority",
			message: "Priorité de la tâche : ",
			choices: ["A", "B", "C", "E"],
		},
		{
			type: "input",
			name: "dueDate",
			message: "Date limite (AAAA-MM-JJ) : ",
			default: null,
		},
	]);

	return data;
};
