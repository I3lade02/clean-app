import { Text, View } from "react-native";
import { router } from "expo-router";
import {
  AppButton,
  EmptyState,
  FadeInView,
  HeroCard,
  MetaRow,
  ScreenContainer,
  SectionTitle,
  StatCard,
  StatGrid,
  StatusBadge,
  SurfaceCard,
} from "../../src/components/ui";
import { useAuthStore } from "../../src/store/auth.store";
import { useReportsStore } from "../../src/store/reports.store";
import { getCategoryLabel, getStatusLabel } from "../../src/lib/report-utils";

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
    <ScreenContainer theme="admin">
      <FadeInView>
        <HeroCard
          theme="admin"
          eyebrow="Administracni panel"
          title={user?.name ?? "Admin"}
          description="Kontroluj prijem podnetu, schvalovani a finalni uzavirani zasahu."
        />
      </FadeInView>
      <FadeInView delay={60}>
        <StatGrid>
          <StatCard theme="admin" label="Nova hlaseni" value={newReports.length} />
          <StatCard theme="admin" label="Schvalena" value={approvedCount} />
          <StatCard theme="admin" label="Uzavrena" value={resolvedCount} />
        </StatGrid>
      </FadeInView>

      <FadeInView delay={120}>
        <View style={{ gap: 12 }}>
          <SectionTitle theme="admin">Ke schvaleni</SectionTitle>
        {newReports.length > 0 ? (
          newReports.map((report) => (
            <SurfaceCard key={report.id} theme="admin">
              <MetaRow
                left={<Text style={{ fontSize: 18, fontWeight: "700", color: "#211A43" }}>{report.title}</Text>}
                right={<StatusBadge theme="admin" label={getStatusLabel(report.status)} />}
              />
              <Text style={{ color: "#645C84" }}>{getCategoryLabel(report.category)}</Text>
              <Text style={{ color: "#3A3550" }}>{report.description}</Text>
              <AppButton theme="admin" variant="secondary" label="Otevrit detail" onPress={() => router.push(`/report/${report.id}`)} />
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <AppButton theme="admin" label="Schvalit" onPress={() => updateReportStatus(report.id, "approved")} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppButton theme="admin" variant="secondary" label="Zamitnout" onPress={() => updateReportStatus(report.id, "rejected")} />
                </View>
              </View>
            </SurfaceCard>
          ))
        ) : (
          <EmptyState theme="admin" title="Fronta je prazdna" description="Zadna nova hlaseni ke schvaleni." />
        )}
      </View>
      </FadeInView>

      <FadeInView delay={180}>
        <View style={{ gap: 12 }}>
          <SectionTitle theme="admin">Ceka na kontrolu po zasahu</SectionTitle>
        {reviewReports.length > 0 ? (
          reviewReports.map((report) => (
            <SurfaceCard key={report.id} theme="admin">
              <MetaRow
                left={<Text style={{ fontSize: 18, fontWeight: "700", color: "#211A43" }}>{report.title}</Text>}
                right={<StatusBadge theme="admin" label={getStatusLabel(report.status)} />}
              />
              <Text style={{ color: "#645C84" }}>Prirazeno: {report.assignedTo ?? "neprirazeno"}</Text>
              <AppButton theme="admin" variant="secondary" label="Otevrit detail" onPress={() => router.push(`/report/${report.id}`)} />
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <AppButton theme="admin" label="Uzavrit" onPress={() => updateReportStatus(report.id, "resolved")} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppButton theme="admin" variant="secondary" label="Vratit do fronty" onPress={() => updateReportStatus(report.id, "approved")} />
                </View>
              </View>
            </SurfaceCard>
          ))
        ) : (
          <EmptyState theme="admin" title="Bez cekajicich kontrol" description="Momentalne nic neceka na kontrolu." />
        )}
      </View>
      </FadeInView>

      <FadeInView delay={240}>
        <AppButton
          theme="admin"
          variant="secondary"
          label="Odhlasit se"
          onPress={() => {
            logout();
            router.replace("/(auth)/login");
          }}
        />
      </FadeInView>
    </ScreenContainer>
  );
}
