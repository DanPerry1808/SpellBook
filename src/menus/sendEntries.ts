import type { TextChannel } from "discord.js";
import { search } from "@inquirer/prompts";
import { printSeparator } from "./utils";
import type { DictionaryEntry } from "../dictionary";

export const findMatches = (searchQuery: string | void, entries: DictionaryEntry[]): string[] => {
    if (!searchQuery) return entries.map((e) => e.names[0]?.name!);
    const searchString = searchQuery.toLowerCase();
    const bestMatches = entries.filter((e) => e.names[0]?.nameLower.startsWith(searchString));
    const bestMatchWords = bestMatches.map((m) => m.names[0]?.name!);
    const partialMatches = entries.filter(
        (e) =>
            !bestMatchWords.includes(e.names[0]?.name!) &&
            e.names.flatMap((n) => n.words).some((word) => word.startsWith(searchString)),
    );
    const partialMatchWords = partialMatches.map((e) => e.names[0]?.name!);
    const allMatches = bestMatchWords.concat(partialMatchWords);
    return allMatches;
};

const selectInput = async (entries: DictionaryEntry[]): Promise<string> => {
    const message = await search<string>({
        message: "Start typing to filter entries:",
        source: async (term: string | void) => {
            return findMatches(term, entries);
        },
    });
    return message;
};

const sendEntries = async (textChannel: TextChannel, entries: DictionaryEntry[]) => {
    while (true) {
        printSeparator();

        const selectedWord = await selectInput(entries);
        console.log(`Selected word: ${selectedWord}`);
        textChannel.send(selectedWord);
    }
};

export default sendEntries;
