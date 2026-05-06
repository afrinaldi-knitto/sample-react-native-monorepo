import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { InputForm } from '@packages/components';

type RootStackParamList = {
  Form: undefined;
  Report: undefined;
  Detail: { sourceApp: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function FormRoute() {
  return (
    <SafeAreaView style={styles.container}>
      <InputForm onSubmit={() => {}} />
    </SafeAreaView>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Form" component={FormRoute} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
});

export default App;
