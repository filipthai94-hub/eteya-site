#!/usr/bin/env node
/**
 * Wrapper for tech stack detection - only outputs JSON to stdout
 * Usage: node detect-tech.js <url>
 */
const { detectTechStack, getTechNames } = require('./scrapers/techstack')

const url = process.argv[2]
if (!url) {
  process.exit(1)
}

detectTechStack(url)
  .then(results => {
    // ONLY output JSON to stdout - all logs go to stderr
    process.stdout.write(JSON.stringify(getTechNames(results)))
  })
  .catch(() => {
    process.stdout.write('[]')
  })