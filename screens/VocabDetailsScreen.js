import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Dimensions } from 'react-native';
import { insertVokabel, updateVokabel, getVokabelById } from '../data/database';
import * as ImagePicker from 'expo-image-picker';
import { CameraComponent } from '../components/CameraComponent';
import styled from 'styled-components/native';

const screenWidth = Dimensions.get('window').width;

const StyledTextInput = styled(TextInput)`
    width: ${screenWidth / 2}px;
    border: 1px solid black;
    margin-left: 5px;
    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 8px;
    min-height: 40px;
`;

const StyledText = styled(Text)`
    margin-left: 5px;
`;

const PicturePickerContainer = styled(View)`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
`;

const SelectImageButton = styled(View)`
    flex: 0.8;
    margin-right: 8px;
    margin-left: 5px;
`;

const CameraButtonContainer = styled(View)`
    flex: 0.2;
`;

const SaveButton = styled(Button).attrs({
    color: 'green',
})`
    flex: 0.8;
    background-color: green;
`;

const SaveButtonContainer = styled(View)`
    justify-content: center;
    align-items: center;
`;

export const VocabDetailsScreen = ({ route, navigation }) => {
    const { deckID, vokabelID } = route.params;
    const [vocable, setVocable] = useState({
        ForeignWord: '',
        CorrectAnswer: '',
        Answer2: '',
        Answer3: '',
        Answer4: '',
        ImagePath: '',
        Score: 0,
        FK_DeckID: deckID
    });
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (vokabelID) {
            loadVocable();
        } else {
            setIsLoading(false);
        }
    }, [vokabelID]);
    const loadVocable = async () => {
        try {
            const vokabelData = await getVokabelById(vokabelID);
            if (vokabelData) {
                setVocable(vokabelData);
            } else {
                console.error('Vokabel nicht gefunden');
            }
        } catch (error) {
            Alert.alert('Fehler', 'Konnte die Vokabel nicht laden.');
            console.error('Fehler beim Laden der Vokabel:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleSave = async () => {
        if (vocable.ForeignWord.trim() === '' || vocable.CorrectAnswer.trim() === '') {
            Alert.alert('Fehler', 'Bitte fülle alle erforderlichen Felder aus.');
            return;
        }
        try {
            if (vokabelID) {
                await updateVokabel(vocable);
                Alert.alert('Erfolg', 'Vokabel erfolgreich aktualisiert.');
            } else {
                await insertVokabel({ ...vocable, Score: 0 });
                Alert.alert('Erfolg', 'Neue Vokabel hinzugefügt.');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Fehler', 'Speichern der Vokabel fehlgeschlagen.');
            console.error('Fehler beim Speichern der Vokabel:', error);
        }
    };
    const handleImageTaken = (imageUri) => {
        // Set the ImagePath in the vocable state
        setVocable({ ...vocable, ImagePath: imageUri });
    };
    const handleChoosePhoto = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Fehler', 'Zugriff auf die Galerie wurde verweigert.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setVocable({ ...vocable, ImagePath: result.assets[0].uri });
        }
    };

    if (isLoading) {
        return <Text>Lade Vokabel...</Text>;
    }

    return (
        <View>
            <StyledText>Foreign Word</StyledText>
            <StyledTextInput
                value={vocable.ForeignWord}
                onChangeText={(text) => setVocable({ ...vocable, ForeignWord: text })}
            />
            <StyledText>Correct Answer</StyledText>
            <StyledTextInput
                value={vocable.CorrectAnswer}
                onChangeText={(text) => setVocable({ ...vocable, CorrectAnswer: text })}
            />
            <StyledText>Answer 2</StyledText>
            <StyledTextInput
                value={vocable.Answer2}
                onChangeText={(text) => setVocable({ ...vocable, Answer2: text })}
            />
            <StyledText>Answer 3</StyledText>
            <StyledTextInput
                value={vocable.Answer3}
                onChangeText={(text) => setVocable({ ...vocable, Answer3: text })}
            />
            <StyledText>Answer 4</StyledText>
            <StyledTextInput
                value={vocable.Answer4}
                onChangeText={(text) => setVocable({ ...vocable, Answer4: text })}
            />
            <StyledText>Image</StyledText>
            <PicturePickerContainer>
                <SelectImageButton>
                    <Button title="Select Image" onPress={handleChoosePhoto} />
                </SelectImageButton>
                <CameraButtonContainer>
                    <CameraComponent onImageTaken={handleImageTaken} />
                </CameraButtonContainer>
            </PicturePickerContainer>
            {vocable.ImagePath ? <Text>{vocable.ImagePath}</Text> : null}
            <SaveButtonContainer>
                <SaveButton title="Save" onPress={handleSave} />
            </SaveButtonContainer>
        </View>
    );
};
