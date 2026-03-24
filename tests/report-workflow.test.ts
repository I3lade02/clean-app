import test from "node:test";
import assert from "node:assert/strict";
import {
  assignReport,
  canTransitionReportStatus,
  createReport,
  transitionReportStatus,
} from "../src/lib/report-workflow";
import { Report } from "../src/types/report";

function buildReport(overrides: Partial<Report> = {}): Report {
  return {
    id: "rep-1",
    title: "Overflowing bin",
    description: "The bin is overflowing onto the sidewalk.",
    category: "trash",
    status: "approved",
    createdBy: "citizen-1",
    images: [],
    createdAt: "2026-03-24T10:00:00.000Z",
    updatedAt: "2026-03-24T10:00:00.000Z",
    ...overrides,
  };
}

test("createReport initializes a new report with generated metadata", () => {
  const report = createReport(
    {
      title: "Illegal dump",
      description: "Large waste pile behind the warehouse.",
      category: "black_dump",
      createdBy: "citizen-2",
      images: [],
      location: { latitude: 50.1, longitude: 14.4 },
    },
    {
      id: "rep-created",
      now: "2026-03-24T12:00:00.000Z",
    },
  );

  assert.equal(report.id, "rep-created");
  assert.equal(report.status, "new");
  assert.equal(report.createdAt, "2026-03-24T12:00:00.000Z");
  assert.equal(report.updatedAt, "2026-03-24T12:00:00.000Z");
});

test("assignReport only allows taking approved work and trims the assignee id", () => {
  const assigned = assignReport(
    buildReport(),
    " volunteer-7 ",
    "assigned_volunteer",
    { now: "2026-03-24T12:10:00.000Z" },
  );

  assert.equal(assigned.assignedTo, "volunteer-7");
  assert.equal(assigned.status, "assigned_volunteer");
  assert.equal(assigned.updatedAt, "2026-03-24T12:10:00.000Z");
});

test("assignReport refuses reassignment to a different user", () => {
  const original = buildReport({
    assignedTo: "volunteer-1",
  });

  const unchanged = assignReport(
    original,
    "volunteer-2",
    "assigned_volunteer",
    { now: "2026-03-24T12:20:00.000Z" },
  );

  assert.deepEqual(unchanged, original);
});

test("transitionReportStatus rejects invalid lifecycle jumps", () => {
  const original = buildReport({
    status: "approved",
    assignedTo: "worker-1",
  });

  const unchanged = transitionReportStatus(original, "resolved", {
    now: "2026-03-24T12:30:00.000Z",
  });

  assert.deepEqual(unchanged, original);
  assert.equal(canTransitionReportStatus("approved", "resolved"), false);
});

test("transitionReportStatus clears assignment when admin returns work to the queue", () => {
  const returnedToQueue = transitionReportStatus(
    buildReport({
      status: "waiting_for_review",
      assignedTo: "worker-3",
    }),
    "approved",
    { now: "2026-03-24T12:40:00.000Z" },
  );

  assert.equal(returnedToQueue.status, "approved");
  assert.equal(returnedToQueue.assignedTo, undefined);
  assert.equal(returnedToQueue.updatedAt, "2026-03-24T12:40:00.000Z");
});

test("transitionReportStatus preserves assignment while work moves through review", () => {
  const submitted = transitionReportStatus(
    buildReport({
      status: "in_progress",
      assignedTo: "worker-9",
    }),
    "waiting_for_review",
    { now: "2026-03-24T12:50:00.000Z" },
  );

  assert.equal(submitted.status, "waiting_for_review");
  assert.equal(submitted.assignedTo, "worker-9");
});
