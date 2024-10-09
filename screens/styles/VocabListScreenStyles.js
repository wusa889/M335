import styled from "styled-components/native";
import { View, Text, Button, TouchableOpacity, SafeAreaView } from 'react-native';

export const VocabButtonContainer = styled(View)`
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`;

export const VocabDeleteButton = styled(Button).attrs({ color: "red" })`
    flex: 0.4;
    align-self: flex-end;
`;

export const VocabListcreenContainer = styled(SafeAreaView)`
    flex: 1;
    padding: 16px;
    margin-bottom: 50px;
`;
export const VocabContainer = styled(View)`
    border: black solid 1px;
    padding: 5px;
    margin-bottom: 2px;
    margin-top: 10px;

`;
export const DeckName = styled(Text)`
    font-family: "Roboto";
    font-weight: bold;
    padding-bottom: 10px;
    padding-top: 10px;
    font-size: 30px;
    text-decoration: underline;
`;

export const VocabText = styled(Text)`

`