import React, { useState, useEffect } from 'react';
import { Text, View, Image } from "react-native";
import { AnswerButtons } from "../components/AnswerButtons";
import { Question } from "../components/Question";
import { getVokabelsByDeck, updateVokabel } from '../data/database';
import styled from "styled-components/native";

const PictureView = styled(View)`
justify-content: center;
    align-items: center;
    margin-top: 16px;
`

export const GameScreen = ({ route, navigation }) => {
    const { deckID } = route.params; // deckID vom HomeScreen übergeben
    const [vocables, setVocables] = useState([]);
    const [currentVocable, setCurrentVocable] = useState(null);

    useEffect(() => {
        loadVocables();
    }, []);

    const loadVocables = async () => {
        const loadedVocables = await getVokabelsByDeck(deckID);

        const sortedVocables = loadedVocables.sort((a, b) => a.Score - b.Score);

        setVocables(sortedVocables);
        setCurrentVocable(sortedVocables[0]);
    };

    const getWeightedRandomVocable = () => {
        const maxScore = Math.max(...vocables.map((v) => v.Score));
        const weights = vocables.map((v) => maxScore - v.Score + 1);
        const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);

        let nextVocable;
        let randomPoint;

        // Repeat selection until a different question is selected
        do {
            randomPoint = Math.random() * totalWeight;

            for (let i = 0; i < vocables.length; i++) {
                if (randomPoint < weights[i]) {
                    nextVocable = vocables[i];
                    break;
                }
                randomPoint -= weights[i];
            }
        } while (nextVocable === currentVocable);  // Ensure the next question is different from the current one
        return nextVocable;
    };

    const handleAnswer = async (isCorrect) => {
        const updatedVocables = vocables.map((vocable) => {
            if (vocable === currentVocable) {
                const updatedScore = isCorrect ? vocable.Score + 1 : vocable.Score - 1;
                const updatedVocable = {
                    ...vocable,
                    Score: updatedScore,
                };
                updateVokabel(updatedVocable);
                return updatedVocable;
            }
            return vocable;
        });

        setVocables(updatedVocables); // Update the state with the new vocable scores

        // Select the next vocable using weighted random selection
        const nextVocable = getWeightedRandomVocable();
        setCurrentVocable(nextVocable);
    };

    if (!currentVocable) {
        return <Text>Loading...</Text>;
    }

    return (
        <>
        <View>
            <PictureView>
            {currentVocable.ImagePath ? (
                <Image
                    source={{ uri: currentVocable.ImagePath }}
                    style={{ width: 300, height: 300, marginBottom: 0 }} // Setze die Bildgröße
                />
            ) : null}
            </PictureView>
            <Question questionWord={currentVocable.ForeignWord} />
            <Text>Score: {currentVocable.Score}</Text>
            <AnswerButtons vocables={[currentVocable]} onAnswer={handleAnswer} />
        </View>
        </>
    );
};
