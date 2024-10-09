import styled from "styled-components/native";
import {View, TouchableOpacity, Button, Text, SafeAreaView} from 'react-native';

export const HomeScreenContainer = styled(SafeAreaView)`
    flex: 1;
    padding: 16px;
    margin-bottom: 50px;
`
export const DeckContainer = styled(View)`
    border: black solid 1px;
    padding: 5px;
    margin-bottom: 2px;
    margin-top: 10px
`
export const DeckName = styled(Text)`
    font-family: "Roboto";
    font-weight: bold;
    margin-left: 8px;
    padding-bottom: 10px;
    padding-top: 10px;
`
export const DeckButtonContainer = styled(View)`
    flex-direction: row;
    justify-content: space-between; 
    align-items: center; 
    padding: 8px;
`;

export const DeckAddVocabButton = styled(Button).attrs({ color: "green" })`
    flex: 0.4;
`;

export const DeckDeleteButton = styled(Button).attrs({ color: "red" })`
    flex: 0.4;
    align-self: flex-end;
`;