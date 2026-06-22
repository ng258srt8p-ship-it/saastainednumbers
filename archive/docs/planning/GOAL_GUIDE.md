# Judge Goal — Usage Guide

Makes opencode work like Hermes `/goal` — set a persistent goal, the AI works toward it across turns, and a structured "judge" evaluates each turn's output before deciding to continue or declare done.

## Prerequisites

- **opencode** with the [ralph-loop](https://opencode.ai) plugin active (provides auto-continuation)
- The judge-goal skill installed at `~/.opencode/skills/judge-goal/SKILL.md`

Skills are auto-discovered by opencode — no config changes needed. The skill activates when it detects trigger keywords in your message.

## Quick Start

```
/goal Refactor the login handler to use async/await and run the auth tests
```

The AI will:

1. Accept the goal and show a turn budget
2. Work on the task
3. Self-evaluate using the judge rubric
4. Either continue working or mark the goal complete

## Commands

| Command | What it does |
|---|---|
| `/goal <text>` | Set (or replace) a persistent goal. Starts working immediately. |
| `/goal` or `/goal status` | Show current goal, status, turns used, and last judge verdict |
| `/goal pause` | Pause the auto-continuation loop without clearing the goal |
| `/goal resume` | Resume a paused goal (resets turn counter) |
| `/goal clear` | Drop the goal entirely |
| `/subgoal add <text>` | Add incremental criteria mid-session |
| `/subgoal` | List all active subgoals |

## The Judge Protocol

After each substantive turn, the AI runs a structured evaluation:

```
Goal: <goal>

Judge evaluation:
1. Is the goal explicitly satisfied? (yes/no/partial)
2. Is the final deliverable clearly produced? (yes/no/partial)
3. Is the goal unachievable or blocked? (yes/no)
4. Have all stated verification steps been run and passed? (yes/no/n/a)
5. Are there any remaining edge cases or loose ends? (yes/no)

Verdict: <continue|done>
Reason: <specific justification>
```

The judge is **conservative** — it only marks goals `done` when the work is verifiably complete. When uncertain, it defaults to `continue` so the AI keeps working rather than stopping prematurely.

## Example Session

```
$ /goal Add a dark mode toggle to the settings page, run tests, confirm it works

✓ Goal set (20-turn budget): Add dark mode toggle to the settings page,
  run tests, confirm it works

[AI creates the toggle component, wires it up]

⚖ Judge:
  1. Goal satisfied? Partial — toggle created but tests not run
  2. Deliverable produced? Partial — files written, not verified
  3. Blocked? No
  4. Tests run? No
  5. Edge cases? Theme persistence not handled
  Verdict: continue
  Reason: Component built but needs tests and persistence logic

↻ Continuing toward goal (1/20): Tests pending, add persistence

[AI adds localStorage persistence, runs tests, they pass]

⚖ Judge:
  1. Goal satisfied? Yes
  2. Deliverable produced? Yes — src/components/ThemeToggle.tsx, tests pass
  3. Blocked? No
  4. Tests run? Yes — all 12 tests pass
  5. Edge cases? Handled (SSR guard, default theme)
  Verdict: done
  Reason: Dark mode toggle implemented, persisted, and verified

✓ Goal achieved (2 turns used)
<promise>DONE</promise>
```

## Turn Budget

Default **20 turns** per goal session. When the budget runs out, the goal auto-pauses. Run `/goal resume` for another 20-turn block.

```
/goal resume
↻ Goal resumed (turn counter reset): <goal>
```

## Pausing and Resuming

```
/goal pause        # Pause mid-work (preserves progress)
/goal resume       # Resume with fresh turn counter
```

Pausing is useful when you want to interject manual instructions without losing the goal context.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| AI ignores `/goal` command | Skill not loaded | Confirm `~/.opencode/skills/judge-goal/SKILL.md` exists, then restart opencode |
| AI marks done too early | Judge not conservative enough | Remind the AI to run the full judge rubric before declaring done |
| AI keeps looping after completion | DONE signal not emitted | The AI should output `<promise>DONE</promise>` when the goal is met |
| Ralph loop not continuing | State file missing | The goal should create `.opencode/judge-goal.local.md` |
| Goal lost after restart | State file is local | The goal is session-scoped; re-set with `/goal <text>` |

## State File

The goal state lives at `.opencode/judge-goal.local.md` in the project directory:

```markdown
---
active: true
iteration: 2
maxIterations: 20
status: active
goal: "Add dark mode toggle to the settings page..."
lastVerdict: done
lastReason: "Dark mode toggle implemented..."
judgeErrorCount: 0
---
```

Add this file to `.gitignore`:

```
.opencode/judge-goal.local.md
```

## Credits

- Inspired by [Hermes Agent's `/goal`](https://hermes-agent.nousresearch.com/docs/user-guide/features/goals)
- Based on Codex CLI's `/goal` by Eric Traut (Pyright), adapted by NousResearch
- Ralph loop integration via opencode's ralph-loop plugin
