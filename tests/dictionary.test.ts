import { describe, it, expect } from "vitest"
import { join } from "node:path";
import { loadTextDictionary, type DictionaryFile } from "../src/dictionary";

describe('loadTextDictionary', () => {
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
                            words: ["aaaa"]
                        },
                    ]
                },
                {
                    names: [
                        {
                            name: "Aaa aaa",
                            nameLower: "aaa aaa",
                            words: ["aaa", "aaa"]
                        },
                    ]
                },
                {
                    names: [
                        {
                            name: "Aaa Bbbb",
                            nameLower: "aaa bbbb",
                            words: ["aaa", "bbbb"]
                        },
                    ]
                },
                {
                    names: [
                        {
                            name: "Aaa Bbb Cccc",
                            nameLower: "aaa bbb cccc",
                            words: ["aaa", "bbb", "cccc"]
                        },
                    ]
                },
                {
                    names: [
                        {
                            name: "AAAAA",
                            nameLower: "aaaaa",
                            words: ["aaaaa"]
                        },
                    ]
                },
                {
                    names: [
                        {
                            name: "ccccc",
                            nameLower: "ccccc",
                            words: ["ccccc"]
                        },
                    ]
                },
            ]
        };
        expect(output).toEqual(expected);
    });
});
