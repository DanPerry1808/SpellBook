import type { TextChannel } from "discord.js";
import { search, select } from "@inquirer/prompts";
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
    FULL,
}

type DictionaryEntryMatch = DictionaryEntry & {
    matchType: MatchType;
    matchIndex: number;
};

export const checkAllNames = (
    searchQuery: string,
    entry: DictionaryEntry,
): DictionaryEntryMatch => {
    for (let i = 0; i < entry.names.length; i++) {
        const name = entry.names[i];
        // Typescript thinks name can be undefined above, so we need to check here
        if (!name) continue;
        if (name.nameLower.startsWith(searchQuery)) {
            return {
                ...entry,
                matchType: MatchType.FULL,
                matchIndex: i,
            };
        }
    }
    for (let i = 0; i < entry.names.length; i++) {
        const name = entry.names[i];
        // Typescript thinks name can be undefined above, so we need to check here
        if (!name) continue;
        if (name.words.some((word) => word.startsWith(searchQuery))) {
            return {
                ...entry,
                matchType: MatchType.PARTIAL,
                matchIndex: i,
            };
        }
    }
    return {
        ...entry,
        matchType: MatchType.NONE,
        matchIndex: -1,
    };
};

export const findMatches = (
    searchQuery: string | void,
    entries: DictionaryEntry[],
): Choice<DictionaryEntryMatch | undefined>[] => {
    if (!searchQuery) {
        const backButton = {
            name: "[BACK TO MAIN MENU]",
            value: undefined,
            description: "Press ENTER to return to main menu",
        };
        return [
            backButton,
            ...entries.map((e) => {
                const value = e.names[0]?.name!;
                const sendSelect = e.names.length > 1 ? "select" : "send";
                return {
                    name: value,
                    value: {
                        ...e,
                        matchType: MatchType.FULL,
                        matchIndex: 0,
                    },
                    description: `Press ENTER to ${sendSelect} "${value}"`,
                };
            }),
        ];
    }
    const searchString = searchQuery.toLowerCase();
    // Check all entries for matches, remove non-matching entries, search so that full matches are at the top
    const matches = entries
        .map((entry) => checkAllNames(searchString, entry))
        .filter((m) => m.matchType !== MatchType.NONE)
        .sort((a, b) => a.matchType - b.matchType);

    return matches.map((match) => {
        const value = match.names[0]?.name!;
        const matchString =
            match.matchIndex === 0 ? "" : ` (matching on "${match.names[match.matchIndex]?.name}")`;
        const sendSelect = match.names.length > 1 ? "select" : "send";
        return {
            name: value,
            value: match,
            description: `Press ENTER to ${sendSelect} "${value}"${matchString}`,
        };
    });
};

// TODO: Sort the list alphabetically by main name (or do this in dictionary loading)
const selectEntry = async (
    entries: DictionaryEntry[],
): Promise<DictionaryEntryMatch | undefined> => {
    const selectedEntry = await search<DictionaryEntryMatch | undefined>({
        message: "Start typing to filter entries:",
        source: async (term: string | void) => {
            return findMatches(term, entries);
        },
    });
    return selectedEntry;
};

const selectName = async (entry: DictionaryEntryMatch): Promise<string | undefined> => {
    const backButton = {
        name: "[BACK TO SEARCH]",
        value: undefined,
        description: "Press ENTER to return to list of entries",
    };
    const nameChoices = [
        backButton,
        ...entry.names.map((e) => ({
            name: e.name,
            value: e.name,
            description: `Press ENTER to send "${e.name}"`,
        })),
    ];
    const selectedName = await select<string | undefined>({
        message: "Select a name for this entry:",
        choices: nameChoices,
        default: entry.names[entry.matchIndex]?.name,
    });
    return selectedName;
};

const sendEntries = async (textChannel: TextChannel, entries: DictionaryEntry[]) => {
    while (true) {
        printSeparator();

        const selectedEntry = await selectEntry(entries);

        if (!selectedEntry) break;

        const selectedName =
            selectedEntry.names.length > 1
                ? await selectName(selectedEntry)
                : selectedEntry.names[0]?.name!;
        if (!selectedName) continue;
        textChannel.send(selectedName);
    }
};

export default sendEntries;
