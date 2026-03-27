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
    };
};
```

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
