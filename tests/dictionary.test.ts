import { describe, it, expect } from "vitest";
import { join } from "node:path";
import { loadJsonDictionary, loadTextDictionary, type DictionaryFile } from "../src/dictionary";

describe("loadTextDictionary", () => {
    it("returns a correctly formed dictionary of entries", () => {
        const filepath = join("testdata", "loadtest.txt");
        const output = loadTextDictionary(filepath);
        const expected: DictionaryFile = {
            name: "loadtest.txt",
            entries: [
                {
                    names: [
                        {
                            name: "Aaaa",
                            nameLower: "aaaa",
                            words: ["aaaa"],
                        },
                    ],
                },
                {
                    names: [
                        {
                            name: "Aaa aaa",
                            nameLower: "aaa aaa",
                            words: ["aaa", "aaa"],
                        },
                    ],
                },
                {
                    names: [
                        {
                            name: "Aaa Bbbb",
                            nameLower: "aaa bbbb",
                            words: ["aaa", "bbbb"],
                        },
                    ],
                },
                {
                    names: [
                        {
                            name: "Aaa Bbb Cccc",
                            nameLower: "aaa bbb cccc",
                            words: ["aaa", "bbb", "cccc"],
                        },
                    ],
                },
                {
                    names: [
                        {
                            name: "AAAAA",
                            nameLower: "aaaaa",
                            words: ["aaaaa"],
                        },
                    ],
                },
                {
                    names: [
                        {
                            name: "ccccc",
                            nameLower: "ccccc",
                            words: ["ccccc"],
                        },
                    ],
                },
            ],
        };
        expect(output).toEqual(expected);
    });
});

describe("loadJsonDictionary", () => {
    it("Returns a valid dicitonary. Ordering of names array preserved", () => {
        const filepath = join("testdata", "loadtest.json");
        const output = loadJsonDictionary(filepath);
        const expected: DictionaryFile = {
            name: "Test dictionary",
            entries: [
                {
                    names: [
                        {
                            name: "James Jones",
                            nameLower: "james jones",
                            words: ["james", "jones"],
                        },
                        {
                            name: "Jim Jones",
                            nameLower: "jim jones",
                            words: ["jim", "jones"],
                        },
                        {
                            name: "J B Jones",
                            nameLower: "j b jones",
                            words: ["j", "b", "jones"],
                        },
                    ],
                },
                {
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
                    ],
                },
                {
                    names: [
                        {
                            name: "NAME",
                            nameLower: "name",
                            words: ["name"],
                        },
                    ],
                },
                {
                    names: [
                        {
                            name: "Very Long Name",
                            nameLower: "very long name",
                            words: ["very", "long", "name"],
                        },
                        {
                            name: "Long Name",
                            nameLower: "long name",
                            words: ["long", "name"],
                        },
                    ],
                },
            ],
        };
        expect(output).toEqual(expected);
    });
});
