import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

const DB_PATH = new URL("../db/db.json", import.meta.url);

export const getDb = async () => {
	initDb();
	const db = await readFile(DB_PATH, "utf-8");
	return JSON.parse(db);
};

export const saveDb = async (data) => {
	await writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
	return data;
};

export const insertDb = async (value, table) => {
	const db = await getDb();
	db[table].push(value);
	await saveDb(db);
	return value;
};

export const initDb = async () => {
	if (!existsSync(DB_PATH)) {
		await saveDb({ guilds: [], tasks: [] });
	}
};
