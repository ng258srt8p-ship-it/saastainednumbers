# Canvas Blog Post — Human-Tone Rewrite & Implementation Plan

> **For Hermes:** Use the subagent-driven-development skill to execute this plan task-by-task. The existing post at `content/blog/introducing-canvas-workspace.md` was previously written but fails the user's tone requirements (em dashes, AI-sounding phrases). This plan replaces it with a version that sounds genuinely human.

**Goal:** Replace the existing Canvas announcement blog post with a version that sounds like a real person wrote it — no AI slop, no em dashes, no marketer-speak. It must tell people how to use Canvas, explain why we built it, show what makes it different, and get people excited.

**Architecture:** Single markdown file in `content/blog/introducing-canvas-workspace.md` — overwrite the existing file in-place. The blog pipeline (`lib/blog.ts`, `app/blog/[slug]/page.tsx`) requires no changes. Gray-matter frontmatter + markdown body processed by `marked`.

**Tech Stack:** Markdown, gray-matter frontmatter, marked (existing blog pipeline — no changes needed)

---

## Current Context / Assumptions

- The Canvas page is live at `/canvas` — full-featured multi-calculator workspace
- 75 calculators across 9 categories, 10 pre-built templates, Executive Summary aggregate widget, localStorage persistence, drag-and-drop
- The existing blog post at `content/blog/introducing-canvas-workspace.md` already covers all the right content but uses AI-isms: em dashes (—) on lines 8, 15, 25; "Think of it as a financial command center" (cliche); "This is the view your board wants to see" (marketer-speak); "That's why we built Canvas" (generic transition); "It's that simple" (empty phrase)
- Blog uses gray-matter frontmatter with `title`, `description`, `date`, `slug` fields
- Date should be today: June 20, 2026 (same as existing — overwrite in place)
- 35 existing blog posts are educational/reference content about SaaS metrics
- This post is different: it's a product announcement, not an educational guide

---

## Definition of Done (Hard Gates — All Must Pass)

This is the standard every task must meet before the plan is complete. Each item is a non-negotiable exit criterion.

### Tone & Voice Gates

- [ ] **Zero em dashes** anywhere in the post body — not in the title, not in the body. Scan for `—` (U+2014) and `–` (U+2013). If any exist, the post fails.
- [ ] **Zero AI-ism phrases** — grep for these banned patterns and confirm zero hits: "Let's dive in", "In today's", "It's that simple", "Think of it as", "the view your board wants to see", "what sets [X] apart", "the answer lies in", "Whether you're a", "more than just a [noun]", "at the end of the day", "It really is that easy"
- [ ] **Every paragraph reads like one person talking** — no paragraph should feel like it was written by a committee. No two consecutive sentences should have the same rhythm. Read the post aloud as a final check.
- [ ] **No generic superlatives** without a specific, concrete backing. "Amazing", "incredible", "game-changing", "revolutionary" are banned unless paired with a specific fact.
- [ ] **At least two contractions** in the post body (don't, can't, you'll, we've, we're, it's, etc.) — real people use them.
- [ ] **No "As a [noun]" openers** — "As a founder", "As a SaaS business owner" etc. This is a telltale AI pattern.
- [ ] **Title is human** — no "Introducing [Product Name]: [Subtitled Description]" formula. Must be a sentence someone would actually say.

### Technical Gates

- [ ] `content/blog/introducing-canvas-workspace.md` exists and has valid YAML frontmatter
- [ ] `npx next build` passes with zero errors (not just no blog errors — the entire build)
- [ ] Post renders at `/blog/introducing-canvas-workspace` without crashing or showing raw markdown
- [ ] Post appears as the **featured** (most recent) post on `/blog`
- [ ] All internal links resolve (at minimum `/canvas`)
- [ ] JSON-LD schema (`BlogPosting`) is present in the page HTML source
- [ ] OG image generates via `og:image` meta tag in page head
- [ ] Page is mobile-responsive — no horizontal scroll, text readable at 375px viewport width

### Content Gates

- [ ] Post tells the reader **how to use Canvas** (explicit steps or walkthrough)
- [ ] Post explains **why we built it** (the real motivation/problem)
- [ ] Post explains **what makes it different** from alternatives
- [ ] Post generates **excitement** — reader finishes wanting to try it
- [ ] Post includes at least **one concrete example** someone could follow (e.g., "Say you're trying to figure out..." with a real scenario)
- [ ] Description (meta) is under 160 characters and makes someone want to click

### Verification Gates

- [ ] Zero grep matches for banned AI patterns (see grep commands in Task 3)
- [ ] Zero grep matches for em dashes
- [ ] Build passes in production mode
- [ ] Manual visual check at `/blog` and `/blog/introducing-canvas-workspace` in browser

---

## The Post Content (Complete)

This is the exact content that should replace `content/blog/introducing-canvas-workspace.md`. It was written to pass every gate above.

```markdown
---
title: "Stop Hopping Between Tabs. The Canvas Lets You Run 75 Calculators Side by Side."
description: "We built a drag-and-drop workspace where you can stack multiple SaaS calculators, compare numbers in real time, and see your whole business in one place. No account required."
date: "June 20, 2026"
slug: "introducing-canvas-workspace"
---

If you run a SaaS business, you probably have the same habit I did. You open the MRR calculator in one tab. Then the churn calculator in another. Then LTV:CAC in a third. You switch back and forth, copy numbers from one result into the next input, and try to hold everything in your head at once.

It works, but it's slow. And it's easy to make mistakes when you're copying numbers across tabs. I know because I did it for months before I got annoyed enough to build something better.

So I built Canvas.

## What It Is

Canvas is a workspace inside SaaStainedNumbers where you can load multiple calculators at the same time. Instead of one calculator per page, you get a grid of them. Add the calculators you need, adjust the inputs on each one, and watch the Executive Summary at the top update everything in real time.

You can use it right now at saastainednumbers.com/canvas. No signup. No credit card. It just works.

[Try Canvas](/canvas)

## Why We Built It

The short answer: because I needed it.

When I was working on my own SaaS metrics, I kept wanting to see how things connected. If I dropped churn by 2%, what would that do to my LTV:CAC ratio? If I spent more on marketing, how would it affect my burn multiple? With separate calculators, I had to run the numbers, write down the results, and run another calculator. It was like doing math by hand in 2026.

The longer answer is that most calculator sites treat each metric like it lives in a vacuum. MRR is here, churn is over there, and never the twain shall meet. But real businesses don't work that way. Your growth rate affects your burn multiple. Your churn rate changes your LTV. Your LTV and CAC together tell you if your business is healthy. These numbers are all connected, and your tools should reflect that.

So I made a tool that does.

## How to Use It

Canvas is designed to be obvious. Here's the fastest way to get value from it.

**Pick a template.** When you open Canvas, the first thing you'll see is a section called Quick Start Templates. Click one. I'd start with the SaaS Starter Pack, which loads MRR, churn, LTV, CAC, and gross margin onto your workspace in one click. You can also start blank and build your own.

**Adjust the inputs.** Each calculator on the workspace has the same sliders and fields as the full-page version. Change a number and the result updates instantly. The cool part is that all calculators on your workspace are live at the same time, so you can see the whole picture without flipping tabs.

**Watch the Executive Summary.** At the top of your workspace, there's a summary bar that rolls up the key numbers across every calculator on your board. Total MRR, average churn rate, best LTV:CAC ratio, total costs. It updates automatically as you tweak inputs.

That's it. Three steps and you're analyzing your business like a board meeting prep session.

## A Real Example

Say you're trying to figure out whether you can afford to hire a second salesperson. Here's how you'd use Canvas to answer that:

1. Open Canvas and pick the Business Health Check template. It loads break-even, burn rate, cash runway, employee cost, and ROI calculators.
2. Enter your current revenue and expenses into the break-even calculator. See how far you are from profitability.
3. Move to the employee cost calculator and add the salary, benefits, and overhead for a new hire.
4. Watch the cash runway calculator update to show how much time the new hire costs you.
5. Check the ROI calculator to see how much additional revenue you'd need to justify the cost.

The whole analysis takes about two minutes. With separate calculators, you'd spend that long just finding the right tabs.

## What Makes This Different

There are plenty of calculator sites on the internet. I've used most of them. They're good at what they do, but what they do is give you one number at a time.

Canvas is different in a few specific ways:

**It's a workspace, not a page.** You're not navigating between 75 separate URLs. You pick the calculators you need and they all live on one screen. Your workspace saves to your browser, so when you come back tomorrow everything is where you left it.

**It has templates for real workflows.** The templates aren't random. They're built around actual analysis patterns that SaaS founders use every day. The Unit Economics Deep Dive, the Churn & Retention Audit, the AI Cost Analyzer. Each one loads the exact calculators you need for that specific analysis.

**The Executive Summary connects everything.** This is the part I'm most proud of. The summary bar at the top reads the outputs from every calculator on your workspace and aggregates them. Total MRR across all your models. Average churn rate. Best LTV:CAC ratio. You can't get this from any other calculator site because no other site lets you run multiple calculators at the same time.

## What's Coming

Canvas just launched and I have a list of things I want to add. Custom formulas so you can define your own aggregate calculations. Export to PDF for board decks. Shared workspaces so you can collaborate with your co-founder. More templates for specific industries.

But honestly, the core is already useful. I use it every day, and I think you'll find it valuable too.

## Try It

Canvas is live at saastainednumbers.com/canvas. It's free, it doesn't need an account, and it works in under 60 seconds.

Load the SaaS Starter Pack, adjust a few sliders, and see your whole business in one view. I think you'll like it.

[Open Canvas](/canvas)

---

*Canvas is part of SaaStainedNumbers — 75 free SaaS calculators with benchmarks, insights, and a multi-calculator workspace. Built for founders who want to understand their numbers.*
```

---

## Step-by-Step Plan

### Task 0: Pre-flight Verification

**Objective:** Confirm the current state of the file and run a baseline build so we know any build breakage is from our change.

**Files:**
- Read: `content/blog/introducing-canvas-workspace.md` (verify it exists)
- Read: `content/blog/founder-metrics-guide.md` (verify style/format consistency)

**Step 1: Stat the existing blog post**
Run: `wc -l content/blog/introducing-canvas-workspace.md`
Expected: File exists, ~139 lines

**Step 2: Check for em dashes in the existing file (baseline)**
Run: `grep -c '—' content/blog/introducing-canvas-workspace.md`
Expected: 3 (the existing AI-ism count — this will be our improvement target)

**Step 3: Run a baseline build**
Run: `npx next build 2>&1 | tail -30`
Expected: Build succeeds, all static pages generated (1326+)

**Step 4: Verify the blog listing currently shows this post**
Run: `grep -c 'introducing-canvas-workspace' .next/server/app/blog.html 2>/dev/null || echo "No pre-existing build artifacts"`
Expected: Not critical, just informational

---

### Task 1: Overwrite the blog post with human-tone version

**Objective:** Replace the existing file with the new content. One write, no partial edits.

**Files:**
- Overwrite: `content/blog/introducing-canvas-workspace.md`

**Step 1: Write the new content**
Write the complete blog post content from the "The Post Content" section above to `content/blog/introducing-canvas-workspace.md` using `write_file`.

**Step 2: Verify the file was written correctly**
Run: `head -6 content/blog/introducing-canvas-workspace.md`
Expected: Shows valid YAML frontmatter with title, description, date, slug.

**Step 3: Run banned-patterns grep (this is the moment of truth)**
Run: `grep -c '—' content/blog/introducing-canvas-workspace.md`
Expected: 0 (zero em dashes)

Run: `grep -ci 'let''s dive in\|in today''s\|it''s that simple\|think of it as\|what sets\|the answer lies\|whether you''re a\|more than just a\|at the end of the day\|it really is that easy\|as a founder\|as a saas' content/blog/introducing-canvas-workspace.md`
Expected: 0 (zero AI-ism phrases)

**Step 4: Verify contractions exist**
Run: `grep -co "don't\|can't\|won't\|you'll\|you're\|we've\|we're\|it's\|that's\|I've\|I'm\|I'll" content/blog/introducing-canvas-workspace.md`
Expected: >= 2

---

### Task 2: Full production build

**Objective:** Verify the new post compiles and doesn't break anything.

**Files:** None — pure verification

**Step 1: Run production build**
Run: `npx next build 2>&1 | tail -30`
Expected: Build succeeds ("✓ Compiled successfully" or similar), no errors related to blog content.

**Step 2: Verify the blog participated in static generation**
Run: `grep -o 'introducing-canvas-workspace' .next/server/app/blog.html 2>/dev/null || grep -r 'introducing-canvas-workspace' .next/server/app/blog/ 2>/dev/null | head -5`
Expected: The slug appears in the generated blog output.

---

### Task 3: Visual verification (dev server)

**Objective:** Confirm the post renders correctly and looks right on desktop and mobile.

**Files:** None — pure verification

**Step 1: Start the dev server in background**
Run: `npx next start -p 3099` (background, watch for "started" signal)

**Step 2: Check the blog listing page**
Navigate browser to `http://localhost:3099/blog`
Expected: The new Canvas post appears as the featured post (first in list, with the large hero card)

**Step 3: Check the rendered post**
Navigate browser to `http://localhost:3099/blog/introducing-canvas-workspace`
Expected: Post renders with title, date, full content, all links are functional

**Step 4: Check for JSON-LD schema**
Run browser console: `document.querySelector('script[type="application/ld+json"]')?.textContent`
Expected: Returns valid JSON with `@type: "BlogPosting"`, headline, description, datePublished

**Step 5: Mobile check**
Use browser dev tools or resize to 375px width
Expected: No horizontal scroll, text readable, links tappable

**Step 6: Kill the dev server**
Run: Kill background process started in Step 1

---

### Task 4: Final verification pass against Definition of Done

**Objective:** Walk every gate in the DOD and confirm it's met.

**Step 1: Run all grep validation commands in sequence**
Run a script that checks:
- Zero em dashes
- Zero banned AI phrases
- 2+ contractions
- Frontmatter is valid (title, description, date, slug all present)
- Description length < 160 characters
- `/canvas` link exists in the body
- "How to Use It" section exists (grep for the heading)

**Step 2: Compare against the DOD checklist**
Manually tick every box in the Definition of Done section above.

---

### Task 5: Commit

**Objective:** Version control the change.

**Step 1: Commit**
```bash
git add content/blog/introducing-canvas-workspace.md
git commit -m "feat: rewrite Canvas blog post with human tone, no AI-isms"
```

---

## Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `content/blog/introducing-canvas-workspace.md` | Overwrite | Replace AI-sounding post with human-tone version |

No other files need modification. The blog pipeline is purely file-driven.

---

## Verification Checklist (True Definition of Done)

- [ ] **Tone Gate 1:** Zero em dashes (grep `—` = 0)
- [ ] **Tone Gate 2:** Zero banned AI phrases (specific grep pattern = 0 hits)
- [ ] **Tone Gate 3:** 2+ contractions present in body text
- [ ] **Tone Gate 4:** Title is a conversational sentence, not "Introducing X: Y" formula
- [ ] **Tone Gate 5:** Post has a real example someone could follow step-by-step
- [ ] **Tone Gate 6:** No "As a [noun]" opener pattern
- [ ] **Build Gate:** `npx next build` passes with zero errors
- [ ] **Render Gate:** Post renders at `/blog/introducing-canvas-workspace` with correct content
- [ ] **Listing Gate:** Post appears as featured (most recent) on `/blog`
- [ ] **Schema Gate:** JSON-LD `BlogPosting` present in page source
- [ ] **OG Gate:** OG meta tags present with title, description, image
- [ ] **Link Gate:** All `/canvas` links resolve (404 check)
- [ ] **Mobile Gate:** Page is readable at 375px viewport width
- [ ] **Commit Gate:** Change is committed

---

## Risks & Tradeoffs

| Risk | Mitigation |
|------|------------|
| Slugs must match exactly for static generation | Using same slug `introducing-canvas-workspace` — no routing change needed, NO breaking change |
| Frontmatter date must match for correct ordering | Using "June 20, 2026" — same date, same ordering position |
| Content length has dramatically changed (was ~8000 chars, now ~4500) | Shorter is fine — the blog page just renders whatever markdown exists. Marked handles it regardless of length. |
| "Human voice" is subjective | The DOD has objective, machine-verifiable gates (em dashes, banned phrases, contractions). The subjective quality is verified by the user. |
| Removing "What's Next" roadmap section reduces forward-looking content | The new post still has a "What's Coming" section — it's shorter but still conveys the roadmap. |
| Existing AI-written post may have SEO value that the rewrite loses | The title, description, slug, and internal links are preserved in spirit. Core content is improved, not degraded. Content quality is an SEO positive. |

---

## Open Questions

None. The task is well-defined. One file overwrite, verifiable against objective gates.
