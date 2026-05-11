import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Button } from 'react-native';
import './global.css';
import { InputForm } from '@packages/components';
import { ProfileScreen } from './src/profile';

type RootStackParamList = {
  Form: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
type Props = NativeStackScreenProps<RootStackParamList, 'Form'>;

function FormRoute({navigation} : Props) {
  return (
    <View className='flex-1'>
      <View className='flex-row px-[10] pt-2'>
        <View className='flex-grow'>
          <Button title='Profile' color={'#000000'} onPress={() => navigation.navigate('Profile')} />
        </View>
      </View>
      <InputForm onSubmit={() => {}} />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Form" component={FormRoute} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
