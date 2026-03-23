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
    <ScreenContainer theme="worker">
      <FadeInView>
        <HeroCard
          theme="worker"
          eyebrow="Profesionalni panel"
          title={user?.name ?? "Profesional"}
          description={`Spravuj tezsi zasahy a cerne skladky. Ve fronte je ${availableReports.length} pripadu.`}
        />
      </FadeInView>
      <FadeInView delay={60}>
        <StatGrid>
          <StatCard theme="worker" label="Ve fronte" value={availableReports.length} />
          <StatCard theme="worker" label="Moje zasahy" value={assignedReports.length} />
        </StatGrid>
      </FadeInView>

      <FadeInView delay={120}>
        <View style={{ gap: 12 }}>
          <SectionTitle theme="worker">Cekajici profesionalni zasahy</SectionTitle>
        {availableReports.length > 0 ? (
          availableReports.map((report) => (
            <SurfaceCard key={report.id} theme="worker">
              <MetaRow
                left={<Text style={{ fontSize: 18, fontWeight: "700", color: "#17242D" }}>{report.title}</Text>}
                right={<StatusBadge theme="worker" label={getStatusLabel(report.status)} />}
              />
              <Text style={{ color: "#60717D" }}>{getCategoryLabel(report.category)}</Text>
              <Text style={{ color: "#31424E" }}>{report.description}</Text>
              <AppButton theme="worker" variant="secondary" label="Otevrit detail" onPress={() => router.push(`/report/${report.id}`)} />
              <AppButton theme="worker" label="Prevzit profesionalni zasah" onPress={() => assignReport(report.id, user?.id ?? "", "in_progress")} />
            </SurfaceCard>
          ))
        ) : (
          <EmptyState theme="worker" title="Nic neceka" description="Zadne cekajici profesionalni zasahy." />
        )}
      </View>
      </FadeInView>

      <FadeInView delay={180}>
        <View style={{ gap: 12 }}>
          <SectionTitle theme="worker">Moje zasahy</SectionTitle>
        {assignedReports.length > 0 ? (
          assignedReports.map((report) => (
            <SurfaceCard key={report.id} theme="worker">
              <MetaRow
                left={<Text style={{ fontSize: 18, fontWeight: "700", color: "#17242D" }}>{report.title}</Text>}
                right={<StatusBadge theme="worker" label={getStatusLabel(report.status)} />}
              />
              <Text style={{ color: "#60717D" }}>{getCategoryLabel(report.category)}</Text>
              <AppButton theme="worker" variant="secondary" label="Otevrit detail" onPress={() => router.push(`/report/${report.id}`)} />
              {report.status === "in_progress" ? (
                <AppButton theme="worker" label="Oznacit jako hotove" onPress={() => updateReportStatus(report.id, "waiting_for_review")} />
              ) : null}
            </SurfaceCard>
          ))
        ) : (
          <EmptyState theme="worker" title="Bez aktivniho zasahu" description="Zatim nemas zadny aktivni zasah." />
        )}
      </View>
      </FadeInView>

      <FadeInView delay={240}>
        <AppButton
          theme="worker"
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
