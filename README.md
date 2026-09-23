# Gharpayy Lead Management CRM — Hiring Assignment

## Overview
This repository contains my implementation of the Gharpayy Lead Management
CRM hiring assignment.

### Selected Modules
1. M-POWER Call
2. Movement CARE
3. Closing Desk

## Architecture

React + TypeScript
        ↓
Supabase
        ↓
PostgreSQL

Frontend/Application:
- React
- TypeScript
- TanStack Router / TanStack Start
- Zustand

Backend / Data:
- Supabase
- PostgreSQL
- Supabase Auth + RLS
- Database migrations / Drizzle tooling

## Module 1 — M-POWER Call

### Before
M-POWER call records were written to hosted Supabase, but Admin Call
Intelligence read only browser-local Zustand records. Calls completed in one
browser/device were therefore not visible in another admin session.

### Improvement
Admin Call Intelligence now retrieves M-POWER records from Supabase while
retaining local Zustand as a fallback if the backend fetch fails.

### Result
M-POWER Call
→ Supabase call_records
→ Admin Call Intelligence

Hosted persistence was verified across separate browser sessions.

## Module 2 — Movement CARE

### Before
Movement CARE next actions were stored only in browser-local Movement state.

### Improvement
CARE now attempts to match the customer to an existing hosted CRM lead using
normalized phone numbers.

For matched leads:
- next action and deadline are written to `next_actions`
- an audit event is written to `lead_timeline`

Demo-only/unmatched customers remain local instead of creating fake CRM data.

## Module 3 — Closing Desk

### Before
Closing Desk commitments were stored only in browser-local state.

### Improvement
Closing Desk now attempts to match the customer to an existing hosted CRM lead
using normalized phone numbers.

For matched leads:
- closing action and deadline are persisted to `next_actions`
- a closing promise audit event is written to `lead_timeline`

Unmatched deterministic demo customers remain local to preserve data integrity.

## Operator Authentication

Added an Operator Login entry point so authenticated operators can use
RLS-protected Supabase operations.

## Data Integrity

The implementation intentionally does not create fake hosted CRM leads when
demo customers cannot be matched to an existing Supabase lead.

## Run Locally

npm install
npm run dev

## Build

npm run build

## Live Assignment

Deployment URL: https://gharpayy-crm-assignment-eight.vercel.app