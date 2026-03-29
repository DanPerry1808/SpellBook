export enum EntityType {
    CHARACTER = 1,
    FAMILY = 2,
    LOCATION = 3,
    ORGANISATION = 4,
    ITEM = 5,
    NOTE = 6,
    EVENT = 7,
    CALENDAR = 8,
    RACE = 9,
    QUEST = 10,
    JOURNAL = 11,
    TAG = 12,
    ABILITY = 16,
    MAP = 17,
    TIMELINE = 18,
    CREATURE = 20,
}

export type EntityTypeInfo = {
    id: EntityType;
    importDirectory: string;
    displayName: string;
    inBasicImport: boolean;
};

export const ENTITY_TYPES: EntityTypeInfo[] = [
    {
        id: EntityType.ABILITY,
        importDirectory: "abilities",
        displayName: "Abilities",
        inBasicImport: false,
    },
    {
        id: EntityType.CALENDAR,
        importDirectory: "calendars",
        displayName: "Calendars",
        inBasicImport: false,
    },
    {
        id: EntityType.CHARACTER,
        importDirectory: "characters",
        displayName: "Characters",
        inBasicImport: true,
    },
    {
        id: EntityType.CREATURE,
        importDirectory: "creatures",
        displayName: "Creatures",
        inBasicImport: true,
    },
    {
        id: EntityType.EVENT,
        importDirectory: "events",
        displayName: "Events",
        inBasicImport: true,
    },
    {
        id: EntityType.FAMILY,
        importDirectory: "families",
        displayName: "Families",
        inBasicImport: true,
    },
    {
        id: EntityType.ITEM,
        importDirectory: "items",
        displayName: "Items",
        inBasicImport: true,
    },
    {
        id: EntityType.JOURNAL,
        importDirectory: "journals",
        displayName: "Journals",
        inBasicImport: false,
    },
    {
        id: EntityType.LOCATION,
        importDirectory: "locations",
        displayName: "Locations",
        inBasicImport: true,
    },
    {
        id: EntityType.MAP,
        importDirectory: "maps",
        displayName: "Map",
        inBasicImport: false,
    },
    {
        id: EntityType.NOTE,
        importDirectory: "notes",
        displayName: "Notes",
        inBasicImport: false,
    },
    {
        id: EntityType.ORGANISATION,
        importDirectory: "organisations",
        displayName: "Organisations",
        inBasicImport: true,
    },
    {
        id: EntityType.QUEST,
        importDirectory: "quests",
        displayName: "Quests",
        inBasicImport: false,
    },
    {
        id: EntityType.RACE,
        importDirectory: "races",
        displayName: "Races",
        inBasicImport: true,
    },
    {
        id: EntityType.TAG,
        importDirectory: "tags",
        displayName: "Tags",
        inBasicImport: false,
    },
    {
        id: EntityType.TIMELINE,
        importDirectory: "timelines",
        displayName: "Timelines",
        inBasicImport: false,
    },
];
