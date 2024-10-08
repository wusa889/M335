import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { insertVokabel, updateVokabel, getVokabelById } from '../data/database';

export const VocabDetailsScreen = ({ route, navigation }) => {
    const { deckID, vokabelID } = route.params; // params: deckID and vokabelID
    const [vocable, setVocable] = useState({
        ForeignWord: '',
        CorrectAnswer: '',
        Answer2: '',
        Answer3: '',
        Answer4: '',
        Score: 0,
        FK_DeckID: deckID
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (vokabelID) {
            loadVocable();
        } else {
            setIsLoading(false); // Skip steps to create new Vocable if not in Update mode
        }
    }, [vokabelID]);

    const loadVocable = async () => {
        try {
            const vokabelData = await getVokabelById(vokabelID);
            if (vokabelData) {
                setVocable(vokabelData); // Prepare input fields with values of loaded Vocable
            } else {
                console.error('Vokabel nicht gefunden');
            }
        } catch (error) {
            Alert.alert('Fehler', 'Konnte die Vokabel nicht laden.');
            console.error('Fehler beim Laden der Vokabel:', error); // Log error
        } finally {
            setIsLoading(false);
        }
    };

    // Handle save event
    const handleSave = async () => {
        if (vocable.ForeignWord.trim() === '' || vocable.CorrectAnswer.trim() === '') {
            Alert.alert('Fehler', 'Bitte fülle alle erforderlichen Felder aus.');
            return;
        }

        try {
            if (vokabelID) {
                await updateVokabel(vocable); // Updates a Vocable if existing one was loaded
                Alert.alert('Erfolg', 'Vokabel erfolgreich aktualisiert.');
            } else {
                await insertVokabel({ ...vocable, Score: 0 }); // Creates new Vocable with Score 0
                Alert.alert('Erfolg', 'Neue Vokabel hinzugefügt.');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Fehler', 'Speichern der Vokabel fehlgeschlagen.');
            console.error('Fehler beim Speichern der Vokabel:', error); // Log Error
        }
    };

    if (isLoading) {
        return <Text>Lade Vokabel...</Text>;
    }

    return (
        <View>
            <Text>Foreign Word</Text>
            <TextInput
                value={vocable.ForeignWord}
                onChangeText={(text) => setVocable({ ...vocable, ForeignWord: text })}
            />

            <Text>Correct Answer</Text>
            <TextInput
                value={vocable.CorrectAnswer}
                onChangeText={(text) => setVocable({ ...vocable, CorrectAnswer: text })}
            />

            <Text>Answer 2</Text>
            <TextInput
                value={vocable.Answer2}
                onChangeText={(text) => setVocable({ ...vocable, Answer2: text })}
            />

            <Text>Answer 3</Text>
            <TextInput
                value={vocable.Answer3}
                onChangeText={(text) => setVocable({ ...vocable, Answer3: text })}
            />

            <Text>Answer 4</Text>
            <TextInput
                value={vocable.Answer4}
                onChangeText={(text) => setVocable({ ...vocable, Answer4: text })}
            />

            <Button title="Save" onPress={handleSave} />
        </View>
    );
};
