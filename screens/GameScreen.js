import React, { useState } from 'react';
import { Text, View } from "react-native";
import { AnswerButtons } from "../components/AnswerButtons";
import { Question } from "../components/Question";

const Deck = {
    name: "MyTestDeck",
    vocables: [
        {
            Score: 0,
            correctAnswer: "A",
            Answer2: "B",
            Answer3: "C",
            Answer4: "D",
            ForeignWord: "Test 1",
            ImagePath: "",
        },
        {
            Score: 0,
            correctAnswer: "A",
            Answer2: "B",
            Answer3: "C",
            Answer4: "D",
            ForeignWord: "Test 2",
            ImagePath: "",
        },
        {
            Score: 0,
            correctAnswer: "A",
            Answer2: "B",
            Answer3: "C",
            Answer4: "D",
            ForeignWord: "Test 3",
            ImagePath: "",
        },
    ],
};

export const GameScreen = () => {
    const [vocables, setVocables] = useState(Deck.vocables);
    const [currentVocable, setCurrentVocable] = useState(vocables[0]);

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

    return (
        <View>
            <Question questionWord={currentVocable.ForeignWord} />
            <Text>Current Question: {currentVocable.ForeignWord}</Text>
            <Text>Score for current question: {currentVocable.Score}</Text>
            <AnswerButtons vocables={[currentVocable]} onAnswer={handleAnswer} />
        </View>
    );
};