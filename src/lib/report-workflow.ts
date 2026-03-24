import { Report, ReportStatus } from "../types/report";

export type CreateReportInput = Omit<
  Report,
  "id" | "createdAt" | "updatedAt" | "status" | "assignedTo"
>;

type WorkflowOptions = {
  now?: string;
};

type CreateReportOptions = WorkflowOptions & {
  id?: string;
};

const assignmentResetStatuses = new Set<ReportStatus>(["new", "approved", "rejected"]);
const assignmentTargetStatuses = new Set<ReportStatus>([
  "assigned_volunteer",
  "in_progress",
]);

const allowedStatusTransitions: Record<ReportStatus, ReportStatus[]> = {
  new: ["approved", "rejected"],
  approved: ["assigned_volunteer", "in_progress"],
  assigned_volunteer: ["in_progress"],
  in_progress: ["waiting_for_review"],
  waiting_for_review: ["approved", "resolved"],
  resolved: [],
  rejected: [],
};

export function createReportId() {
  return Math.random().toString(36).slice(2, 10);
}

export function createReport(
  input: CreateReportInput,
  options: CreateReportOptions = {},
) {
  const now = options.now ?? new Date().toISOString();

  return {
    id: options.id ?? createReportId(),
    status: "new" as const,
    createdAt: now,
    updatedAt: now,
    ...input,
  };
}

export function canTransitionReportStatus(
  currentStatus: ReportStatus,
  nextStatus: ReportStatus,
) {
  return allowedStatusTransitions[currentStatus].includes(nextStatus);
}

export function assignReport(
  report: Report,
  assignedTo: string,
  nextStatus: ReportStatus,
  options: WorkflowOptions = {},
) {
  const nextAssignee = assignedTo.trim();

  if (!nextAssignee) {
    return report;
  }

  if (report.status !== "approved") {
    return report;
  }

  if (!assignmentTargetStatuses.has(nextStatus)) {
    return report;
  }

  if (report.assignedTo && report.assignedTo !== nextAssignee) {
    return report;
  }

  return {
    ...report,
    assignedTo: nextAssignee,
    status: nextStatus,
    updatedAt: options.now ?? new Date().toISOString(),
  };
}

export function transitionReportStatus(
  report: Report,
  nextStatus: ReportStatus,
  options: WorkflowOptions = {},
) {
  if (report.status === nextStatus) {
    return report;
  }

  if (!canTransitionReportStatus(report.status, nextStatus)) {
    return report;
  }

  return {
    ...report,
    status: nextStatus,
    assignedTo: assignmentResetStatuses.has(nextStatus) ? undefined : report.assignedTo,
    updatedAt: options.now ?? new Date().toISOString(),
  };
}
