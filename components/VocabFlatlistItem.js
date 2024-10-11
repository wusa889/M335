import React from "react";
import {Alert ,Text, TouchableOpacity, View} from "react-native";
import {VocabContainer, VocabDeleteButton, VocabButtonContainer, VocabText} from '../screens/styles/VocabListScreenStyles'
import { deleteVokabelById} from "../data/database";


export const VocabFlatlistItem = ({navigation, item, deckID, onVocabDeleted }) => {

    // Handles deletion of Vocables
    const handleDeleteVocab = async () => {
        // As user again if he really wants to delete
        Alert.alert(
            'Delete vocable',
            'Are you sure you want to delete this vocable?',
            [
                { text: 'No', style: 'cancel' },
                // On yes delete Vocable
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
