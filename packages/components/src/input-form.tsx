import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";

interface InputFormProps {
  onSubmit: (value: string) => void;
}

export function InputForm({ onSubmit }: InputFormProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim() === "") {
      ToastAndroid.show("Nama tidak boleh kosong", ToastAndroid.SHORT);
      return;
    }
    onSubmit(value);
    setValue("");
    ToastAndroid.show("Data disimpan", ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nama Lengkap</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => setValue(text)}
      />
      <Button color={"#000000"} title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginHorizontal: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    marginVertical: 8,
  },
});

console.log("InputForm");
