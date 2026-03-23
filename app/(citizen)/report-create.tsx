import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/src/store/auth.store";
import { useReportsStore } from "@/src/store/reports.store";
import { ReportCategory, ReportImage, ReportLocation } from "@/src/types/report";

const categories: ReportCategory[] = [
  "trash",
  "black_dump",
  "graffiti",
  "other",
];

export default function ReportCreateScreen() {
  const user = useAuthStore((s) => s.user);
  const createReport = useReportsStore((s) => s.createReport);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ReportCategory>("trash");
  const [images, setImages] = useState<ReportImage[]>([]);
  const [location, setLocation] = useState<ReportLocation | undefined>(undefined);
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const handlePickImage = async () => {
    try {
      setIsPickingImage(true);

      const ImagePicker = await import("expo-image-picker");

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Chybí oprávnění", "Aplikace potřebuje přístup k fotkám.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.7,
      });

      if (result.canceled || result.assets.length === 0) {
        return;
      }

      const nextImage: ReportImage = {
        id: Math.random().toString(36).slice(2, 10),
        uri: result.assets[0].uri,
        type: "general",
      };

      setImages((currentImages) => [...currentImages, nextImage]);
    } catch {
      Alert.alert(
        "Chyba",
        "Image picker není v aktuálním klientovi dostupný. Otevři aplikaci v Expo Go nebo znovu nainstaluj development build.",
      );
    } finally {
      setIsPickingImage(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setIsFetchingLocation(true);

      const Location = await import("expo-location");

      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Chybí oprávnění", "Aplikace potřebuje přístup k poloze.");
        return;
      }

      const coords = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: coords.coords.latitude,
        longitude: coords.coords.longitude,
      });
    } catch {
      Alert.alert(
        "Chyba",
        "Modul pro GPS není v aktuálním klientovi dostupný nebo nepovolil oprávnění.",
      );
    } finally {
      setIsFetchingLocation(false);
    }
  };

  const handleSubmit = () => {
    if (!user) return;

    if (!title.trim() || !description.trim()) {
      Alert.alert("Chybí data", "Vyplň název i popis hlášení.");
      return;
    }

    createReport({
      title: title.trim(),
      description: description.trim(),
      category,
      createdBy: user.id,
      images,
      location,
      assignedTo: undefined,
    });

    Alert.alert("Hotovo", "Hlášení bylo vytvořeno.");
    router.replace("/(citizen)/my-reports");
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 14 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>
        Nové hlášení
      </Text>

      <TextInput
        placeholder="Název hlášení"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
        }}
      />

      <TextInput
        placeholder="Popis problému"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          minHeight: 120,
          textAlignVertical: "top",
        }}
      />

      <Text style={{ fontWeight: "600" }}>Kategorie</Text>

      <View style={{ gap: 10 }}>
        {categories.map((item) => {
          const selected = category === item;

          return (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={{
                borderWidth: 1,
                borderRadius: 12,
                padding: 14,
                backgroundColor: selected ? "#dbeafe" : "white",
              }}
            >
              <Text>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={{ fontWeight: "600" }}>Fotodokumentace</Text>

      <Pressable
        onPress={handlePickImage}
        style={{
          borderWidth: 1,
          borderRadius: 12,
          padding: 14,
          opacity: isPickingImage ? 0.6 : 1,
        }}
      >
        <Text>{isPickingImage ? "Načítám fotku..." : "Vybrat fotku z galerie"}</Text>
      </Pressable>

      {images.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {images.map((image) => (
              <Image
                key={image.id}
                source={{ uri: image.uri }}
                style={{ width: 96, height: 96, borderRadius: 12 }}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text>Zatím není přiložená žádná fotka.</Text>
      )}

      <Text style={{ fontWeight: "600" }}>Poloha</Text>

      <Pressable
        onPress={handleUseCurrentLocation}
        style={{
          borderWidth: 1,
          borderRadius: 12,
          padding: 14,
          opacity: isFetchingLocation ? 0.6 : 1,
        }}
      >
        <Text>{isFetchingLocation ? "Načítám polohu..." : "Použít aktuální GPS polohu"}</Text>
      </Pressable>

      {location ? (
        <Text>
          GPS: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </Text>
      ) : (
        <Text>Poloha zatím není vybraná.</Text>
      )}

      <Pressable
        onPress={handleSubmit}
        style={{
          marginTop: 8,
          backgroundColor: "#1E88E5",
          borderRadius: 12,
          padding: 14,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          Uložit hlášení
        </Text>
      </Pressable>
    </ScrollView>
  );
}
