import { Question } from "../src/models/question-model.js";
import { connectionDB } from "../src/db/db-connection.js";
import { readFile} from "fs/promises";
const data = await readFile(new URL("../DataSet/questions.json", import.meta.url));
const questions = JSON.parse(data);
import dotenv from "dotenv";
dotenv.config({
    path: "../.env"
});

async function seedDB() {
  try {
    await connectionDB ();

    // Optional: clear existing data
    // await Question.deleteMany({});
    // console.log("🗑️ Old questions deleted");

    // Insert new data
    await Question.insertMany(questions);
    console.log(`✅ Inserted ${questions.length} questions`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDB();