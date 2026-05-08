import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

type ScreenConfig = {
  component: React.ComponentType<any>;
  options?: NativeStackNavigationOptions;
};

type NavAppProps<T extends Record<string, object | undefined>> = {
  screens: {
    [K in keyof T]: ScreenConfig;
  };
};

export type ScreenProps<
  T extends Record<string, object | undefined>,
  K extends keyof T,
> = NativeStackScreenProps<T, K>;

export function NavStack<T extends Record<string, object | undefined>>({
  screens,
}: NavAppProps<T>) {
  const Stack = createNativeStackNavigator<T>();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {Object.entries(screens).map(([name, config]) => (
          <Stack.Screen
            key={name}
            name={name as keyof T}
            component={config.component}
            options={config.options}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
