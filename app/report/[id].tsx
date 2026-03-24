import { Redirect, Stack, router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import {
  AppButton,
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

export default function SharedReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const reportId = Array.isArray(id) ? id[0] : id;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const report = useReportsStore((state) =>
    reportId ? state.getReportById(reportId) : undefined,
  );
  const assignReport = useReportsStore((state) => state.assignReport);
  const updateReportStatus = useReportsStore((state) => state.updateReportStatus);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const detailTheme =
    user?.role === "admin"
      ? "admin"
      : user?.role === "worker"
        ? "worker"
        : user?.role === "volunteer"
          ? "volunteer"
          : "citizen";

  if (!report) {
    return (
      <>
        <Stack.Screen options={{ headerShown: true, title: "Detail hlaseni" }} />
        <ScreenContainer theme={detailTheme}>
          <FadeInView>
            <EmptyState
              theme={detailTheme}
              title="Hlaseni nebylo nalezeno"
              description="Pozadovany zaznam uz neexistuje nebo pro nej nemas dostupna data."
            />
          </FadeInView>
          <FadeInView delay={80}>
            <AppButton
              theme={detailTheme}
              variant="secondary"
              label="Zpet na prehled"
              onPress={() => router.replace("/")}
            />
          </FadeInView>
        </ScreenContainer>
      </>
    );
  }

  if (user?.role === "citizen" && report.createdBy !== user.id) {
    return (
      <>
        <Stack.Screen options={{ headerShown: true, title: "Detail hlaseni" }} />
        <ScreenContainer theme="citizen">
          <FadeInView>
            <EmptyState
              theme="citizen"
              title="K tomuto hlaseni nemas pristup"
              description="Obcansky ucet muze otevrit jen vlastni hlaseni, ne podnety ostatnich uzivatelu."
            />
          </FadeInView>
          <FadeInView delay={80}>
            <AppButton
              theme="citizen"
              variant="secondary"
              label="Zpet na moje hlaseni"
              onPress={() => router.replace("/(citizen)/my-reports")}
            />
          </FadeInView>
        </ScreenContainer>
      </>
    );
  }

  const canVolunteerClaim =
    user?.role === "volunteer" &&
    report.status === "approved" &&
    report.category !== "black_dump";
  const canWorkerClaim =
    user?.role === "worker" &&
    report.status === "approved" &&
    report.category === "black_dump";
  const canAdminApprove = user?.role === "admin" && report.status === "new";
  const canAdminReview = user?.role === "admin" && report.status === "waiting_for_review";
  const canVolunteerStart =
    user?.role === "volunteer" &&
    report.assignedTo === user.id &&
    report.status === "assigned_volunteer";
  const canVolunteerSubmit =
    user?.role === "volunteer" &&
    report.assignedTo === user.id &&
    report.status === "in_progress";
  const canWorkerSubmit =
    user?.role === "worker" &&
    report.assignedTo === user.id &&
    report.status === "in_progress";

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Detail hlaseni" }} />

      <ScreenContainer theme={detailTheme}>
        <FadeInView>
          <HeroCard
            theme={detailTheme}
            eyebrow="Pracovni detail"
            title={report.title}
            description="Detail je sdileny pro vsechny role. Nabidnute akce se meni podle role a aktualniho stavu."
          />
        </FadeInView>

        <FadeInView delay={60}>
        <SurfaceCard theme={detailTheme}>
          <Text style={{ fontSize: 24, fontWeight: "700", color: "#122018" }}>{report.title}</Text>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge theme={detailTheme} label={getCategoryLabel(report.category)} />
            <StatusBadge theme={detailTheme} label={getStatusLabel(report.status)} />
          </View>
          <Text style={{ color: "#5A6B62" }}>Vytvoril: {report.createdBy}</Text>
          <Text style={{ color: "#5A6B62" }}>Prirazeno: {report.assignedTo ?? "neprirazeno"}</Text>
          <Text style={{ fontWeight: "700", color: "#122018" }}>Popis</Text>
          <Text style={{ color: "#24332B", lineHeight: 22 }}>{report.description}</Text>

          {report.location ? (
            <Text style={{ color: "#2E6B52", fontWeight: "600" }}>
              GPS: {report.location.latitude.toFixed(5)}, {report.location.longitude.toFixed(5)}
            </Text>
          ) : (
            <Text style={{ color: "#5A6B62" }}>GPS: neuvedeno</Text>
          )}

          {report.images.length > 0 ? (
            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: "700", color: "#122018" }}>Fotodokumentace</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  {report.images.map((image) => (
                    <Image
                      key={image.id}
                      source={{ uri: image.uri }}
                      style={{ width: 120, height: 120, borderRadius: 14 }}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : (
            <Text style={{ color: "#5A6B62" }}>Fotodokumentace: bez priloh</Text>
          )}

          <MetaRow
            left={<Text style={{ color: "#5A6B62" }}>Vytvoreno: {new Date(report.createdAt).toLocaleString()}</Text>}
          />
          <MetaRow
            left={<Text style={{ color: "#5A6B62" }}>Aktualizovano: {new Date(report.updatedAt).toLocaleString()}</Text>}
          />
        </SurfaceCard>
        </FadeInView>

        <FadeInView delay={120}>
        <View style={{ gap: 10, marginTop: 8 }}>
          {canAdminApprove ? (
            <>
              <AppButton theme="admin" label="Schvalit hlaseni" onPress={() => updateReportStatus(report.id, "approved")} />
              <AppButton theme="admin" variant="secondary" label="Zamitnout hlaseni" onPress={() => updateReportStatus(report.id, "rejected")} />
            </>
          ) : null}

          {canAdminReview ? (
            <>
              <AppButton theme="admin" label="Uzavrit po kontrole" onPress={() => updateReportStatus(report.id, "resolved")} />
              <AppButton theme="admin" variant="secondary" label="Vratit do fronty" onPress={() => updateReportStatus(report.id, "approved")} />
            </>
          ) : null}

          {canVolunteerClaim ? (
            <AppButton theme="volunteer" label="Prevzit jako dobrovolnik" onPress={() => assignReport(report.id, user?.id ?? "", "assigned_volunteer")} />
          ) : null}

          {canWorkerClaim ? (
            <AppButton theme="worker" label="Prevzit jako profesional" onPress={() => assignReport(report.id, user?.id ?? "", "in_progress")} />
          ) : null}

          {canVolunteerStart ? (
            <AppButton theme="volunteer" label="Zahajit uklid" onPress={() => updateReportStatus(report.id, "in_progress")} />
          ) : null}

          {canVolunteerSubmit || canWorkerSubmit ? (
            <AppButton theme={user?.role === "worker" ? "worker" : "volunteer"} label="Odeslat ke kontrole" onPress={() => updateReportStatus(report.id, "waiting_for_review")} />
          ) : null}
        </View>
        </FadeInView>
      </ScreenContainer>
    </>
  );
}
