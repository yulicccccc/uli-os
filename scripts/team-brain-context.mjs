import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const baseFiles = [
  "AGENTS.md",
  "PRD.md",
  "DECISIONS.md",
  "IMPLEMENTATION_STATE.md",
  ".ai-bridge/TEAM_STATE.md",
  ".ai-bridge/CURRENT_DECISION.md",
  ".ai-bridge/OPEN_QUESTIONS.md",
  ".ai-bridge/HANDOFF.md",
  ".ai-bridge/agent-notes/chatgpt-product-lead.md",
  ".ai-bridge/agent-notes/codex-engineer.md",
  ".ai-bridge/agent-notes/qa-validator.md",
];

function read(relative) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, "utf8").trim();
}

const teamState = read(".ai-bridge/TEAM_STATE.md") ?? "";
const activeSpecMatch = teamState.match(/## Active module spec[\s\S]*?`([^`]+\.md)`/i);
const files = [...baseFiles];

if (activeSpecMatch?.[1] && !files.includes(activeSpecMatch[1])) {
  files.push(activeSpecMatch[1]);
}

const emitted = [];
for (const relative of files) {
  const content = read(relative);
  if (content) emitted.push({ relative, content });
}

console.log("# ULI OS TEAM CONTEXT PACKET");
console.log("");
console.log("Generated from repository-native canonical docs and Team Brain state.");
console.log("Do not treat this packet as permission to override PRD.md or DECISIONS.md.");
console.log("");

for (const { relative, content } of emitted) {
  console.log("---");
  console.log(`FILE: ${relative}`);
  console.log("---");
  console.log(content);
  console.log("");
}

if (activeSpecMatch?.[1] && !read(activeSpecMatch[1])) {
  console.log("---");
  console.log("ACTIVE MODULE SPEC NOTICE");
  console.log("---");
  console.log(`TEAM_STATE references ${activeSpecMatch[1]}, but that file is not present on this branch.`);
  console.log("Do not infer missing module requirements from code. Inspect the named feature branch/PR or request a handoff update.");
}
