import React from 'react';
import { View, TouchableOpacity, Button, Text, Alert  } from 'react-native';
import { DeckName, DeckContainer, DeckButtonContainer, DeckAddVocabButton, DeckDeleteButton } from "../screens/styles/HomeScreenStyles"
import { deleteDeckById } from '../data/database';

export const DeckFlatListItem = ({ navigation, item, onDelete  }) => {

    const handleDelete = async () => {
        Alert.alert(
            "Deck löschen",
            "Bist du sicher, dass du dieses Deck löschen möchtest?",
            [
                {
                    text: "Nein",
                    onPress: null,
                    style: "cancel"
                },
                {
                    text: "Ja",
                    onPress: async () => {
                        try {
                            await deleteDeckById(item.ID);
                            if (onDelete) {
                                onDelete(item.ID);
                            }
                        } catch (error) {
                            console.error('Fehler beim Löschen des Decks:', error);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <DeckContainer>
            <TouchableOpacity
                onPress={() => navigation.navigate('GameScreen', { deckID: item.ID })}
            >
                <DeckName>{item.Name}</DeckName>
            <DeckButtonContainer>
            <DeckAddVocabButton
                title="Add Vocab"
                onPress={() => navigation.navigate('VocabListScreen', { deckID: item.ID })}
            />
                <DeckDeleteButton
                title="Delete"
                onPress={handleDelete}
                />
                </DeckButtonContainer>
            </TouchableOpacity>
        </DeckContainer>
    );
};
