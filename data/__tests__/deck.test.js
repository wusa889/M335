import { insertDeck, getDecks, getDeckById, deleteDeckById } from '../database';
import * as SQLite from 'expo-sqlite';

jest.mock('expo-sqlite', () => {
    const runAsyncMock = jest.fn();
    const getAllAsyncMock = jest.fn();
    const getFirstAsyncMock = jest.fn();
    return {
        openDatabaseAsync: jest.fn(() => ({
            runAsync: runAsyncMock,
            getAllAsync: getAllAsyncMock,
            getFirstAsync: getFirstAsyncMock,
        })),
    };
});

describe('Deck functions', () => {
    let mockDB;

    beforeEach(() => {
        mockDB = SQLite.openDatabaseAsync();
    });

    it('should insert a new deck and return its ID', async () => {
        const deckName = 'Test Deck';
        mockDB.runAsync.mockResolvedValueOnce({ lastInsertRowId: 1 });

        await insertDeck(deckName);

        expect(mockDB.runAsync).toHaveBeenCalledWith(
            'INSERT INTO Deck (Name) VALUES (?);',
            [deckName]
        );
    });

    it('should retrieve all decks', async () => {
        const mockDecks = [{ ID: 1, Name: 'Test Deck' }, { ID: 2, Name: 'Another Deck' }];
        mockDB.getAllAsync.mockResolvedValue(mockDecks);

        const decks = await getDecks();

        expect(decks).toEqual(mockDecks);
        expect(mockDB.getAllAsync).toHaveBeenCalledWith('SELECT * FROM Deck;');
    });

    it('should retrieve a deck by ID', async () => {
        const mockDeck = { ID: 1, Name: 'Test Deck' };
        mockDB.getFirstAsync.mockResolvedValue(mockDeck);

        const deck = await getDeckById(1);

        expect(deck).toEqual(mockDeck);
        expect(mockDB.getFirstAsync).toHaveBeenCalledWith('SELECT * FROM Deck WHERE ID = ?', [1]);
    });

    it('should delete a deck by ID', async () => {
        mockDB.runAsync.mockResolvedValueOnce(true);

        await deleteDeckById(1);

        expect(mockDB.runAsync).toHaveBeenCalledWith('DELETE FROM Deck WHERE ID = ?', [1]);
    });
});
