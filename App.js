import React from "react";
import {StatusBar as ExpoStatusBar} from "expo-status-bar";
import styled from "styled-components/native";
import {View, SafeAreaView, Platform, StatusBar, Text, Button} from "react-native";
import {GameScreen} from "./screens/GameScreen";
import {NavigationContainer} from '@react-navigation/native';
import {HomeScreen} from "./screens/HomeScreen";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {VocabDetailsScreen} from "./screens/VocabDetailsScreen";
import {VocabListScreen} from "./screens/VocabListScreen";


const Stack = createNativeStackNavigator();

function DetailsScreen() {
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Details Screen</Text>
        </View>
    );
}


// Container to avoid overflowing
const SafeAreaViewContainer = styled(SafeAreaView)`
    flex: 1;
    margin-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;

export default function App() {
    return (
        <>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="GameScreen" component={GameScreen}/>
                    <Stack.Screen name="VocabDetailsScreen" component={VocabDetailsScreen}/>
                    <Stack.Screen name="VocabListScreen" component={VocabListScreen}/>
                </Stack.Navigator>
                <ExpoStatusBar style="auto"/>
            </NavigationContainer>
        </>
    );
}