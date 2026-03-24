import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import {
  EmptyState,
  FadeInView,
  HeroCard,
  MetaRow,
  ScreenContainer,
  StatusBadge,
  SurfaceCard,
} from "../../src/components/ui";
import { useAuthStore } from "../../src/store/auth.store";
import { useReportsStore } from "../../src/store/reports.store";
import { getCategoryLabel, getStatusLabel } from "../../src/lib/report-utils";

export default function MyReportsScreen() {
  const user = useAuthStore((state) => state.user);
  const reports = useReportsStore((state) => state.reports);

  const myReports = reports.filter((report) => report.createdBy === user?.id);
  const activeReports = myReports.filter((report) => !["resolved", "rejected"].includes(report.status));

  return (
    <ScreenContainer theme="citizen">
      <FadeInView>
        <HeroCard
          theme="citizen"
          eyebrow="Prehled hlaseni"
          title="Moje hlaseni"
          description={`Aktivni otevrena hlaseni: ${activeReports.length} z ${myReports.length}`}
        />
      </FadeInView>

      {myReports.length > 0 ? (
        myReports.map((report, index) => (
          <FadeInView key={report.id} delay={40 * (index + 1)}>
            <Pressable
              onPress={() => router.push(`/report/${report.id}`)}
            >
              <SurfaceCard theme="citizen">
                <MetaRow
                  left={<Text style={{ fontSize: 18, fontWeight: "700", color: "#122018" }}>{report.title}</Text>}
                  right={<StatusBadge theme="citizen" label={getStatusLabel(report.status)} />}
                />
                <Text style={{ color: "#5A6B62" }}>{getCategoryLabel(report.category)}</Text>
                <Text style={{ color: "#24332B" }} numberOfLines={2}>{report.description}</Text>
                <MetaRow
                  left={<Text style={{ color: "#5A6B62", fontSize: 12 }}>{new Date(report.updatedAt).toLocaleDateString()}</Text>}
                  right={<Text style={{ color: "#1C7C54", fontWeight: "700" }}>Otevrit detail</Text>}
                />
              </SurfaceCard>
            </Pressable>
          </FadeInView>
        ))
      ) : (
        <FadeInView delay={80}>
          <EmptyState theme="citizen" title="Zatim nemas zadne hlaseni" description="Vytvor prvni podnet a aplikace ti pak ukaze jeho stav i navazujici kroky." />
        </FadeInView>
      )}
    </ScreenContainer>
  );
}
