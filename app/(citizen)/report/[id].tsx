import { Stack, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { useReportsStore } from "@/src/store/reports.store";

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const reportId = Array.isArray(id) ? id[0] : id;
  const report = useReportsStore((s) =>
    reportId ? s.getReportById(reportId) : undefined,
  );

  if (!report) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text>Hlášení nebylo nalezeno.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Detail hlášení" }} />

      <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>{report.title}</Text>
        <Text>Kategorie: {report.category}</Text>
        <Text>Status: {report.status}</Text>
        <Text>Popis:</Text>
        <Text>{report.description}</Text>
        {report.location ? (
          <Text>
            GPS: {report.location.latitude.toFixed(5)}, {report.location.longitude.toFixed(5)}
          </Text>
        ) : (
          <Text>GPS: neuvedeno</Text>
        )}
        {report.images.length > 0 ? (
          <View style={{ gap: 8 }}>
            <Text>Fotodokumentace:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                {report.images.map((image) => (
                  <Image
                    key={image.id}
                    source={{ uri: image.uri }}
                    style={{ width: 120, height: 120, borderRadius: 12 }}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        ) : (
          <Text>Fotodokumentace: bez příloh</Text>
        )}
        <Text>Vytvořeno: {new Date(report.createdAt).toLocaleString()}</Text>
      </ScrollView>
    </>
  );
}
