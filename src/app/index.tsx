import { useWeather } from "@/hooks/useWeather";
import { getWeatherIcon } from "@/utils/weather";
import { getWeatherDescription } from "@/utils/weather-des";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

export type DailyItem = {
  id: number;
  temp_max: number;
  temp_min: number;
  time: string;
  code: number;
};

export type HourlyItem = {
  id: number;
  temp: number;
  hour: string;
  code: number;
};

const convertDate = (date: string) => {
  const day = new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
  });

  return day.charAt(0).toUpperCase() + day.slice(1, 3);
};

export default function Index() {
  const { data, loading } = useWeather();

  const daily = useMemo<DailyItem[]>(() => {
    if (!data?.daily) return [];

    return data.daily.time.map((time, index) => ({
      id: index,
      temp_max: data.daily.temperature_2m_max[index],
      temp_min: data.daily.temperature_2m_min[index],
      time: convertDate(time),
      code: data.daily.weather_code[index],
    }));
  }, [data]);

  const hourly = useMemo<HourlyItem[]>(() => {
    if (!data?.hourly || !data?.current) return [];

    const currentTime = data.current.time;

    const currentIndex = data.hourly.time.findIndex(
      (time) => time >= currentTime,
    );

    if (currentIndex === -1) return [];

    return data.hourly.time
      .slice(currentIndex, currentIndex + 24)
      .map((time, index) => ({
        id: index,
        temp: data.hourly.temperature_2m[currentIndex + index],
        hour: time.slice(11, 16),
        code: data.hourly.weather_code[currentIndex + index],
      }));
  }, [data]);

  return (
    <SafeAreaView style={styles.container}>
      {loading || !data ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Header */}
          <View className="h-16 flex-row justify-between items-center px-4">
            {/* Location */}
            <View className="flex-row items-center gap-2">
              <Ionicons name="location-outline" size={24} color="#333" />

              <View>
                <Text className="text-xs text-gray-500">Your location</Text>
                <Text className="text-lg font-bold">Côte d'Ivoire</Text>
              </View>
            </View>

            {/* Settings */}
            <Ionicons name="settings-outline" size={26} color="#333" />
          </View>

          {/* Current Weather */}
          <View className="min-h-[180px] items-center justify-center py-4">
            {/* Temperature */}
            <View className="flex-row items-start">
              <Text className="text-8xl font-bold">
                {data.current?.temperature_2m != null
                  ? Math.round(data.current.temperature_2m)
                  : "--"}
              </Text>

              <Text className="text-2xl font-bold mt-3">°C</Text>
            </View>

            {/* Weather Icon */}
            <Ionicons
              name={getWeatherIcon(data.current?.weather_code ?? -1)}
              size={70}
              color="#F97316"
            />

            {/* Weather Description */}
            <View className="flex-row items-center gap-2">
              <Text className="text-xl font-semibold">
                {data.current?.weather_code != null
                  ? getWeatherDescription(data.current.weather_code)
                  : "Chargement..."}
              </Text>
            </View>
          </View>

          {/* Today's Forecast */}
          <View className="min-h-[150px] px-4 py-4">
            <Text className="text-xl font-bold">Today</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 20 }}
              className="mt-4"
            >
              {hourly.map((item) => (
                <View key={item.hour} className="items-center gap-2">
                  <Text className="text-base">{item.hour}</Text>

                  <Ionicons
                    name={getWeatherIcon(item.code)}
                    size={28}
                    color="#F97316"
                  />

                  <Text className="text-base font-semibold">
                    {Math.round(item.temp)}°
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Weekly Forecast */}
          <View className="min-h-[200px] px-4 py-4">
            <Text className="text-xl font-bold">The week</Text>

            {daily.map((item) => (
              <View
                key={item.id}
                className="flex-row justify-between items-center my-3"
              >
                {/* Weather information */}
                <View className="flex-row items-center w-3/4 gap-2">
                  <Ionicons
                    name={getWeatherIcon(item.code)}
                    size={24}
                    color="#F97316"
                  />

                  <Text className="font-semibold">{item.time}</Text>

                  <Text className="text-sm">
                    {getWeatherDescription(item.code)}
                  </Text>
                </View>

                {/* Temperatures */}
                <View className="flex-row items-center justify-between w-1/4">
                  <Text className="font-semibold">
                    {Math.round(item.temp_max)}°
                  </Text>

                  <View
                    style={{
                      height: 5,
                      width: 30,
                      backgroundColor: "#F97316",
                      borderRadius: 5,
                    }}
                  />

                  <Text className="text-gray-500">
                    {Math.round(item.temp_min)}°
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Weather Details */}
          <View className="px-4 py-4">
            <Text className="text-xl font-bold mb-4">Weather Details</Text>

            <View className="flex-row gap-3">
              {/* Left Column */}
              <View className="flex-1 gap-3">
                {/* Humidity */}
                <View className="min-h-[100px] bg-blue-500 rounded-xl p-3 justify-between">
                  <Ionicons name="water-outline" size={24} color="white" />

                  <Text className="text-white">Humidity</Text>

                  <Text className="text-2xl font-bold text-white">
                    {data.current?.relative_humidity_2m ?? "--"}%
                  </Text>
                </View>

                {/* Rain */}
                <View className="min-h-[100px] bg-yellow-100 rounded-xl p-3 justify-between">
                  <Ionicons name="rainy-outline" size={24} color="#EAB308" />

                  <Text>Rain</Text>

                  <Text className="text-2xl font-bold">
                    {data.current?.rain ?? "--"} mm
                  </Text>
                </View>
              </View>

              {/* Right Column */}
              <View className="flex-1">
                {/* Wind Speed */}
                <View className="min-h-[213px] bg-white rounded-xl p-3 justify-between">
                  <Ionicons name="navigate-outline" size={24} color="#F97316" />

                  <Text>Wind Speed</Text>

                  <Text className="text-3xl font-bold">
                    {data.current?.wind_speed_10m ?? "--"}
                  </Text>

                  <Text className="text-gray-500">km/h</Text>

                  <Text className="text-gray-500">
                    Direction: {data.current?.wind_direction_10m ?? "--"}°
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
