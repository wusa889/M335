import React, { useState, useEffect } from 'react';
import { Button, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Dialog from 'react-native-dialog';
import { insertDeck, initDB, getDecks } from '../data/database'; // Importiere die DB-Funktionen

export const HomeScreen = ({ navigation }) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deckName, setDeckName] = useState('');
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state

    // DB init + load all Decks
    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                await initDB(); // Ensure the database is initialized
                await loadDecks(); // Load decks after DB is initialized
            } catch (err) {
                setError('Fehler beim Laden der Datenbank.'); // Set error message if something goes wrong
                console.error('Datenbank-Fehler:', err);
            } finally {
                setLoading(false); // Ensure loading stops
            }
        };

        initializeDatabase();
    }, []);

    // Async Function to get all Decks from DB
    const loadDecks = async () => {
        try {
            const fetchedDecks = await getDecks();
            setDecks(fetchedDecks);
        } catch (err) {
            setError('Fehler beim Laden der Decks.');
            console.error('Fehler beim Abrufen der Decks:', err);
        }
    };

    // Function to handle creation of Deck
    const handleCreateDeck = async () => {
        if (deckName.trim()) {
            try {
                await insertDeck(deckName); // Insert Deck into DB
                setDialogVisible(false);
                setDeckName('');
                await loadDecks(); // Refresh Deck screen after adding new deck
            } catch (err) {
                setError('Fehler beim Hinzufügen des Decks.');
                console.error('Fehler beim Hinzufügen des Decks:', err);
            }
        } else {
            alert('Bitte einen gültigen Namen eingeben');
        }
    };

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Lade Decks...</Text>
            </View>
        );
    }

    // Show error message if there's an error
    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View>
            <Button title="Neues Deck erstellen" onPress={() => setDialogVisible(true)} />
            {/* Alert to create a new Deck */}
            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title>Neues Deck erstellen</Dialog.Title>
                <Dialog.Input
                    placeholder="Deck Name"
                    value={deckName}
                    onChangeText={setDeckName}
                />
                <Dialog.Button label="Abbrechen" onPress={() => setDialogVisible(false)} />
                <Dialog.Button label="Erstellen" onPress={handleCreateDeck} />
            </Dialog.Container>

            {/* List of all existing Decks */}
            <FlatList
                data={decks}
                keyExtractor={item => item.ID.toString()}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('GameScreen', { deckID: item.ID })}
                        >
                            <Text>{item.Name}</Text>
                        </TouchableOpacity>
                        <Button
                            title="Vokabeln hinzufügen"
                            onPress={() => navigation.navigate('VocabListScreen', { deckID: item.ID })}
                        />
                    </View>
                )}
            />
        </View>
    );
};
