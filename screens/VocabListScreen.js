import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getVokabelsByDeck } from '../data/database'; // Importiere die DB-Funktionen

export const VocabListScreen = ({ route, navigation }) => {
    const { deckID } = route.params; // deckID aus dem HomeScreen übergeben
    const [vokabeln, setVokabeln] = useState([]);

    useFocusEffect(
        useCallback(() => {
            loadVokabeln();
        }, [])
    );

    const loadVokabeln = async () => {
        try {
            const vokabelList = await getVokabelsByDeck(deckID);
            setVokabeln(vokabelList);
        } catch (error) {
            console.log('Fehler beim Laden der Vokabeln:', error);
        }
    };

    return (
        <View>
            <Text>Vokabeln für Deck: {deckID}</Text>

            <FlatList
                data={vokabeln}
                keyExtractor={item => item.UniqueID.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('VocabDetailsScreen', { deckID: deckID, vokabelID: item.UniqueID })}
                    >
                        <Text>{item.ForeignWord}</Text>
                    </TouchableOpacity>
                )}
            />

            <Button
                title="Neue Vokabel hinzufügen"
                onPress={() => navigation.navigate('VocabDetailsScreen', { deckID: deckID })}
            />
        </View>
    );
};
