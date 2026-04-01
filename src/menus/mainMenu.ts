import { select } from "@inquirer/prompts";
import { printSeparator } from "./utils";

export enum MainMenuChoice {
    SEND_ENTRIES,
    LOAD_DICTIONARY,
    NEW_DICTIONARY,
    EXIT,
}

const mainMenu = async (currentDictionaryName: string | undefined): Promise<MainMenuChoice> => {
    printSeparator();

    console.log("Welcome to SpellBook");
    let sendEntryDescription: string;
    if (currentDictionaryName) {
        console.log(`Current dictionary: ${currentDictionaryName}`);
        sendEntryDescription = "Send entries from the currently loaded dictionary to Discord"
    } else {
        console.log("No dictionary loaded.");
        sendEntryDescription = "You must load or import a dictionary before you can send entries"
    }
    const answer = await select({
        message: "Please select an option",
        choices: [
            {
                name: "Send entries",
                value: MainMenuChoice.SEND_ENTRIES,
                description: sendEntryDescription,
                disabled: currentDictionaryName === undefined,
            },
            {
                name: "Load dictionary file",
                value: MainMenuChoice.LOAD_DICTIONARY,
                description: "Load a new dictionary from a file",
            },
            {
                name: "Create new dictionary",
                value: MainMenuChoice.NEW_DICTIONARY,
                description: "Create a new dictionary from a Kanka JSON export",
            },
            {
                name: "Exit",
                value: MainMenuChoice.EXIT,
                description: "Close the program",
            },
        ],
    });

    if (answer === MainMenuChoice.EXIT) process.exit();

    return answer;
};

export default mainMenu;
