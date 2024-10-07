import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
    justify-content: center;
    align-items: center;
    padding: 50px;
`;

const QuestionStyle = styled.Text`
    font-weight: bold;
    font-size: 16px;
    font-family: Roboto;
    text-align: center;
`;

export const Question = ({ questionWord }) => {
    return (
        <Container>
            <QuestionStyle>{questionWord}</QuestionStyle>
        </Container>
    );
};