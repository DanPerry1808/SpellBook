import { input, search } from "@inquirer/prompts";
import { Dirent, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { campaignEntitySchema, campaignJsonSchema, characterSchema } from "./importSchemas";
import { Category, type DictionaryEntry, type DictionaryFile, type DictionaryJSONEntry, type DictionaryJSONFile } from "../dictionary";

const getDirectories = (path: string): string[] => {
    return readdirSync(path, { withFileTypes: true }).filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
};

const getFiles = (path: string): string[] => {
    return readdirSync(path, { withFileTypes: true }).filter(dirent => dirent.isFile()).map(dirent => dirent.name);
};

const selectFolder = async (folders: string[]): Promise<string | undefined> => {
    const backButton = {
        name: "[RETURN TO MAIN MENU]",
        value: undefined,
        description: "Press ENTER to return to main menu"
    };
    const choice = await search<string | undefined>({
        message: "Begin typing to filter options",
        source: async (term: string | void) => {
            if (!term) {
                return [
                    backButton,
                    ...folders.map(f => (
                        {
                            name: f,
                            value: f,
                            description: `Press ENTER to import "${f}"`
                        }
                    ))
                ];
            }
            return folders.filter(f => f.startsWith(term)).map(f => (
                {
                    name: f,
                    value: f,
                    description: `Press ENTER to import "${f}"`
                }
            ));
        }
    });
    return choice;
};

const readCampaignName = (dirContents: Dirent<string>[], basePath: string): string | undefined => {
    const hasCampaignFile = dirContents.filter(dirent => dirent.isFile() && dirent.name === "campaign.json").length > 0;
    if (!hasCampaignFile) {
        console.log("Could not find a file called campaign.json at Kanka directory root. Are you sure this is a Kanka export?");
        return;
    }
    const campaignFile = readFileSync(join(basePath, "campaign.json"), {"encoding": "utf-8"});
    const campaignJson = JSON.parse(campaignFile);
    const parseResult = campaignJsonSchema.safeParse(campaignJson);
    if (parseResult.success) {
        return parseResult.data.name;
    } else {
        console.log("campaign.json file was missing attribute \"name\"");
        return;
    }
};

const readEntries = (basePath: string): DictionaryJSONEntry[] => {
    // TODO: Allow users to select which folders/entity types to ignore
    const ignoreFolders = ["settings"];
    const subdirectories = getDirectories(basePath).filter(d => !ignoreFolders.includes(d));
    const entries: DictionaryJSONEntry[] = [];
    subdirectories.forEach(dirName => {
        const dirPath = join(basePath, dirName)
        const fileNames = getFiles(dirPath);
        fileNames.forEach(fileName => {
            const fullPath = join(basePath, dirName, fileName);
            console.log(`Reading file ${fullPath}`);
            const fileData = readFileSync(fullPath, { encoding: 'utf-8' });
            const fileJson = JSON.parse(fileData);
            const entity = campaignEntitySchema.parse(fileJson);

            const names = [entity.name];
            
            // If entity is a character and has a title, add this as an alternate name
            if (entity.entity.type_id === Category.CHARACTER) {
                const characterEntity = characterSchema.parse(fileJson);
                if (characterEntity.title) {
                    names.push(characterEntity.title);
                }
            }
            entries.push({
                names: names,
                category: entity.entity.type_id
            });
        });
    });
    return entries;
};

const enterOutputName = async (dictionaryFolder: string): Promise<string> => {
    let filename = "";
    while (filename.length < 1) {
        filename = await input({
            message: "Provide an output filename:"
        });

        if (!filename.endsWith(".json"))
            filename = `${filename}.json`;

        const existingDictionaryFiles = getFiles(dictionaryFolder);
        if (existingDictionaryFiles.includes(filename)) {
            console.log(`A file called ${filename} already exists in the folder ${dictionaryFolder}`);
            filename = "";
        }
    }
    return filename;
};

const writeOutputFile = (dictionaryFolder: string, newFileName: string, dictionary: DictionaryJSONFile) => {
    const fullPath = join(dictionaryFolder, newFileName);
    writeFileSync(fullPath, JSON.stringify(dictionary), { encoding: 'utf-8' });
    console.log(`Successfully saved dictionary to ${fullPath}`);
}

const importToDictionary = async (importFolder: string, selectedFolder: string, dictionaryFolder: string) => {
    const basePath = join(importFolder, selectedFolder)
    const dirContents = readdirSync(basePath, { withFileTypes: true });
    const campaignName = readCampaignName(dirContents, basePath);
    if (!campaignName)
        return;
    const entries = readEntries(basePath);
    const dictionary: DictionaryJSONFile = {
        name: campaignName,
        entries: entries,
    };
    const outputName = await enterOutputName(dictionaryFolder);
    writeOutputFile(dictionaryFolder, outputName, dictionary);
};

const importFolderToDictionary = async (importFolder: string | undefined, dictionaryFolder: string) => {
    if (!importFolder) {
        console.log("An import folder was not set in your config file")
        return;
    }
    const folders = getDirectories(importFolder);
    if (folders.length === 0) {
        console.log(`No folders found in import directory ${importFolder}`)
    }
    const selectedFolder = await selectFolder(folders);
    if (!selectedFolder)
        return;
    await importToDictionary(importFolder, selectedFolder, dictionaryFolder);
};

export default importFolderToDictionary;
