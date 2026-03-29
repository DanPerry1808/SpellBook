import { Client, TextChannel } from "discord.js";
import loadDictionary, { type DictionaryFile } from "./dictionary";
import { loadConfig } from "./config";
import mainMenu, { MainMenuChoice } from "./menus/mainMenu";
import sendEntries from "./menus/sendEntries";
import selectDictionary from "./menus/selectDictionary";
import importFolderToDictionary from "./menus/import";

const CONFIG_FILEPATH = "./spellbook.config.json";

const configFile = loadConfig(CONFIG_FILEPATH);

let dictionary: DictionaryFile | undefined;
let textChannel: TextChannel | undefined;

if (configFile.dictionaries.defaultDictionaryFilename) {
    dictionary = loadDictionary(
        configFile.dictionaries.dictionaryFolder,
        configFile.dictionaries.defaultDictionaryFilename,
    );
}

const client = new Client({
    intents: [],
});

const handleUserInput = async () => {
    if (!textChannel) throw new Error("Text channel is undefined, cannot continue");

    while (true) {
        const mainMenuAnswer = await mainMenu(dictionary ? dictionary.name : undefined);
        switch (mainMenuAnswer) {
            case MainMenuChoice.SEND_ENTRIES:
                if (!dictionary) throw new Error("No dictionary has been loaded yet");
                console.log("Send entries");
                await sendEntries(textChannel, dictionary.entries);
                break;
            case MainMenuChoice.LOAD_DICTIONARY:
                console.log("Load dictionary");
                dictionary = await selectDictionary(configFile.dictionaries.dictionaryFolder);
                break;
            case MainMenuChoice.NEW_DICTIONARY:
                await importFolderToDictionary(
                    configFile.dictionaries.importFolder,
                    configFile.dictionaries.dictionaryFolder,
                );
                break;
        }
    }
};

client.once("clientReady", async (readyClient) => {
    console.log(`Logged in to Discord as ${readyClient.user.tag}`);
    const channel = await readyClient.channels.fetch(configFile.discord.channelId);
    if (channel === null) {
        throw Error(
            `Channel could not be found. Check the channel ID: ${configFile.discord.channelId}`,
        );
    }
    textChannel = channel as TextChannel;

    await handleUserInput();
});

client.login(configFile.discord.botToken);
