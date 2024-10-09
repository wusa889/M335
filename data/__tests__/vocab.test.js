import { insertVokabel, getVokabelsByDeck, getVokabelById, updateVokabel, deleteVokabelById } from '../database';
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

describe('Vocable functions', () => {
    let mockDB;

    beforeEach(() => {
        mockDB = SQLite.openDatabaseAsync();
    });

    it('should insert a new vocable into the deck', async () => {
        const vokabel = {
            Score: 0,
            CorrectAnswer: 'Correct Answer',
            Answer2: 'Wrong Answer 2',
            Answer3: 'Wrong Answer 3',
            Answer4: 'Wrong Answer 4',
            ForeignWord: 'Test Word',
            ImagePath: '/test/path/image.jpg',
            FK_DeckID: 1,
        };
        mockDB.runAsync.mockResolvedValueOnce({ lastInsertRowId: 1 });

        await insertVokabel(vokabel);

        expect(mockDB.runAsync).toHaveBeenCalledWith(
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
    });

    it('should retrieve all vocables for a deck', async () => {
        const mockVokabeln = [
            { UniqueID: 1, ForeignWord: 'Test Word', CorrectAnswer: 'Correct Answer', FK_DeckID: 1 },
            { UniqueID: 2, ForeignWord: 'Another Word', CorrectAnswer: 'Another Answer', FK_DeckID: 1 }
        ];
        mockDB.getAllAsync.mockResolvedValue(mockVokabeln);

        const vokabeln = await getVokabelsByDeck(1);

        expect(vokabeln).toEqual(mockVokabeln);
        expect(mockDB.getAllAsync).toHaveBeenCalledWith('SELECT * FROM Vokabel WHERE FK_DeckID = ?;', [1]);
    });

    it('should retrieve a vocable by ID', async () => {
        const mockVokabel = { UniqueID: 1, ForeignWord: 'Test Word', CorrectAnswer: 'Correct Answer' };
        mockDB.getFirstAsync.mockResolvedValue(mockVokabel);

        const vokabel = await getVokabelById(1);

        expect(vokabel).toEqual(mockVokabel);
        expect(mockDB.getFirstAsync).toHaveBeenCalledWith('SELECT * FROM Vokabel WHERE UniqueID = ?', [1]);
    });

    it('should update a vocable by ID', async () => {
        const updatedVokabel = {
            UniqueID: 1,
            ForeignWord: 'Updated Word',
            CorrectAnswer: 'Updated Answer',
            Answer2: 'Updated Answer 2',
            Answer3: 'Updated Answer 3',
            Answer4: 'Updated Answer 4',
            Score: 1.5,
            ImagePath: '/new/path/image.jpg',
        };

        await updateVokabel(updatedVokabel);

        expect(mockDB.runAsync).toHaveBeenCalledWith(
            'UPDATE Vokabel SET ForeignWord = ?, CorrectAnswer = ?, Answer2 = ?, Answer3 = ?, Answer4 = ?, Score = ?, ImagePath = ? WHERE UniqueID = ?;',
            [
                updatedVokabel.ForeignWord,
                updatedVokabel.CorrectAnswer,
                updatedVokabel.Answer2,
                updatedVokabel.Answer3,
                updatedVokabel.Answer4,
                updatedVokabel.Score,
                updatedVokabel.ImagePath,
                updatedVokabel.UniqueID,
            ]
        );
    });

    it('should delete a vocable by ID', async () => {
        mockDB.runAsync.mockResolvedValueOnce(true);

        await deleteVokabelById(1);

        expect(mockDB.runAsync).toHaveBeenCalledWith('DELETE FROM Vokabel WHERE UniqueID = ?', [1]);
    });
});
