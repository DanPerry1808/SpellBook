import { readFileSync } from "node:fs";
import { z } from "zod";

const DEFAULT_DICTIONARY_FOLDER = "dictionaries";

const dictionaryConfig = z.strictObject({
    dictionaryFolder: z.string().default(DEFAULT_DICTIONARY_FOLDER),
    defaultDictionaryFilename: z.string().optional(),
    importFolder: z.string().optional(),
});

export type DictionaryConfig = z.infer<typeof dictionaryConfig>;

const configSchema = z.strictObject({
    discord: z.strictObject({
        botToken: z.string(),
        channelId: z.string(),
    }),
    dictionaries: dictionaryConfig,
});

export type ConfigFile = z.infer<typeof configSchema>;

export const loadConfig = (filepath: string): ConfigFile => {
    const configData = readFileSync(filepath, { encoding: "utf-8" });
    const configJson = JSON.parse(configData);
    const result = configSchema.parse(configJson);
    return result;
};
