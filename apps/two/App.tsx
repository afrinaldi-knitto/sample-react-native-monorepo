import React, { Activity } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { InputForm } from '@packages/components';
import { addForm, allForms, FormState, store } from '@workspace/packages/redux';
import { NavBottomTab, NavStack, ScreenProps } from '@workspace/navigations';
import { HomeScreen } from '@screens/home';
import { FavoritesScreen } from '@screens/favorites';
import { SettingsScreen } from '@screens/settings';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
  Form: undefined;
  Report: undefined;
  Main: undefined;
};

type Props = ScreenProps<RootStackParamList, 'Form'>;

type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Settings: undefined;
};

function FormRoute({ navigation }: Props) {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.viewGrow}>
          <Button
            color={'black'}
            title="Report"
            onPress={() => navigation.navigate('Report')}
          />
        </View>

        <View style={styles.viewGrow}>
          <Button
            color={'black'}
            title="Main"
            onPress={() => navigation.navigate('Main')}
          />
        </View>
      </View>
      <InputForm
        onSubmit={value => {
          dispatch(
            addForm({
              id: new Date().toISOString(),
              name: value,
              date: new Date().toDateString(),
            }),
          );
        }}
      />
    </View>
  );
}

const Item = ({ item, index }: { item: FormState; index: number }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.textIndex}>#{index}</Text>
      <Text>{item.name}</Text>
      <Text style={styles.textDate}>{item.date}</Text>
    </View>
  );
};

function ReportRoute() {
  const forms = useSelector(allForms);

  return (
    <View style={styles.container}>
      <Activity mode={forms.length === 0 ? 'visible' : 'hidden'}>
        <Text style={styles.text}>Belum ada data</Text>
      </Activity>
      <Activity mode={forms.length > 0 ? 'visible' : 'hidden'}>
        <FlashList
          data={forms}
          renderItem={({ item, index }) => (
            <Item item={item} index={index + 1} />
          )}
          keyExtractor={item => item.id}
        />
      </Activity>
    </View>
  );
}

function MainRoute() {
  return (
    <NavBottomTab<MainTabParamList>
      screens={{
        Home: {
          component: HomeScreen,
        },
        Favorites: {
          component: FavoritesScreen,
        },
        Settings: {
          component: SettingsScreen,
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarIconStyle: {
          display: 'none',
        },
        tabBarLabelStyle: {
          flex: 1,
          verticalAlign: 'middle',
          fontSize: 12,
        },
      }}
    />
  );
}

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
          <NavStack<RootStackParamList>
            screens={{
              Form: {
                component: FormRoute,
              },
              Report: {
                component: ReportRoute,
              },
              Main: {
                component: MainRoute,
              },
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  text: {
    flexGrow: 1,
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  textIndex: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  textDate: {
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
  viewGrow: {
    flexGrow: 1,
  },
  itemContainer: {
    gap: 4,
    marginHorizontal: 10,
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
});

export default App;
