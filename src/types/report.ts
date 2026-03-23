export type ReportCategory = "trash" | "black_dump" | "graffiti" | "other"

export type ReportStatus =
    | "new"
    | "approved"
    | "assigned_volunteer"
    | "in_progress"
    | "waiting_for_review"
    | "resolved"
    | "rejected";

export type ReportLocation = {
    latitude: number;
    longitude: number;
    address?: string;
};

export type ReportImage = {
    id: string;
    uri: string;
    type: "general" | "before" | "after";
};

export type Report = {
    id: string;
    title: string;
    description: string;
    category: ReportCategory;
    status: ReportStatus;
    createdBy: string;
    assignedTo?: string;
    location?: ReportLocation;
    images: ReportImage[];
    createdAt: string;
    updatedAt: string;
};
