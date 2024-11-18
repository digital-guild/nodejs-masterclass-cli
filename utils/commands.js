import chalk from "chalk";
import os from "node:os";
import { saveDb } from "./db.js";
import { listGuilds, registerPrompt, regsiterGuild } from "./register.js";
import { listTask, registerPromptTasks, registerTasks } from "./tasks.js";

export const executeCommand = (program) => {
	program
		.command("register")
		.description("Register a new guild")
		.option("-n, --name <name>", "Nom de la guilde")
		.option("-r, --rank <rank>", "rang de la guilde")
		.action(async function () {
			const { name, rank } = this.opts();

			const data = await registerPrompt({ name, rank });
			const newGuild = await regsiterGuild(data);
			console.log(
				chalk.green(`la guile ${newGuild.name} a été crée avec succès`),
			);
		});

	program
		.command("assign-tasks")
		.description("Assigner les tâches quotidiennes aux guildes")
		.action(async () => {
			const guilds = await listGuilds();
			const tasks = await listTask();

			tasks.forEach(async (task) => {
				if (task.completed) return;
				const guild = guilds.find((guild) => guild.rank === task.priority);
				if (!guild) return;
				guild.tasks.push(task.id);
			});

			await saveDb({ guilds, tasks });
			console.log(
				chalk.blue(
					"Les tâches quotidiennes ont été assignées à toutes les guildes.",
				),
			);
		});

	program
		.command("add")
		.description("Ajouter une nouvelle tâche")
		.action(async () => {
			const data = await registerPromptTasks();
			await registerTasks(data);
			console.log(chalk.green("Tâche ajoutée avec succès !"));
		});

	program
		.command("complete <id>")
		.description("Marquer une tâche comme complétée")
		.action(async (id) => {
			const tasks = await listTask();

			const findedTask = tasks?.find((task) => task.id === +id);

			if (findedTask) {
				findedTask.completed = true;
				const guilds = await listGuilds();
				await saveDb({ guilds, tasks });
				console.log(chalk.green("Tâche complétée !"));
			} else {
				console.log(chalk.red("Tâche non trouvée."));
			}
		});

	program.command("list").action(async (list) => {
		const guilds = await listGuilds();
		console.log(chalk.blue.bold("Liste des guildes :"));
		console.log({ guilds });
		const tasks = await listTask();
		console.log(chalk.blue.bold("Liste des tâches :"));
		console.log({ tasks });
	});

	program
		.command("info-sys")
		.description("Informations sur le monde")
		.action(() => {
			console.log(chalk.blue.bold("Informations du mode :"));
			console.log({ "Nom du monde": os.type() });
			console.log({ Memoire: `${(os.freemem() / 1024 ** 3).toFixed(2)} Go` });
		});
};
