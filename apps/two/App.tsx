import React, { Activity } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import { InputForm } from '@packages/components';
import { addForm, allForms, FormState, store } from '@workspace/packages/redux';
import { NavStack, ScreenProps } from '@workspace/navigations';

type RootStackParamList = {
  Form: undefined;
  Report: undefined;
};

type Props = ScreenProps<RootStackParamList, 'Form'>;

function FormRoute({ navigation }: Props) {
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          color={'black'}
          title="Report"
          onPress={() => navigation.navigate('Report')}
        />
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
    </SafeAreaView>
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
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

function App() {
  return (
    <Provider store={store}>
      <NavStack<RootStackParamList>
        screens={{
          Form: {
            component: FormRoute,
          },
          Report: {
            component: ReportRoute,
          },
        }}
      />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: 10,
    marginHorizontal: 10,
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
