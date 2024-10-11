import React, { useState, useEffect } from 'react';
import { Button, Text, View, FlatList, ActivityIndicator } from 'react-native';
import Dialog from 'react-native-dialog';

import { insertDeck, initDB, getDecks } from '../data/database';
import {DeckFlatListItem} from "../components/DeckFlatlistItem";
import { HomeScreenContainer } from "./styles/HomeScreenStyles"

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

    // Handles deletion of a Deck
    const handleDeleteDeck = (deckID) => {
        setDecks((prevDecks) => prevDecks.filter((deck) => deck.ID !== deckID));
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
        <HomeScreenContainer>
            <Button title="Create New Deck" onPress={() => setDialogVisible(true)} />
        <View>
            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title>Create New Deck</Dialog.Title>
                <Dialog.Input
                    placeholder="Deck Name"
                    value={deckName}
                    onChangeText={setDeckName}
                />
                <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
                <Dialog.Button label="Create" onPress={handleCreateDeck} />
            </Dialog.Container>

            <FlatList
                data={decks}
                keyExtractor={item => item.ID.toString()}
                renderItem={({ item }) => (
                    <DeckFlatListItem item={item} navigation={navigation} onDelete={handleDeleteDeck} />
                )}
            />
        </View>
        </HomeScreenContainer>
    );
};