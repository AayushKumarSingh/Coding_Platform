export type SubmissionPayload = {
  submissionId: string;
  code: string;
  language: string;
  problemId: string;
  userId?: string;
};

export type SubmissionStatus =
  | "queued"
  | "running"
  | "passed"
  | "failed"
  | "error";

export type SubmissionRecord = {
  submissionId: string;
  status: SubmissionStatus;
  startedAt?: number;
  finishedAt?: number;
  runtimeMs?: number;
  message?: string;
  stdout?: string;
  stderr?: string;
  memoryBytes?: number;
};
