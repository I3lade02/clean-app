import { PropsWithChildren, ReactNode, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { appTheme, ThemeKey } from "../lib/theme";

export function ScreenContainer({
  children,
  theme,
}: PropsWithChildren<{ theme: ThemeKey }>) {
  const { width } = useWindowDimensions();
  const padding = width < 380 ? 16 : appTheme.spacing.screen;

  return (
    <ScrollView
      contentContainerStyle={{
        padding,
        gap: appTheme.spacing.section,
        backgroundColor: appTheme.colors[theme].bg,
      }}
    >
      {children}
    </ScrollView>
  );
}

export function FadeInView({
  children,
  delay = 0,
}: PropsWithChildren<{ delay?: number }>) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

export function HeroCard({
  theme,
  eyebrow,
  title,
  description,
}: {
  theme: ThemeKey;
  eyebrow: string;
  title: string;
  description: string;
}) {
  const colors = appTheme.colors[theme];

  return (
    <View
      style={{
        backgroundColor: colors.hero,
        borderRadius: appTheme.radius.xl,
        padding: 22,
        gap: 8,
      }}
    >
      <Text style={{ color: colors.heroMuted, fontWeight: "700" }}>{eyebrow}</Text>
      <Text style={{ fontSize: 28, fontWeight: "700", color: "white" }}>{title}</Text>
      <Text style={{ color: colors.heroText }}>{description}</Text>
    </View>
  );
}

export function StatGrid({
  children,
}: PropsWithChildren) {
  const { width } = useWindowDimensions();
  const isCompact = width < 380;

  return (
    <View style={{ flexDirection: isCompact ? "column" : "row", gap: 12 }}>
      {children}
    </View>
  );
}

export function StatCard({
  theme,
  label,
  value,
}: {
  theme: ThemeKey;
  label: string;
  value: string | number;
}) {
  const colors = appTheme.colors[theme];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: appTheme.radius.lg,
        padding: 16,
        gap: 6,
      }}
    >
      <Text style={{ color: colors.subtext }}>{label}</Text>
      <Text style={{ fontSize: 24, fontWeight: "700", color: colors.title }}>{value}</Text>
    </View>
  );
}

export function SectionTitle({
  theme,
  children,
}: PropsWithChildren<{ theme: ThemeKey }>) {
  return (
    <Text style={{ fontSize: 20, fontWeight: "700", color: appTheme.colors[theme].title }}>
      {children}
    </Text>
  );
}

export function SurfaceCard({
  theme,
  children,
}: PropsWithChildren<{ theme: ThemeKey }>) {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: appTheme.colors[theme].border,
        borderRadius: 20,
        padding: appTheme.spacing.card,
        gap: 10,
      }}
    >
      {children}
    </View>
  );
}

export function StatusBadge({
  theme,
  label,
}: {
  theme: ThemeKey;
  label: string;
}) {
  const colors = appTheme.colors[theme];

  return (
    <View
      style={{
        backgroundColor: colors.soft,
        borderRadius: appTheme.radius.pill,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <Text style={{ color: colors.accent, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </View>
  );
}

export function AppButton({
  theme,
  label,
  onPress,
  variant = "primary",
  loading = false,
}: {
  theme: ThemeKey;
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  loading?: boolean;
}) {
  const colors = appTheme.colors[theme];
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={{
        borderRadius: 16,
        padding: 15,
        backgroundColor: isPrimary ? colors.hero : "white",
        borderWidth: isPrimary ? 0 : 1,
        borderColor: colors.border,
        opacity: loading ? 0.7 : 1,
      }}
    >
      <Text
        style={{
          color: isPrimary ? "white" : colors.title,
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {loading ? "Probíhá..." : label}
      </Text>
    </Pressable>
  );
}

export function EmptyState({
  theme,
  title,
  description,
}: {
  theme: ThemeKey;
  title: string;
  description: string;
}) {
  return (
    <SurfaceCard theme={theme}>
      <Text style={{ fontSize: 18, fontWeight: "700", color: appTheme.colors[theme].title }}>
        {title}
      </Text>
      <Text style={{ color: appTheme.colors[theme].subtext }}>{description}</Text>
    </SurfaceCard>
  );
}

export function LoadingScreen({
  label = "Nacitam aplikaci...",
}: {
  label?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#F4F8F6",
        padding: 24,
      }}
    >
      <ActivityIndicator size="large" color="#1C7C54" />
      <Text style={{ color: "#24332B", fontWeight: "600" }}>{label}</Text>
    </View>
  );
}

export function MetaRow({
  left,
  right,
}: {
  left: ReactNode;
  right?: ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}
    >
      <View style={{ flex: 1 }}>{left}</View>
      {right ? right : null}
    </View>
  );
}
