import { Image, View, Text, TouchableWithoutFeedback } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const AnimatedImage = Animated.createAnimatedComponent(Image)

export function ProfileScreen() {
    const scale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value}]
        }
    })

    const handlePressIn = () => {
        scale.value = withSpring(0.9, {
            damping: 5,
            stiffness: 200
        })
    }

    const handlePressOut = () => {
        scale.value = withSpring(1, {
            damping: 5,
            stiffness: 200
        })
    }

    return (
        <View className="flex-1 bg-[#37214C]">
            <View className="absolute top-0 left-0 right-0 h-64 bg-[#A472C2] rounded-bl-[40]" />
            <View className="absolute top-0 left-0 right-0 h-40 bg-white rounded-bl-[32]" />
            <View className="h-40 items-center">
                <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
                    <AnimatedImage className="rounded-full w-16 h-16 mt-4" style={animatedStyle} source={{
                        uri: 'https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                    }} />
                </TouchableWithoutFeedback>
                <Text className="font-bold text-base mt-4">Afrinaldi</Text>
                <Text className="font-normal text-sm text-slate-400">Jl Holis, Bandung, Jawa Barat, Indonesia</Text>
            </View>
            <View className="flex-row justify-center items-center h-24">
                <View className="items-center">
                    <Text className="font-semibold text-base text-white">6K</Text>
                    <Text className="font-thin text-sm text-white">Likes</Text>
                </View>
                <View className="h-12 bg-[#36363636] w-[0.5] mx-2" />
                <View className="items-center">
                    <Text className="font-semibold text-base text-white">150</Text>
                    <Text className="font-thin text-sm text-white">Following</Text>
                </View>
                <View className="h-12 bg-[#36363636] w-[0.5] mx-2"/>
                <View className="items-center">
                    <Text className="font-semibold text-base text-white">10K</Text>
                    <Text className="font-thin text-sm text-white">Followers</Text>
                </View>
            </View>
            <View className="flex-grow px-8 pt-4">
                <Text className="font-semibold text-white">Email</Text>
                <Text className="text-sm text-white font-light">afrinaldi.knitto@gmail.com</Text>
                <View className="w-full h-[0.8] bg-white my-1"/>
                <Text className="font-semibold text-white">Phone</Text>
                <Text className="text-sm text-white font-light">+62 812 3456 7890</Text>
                <View className="w-full h-[0.8] bg-white my-1"/>
                <Text className="font-semibold text-white">D.O.B</Text>
                <Text className="text-sm text-white font-light">April 19, 2001</Text>
                <View className="w-full h-[0.8] bg-white my-2"/>
            </View>
        </View>
    )
}