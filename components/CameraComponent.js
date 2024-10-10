import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export const CameraComponent = ({ onImageTaken }) => {
    const [image, setImage] = useState(null);

    const openCamera = async () => {
        // Get Camera Permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
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

        if (result.cancelled) {
            console.log("Der Benutzer hat die Kamera abgebrochen.");
        } else if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
            const imageUri = result.assets[0].uri;
            console.log("Bild wurde aufgenommen:", imageUri);

            // Set Image Path
            setImage(imageUri);

            // Pass the image URI to the parent component
            if (onImageTaken) {
                onImageTaken(imageUri);
            }

            // Save Image to Gallery
            await saveImageToGallery(imageUri);
        } else {
            console.log("Kein gültiger Bildpfad vorhanden.");
        }
    };

    const saveImageToGallery = async (imageUri) => {
        console.log("Speichern des Bildes in der Galerie...");
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Mediathek-Zugriff wurde verweigert!');
                return;
            }

            // Create picture asset and save to gallery
            const asset = await MediaLibrary.createAssetAsync(imageUri);
            await MediaLibrary.createAlbumAsync('VocabApp Photos', asset, false);
        } catch (error) {
            console.error("Fehler beim Speichern des Bildes in der Galerie:", error);
        }
    };

    return (
        <Button title="Take Picture" onPress={openCamera} />
    );
};
