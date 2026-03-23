import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { Report, ReportStatus } from "../types/report";

type CreateReportInput = Omit<
    Report,
    "id" | "createdAt" | "updatedAt" | "status"
>;

const initialReports: Report[] = [
    {
        id: "rep-1001",
        title: "Preplneny kontejner u parku",
        description: "Kontejner je plny a kolem jsou odpadky.",
        category: "trash",
        status: "new",
        createdBy: "citizen-demo",
        images: [],
        createdAt: "2026-03-20T08:30:00.000Z",
        updatedAt: "2026-03-20T08:30:00.000Z",
        location: {
            latitude: 50.08745,
            longitude: 14.42125,
            address: "Praha 1",
        },
    },
    {
        id: "rep-1002",
        title: "Cerna skladka za mestskym skladem",
        description: "Vetsi mnozstvi odpadu, bude potreba technika.",
        category: "black_dump",
        status: "approved",
        createdBy: "citizen-demo",
        images: [],
        createdAt: "2026-03-19T11:10:00.000Z",
        updatedAt: "2026-03-20T09:00:00.000Z",
        location: {
            latitude: 50.07554,
            longitude: 14.4378,
            address: "Praha 3",
        },
    },
    {
        id: "rep-1003",
        title: "Odpadky kolem zastavky",
        description: "Mensi lokalita vhodna pro dobrovolnicky uklid.",
        category: "other",
        status: "approved",
        createdBy: "citizen-demo",
        images: [],
        createdAt: "2026-03-18T12:00:00.000Z",
        updatedAt: "2026-03-20T12:30:00.000Z",
        location: {
            latitude: 50.09812,
            longitude: 14.44791,
            address: "Praha 8",
        },
    },
    {
        id: "rep-1004",
        title: "Dobrovolnicky uklid skoro hotovy",
        description: "Misto je uklizene, ceka na potvrzeni adminem.",
        category: "trash",
        status: "waiting_for_review",
        createdBy: "citizen-demo",
        assignedTo: "volunteer-demo",
        images: [],
        createdAt: "2026-03-17T09:15:00.000Z",
        updatedAt: "2026-03-21T15:45:00.000Z",
        location: {
            latitude: 50.0902,
            longitude: 14.401,
            address: "Praha 7",
        },
    },
];

type ReportsState = {
    reports: Report[];
    createReport: (input: CreateReportInput) => void;
    getReportById: (id: string) => Report | undefined;
    assignReport: (id: string, assignedTo: string, nextStatus: ReportStatus) => void;
    updateReportStatus: (id: string, status: ReportStatus) => void;
};

export const useReportsStore = create<ReportsState>()(
    persist(
        (set, get) => ({
            reports: initialReports,
            createReport: (input) => {
                const now = new Date().toISOString();

                const newReport: Report = {
                    id: Math.random().toString(36).slice(2, 10),
                    status: "new",
                    createdAt: now,
                    updatedAt: now,
                    ...input,
                };

                set((state) => ({
                    reports: [newReport, ...state.reports],
                }));
            },
            getReportById: (id) => get().reports.find((report) => report.id === id),
            assignReport: (id, assignedTo, nextStatus) =>
                set((state) => ({
                    reports: state.reports.map((report) =>
                        report.id === id
                            ? {
                                ...report,
                                assignedTo,
                                status: nextStatus,
                                updatedAt: new Date().toISOString(),
                            }
                            : report,
                    ),
                })),
            updateReportStatus: (id, status) =>
                set((state) => ({
                    reports: state.reports.map((report) =>
                        report.id === id
                            ? {
                                ...report,
                                status,
                                updatedAt: new Date().toISOString(),
                            }
                            : report,
                    ),
                })),
        }),
        {
            name: "clean-app-reports",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
