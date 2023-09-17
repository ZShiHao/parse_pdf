import { Command } from "commander";
import { parseDate, parseTitle, parseAuthor, getInfo } from "./src/parse.ts";

const program = new Command();

program
  .command("parse")
  .option("-d, --date", "date")
  .option("-t --title")
  .option("-a --author")
  .action((opts, { args }) => {
    if (opts.date) parseDate(args);
    if (opts.title) parseTitle(args);
    if (opts.author) parseAuthor(args);
  });
program.command("info").action(getInfo);

program.parse();
