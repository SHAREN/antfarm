import { describe, it, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import { scheduleWorkflowAgentSoon } from "../dist/installer/agent-cron.js";

describe("scheduleWorkflowAgentSoon delayed dispatch", () => {
  const originalFetch = globalThis.fetch;

  function installCronFetch(addResponse: { ok: boolean; result?: any; error?: any }) {
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
          json: async () => addResponse,
        } as any;
      }

      return {
        ok: true,
        status: 200,
        json: async () => ({ ok: true, result: {} }),
      } as any;
    }) as any;
  }

  beforeEach(() => {
    installCronFetch({ ok: true, result: { id: "dispatch-job-1" } });
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
    installCronFetch({ ok: false, error: { message: "cron add failed" } });

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

  it("surfaces failure through fire-and-forget catch path used on run start", async () => {
    installCronFetch({ ok: false, error: { message: "run-start add failed" } });

    let caughtMessage = "";
    await new Promise<void>((resolve) => {
      void scheduleWorkflowAgentSoon({
        workflowId: "wf",
        agentId: "fixer",
        runId: "run-start",
        stepId: "step-first",
      })
        .catch((err) => {
          caughtMessage = String(err?.message ?? err);
        })
        .finally(() => resolve());
    });

    assert.match(caughtMessage, /Failed to schedule delayed workflow dispatch/);
    assert.match(caughtMessage, /run-start/);
  });

  it("surfaces failure through fire-and-forget catch path used after pipeline advance", async () => {
    installCronFetch({ ok: false, error: { message: "pipeline add failed" } });

    let caughtMessage = "";
    await new Promise<void>((resolve) => {
      void scheduleWorkflowAgentSoon({
        workflowId: "wf",
        agentId: "reviewer",
        runId: "run-advance",
        stepId: "step-next",
      })
        .catch((err) => {
          caughtMessage = String(err?.message ?? err);
        })
        .finally(() => resolve());
    });

    assert.match(caughtMessage, /Failed to schedule delayed workflow dispatch/);
    assert.match(caughtMessage, /run-advance/);
    assert.match(caughtMessage, /step-next/);
    assert.match(caughtMessage, /agentId=reviewer/);
  });
});
