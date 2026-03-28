import type { TextChannel } from "discord.js";
import { search } from "@inquirer/prompts";
import { printSeparator } from "./utils";
import type { DictionaryEntry } from "../dictionary";

type Choice<T> = {
    name: string;
    value: T;
    description?: string;
};

enum MatchType {
    NONE,
    PARTIAL,
    FULL
};

type DictionaryEntryMatch = DictionaryEntry & {
    matchType: MatchType;
    matchIndex: number;
};

export const checkAllNames = (searchQuery: string, entry: DictionaryEntry): DictionaryEntryMatch => {
    for (let i = 0; i < entry.names.length; i++) {
        const name = entry.names[i];
        // Typescript thinks name can be undefined above, so we need to check here
        if (!name) continue;
        if (name.nameLower.startsWith(searchQuery)) {
            return {
                ...entry,
                matchType: MatchType.FULL,
                matchIndex: i
            };
        }
    }
    for (let i = 0; i < entry.names.length; i++) {
        const name = entry.names[i];
        // Typescript thinks name can be undefined above, so we need to check here
        if (!name) continue;
        if (name.words.some(word => word.startsWith(searchQuery))) {
            return {
                ...entry,
                matchType: MatchType.PARTIAL,
                matchIndex: i
            };
        }
    }
    return {
        ...entry,
        matchType: MatchType.NONE,
        matchIndex: -1
    };
};

export const findMatches = (searchQuery: string | void, entries: DictionaryEntry[]): Choice<string>[] => {
    if (!searchQuery) return entries.map((e) => {
        const value = e.names[0]?.name!;
        return {
            name: value,
            value: value,
            description: value
        }
    });
    const searchString = searchQuery.toLowerCase();
    // Check all entries for matches, remove non-matching entries, search so that full matches are at the top
    const matches = entries.map(entry => checkAllNames(searchString, entry)).filter(m => m.matchType !== MatchType.NONE).sort((a, b) => a.matchType - b.matchType);

    return matches.map(match => {
        const value = match.names[0]?.name!
        const matchString = match.matchIndex === 0 ? "" : ` (matching on "${match.names[match.matchIndex]?.name}")`
        return {
            name: value,
            value: value,
            description: `${value}${matchString}`,
        }
    });
};

// TODO: Sort the list alphabetically by main name (or do this in dictionary loading)
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
