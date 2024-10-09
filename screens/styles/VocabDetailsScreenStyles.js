import {Button, Dimensions, Text, TextInput, View} from "react-native";
import styled from "styled-components/native";


const screenWidth = Dimensions.get('window').width;

export const StyledTextInput = styled(TextInput)`
    width: ${screenWidth / 2}px;
    border: 1px solid black;
    margin-left: 5px;
    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 8px;
    min-height: 40px;
`;

export const StyledTextBold = styled(Text)`
    margin-left: 5px;
    font-weight: bold;
`;

export const StyledText = styled(Text)`
    margin-left: 5px;
`;

export const PicturePickerContainer = styled(View)`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
`;

export const SelectImageButton = styled(View)`
    flex: 0.8;
    margin-right: 8px;
    margin-left: 5px;
`;

export const CameraButtonContainer = styled(View)`
    flex: 0.2;
`;

export const SaveButton = styled(Button).attrs({
    color: 'green',
})`
    flex: 0.8;
    background-color: green;
`;

export const SaveButtonContainer = styled(View)`
    justify-content: center;
    align-items: center;
`;