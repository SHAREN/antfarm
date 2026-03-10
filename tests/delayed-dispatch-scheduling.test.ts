import { describe, it, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import { scheduleWorkflowAgentSoon } from "../dist/installer/agent-cron.js";

describe("scheduleWorkflowAgentSoon delayed dispatch", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = mock.fn(async (_url: string, init: any) => {
      const body = JSON.parse(init.body);
      const action = body?.args?.action;

      if (action === "list") {
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: true, result: { jobs: [] } }),
        } as any;
      }

      if (action === "add") {
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: true, result: { id: "dispatch-job-1" } }),
        } as any;
      }

      return {
        ok: true,
        status: 200,
        json: async () => ({ ok: true, result: {} }),
      } as any;
    }) as any;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("creates an at-trigger delayed dispatch job", async () => {
    const result = await scheduleWorkflowAgentSoon({
      workflowId: "wf",
      agentId: "fixer",
      runId: "run-1",
      stepId: "step-1",
    });

    assert.equal(result.ok, true);
    assert.equal(result.id, "dispatch-job-1");

    const fetchMock = globalThis.fetch as any;
    const addCall = fetchMock.mock.calls.find((c: any) => {
      const body = JSON.parse(c.arguments[1].body);
      return body?.args?.action === "add";
    });

    assert.ok(addCall, "expected cron add call");

    const addBody = JSON.parse(addCall.arguments[1].body);
    const job = addBody.args.job;

    assert.equal(job.schedule.kind, "at");
    assert.equal(typeof job.schedule.at, "string");
    assert.equal(job.deleteAfterRun, true);
    assert.equal(job.name, "antfarm/dispatch/wf/run-1/step-1/fixer");
  });

  it("throws when cron creation returns ok:false", async () => {
    globalThis.fetch = mock.fn(async (_url: string, init: any) => {
      const body = JSON.parse(init.body);
      const action = body?.args?.action;

      if (action === "list") {
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: true, result: { jobs: [] } }),
        } as any;
      }

      if (action === "add") {
        return {
          ok: true,
          status: 200,
          json: async () => ({ ok: false, error: { message: "cron add failed" } }),
        } as any;
      }

      return {
        ok: true,
        status: 200,
        json: async () => ({ ok: true, result: {} }),
      } as any;
    }) as any;

    await assert.rejects(
      () =>
        scheduleWorkflowAgentSoon({
          workflowId: "wf",
          agentId: "fixer",
          runId: "run-1",
          stepId: "step-1",
        }),
      (err: any) => {
        assert.match(String(err?.message ?? err), /Failed to schedule delayed workflow dispatch/);
        assert.match(String(err?.message ?? err), /cron add failed/);
        assert.match(String(err?.message ?? err), /workflowId=wf/);
        return true;
      }
    );
  });
});
