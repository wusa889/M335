import React from "react";
import {Alert ,Text, TouchableOpacity, View} from "react-native";
import {VocabContainer, VocabDeleteButton, VocabButtonContainer, VocabText} from '../screens/styles/VocabListScreenStyles'
import { deleteVokabelById} from "../data/database";


export const VocabFlatlistItem = ({navigation, item, deckID, onVocabDeleted }) => {

    const handleDeleteVocab = async () => {
        Alert.alert(
            'Vokabel löschen',
            'Bist du sicher, dass du diese Vokabel löschen möchtest?',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: async () => {
                        try {
                            await deleteVokabelById(item.UniqueID);
                            onVocabDeleted();
                        } catch (error) {
                            console.error('Fehler beim Löschen der Vokabel:', error);
                        }
                    }},
            ]
        );
    };

    return (
        <VocabContainer>
            <TouchableOpacity
                onPress={() => navigation.navigate('VocabDetailsScreen', {deckID: deckID, vokabelID: item.UniqueID})}
            >
                <VocabText>{item.ForeignWord} - {item.CorrectAnswer}</VocabText>
                <VocabButtonContainer>
                    <VocabDeleteButton title={"Delete"} onPress={handleDeleteVocab}/>
                </VocabButtonContainer>
            </TouchableOpacity>
        </VocabContainer>
    )
}
