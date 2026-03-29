import { checkbox, input, search, select } from "@inquirer/prompts";
import { Dirent, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { campaignEntitySchema, campaignJsonSchema, characterSchema } from "./importSchemas";
import type { DictionaryJSONEntry, DictionaryJSONFile } from "../dictionary";
import { ENTITY_TYPES, EntityType, type EntityTypeInfo } from "../entityTypes";

// Returns all the directories in a given directory
const getDirectories = (path: string): string[] => {
    return readdirSync(path, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
};

// Returns all the files in a given directory
const getFiles = (path: string): string[] => {
    return readdirSync(path, { withFileTypes: true })
        .filter((dirent) => dirent.isFile())
        .map((dirent) => dirent.name);
};

// Asks the user to select the folder to import
const selectFolder = async (folders: string[]): Promise<string | undefined> => {
    const backButton = {
        name: "[RETURN TO MAIN MENU]",
        value: undefined,
        description: "Press ENTER to return to main menu",
    };
    const choice = await search<string | undefined>({
        message: "Begin typing to filter options",
        source: async (term: string | void) => {
            if (!term) {
                return [
                    backButton,
                    ...folders.map((f) => ({
                        name: f,
                        value: f,
                        description: `Press ENTER to import "${f}"`,
                    })),
                ];
            }
            return folders
                .filter((f) => f.startsWith(term))
                .map((f) => ({
                    name: f,
                    value: f,
                    description: `Press ENTER to import "${f}"`,
                }));
        },
    });
    return choice;
};

// Attempts to read the name field from the campaign.json file at the root of the directory being imported
const readCampaignName = (dirContents: Dirent<string>[], basePath: string): string | undefined => {
    const hasCampaignFile =
        dirContents.filter((dirent) => dirent.isFile() && dirent.name === "campaign.json").length >
        0;
    if (!hasCampaignFile) {
        console.log(
            "Could not find a file called campaign.json at Kanka directory root. Are you sure this is a Kanka export?",
        );
        return;
    }
    const campaignFile = readFileSync(join(basePath, "campaign.json"), { encoding: "utf-8" });
    const campaignJson = JSON.parse(campaignFile);
    const parseResult = campaignJsonSchema.safeParse(campaignJson);
    if (parseResult.success) {
        return parseResult.data.name;
    } else {
        console.log('campaign.json file was missing attribute "name"');
        return;
    }
};

// Shows user checkbox to select which entity types to show for a custom import
const chooseCustomEntityTypes = async (): Promise<EntityTypeInfo[]> => {
    let selectedTypes: EntityTypeInfo[] = [];
    const choices = ENTITY_TYPES.map((e) => ({
        name: e.displayName,
        value: e,
    }));
    while (selectedTypes.length === 0) {
        selectedTypes = await checkbox<EntityTypeInfo>({
            message: "Select the entity types you wish to import",
            choices: choices,
        });
        if (selectedTypes.length === 0) console.log("You must select at least one entity type");
    }
    return selectedTypes;
};

// Let user choose from full, minimal, or custom import
// Each option has a different number of entity types included
const selectEntityTypes = async (): Promise<EntityTypeInfo[]> => {
    type ImportEntityChoice = "MINIMAL" | "FULL" | "CUSTOM";
    const minimalTypes = ENTITY_TYPES.filter((e) => e.inBasicImport);
    const minimalTypesText = minimalTypes.map((e) => e.displayName).join(", ");
    const typeChoice = await select<ImportEntityChoice>({
        message: "Which entity types do you want to import?",
        choices: [
            {
                name: "Minimal import",
                value: "MINIMAL",
                description: `Includes: ${minimalTypesText}`,
            },
            {
                name: "Full import",
                value: "FULL",
                description: "Includes all entity types",
            },
            {
                name: "Custom import",
                value: "CUSTOM",
                description: "Select exactly which entity types are imported",
            },
        ],
        default: "MINIMAL",
    });
    switch (typeChoice) {
        case "MINIMAL":
            return minimalTypes;
        case "FULL":
            return ENTITY_TYPES;
        case "CUSTOM":
            return await chooseCustomEntityTypes();
    }
};

// Reads each JSON file from the selected entity types and produces a dictionary entry for each one
const readEntries = (basePath: string, selectedEntityFolders: string[]): DictionaryJSONEntry[] => {
    const subdirectories = getDirectories(basePath).filter((d) =>
        selectedEntityFolders.includes(d),
    );
    const entries: DictionaryJSONEntry[] = [];
    subdirectories.forEach((dirName) => {
        const dirPath = join(basePath, dirName);
        const fileNames = getFiles(dirPath);
        fileNames.forEach((fileName) => {
            const fullPath = join(basePath, dirName, fileName);
            console.log(`Reading file ${fullPath}`);
            const fileData = readFileSync(fullPath, { encoding: "utf-8" });
            const fileJson = JSON.parse(fileData);
            const entity = campaignEntitySchema.parse(fileJson);

            const names = [entity.name];

            // If entity is a character and has a title, add this as an alternate name
            if (entity.entity.type_id === EntityType.CHARACTER) {
                const characterEntity = characterSchema.parse(fileJson);
                if (characterEntity.title) {
                    names.push(characterEntity.title);
                }
            }
            entries.push({
                names: names,
                category: entity.entity.type_id,
            });
        });
    });
    return entries;
};

// Asks user for name of file to save new dictionary to,
// .json suffix is optional, will be appended if missed off
const enterOutputName = async (dictionaryFolder: string): Promise<string> => {
    let filename = "";
    while (filename.length < 1) {
        filename = await input({
            message: "Provide an output filename:",
        });

        if (!filename.endsWith(".json")) filename = `${filename}.json`;

        const existingDictionaryFiles = getFiles(dictionaryFolder);
        if (existingDictionaryFiles.includes(filename)) {
            console.log(
                `A file called ${filename} already exists in the folder ${dictionaryFolder}`,
            );
            filename = "";
        }
    }
    return filename;
};

// Serialises the dictionary and writes it to a JSON file
const writeOutputFile = (
    dictionaryFolder: string,
    newFileName: string,
    dictionary: DictionaryJSONFile,
) => {
    const fullPath = join(dictionaryFolder, newFileName);
    writeFileSync(fullPath, JSON.stringify(dictionary), { encoding: "utf-8" });
    console.log(`Successfully saved dictionary to ${fullPath}`);
};

// Main function for importing a given folder
const importToDictionary = async (
    importFolder: string,
    selectedFolder: string,
    dictionaryFolder: string,
) => {
    const basePath = join(importFolder, selectedFolder);
    const dirContents = readdirSync(basePath, { withFileTypes: true });
    const campaignName = readCampaignName(dirContents, basePath);
    if (!campaignName) return;
    const selectedEntityTypes = await selectEntityTypes();
    const selectedEntityFolders = selectedEntityTypes.map((e) => e.importDirectory);
    const entries = readEntries(basePath, selectedEntityFolders);
    const dictionary: DictionaryJSONFile = {
        name: campaignName,
        entries: entries,
    };
    const outputName = await enterOutputName(dictionaryFolder);
    writeOutputFile(dictionaryFolder, outputName, dictionary);
};

// Asks user to select the folder to import, then calls the function to import it
const importFolderToDictionary = async (
    importFolder: string | undefined,
    dictionaryFolder: string,
) => {
    if (!importFolder) {
        console.log("An import folder was not set in your config file");
        return;
    }
    const folders = getDirectories(importFolder);
    if (folders.length === 0) {
        console.log(`No folders found in import directory ${importFolder}`);
    }
    const selectedFolder = await selectFolder(folders);
    if (!selectedFolder) return;
    await importToDictionary(importFolder, selectedFolder, dictionaryFolder);
};

export default importFolderToDictionary;
