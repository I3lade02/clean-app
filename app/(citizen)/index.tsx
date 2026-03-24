import { Text } from "react-native";
import { router } from "expo-router";
import {
  AppButton,
  FadeInView,
  HeroCard,
  ScreenContainer,
  StatCard,
  StatGrid,
  SurfaceCard,
} from "../../src/components/ui";
import { useAuthStore } from "../../src/store/auth.store";
import { useReportsStore } from "../../src/store/reports.store";
import { getStatusLabel } from "../../src/lib/report-utils";

export default function CitizenDashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const reports = useReportsStore((state) => state.reports);
  const myReportsCount = reports.filter((report) => report.createdBy === user?.id).length;
  const latestReport = reports.find((report) => report.createdBy === user?.id);

  return (
    <ScreenContainer theme="citizen">
      <FadeInView>
        <HeroCard
          theme="citizen"
          eyebrow="Obcansky panel"
          title={`Ahoj, ${user?.name ?? "uzivateli"}`}
          description="Sleduj stav hlaseni a vytvarej nove podnety pro mesto."
        />
      </FadeInView>

      <FadeInView delay={60}>
        <StatGrid>
          <StatCard theme="citizen" label="Body" value={user?.points ?? 0} />
          <StatCard theme="citizen" label="Moje hlaseni" value={myReportsCount} />
        </StatGrid>
      </FadeInView>

      {latestReport ? (
        <FadeInView delay={120}>
          <SurfaceCard theme="citizen">
            <Text style={{ color: "#5A6B62", fontWeight: "700" }}>Posledni aktivita</Text>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#122018" }}>{latestReport.title}</Text>
            <Text style={{ color: "#2E6B52" }}>Status: {getStatusLabel(latestReport.status)}</Text>
          </SurfaceCard>
        </FadeInView>
      ) : null}

      <FadeInView delay={180}>
        <AppButton theme="citizen" label="Vytvorit nove hlaseni" onPress={() => router.push("/(citizen)/report-create")} />
      </FadeInView>
      <FadeInView delay={220}>
        <AppButton theme="citizen" variant="secondary" label="Moje hlaseni" onPress={() => router.push("/(citizen)/my-reports")} />
      </FadeInView>
      <FadeInView delay={260}>
        <AppButton
          theme="citizen"
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
