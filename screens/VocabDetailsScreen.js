import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, Button, Alert, Dimensions, Image} from 'react-native';
import { insertVokabel, updateVokabel, getVokabelById } from '../data/database';
import * as ImagePicker from 'expo-image-picker';
import { CameraComponent } from '../components/CameraComponent';
import { StyledText, StyledTextInput, StyledTextBold, PicturePickerContainer, SelectImageButton, CameraButtonContainer, SaveButton, SaveButtonContainer  } from './styles/VocabDetailsScreenStyles';

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
        if (vocable.ForeignWord.trim() === '' || vocable.CorrectAnswer.trim() === '' || vocable.Answer2.trim() === '' || vocable.Answer3.trim() === '' || vocable.Answer4.trim() === '') {
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
            <StyledTextBold>Foreign Word</StyledTextBold>
            <StyledTextInput
                value={vocable.ForeignWord}
                onChangeText={(text) => setVocable({ ...vocable, ForeignWord: text })}
            />
            <StyledTextBold>Correct Answer</StyledTextBold>
            <StyledTextInput
                value={vocable.CorrectAnswer}
                onChangeText={(text) => setVocable({ ...vocable, CorrectAnswer: text })}
            />
            <StyledTextBold>Answer 2</StyledTextBold>
            <StyledTextInput
                value={vocable.Answer2}
                onChangeText={(text) => setVocable({ ...vocable, Answer2: text })}
            />
            <StyledTextBold>Answer 3</StyledTextBold>
            <StyledTextInput
                value={vocable.Answer3}
                onChangeText={(text) => setVocable({ ...vocable, Answer3: text })}
            />
            <StyledTextBold>Answer 4</StyledTextBold>
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
            <View  style={{alignItems: "center", marginBottom: 10}}>
            {vocable.ImagePath ? <Image
                source={{ uri: vocable.ImagePath }}
                style={{ width: 200, height: 200, marginBottom: 0 }} // Setze die Bildgröße
            /> : null}
            </View>
            <SaveButtonContainer>
                <SaveButton title="Save" onPress={handleSave} />
            </SaveButtonContainer>
        </View>
    );
};
