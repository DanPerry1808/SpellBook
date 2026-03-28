import { readFileSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { z } from "zod";

enum ValidFileExtensions {
    TXT = ".txt",
    JSON = ".json",
}

const dictionaryEntryNamesSchema = z.strictObject({
    name: z.string(),
    nameLower: z.string(),
    words: z.array(z.string()),
});

const dictionaryEntrySchema = z.strictObject({
    names: z.array(dictionaryEntryNamesSchema).min(1),
});

const dictionarySchema = z.strictObject({
    name: z.string(),
    entries: z.array(dictionaryEntrySchema),
});

const dictionaryEntryJsonSchema = z.strictObject({
    names: z.array(z.string().min(1)).min(1),
});

const dictionaryJsonSchema = z.strictObject({
    name: z.string(),
    entries: z.array(dictionaryEntryJsonSchema).min(1),
});

type DictionaryJSONFile = z.infer<typeof dictionaryJsonSchema>;

export type DictionaryFile = z.infer<typeof dictionarySchema>;

export type DictionaryEntry = z.infer<typeof dictionaryEntrySchema>;

export type DictionaryEntryName = z.infer<typeof dictionaryEntryNamesSchema>;

export const dictionaryPath = (folder: string, filepath: string): string => {
    return join(folder, filepath);
};

export const createNameObject = (name: string): DictionaryEntryName => {
    const nameLower = name.toLowerCase();
    return {
        name: name,
        nameLower: nameLower,
        words: nameLower.split(/\s/),
    };
};

export const loadTextDictionary = (fullPath: string): DictionaryFile => {
    const dictionaryData = readFileSync(fullPath, { encoding: "utf-8" });
    const dictionaryList = dictionaryData.split("\n").filter((line) => line.trim() !== "");
    return {
        name: basename(fullPath),
        entries: dictionaryList.map((entry) => ({
            names: [createNameObject(entry)],
        })),
    };
};

export const loadJsonDictionary = (fullPath: string): DictionaryFile => {
    const dictionaryData = readFileSync(fullPath, { encoding: "utf-8" });
    const dictionaryJson = JSON.parse(dictionaryData);
    const rawDictionary = dictionaryJsonSchema.parse(dictionaryJson);
    return {
        name: rawDictionary.name,
        entries: rawDictionary.entries.map((entry) => ({
            names: entry.names.map((name) => createNameObject(name)),
        })),
    };
};

const loadDictionary = (folder: string, filepath: string): DictionaryFile => {
    const fileExtension = extname(filepath);
    const fullPath = join(folder, filepath);
    console.log(`Attempting to load dictionary from file ${fullPath}`);

    switch (fileExtension) {
        case ValidFileExtensions.TXT:
            return loadTextDictionary(fullPath);
        case ValidFileExtensions.JSON:
            return loadJsonDictionary(fullPath);
        default:
            throw new Error(
                `Dictionary file ${filepath} has unsupported extension ${fileExtension}`,
            );
    }
};

export default loadDictionary;
