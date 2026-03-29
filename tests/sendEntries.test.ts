import { describe, it, expect } from "vitest";
import { checkAllNames } from "../src/menus/sendEntries";
import type { DictionaryEntry } from "../src/dictionary";

describe("checkAllNames", () => {
    it("Returns a full match", () => {
        const entry: DictionaryEntry = {
            names: [
                {
                    name: "Bob Smith",
                    nameLower: "bob smith",
                    words: ["bob", "smith"],
                },
                {
                    name: "Robert Smith",
                    nameLower: "robert smith",
                    words: ["robert", "smith"],
                },
                {
                    name: "Robert I Smith",
                    nameLower: "robert i smith",
                    words: ["robert", "i", "smith"],
                },
            ],
        };
        const output = checkAllNames("robert", entry);
        expect(output).toEqual({
            ...entry,
            matchType: 2,
            matchIndex: 1,
        });
    });

    it("Returns a full match before a partial match", () => {
        const entry: DictionaryEntry = {
            names: [
                {
                    name: "Bob Smith",
                    nameLower: "bob smith",
                    words: ["bob", "smith"],
                },
                {
                    name: "Robert Smith",
                    nameLower: "robert smith",
                    words: ["robert", "smith"],
                },
                {
                    name: "Smithy",
                    nameLower: "smithy",
                    words: ["smithy"],
                },
            ],
        };
        const output = checkAllNames("smith", entry);
        expect(output).toEqual({
            ...entry,
            matchType: 2,
            matchIndex: 2,
        });
    });

    it("Returns a partial match if no full match", () => {
        const entry: DictionaryEntry = {
            names: [
                {
                    name: "Bob Jones",
                    nameLower: "bob jones",
                    words: ["bob", "jones"],
                },
                {
                    name: "Robert Jones",
                    nameLower: "robert jones",
                    words: ["robert", "jones"],
                },
                {
                    name: "Smithy",
                    nameLower: "smithy",
                    words: ["smithy"],
                },
            ],
        };
        const output = checkAllNames("jones", entry);
        expect(output).toEqual({
            ...entry,
            matchType: 1,
            matchIndex: 0,
        });
    });

    it("Returns no match if it does not match", () => {
        const entry: DictionaryEntry = {
            names: [
                {
                    name: "Bob Smith",
                    nameLower: "bob smith",
                    words: ["bob", "smith"],
                },
                {
                    name: "Robert Smith",
                    nameLower: "robert smith",
                    words: ["robert", "smith"],
                },
                {
                    name: "Robert I Smith",
                    nameLower: "robert i smith",
                    words: ["robert", "i", "smith"],
                },
            ],
        };
        const output = checkAllNames("bobby", entry);
        expect(output).toEqual({
            ...entry,
            matchType: 0,
            matchIndex: -1,
        });
    });
});

/*
describe("findMatches - no alternate names", () => {
    const entries: DictionaryEntry[] = [
        {
            names: [
                {
                    name: "Bob Smith",
                    nameLower: "bob smith",
                    words: ["bob", "smith"],
                },
            ],
        },
        {
            names: [
                {
                    name: "John Jones",
                    nameLower: "john jones",
                    words: ["john", "jones"],
                },
            ],
        },
        {
            names: [
                {
                    name: "Steve Jones",
                    nameLower: "steve jones",
                    words: ["steve", "jones"],
                },
            ],
        },
        {
            names: [
                {
                    name: "John Smith",
                    nameLower: "john smith",
                    words: ["john", "smith"],
                },
            ],
        },
        {
            names: [
                {
                    name: "Zzzz Yyyy",
                    nameLower: "zzzz yyyy",
                    words: ["zzzz", "yyyy"],
                },
            ],
        },
    ];

    it("Returns the entire list for an empty search term", () => {
        const output = findMatches("", entries);
        const expected = ["Bob Smith", "John Jones", "Steve Jones", "John Smith", "Zzzz Yyyy"];
        expect(output).toEqual(expected);
    });

    it("Returns one result for an exact match", () => {
        const output = findMatches("John Smith", entries);
        const expected = ["John Smith"];
        expect(output).toEqual(expected);
    });

    it("Returns partial matches when matching on words other than the first", () => {
        const output = findMatches("Jones", entries);
        const expected = ["John Jones", "Steve Jones"];
        expect(output).toEqual(expected);
    });

    it("Returns partial matches after best matches", () => {
        const output = findMatches("Jo", entries);
        const expected = ["John Jones", "John Smith", "Steve Jones"];
        expect(output).toEqual(expected);
    });
});
*/
