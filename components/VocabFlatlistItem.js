import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {VocabContainer, VocabDeleteButton, VocabButtonContainer, VocabText} from '../screens/styles/VocabListScreenStyles'


export const VocabFlatlistItem = ({navigation, item, deckID}) => {
    return (
        <VocabContainer>
            <TouchableOpacity
                onPress={() => navigation.navigate('VocabDetailsScreen', {deckID: deckID, vokabelID: item.UniqueID})}
            >
                <VocabText>{item.ForeignWord} - {item.CorrectAnswer}</VocabText>
                <VocabButtonContainer>
                    <VocabDeleteButton title={"Delete"}/>
                </VocabButtonContainer>
            </TouchableOpacity>
        </VocabContainer>
    )
}
