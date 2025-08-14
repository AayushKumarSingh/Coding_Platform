import { redis } from "./redis";
import type { SubmissionRecord } from "./types";

const key = (id: string) => `submission:${id}`;

export async function setStatus(id: string, data: Partial<SubmissionRecord>) {
  await redis.hset(key(id), Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, String(v)])
  ));
}

export async function initStatus(id: string) {
  const now = Date.now();
  const rec: SubmissionRecord = {
    submissionId: id,
    status: "queued",
    startedAt: 0,
    finishedAt: 0,
    runtimeMs: 0,
    message: "",
    stdout: "",
    stderr: "",
    memoryBytes: 0,
  };
  await redis.hset(key(id), Object.fromEntries(Object.entries(rec).map(([k, v]) => [k, String(v)])));
  await redis.expire(key(id), 60 * 60 * 24); // 24h TTL
}

export async function getStatus(id: string): Promise<SubmissionRecord | null> {
  const raw = await redis.hgetall(key(id));
  if (!raw || Object.keys(raw).length === 0) return null;
  return {
    submissionId: raw.submissionId as any,
    status: raw.status as SubmissionRecord["status"],
    startedAt: Number(raw.startedAt || 0),
    finishedAt: Number(raw.finishedAt || 0),
    runtimeMs: Number(raw.runtimeMs || 0),
    message: raw.message || "",
    stdout: raw.stdout || "",
    stderr: raw.stderr || "",
    memoryBytes: Number(raw.memoryBytes || 0),
  };
}
