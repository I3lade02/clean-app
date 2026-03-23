import { ReportCategory, ReportStatus } from "../types/report";

const categoryLabels: Record<ReportCategory, string> = {
  trash: "Odpad",
  black_dump: "Cerna skladka",
  graffiti: "Graffiti",
  other: "Ostatni",
};

const statusLabels: Record<ReportStatus, string> = {
  new: "Nove",
  approved: "Schvalene",
  assigned_volunteer: "Prirazeno dobrovolnikovi",
  in_progress: "V reseni",
  waiting_for_review: "Ceka na kontrolu",
  resolved: "Uzavreno",
  rejected: "Zamitnuto",
};

export function getCategoryLabel(category: ReportCategory) {
  return categoryLabels[category];
}

export function getStatusLabel(status: ReportStatus) {
  return statusLabels[status];
}
