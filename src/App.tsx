import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import DynastyScreen from './screens/DynastyScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar />
      <DynastyScreen />
    </SafeAreaView>
  );
}
