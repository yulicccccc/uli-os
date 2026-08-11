import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "AGENTS.md",
  "PRD.md",
  "DECISIONS.md",
  "IMPLEMENTATION_STATE.md",
  ".ai-bridge/README.md",
  ".ai-bridge/TEAM_STATE.md",
  ".ai-bridge/CURRENT_DECISION.md",
  ".ai-bridge/OPEN_QUESTIONS.md",
  ".ai-bridge/HANDOFF.md",
  ".ai-bridge/agent-notes/chatgpt-product-lead.md",
  ".ai-bridge/agent-notes/codex-engineer.md",
  ".ai-bridge/agent-notes/qa-validator.md",
  ".ai-bridge/history/README.md",
];

const requiredSections = {
  ".ai-bridge/TEAM_STATE.md": [
    "## Current objective",
    "## Active work",
    "## Verified project state",
    "## Current blockers",
    "## Next intended sequence",
  ],
  ".ai-bridge/CURRENT_DECISION.md": [
    "## Decision",
    "## Observed facts",
    "## Current judgment",
    "## Guardrails",
    "## Next action",
  ],
  ".ai-bridge/OPEN_QUESTIONS.md": ["# Open Questions"],
  ".ai-bridge/HANDOFF.md": [
    "From:",
    "To:",
    "Status:",
    "## Task",
    "## Scope",
    "## Acceptance evidence",
  ],
};

const agentSections = [
  "## Task",
  "## Observed facts",
  "## Current judgment",
  "## Evidence",
  "## Uncertainty / risk",
  "## Recommended next action",
  "## Recommended next owner",
];

const errors = [];

for (const relative of requiredFiles) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) errors.push(`Missing required file: ${relative}`);
}

for (const [relative, markers] of Object.entries(requiredSections)) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, "utf8");
  for (const marker of markers) {
    if (!content.includes(marker)) errors.push(`${relative} is missing required marker: ${marker}`);
  }
}

for (const relative of requiredFiles.filter((file) => file.startsWith(".ai-bridge/agent-notes/"))) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, "utf8");
  for (const marker of agentSections) {
    if (!content.includes(marker)) errors.push(`${relative} is missing required section: ${marker}`);
  }
}

const bridgeFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && /\.(md|json|ya?ml|txt)$/i.test(entry.name)) bridgeFiles.push(full);
  }
}
walk(path.join(root, ".ai-bridge"));
bridgeFiles.push(path.join(root, "AGENTS.md"));

const secretPatterns = [
  { name: "PostgreSQL credential URL", regex: /postgres(?:ql)?:\/\/[^\s/:]+:[^\s@]+@[^\s]+/gi },
  { name: "OpenAI-style API key", regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { name: "GitHub token", regex: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g },
];

for (const full of bridgeFiles) {
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, "utf8");
  for (const { name, regex } of secretPatterns) {
    regex.lastIndex = 0;
    if (regex.test(content)) {
      errors.push(`${path.relative(root, full)} appears to contain a ${name}.`);
    }
  }
}

const decision = path.join(root, ".ai-bridge/CURRENT_DECISION.md");
if (fs.existsSync(decision)) {
  const content = fs.readFileSync(decision, "utf8");
  if (!/Status:\s*\S+/i.test(content)) errors.push("CURRENT_DECISION.md must declare a Status.");
  if (!/Owner:\s*\S+/i.test(content)) errors.push("CURRENT_DECISION.md must declare an Owner.");
}

if (errors.length > 0) {
  console.error("Uli OS Team Brain verification FAILED:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Uli OS Team Brain verification PASS (${requiredFiles.length} required files checked).`);
