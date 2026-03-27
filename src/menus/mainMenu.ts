import { select } from "@inquirer/prompts";
import { printSeparator } from "./utils";

export enum MainMenuChoice {
    SEND_ENTRIES,
    LOAD_DICTIONARY,
    EXIT,
}

const mainMenu = async (currentDictionaryName: string | undefined): Promise<MainMenuChoice> => {
    printSeparator();

    console.log("Welcome to SpellBook");
    if (currentDictionaryName) {
        console.log(`Current dictionary: ${currentDictionaryName}`);
    } else {
        console.log("No dictionary loaded.");
    }
    const answer = await select({
        message: "Please select an option",
        choices: [
            {
                name: "Send entries",
                value: MainMenuChoice.SEND_ENTRIES,
                description: "Search the currently loaded dictionary",
                disabled: currentDictionaryName === undefined,
            },
            {
                name: "Load dictionary file",
                value: MainMenuChoice.LOAD_DICTIONARY,
                description: "Load a new dictionary from a file",
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
