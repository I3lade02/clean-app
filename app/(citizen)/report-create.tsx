import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  AppButton,
  FadeInView,
  HeroCard,
  ScreenContainer,
  StatGrid,
  StatCard,
  SurfaceCard,
} from "../../src/components/ui";
import { createReportSchema } from "../../src/lib/schemas";
import { useAuthStore } from "../../src/store/auth.store";
import { useReportsStore } from "../../src/store/reports.store";
import { getCategoryLabel } from "../../src/lib/report-utils";
import { ReportCategory, ReportImage, ReportLocation } from "../../src/types/report";

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
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

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

    const parsed = createReportSchema.safeParse({ title, description });
    if (!parsed.success) {
      const nextErrors: { title?: string; description?: string } = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "title") nextErrors.title = issue.message;
        if (field === "description") nextErrors.description = issue.message;
      }
      setErrors(nextErrors);
      Alert.alert("Formular neni kompletni", "Oprav zvyraznena pole a zkus to znovu.");
      return;
    }

    setErrors({});

    createReport({
      title: parsed.data.title,
      description: parsed.data.description,
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
    <ScreenContainer theme="citizen">
      <FadeInView>
        <HeroCard
          theme="citizen"
          eyebrow="Nova udalost"
          title="Vytvor hlaseni"
          description="Doplneni fotky a GPS zrychli schvaleni a spravne prirazeni zasahu."
        />
      </FadeInView>

      <FadeInView delay={60}>
        <StatGrid>
          <StatCard theme="citizen" label="Fotky" value={images.length} />
          <StatCard theme="citizen" label="GPS" value={location ? "Pridano" : "Chybi"} />
        </StatGrid>
      </FadeInView>

      <FadeInView delay={120}>
        <SurfaceCard theme="citizen">
        <TextInput
          placeholder="Nazev hlaseni"
          value={title}
          onChangeText={(value) => {
            setTitle(value);
            if (errors.title) setErrors((current) => ({ ...current, title: undefined }));
          }}
          style={{
            borderWidth: 1,
            borderRadius: 14,
            padding: 14,
            borderColor: errors.title ? "#D64545" : "#C8D7CF",
            backgroundColor: "#FAFCFB",
          }}
        />
        {errors.title ? <Text style={{ color: "#D64545" }}>{errors.title}</Text> : null}

        <TextInput
          placeholder="Popis problemu"
          value={description}
          onChangeText={(value) => {
            setDescription(value);
            if (errors.description) setErrors((current) => ({ ...current, description: undefined }));
          }}
          multiline
          style={{
            borderWidth: 1,
            borderRadius: 14,
            padding: 14,
            minHeight: 140,
            textAlignVertical: "top",
            borderColor: errors.description ? "#D64545" : "#C8D7CF",
            backgroundColor: "#FAFCFB",
          }}
        />
        {errors.description ? <Text style={{ color: "#D64545" }}>{errors.description}</Text> : null}

        <Text style={{ fontWeight: "700", color: "#122018" }}>Kategorie</Text>

        <View style={{ gap: 10 }}>
          {categories.map((item) => {
            const selected = category === item;

            return (
              <Pressable
                key={item}
                onPress={() => setCategory(item)}
                style={{
                  borderWidth: 1,
                  borderRadius: 14,
                  padding: 14,
                  backgroundColor: selected ? "#E3F3EA" : "#FAFCFB",
                  borderColor: selected ? "#1C7C54" : "#C8D7CF",
                }}
              >
                <Text style={{ fontWeight: selected ? "700" : "500" }}>{getCategoryLabel(item)}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ fontWeight: "700", color: "#122018" }}>Fotodokumentace</Text>

        <AppButton theme="citizen" variant="secondary" loading={isPickingImage} label="Vybrat fotku z galerie" onPress={handlePickImage} />

        {images.length > 0 ? (
          <View>
            <Text style={{ color: "#5A6B62", marginBottom: 8 }}>Pridane fotky</Text>
            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              {images.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.uri }}
                  style={{ width: 96, height: 96, borderRadius: 14 }}
                />
              ))}
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: "#F7FBF8", borderRadius: 14, padding: 14 }}>
            <Text style={{ color: "#5A6B62" }}>Zatim neni prilozena zadna fotka.</Text>
          </View>
        )}

        <Text style={{ fontWeight: "700", color: "#122018" }}>Poloha</Text>

        <AppButton theme="citizen" variant="secondary" loading={isFetchingLocation} label="Pouzit aktualni GPS polohu" onPress={handleUseCurrentLocation} />

        {location ? (
          <Text style={{ color: "#2E6B52", fontWeight: "600" }}>
            GPS: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </Text>
        ) : (
          <View style={{ backgroundColor: "#F7FBF8", borderRadius: 14, padding: 14 }}>
            <Text style={{ color: "#5A6B62" }}>Poloha zatim neni vybrana.</Text>
          </View>
        )}

        <AppButton theme="citizen" label="Ulozit hlaseni" onPress={handleSubmit} />
        </SurfaceCard>
      </FadeInView>
    </ScreenContainer>
  );
}
