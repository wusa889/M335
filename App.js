import React from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import styled from "styled-components/native";
import { View, SafeAreaView, Platform, StatusBar, Text } from "react-native";
import {GameScreen} from "./screens/GameScreen";
// Container to avoid overflowing
const SafeAreaViewContainer = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${Platform.OS === "android" ? StatusBar.currentHeight : 0}px;
`;

export default function App() {
    return (
        <>
            <ExpoStatusBar style="auto" />

            <SafeAreaViewContainer>
                <View>
                    <GameScreen></GameScreen>
                </View>
            </SafeAreaViewContainer>
        </>
    );
}