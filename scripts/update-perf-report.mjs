#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const repoRoot = path.resolve(process.cwd())
const reportPath = path.join(repoRoot, "perf-report.json")

const build = spawnSync("npm", ["run", "build"], {
  cwd: repoRoot,
  encoding: "utf8",
  env: process.env,
})

const output = `${build.stdout || ""}\n${build.stderr || ""}`

if (build.status !== 0) {
  process.stderr.write(output)
  process.exit(build.status || 1)
}

const routeRegex = /^[┌├└] [○●ƒ] (.+?)\s{2,}([0-9.]+ kB|[0-9]+ B|0 B)\s+([0-9.]+ kB|[0-9]+ B|0 B)$/gm
const routes = []
let match

while ((match = routeRegex.exec(output)) !== null) {
  routes.push({
    route: match[1].trim(),
    routeJs: match[2].trim(),
    firstLoadJs: match[3].trim(),
  })
}

const sharedMatch = output.match(/\+ First Load JS shared by all\s+([0-9.]+ kB|0 B)/)
const sharedFirstLoadJs = sharedMatch ? sharedMatch[1] : ""

const existing = JSON.parse(readFileSync(reportPath, "utf8"))
const nextReport = {
  ...existing,
  latestBuild: {
    capturedAt: new Date().toISOString(),
    buildRoutes: routes,
    sharedFirstLoadJs,
  },
}

writeFileSync(reportPath, JSON.stringify(nextReport, null, 2))
process.stdout.write("Updated perf-report.json with latest build metrics.\n")
