import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const eslintBinary = resolve(
  rootDir,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "eslint.cmd" : "eslint",
);

const configCandidates = [
  "eslint.config.js",
  "eslint.config.mjs",
  "eslint.config.cjs",
  ".eslintrc.js",
  ".eslintrc.cjs",
  ".eslintrc.json",
].map((file) => resolve(rootDir, file));

if (!existsSync(eslintBinary)) {
  console.error(
    "ESLint is not installed. Install `eslint` and `eslint-config-expo` before running `npm run lint`.",
  );
  process.exit(1);
}

if (!configCandidates.some((file) => existsSync(file))) {
  console.error(
    "No ESLint config found. Add `eslint.config.js` or `.eslintrc.*` before running `npm run lint`.",
  );
  process.exit(1);
}

const result = spawnSync(eslintBinary, ["app", "src", "--ext", ".ts,.tsx"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
