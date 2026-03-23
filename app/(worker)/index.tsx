import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/src/store/auth.store";
import { useReportsStore } from "@/src/store/reports.store";

export default function WorkerScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const reports = useReportsStore((state) => state.reports);
  const assignReport = useReportsStore((state) => state.assignReport);
  const updateReportStatus = useReportsStore((state) => state.updateReportStatus);

  const availableReports = reports.filter(
    (report) => report.status === "approved" && report.category === "black_dump",
  );
  const assignedReports = reports.filter(
    (report) => report.assignedTo === user?.id && report.status !== "resolved",
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Dashboard profesionála</Text>
      <Text>Přihlášený uživatel: {user?.name}</Text>
      <Text>Typ zásahu: těžší případy a černé skládky</Text>

      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Čekající profesionální zásahy</Text>
        {availableReports.length > 0 ? (
          availableReports.map((report) => (
            <View
              key={report.id}
              style={{ borderWidth: 1, borderRadius: 12, padding: 14, gap: 8 }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700" }}>{report.title}</Text>
              <Text>{report.description}</Text>
              <Text>Status: {report.status}</Text>
              <Pressable
                onPress={() => assignReport(report.id, user?.id ?? "", "in_progress")}
                style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
              >
                <Text>Převzít profesionální zásah</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text>Žádné čekající profesionální zásahy.</Text>
        )}
      </View>

      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>Moje zásahy</Text>
        {assignedReports.length > 0 ? (
          assignedReports.map((report) => (
            <View
              key={report.id}
              style={{ borderWidth: 1, borderRadius: 12, padding: 14, gap: 8 }}
            >
              <Text style={{ fontSize: 16, fontWeight: "700" }}>{report.title}</Text>
              <Text>Status: {report.status}</Text>
              <Text>Kategorie: {report.category}</Text>
              {report.status === "in_progress" ? (
                <Pressable
                  onPress={() => updateReportStatus(report.id, "waiting_for_review")}
                  style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
                >
                  <Text>Označit jako hotové</Text>
                </Pressable>
              ) : null}
            </View>
          ))
        ) : (
          <Text>Zatím nemáš žádný aktivní zásah.</Text>
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
