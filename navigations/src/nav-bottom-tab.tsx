import {
  BottomTabNavigationOptions,
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

type ScreenConfig = {
  component: React.ComponentType<any>;
  options?: BottomTabNavigationOptions;
};

type NavAppProps<T extends Record<string, object | undefined>> = {
  screens: {
    [K in keyof T]: ScreenConfig;
  };
  screenOptions?: BottomTabNavigationOptions;
};

export type NavBottomTabScreenProps<
  T extends Record<string, object | undefined>,
  K extends keyof T,
> = BottomTabScreenProps<T, K>;

export function NavBottomTab<T extends Record<string, object | undefined>>({
  screens,
  screenOptions,
}: NavAppProps<T>) {
  const { Navigator, Screen } = createBottomTabNavigator<T>();

  return (
    <Navigator screenOptions={screenOptions}>
      {Object.entries(screens).map(([name, config]) => (
        <Screen
          key={name}
          name={name as keyof T}
          component={config.component}
          options={config.options}
        />
      ))}
    </Navigator>
  );
}
