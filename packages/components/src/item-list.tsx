import { FlashList } from "@shopify/flash-list";
import { Text } from "react-native";

export function ItemList() {
  return (
    <FlashList
      data={Array.from({ length: 100 }).map((_, index) => ({
        id: index,
        name: `Item ${index}`,
      }))}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

console.log("ItemList");
