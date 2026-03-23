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

export default function VolunteerScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const reports = useReportsStore((state) => state.reports);
  const assignReport = useReportsStore((state) => state.assignReport);
  const updateReportStatus = useReportsStore((state) => state.updateReportStatus);

  const availableReports = reports.filter(
    (report) =>
      report.status === "approved" &&
      report.category !== "black_dump",
  );
  const assignedReports = reports.filter(
    (report) => report.assignedTo === user?.id && report.status !== "resolved",
  );

  return (
    <ScreenContainer theme="volunteer">
      <FadeInView>
        <HeroCard
          theme="volunteer"
          eyebrow="Dobrovolnicky panel"
          title={user?.name ?? "Dobrovolnik"}
          description={`Mas ${availableReports.length} volnych akci a ${assignedReports.length} aktivnich ukolu.`}
        />
      </FadeInView>
      <FadeInView delay={60}>
        <StatGrid>
          <StatCard theme="volunteer" label="Body" value={user?.points ?? 0} />
          <StatCard theme="volunteer" label="Aktivni ukoly" value={assignedReports.length} />
        </StatGrid>
      </FadeInView>

      <FadeInView delay={120}>
        <View style={{ gap: 12 }}>
          <SectionTitle theme="volunteer">Volna hlaseni k prevzeti</SectionTitle>
        {availableReports.length > 0 ? (
          availableReports.map((report) => (
            <SurfaceCard key={report.id} theme="volunteer">
              <MetaRow
                left={<Text style={{ fontSize: 18, fontWeight: "700", color: "#382B1F" }}>{report.title}</Text>}
                right={<StatusBadge theme="volunteer" label={getStatusLabel(report.status)} />}
              />
              <Text style={{ color: "#7A654E" }}>{getCategoryLabel(report.category)}</Text>
              <Text style={{ color: "#4D3E2E" }}>{report.description}</Text>
              <AppButton theme="volunteer" variant="secondary" label="Otevrit detail" onPress={() => router.push(`/report/${report.id}`)} />
              <AppButton theme="volunteer" label="Prevzit hlaseni" onPress={() => assignReport(report.id, user?.id ?? "", "assigned_volunteer")} />
            </SurfaceCard>
          ))
        ) : (
          <EmptyState theme="volunteer" title="Nic neni volne" description="Ted neni nic volneho pro dobrovolniky." />
        )}
      </View>
      </FadeInView>

      <FadeInView delay={180}>
        <View style={{ gap: 12 }}>
          <SectionTitle theme="volunteer">Moje aktivni ukoly</SectionTitle>
        {assignedReports.length > 0 ? (
          assignedReports.map((report) => (
            <SurfaceCard key={report.id} theme="volunteer">
              <MetaRow
                left={<Text style={{ fontSize: 18, fontWeight: "700", color: "#382B1F" }}>{report.title}</Text>}
                right={<StatusBadge theme="volunteer" label={getStatusLabel(report.status)} />}
              />
              <Text style={{ color: "#7A654E" }}>{getCategoryLabel(report.category)}</Text>
              <AppButton theme="volunteer" variant="secondary" label="Otevrit detail" onPress={() => router.push(`/report/${report.id}`)} />
              {report.status === "assigned_volunteer" ? (
                <AppButton theme="volunteer" label="Zahajit uklid" onPress={() => updateReportStatus(report.id, "in_progress")} />
              ) : null}
              {report.status === "in_progress" ? (
                <AppButton theme="volunteer" label="Odeslat ke kontrole" onPress={() => updateReportStatus(report.id, "waiting_for_review")} />
              ) : null}
            </SurfaceCard>
          ))
        ) : (
          <EmptyState theme="volunteer" title="Zatim bez ukolu" description="Zatim nemas zadne prevzate hlaseni." />
        )}
      </View>
      </FadeInView>

      <FadeInView delay={240}>
        <AppButton
          theme="volunteer"
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
