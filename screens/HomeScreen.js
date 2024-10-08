import React, { useState, useEffect } from 'react';
import { Button, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Dialog from 'react-native-dialog';
import { insertDeck, initDB, getDecks } from '../data/database'; // Importiere die DB-Funktionen

export const HomeScreen = ({ navigation }) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deckName, setDeckName] = useState('');
    const [decks, setDecks] = useState([]);

    // DB init + load all Decks
    useEffect(() => {
        initDB();
        loadDecks();
    }, []);

    // Async Function to get all Decks from DB
    const loadDecks = async () => {
        const fetchedDecks = await getDecks();
        setDecks(fetchedDecks);
    };

    // Function to handle creation of Deck
    const handleCreateDeck = () => {
        if (deckName.trim()) {
            insertDeck(deckName); // Insert Deck into DB
            setDialogVisible(false);
            setDeckName('');
            loadDecks(); // Refresh Deck screen
        } else {
            alert('Bitte einen gültigen Namen eingeben');
        }
    };

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
