import React, { useState } from "react";
import { Button } from "react-native-paper";
import {Platform, View} from "react-native";
import styled from "styled-components/native";

const RowView = styled(View)`
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 16px;
`;

const QuadView = styled(View)`
    flex: 1;
`;

const ContainerView = styled(View)`
margin-top: 10px;
`

export const AnswerButtons = ({ vocables, onAnswer }) => {
    const [currentVocableIndex, setCurrentVocableIndex] = useState(0);

    const currentVocable = vocables[currentVocableIndex];

    // Randomize answer options for the current vocable
    const getShuffledAnswers = () => {
        const answers = [
            currentVocable.CorrectAnswer,
            currentVocable.Answer2,
            currentVocable.Answer3,
            currentVocable.Answer4,
        ];
        return answers.sort(() => Math.random() - 0.5);
    };

    // Handles answere and gives it back to parent component
    const handleAnswer = (selectedAnswer) => {
        if (selectedAnswer === currentVocable.CorrectAnswer) {
            onAnswer(true); // Correct answer
        } else {
            onAnswer(false); // Incorrect answer
        }
    };

    const shuffledAnswers = getShuffledAnswers();

    return (
        <>
            <ContainerView>
            <RowView>
                <QuadView>
                    <Button
                        mode="outlined"
                        textColor="black"
                        onPress={() => handleAnswer(shuffledAnswers[0])}
                    >
                        {shuffledAnswers[0]}
                    </Button>
                </QuadView>
                <QuadView>
                    <Button
                        mode="outlined"
                        textColor="black"
                        onPress={() => handleAnswer(shuffledAnswers[1])}
                    >
                        {shuffledAnswers[1]}
                    </Button>
                </QuadView>
            </RowView>
            <RowView>
                <QuadView>
                    <Button
                        mode="outlined"
                        textColor="black"
                        onPress={() => handleAnswer(shuffledAnswers[2])}
                    >
                        {shuffledAnswers[2]}
                    </Button>
                </QuadView>
                <QuadView>
                    <Button
                        mode="outlined"
                        textColor="black"
                        onPress={() => handleAnswer(shuffledAnswers[3])}
                    >
                        {shuffledAnswers[3]}
                    </Button>
                </QuadView>
            </RowView>
            </ContainerView>
        </>
    );
};