#!/usr/bin/env node

import process from 'node:process'
import { runStacksOnboarding } from '../stacks-onboarding'

runStacksOnboarding().catch((err) => {
  console.error('Failed to run Stacks.js onboarding:', err)
  process.exit(1)
})
