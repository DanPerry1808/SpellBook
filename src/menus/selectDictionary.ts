import { readdirSync } from "node:fs";
import { search } from "@inquirer/prompts";
import type { DictionaryFile } from "../dictionary.js";
import loadDictionary from "../dictionary.js";

const selectFile = async (folderPath: string): Promise<string> => {
    const files = readdirSync(folderPath);
    const selectedFile = await search<string>({
        message: "Select a file or start typing to filter the results",
        source: (term: string | undefined) => {
            if (!term) return files;
            return files.filter((f) => f.toLowerCase().startsWith(term.toLowerCase()));
        },
    });
    return selectedFile;
};

const selectDictionary = async (folderPath: string): Promise<DictionaryFile> => {
    const newFilename = await selectFile(folderPath);
    return loadDictionary(folderPath, newFilename);
};

export default selectDictionary;
