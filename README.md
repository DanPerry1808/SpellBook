# SpellBook

SpellBook is a command line tool and Discord bot to help Game Masters in any TTRPG easily give
their note-taking players spellings for names, places, and any other difficult-to-spell words.
With SpellBook, you can have role-play interactions without having to pause every few seconds to
spell out the name of that ancient elven city you came up with.

The tool consists of a CLI which the Game Master can use to select a word or phrase from a
user-defined dictionary, which is then sent through a Discord bot to a server with your players in.

## Installation

- First you will need to create a Discord server and invite any players who want to receive
  spellings during your sessions.
- Create a Discord bot and invite it to your server. Take note of the bot's token as the tool will
  need it.
- Install [NodeJS](https://nodejs.org/) v24+ and [Bun](https://bun.sh/) on the device you want to send spellings from
- Clone the Git repo to that device and run `bun install`
- Copy the file `config.example.json` to `config.json` and fill in the required fields (see below
  for more details)
- Run `bun run bs` in a terminal window to build and launch the tool
- After the first run, you can use `bun run start` to launch the tool without building from source first

### The config file

A file called `config.json` must be present in the project root directory for the tool to launch.
The expected format for the file is below:

```typescript
type ConfigFile = {
    discord: {
        // Discord bot token
        botToken: string;
        // Discord channel ID to send spellings to
        // You may need to enable developer mode on your Discord client to get the channel ID
        channelId: string;
    };
    dictionaries: {
        // Optional: folder containing all dictionary files
        // Default value: "dictionaries" (resolves to "./dictionaries")
        dictionaryFolder: string;
        // Optional: File name for default dictionary to open on launch
        // Filepath relative from the path given in dictionaryFolder
        defaultDictionaryFilename?: string | undefined;
        // Optional: directory to place Kanka JSON folders for importing into the tool
        // Filepath relative to project root
        importFolder?: string | undefined;
    };
};
```

## Dictionary Files

In order to use the tool, you will need to provide a file containing the names you want to send.
Example dictionary files can be found in the `testdata` directory.
There are currently 2 different formats you can use:

### Text Files

This is the simplest type of dictionary. Simply provide a `.txt` file where each line contains
the name of something you'd like to send. This file format does not have support for alternate names.

### JSON Files

The JSON file format allows providing multiple names for a single entity. If your characters have
aliases, using this format is preferable. The first name given for an entity is assumed to be its
"main" name and will appear in the search list as this name, though it can still match on other
names when searching, and you can still select an alternate name before sending.

## Importing Dictionaries from Kanka

> [!WARNING]
> I have no affiliation with Kanka whatsoever, this project is not endorsed or sponsored by Kanka in any way.
> If you have an issue with importing Kanka data into this program, please do not contact them.

[Kanka](https://kanka.io/) is a world-building tool for TTRPGs. It has functionality to export the
articles written in it to a `.zip` file of JSON files. You can use the tool to convert a Kanka export
into a JSON dictionary which the program can then use.

To import a Kanka workspace, export it to JSON and download the `.zip` file it produces. Next
ensure a value has been set for the `importFolder` variable in your `spellbook.config.json` file.
Unzip the export file and place the resulting folder into your imports directory.

Run the application and select "Create a new dictionary" from the main menu. From there you will be
able to select the folder to import, the exact entity types you wish to import, and a filename for
the output dictionary. Once the process has completed you can load the dictionary you just created
from the "Load dictionary file" menu.

## Using the tool

- If you have not provided a default dictionary in the config, you will need to select one
- After selecting a dictionary, you can begin to send entries
- When sending entries, the tool will initially show a full list of the entire dictionary
- To narrow down the available entries, start typing in the terminal window
    - Searches are case-insensitive
    - Only results beginning with your search term, or containing a word beginning with your search
      term will be displayed
    - Entries matching the search term exactly will be shown first, followed by entries that only
      match on a word within an entry
- Use the arrow keys to traverse the list, then press enter to select an entry
- The text of that entry will be sent to the Discord channel specified in the config file
- To close the program from the Send Entries menu, press CTRL + C

## Stuff to add

- Add support for multiple names in `.txt` dictionary files
- Sort entries alphabetically on loading (maybe add config option to disable)
- Filter to only see specific entity types after loading dictionary
- After importing dictionary, ask if you want to load it
- Add more unit tests, look at mocking inquirer functions
