import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/src/store/auth.store";
import { useReportsStore } from "@/src/store/reports.store";

export default function AdminScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const reports = useReportsStore((state) => state.reports);
  const updateReportStatus = useReportsStore((state) => state.updateReportStatus);

  const newReports = reports.filter((report) => report.status === "new");
  const reviewReports = reports.filter((report) => report.status === "waiting_for_review");
  const approvedCount = reports.filter((report) => report.status === "approved").length;
  const resolvedCount = reports.filter((report) => report.status === "resolved").length;

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Dashboard admina</Text>
      <Text>Přihlášený uživatel: {user?.name}</Text>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1, borderWidth: 1, borderRadius: 12, padding: 14, gap: 6 }}>
          <Text style={{ fontWeight: "700" }}>Nová hlášení</Text>
          <Text>{newReports.length}</Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderRadius: 12, padding: 14, gap: 6 }}>
          <Text style={{ fontWeight: "700" }}>Schválená</Text>
          <Text>{approvedCount}</Text>
        </View>
        <View style={{ flex: 1, borderWidth: 1, borderRadius: 12, padding: 14, gap: 6 }}>
          <Text style={{ fontWeight: "700" }}>Uzavřená</Text>
          <Text>{resolvedCount}</Text>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Ke schválení</Text>
        {newReports.length > 0 ? (
          newReports.map((report) => (
            <View
              key={report.id}
              style={{ borderWidth: 1, borderRadius: 12, padding: 14, gap: 8 }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700" }}>{report.title}</Text>
              <Text>{report.description}</Text>
              <Text>Kategorie: {report.category}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={() => updateReportStatus(report.id, "approved")}
                  style={{ flex: 1, borderWidth: 1, borderRadius: 10, padding: 12 }}
                >
                  <Text style={{ textAlign: "center" }}>Schválit</Text>
                </Pressable>
                <Pressable
                  onPress={() => updateReportStatus(report.id, "rejected")}
                  style={{ flex: 1, borderWidth: 1, borderRadius: 10, padding: 12 }}
                >
                  <Text style={{ textAlign: "center" }}>Zamítnout</Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <Text>Žádná nová hlášení ke schválení.</Text>
        )}
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Čeká na kontrolu po zásahu</Text>
        {reviewReports.length > 0 ? (
          reviewReports.map((report) => (
            <View
              key={report.id}
              style={{ borderWidth: 1, borderRadius: 12, padding: 14, gap: 8 }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700" }}>{report.title}</Text>
              <Text>Status: {report.status}</Text>
              <Text>Přiřazeno: {report.assignedTo ?? "nepřiřazeno"}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={() => updateReportStatus(report.id, "resolved")}
                  style={{ flex: 1, borderWidth: 1, borderRadius: 10, padding: 12 }}
                >
                  <Text style={{ textAlign: "center" }}>Uzavřít</Text>
                </Pressable>
                <Pressable
                  onPress={() => updateReportStatus(report.id, "approved")}
                  style={{ flex: 1, borderWidth: 1, borderRadius: 10, padding: 12 }}
                >
                  <Text style={{ textAlign: "center" }}>Vrátit do fronty</Text>
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <Text>Momentálně nic nečeká na kontrolu.</Text>
        )}
      </View>

      <Pressable
        onPress={() => {
          logout();
          router.replace("/(auth)/login");
        }}
        style={{ borderWidth: 1, borderRadius: 12, padding: 14 }}
      >
        <Text>Odhlásit se</Text>
      </Pressable>
    </ScrollView>
  );
}
