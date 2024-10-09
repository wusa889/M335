import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getVokabelsByDeck, getDeckById } from '../data/database';
import { DeckName, VocabListcreenContainer } from "./styles/VocabListScreenStyles";
import { VocabFlatlistItem } from '../components/VocabFlatlistItem'

export const VocabListScreen = ({ route, navigation }) => {
    const { deckID } = route.params; // Get id of selected Deck from Homescreen
    const [vokabeln, setVokabeln] = useState([]);
    const [deckName, setDeckName] = useState('');

    const loadDeckName = async () => {
        try {
            const deckGotten = await getDeckById(deckID);
            setDeckName(deckGotten.Name); // Setzt den Namen des Decks in den State
        } catch (error) {
            console.error('Fehler beim Laden des Decks:', error);
        }
    };

    loadDeckName();

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
        <VocabListcreenContainer>
            <DeckName>{deckName}</DeckName>
            <Button
                title="New Vocable"
                onPress={() => navigation.navigate('VocabDetailsScreen', { deckID: deckID })}
            />
            <FlatList
                data={vokabeln}
                keyExtractor={item => item.UniqueID.toString()}
                renderItem={({ item }) => ( <VocabFlatlistItem navigation={navigation} deckID={deckID} item={item} />

                )}
            />
        </VocabListcreenContainer>
    );
};
