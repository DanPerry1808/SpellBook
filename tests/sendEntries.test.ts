import { describe, it, expect } from "vitest";
import { findMatches } from "../src/menus/sendEntries";
import type { DictionaryEntry } from "../src/dictionary";

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
