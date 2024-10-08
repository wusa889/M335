import React, { useState, useEffect } from 'react';
import { Text, View } from "react-native";
import { AnswerButtons } from "../components/AnswerButtons";
import { Question } from "../components/Question";
import { getVokabelsByDeck } from '../data/database';

export const GameScreen = ({ route, navigation }) => {
    const { deckID } = route.params; // deckID vom HomeScreen übergeben
    const [vocables, setVocables] = useState([]);
    const [currentVocable, setCurrentVocable] = useState(null);

    useEffect(() => {
        loadVocables();
    }, []);

    const loadVocables = async () => {
        const loadedVocables = await getVokabelsByDeck(deckID);
        setVocables(loadedVocables);
        setCurrentVocable(loadedVocables[0]);
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

    const handleAnswer = (isCorrect) => {
        const updatedVocables = vocables.map((vocable) => {
            if (vocable === currentVocable) {
                return {
                    ...vocable,
                    Score: isCorrect ? vocable.Score + 1 : vocable.Score - 1,
                };
            }
            return vocable;
        });

        setVocables(updatedVocables); // Update the state with the new vocable scores

        // Select the next vocable using weighted random selection
        const nextVocable = getWeightedRandomVocable();
        setCurrentVocable(nextVocable);
    };

    if (!currentVocable) {
        return <Text>Loading...</Text>; // Zeige einen Ladezustand an, solange keine Vokabel geladen wurde
    }

    return (
        <View>
            <Question questionWord={currentVocable.ForeignWord} />
            <Text>Current Question: {currentVocable.ForeignWord}</Text>
            <Text>Score for current question: {currentVocable.Score}</Text>
            <AnswerButtons vocables={[currentVocable]} onAnswer={handleAnswer} />
        </View>
    );
};
