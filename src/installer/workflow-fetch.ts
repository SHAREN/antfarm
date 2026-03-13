import fs from "node:fs/promises";
import path from "node:path";
import { resolveBundledWorkflowDir, resolveBundledWorkflowsDir, resolveWorkflowDir } from "./paths.js";

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}


/**
 * List all available bundled workflows
 */
export async function listBundledWorkflows(): Promise<string[]> {
  const bundledDir = resolveBundledWorkflowsDir();
  try {
    const entries = await fs.readdir(bundledDir, { withFileTypes: true });
    const workflows: string[] = [];
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const workflowYml = path.join(bundledDir, entry.name, "workflow.yml");
        if (await pathExists(workflowYml)) {
          workflows.push(entry.name);
        }
      }
    }
    return workflows;
  } catch {
    return [];
  }
}

/**
 * Fetch a bundled workflow by name.
 * Under A1, bundled repo workflows are the only source of truth and are used directly.
 */
export async function fetchWorkflow(workflowId: string): Promise<{ workflowDir: string; bundledSourceDir: string }> {
  const bundledDir = resolveBundledWorkflowDir(workflowId);
  const workflowYml = path.join(bundledDir, "workflow.yml");

  if (!(await pathExists(workflowYml))) {
    const available = await listBundledWorkflows();
    const availableStr = available.length > 0 ? `Available: ${available.join(", ")}` : "No workflows bundled.";
    throw new Error(`Workflow "${workflowId}" not found. ${availableStr}`);
  }

  const workflowDir = resolveWorkflowDir(workflowId);
  return { workflowDir, bundledSourceDir: bundledDir };
}
