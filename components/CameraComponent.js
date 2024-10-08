import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

const CameraComponent = () => {
    const [image, setImage] = useState(null);

    const openCamera = async () => {
        // Get Camera Permissions
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Kamera-Zugriff wurde verweigert!');
            return;
        }

        // Open Camera to take picture
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });

        // DebugLog - Whole Result
        console.log("Result der Kamera:", result);

        if (result.cancelled) {
            console.log("Der Benutzer hat die Kamera abgebrochen.");
        } else if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
            const imageUri = result.assets[0].uri;
            console.log("Bild wurde aufgenommen:", imageUri);

            // Set Image Path
            setImage(imageUri);

            // Save Image to Gallery
            await saveImageToGallery(imageUri);
        } else {
            console.log("Kein gültiger Bildpfad vorhanden.");
        }
    };

    const saveImageToGallery = async (imageUri) => {
        console.log("Speichern des Bildes in der Galerie...");
        try {
            // Berechtigung zur Nutzung der Mediathek anfordern
            const {status} = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Mediathek-Zugriff wurde verweigert!');
                return;
            }
            console.log("Mediathek-Zugriff gewährt.");

            // Create picture Asset
            const asset = await MediaLibrary.createAssetAsync(imageUri);

            // Create new Album if not exist and save picture asset in it
            await MediaLibrary.createAlbumAsync('VocabApp Photos', asset, false);
        } catch (error) {
            console.error("Fehler beim Speichern des Bildes in der Galerie:", error);
        }
    };

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Button title="Foto machen" onPress={openCamera}/>
            {image && <Text>Bild Pfad: {image}</Text>}
        </View>
    );
};

export default CameraComponent;
