import { buildWeatherUrl, searchPlace } from "@/utils/geo";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
  };

  const goToWeather = (lat: number, lon: number, name: string) => {
    const url = buildWeatherUrl(lat, lon);
    console.log(url);

    // Adapte le chemin à ta route d'accueil
    router.replace({
      pathname: "/",
      params: { lat: String(lat), lon: String(lon), name },
    });
  };

  // Recherche par nom de lieu
  const handleSearch = async () => {
    if (!searchText.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const place = await searchPlace(searchText);
      if (!place) {
        setError("Lieu introuvable");
        return;
      }

      goToWeather(place.latitude, place.longitude, place.name);
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Position GPS de l'appareil
  const handleCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission de localisation refusée");
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      goToWeather(pos.coords.latitude, pos.coords.longitude, "Ma position");
    } catch {
      setError("Impossible d'obtenir la position");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View className="flex-row items-center gap-4">
        <TextInput
          className="w-[80%]"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          placeholder="Rechercher une ville"
          returnKeyType="search"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Text>Go</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="my-4" onPress={handleCurrentLocation}>
        <Text>📍 Utiliser ma position</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator color="#F97316" />}
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <TouchableOpacity className="my-16" onPress={handleBack}>
        <Text>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: "#d8d4d4",
    height: 42,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
});
