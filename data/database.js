import * as SQLite from 'expo-sqlite';

// open or create DB
async function openDatabase() {
    const db = await SQLite.openDatabaseAsync('vocabApp.db');
    return db;
}

// Init DB if no DB present
export async function initDB() {
    const db = await openDatabase();

    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS Deck (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      Name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS Vokabel (
      UniqueID INTEGER PRIMARY KEY AUTOINCREMENT,
      Score REAL,
      CorrectAnswer TEXT,
      Answer2 TEXT,
      Answer3 TEXT,
      Answer4 TEXT,
      ForeignWord TEXT,
      ImagePath TEXT,
      FK_DeckID INTEGER,
      FOREIGN KEY(FK_DeckID) REFERENCES Deck(ID)
    );
  `);

}

// Insert new Deck
export async function insertDeck(name) {
    const db = await openDatabase();

    const result = await db.runAsync('INSERT INTO Deck (Name) VALUES (?);', [name]);
    console.log('Neues Deck eingefügt mit ID:', result.lastInsertRowId);
}

// Insert new Vocable
export async function insertVokabel(vokabel) {
    const db = await openDatabase();

    const result = await db.runAsync(
        'INSERT INTO Vokabel (Score, CorrectAnswer, Answer2, Answer3, Answer4, ForeignWord, ImagePath, FK_DeckID) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [
            vokabel.Score,
            vokabel.CorrectAnswer,
            vokabel.Answer2,
            vokabel.Answer3,
            vokabel.Answer4,
            vokabel.ForeignWord,
            vokabel.ImagePath,
            vokabel.FK_DeckID,
        ]
    );
}

// Get all Decks
export async function getDecks() {
    const db = await openDatabase();
    const rows = await db.getAllAsync('SELECT * FROM Deck;');
    return rows;
}

// Get all Vocables from specified Deck
export async function getVokabelsByDeck(deckID) {
    const db = await openDatabase();
    const rows = await db.getAllAsync('SELECT * FROM Vokabel WHERE FK_DeckID = ?;', [deckID]);
    return rows;
}

// Get specific Vocable by ID
export const getVokabelById = async (vokabelID) => {
    const db = await openDatabase(); // Öffne die Datenbank asynchron

    try {
        const result = await db.getFirstAsync('SELECT * FROM Vokabel WHERE UniqueID = ?', [vokabelID]);
        if (result) {
            return result;
        } else {
            throw new Error('Keine Vokabel mit dieser ID gefunden');
        }
    } catch (error) {
        console.error('Fehler beim Laden der Vokabel:', error);
        throw error;
    }
};

// Update existing Vocable by ID
export const updateVokabel = async (vocable) => {
    const db = await openDatabase(); // Öffne die Datenbank asynchron

    try {
        const result = await db.runAsync(
            'UPDATE Vokabel SET ForeignWord = ?, CorrectAnswer = ?, Answer2 = ?, Answer3 = ?, Answer4 = ?, Score = ?, ImagePath = ? WHERE UniqueID = ?;',
            [vocable.ForeignWord, vocable.CorrectAnswer, vocable.Answer2, vocable.Answer3, vocable.Answer4, vocable.Score, vocable.ImagePath, vocable.UniqueID]
        );
        return result;
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Vokabel:', error);
        throw error;
    }
};

