# S1E13 research: infrastructure for agent-driven development

Status: working preparation for an unrecorded episode. The working question is
how a team admits trustworthy changes when agents can produce attempts faster
than people and infrastructure can check them. This is a discussion hypothesis,
not a claim that every team needs a new platform.

## Start here

- [Full infrastructure dossier](../../../docs/research/2026-10-16-agent-development-infrastructure.md):
  the factual ledger, source registry, corrections, disagreements and unresolved checks.
- [T01: lab infrastructure](../../../docs/research/2026-10-31-3-aimigo-topics/T01-lab-infrastructure.md):
  the later topic dossier, with counterarguments and links to previous discussions.
- [Original announcement](../../../docs/podcast-prep/3-aimigo-s1e13-announcement.md).
- Published longread: [English](https://polomodov.tech/en/2026-10-16-agent-development-infrastructure/)
  / [Russian](https://polomodov.tech/2026-10-16-agent-development-infrastructure/).
- [Recording outline](script.md) and [local release workflow](../../../docs/episode-workflow.md).

The full infrastructure dossier was checked on **17 October 2026**, using
publications through **16 October**; some living documentation was read on the
17th without a pinned earlier version. The T01 package has its own later cutoff.
This working sheet extracts existing research; it does not claim a fresh source
check. Reopen the selected primary sources before recording and record the new
check date. Source IDs (`S…`) and claim IDs (`H…`) below belong to the full dossier.

## Evidence to take into the discussion

| Discussion use | Historical evidence anchor | Qualification to preserve |
| --- | --- | --- |
| Intake: a queue can be the bottleneck before work starts | H2-06 / S137, [GitHub availability report](https://github.blog/2026/04/30/github-availability-report-april-2026/): a global rate-limit error delayed about 84% of new cloud-agent session requests in waves, with a 54-minute peak queue | Incident on 9 April; report dated 14 May despite its URL. This is an incident account, not normal queue performance. |
| Orchestration: tasks and workspaces outlive a worker | H2-01 / S032, [OpenAI Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/), 27 April: tracker-driven work, per-task agent/workspace and worker restart | A product/team pattern, not evidence about every internal OpenAI workflow. |
| Recovery: preserve state separately from execution | H3-01 / S011, [Anthropic Managed Agents](https://www.anthropic.com/engineering/managed-agents), 8 April, updated 24 April: session event history is separated from the harness/container | A hosted product. Recovery of a session does not itself prove that external side effects are idempotent. |
| CI: more attempts change the load model | H5-01 / S003, [Anthropic test impact analysis](https://claude.com/resources/articles/agentic-coding-is-straining-ci-heres-how-we-scaled-test-impact-analysis-at-anthropic), 14 September: the vendor reports 25× more CI jobs over six months | Vendor self-report; exact window boundaries are not given. Do not call it a 25× productivity improvement. |
| Admission: evidence must match the revision being admitted | H7-01–02 / S008, [Claude Code review](https://claude.dev/blog/solving-code-review-at-anthropic/), 15 October: risk-based 0/1/2 human reviews and approval tied to a specific commit | Claude Code repositories, not all of Anthropic. Risk shares are unpublished; a new untrusted commit may invalidate approval. |
| Source control: distinguish operating designs | S004, [Scion](https://www.anthropic.com/engineering/redesigning-source-control), 13 October, updated 15 October | Keep Scion's monorepo admission model distinct from the Claude Code repository workflow. Do not combine them into one universal policy. |
| Verification: passing tests and maintainer acceptance differ | H8-11 / S155, [maintainer assessment of SWE-bench-passing PRs](https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/), 10 March: roughly half would not be merged | Four maintainers, 296 PRs, hypothetical judgments and no iterative feedback. It is not a universal rejection rate for production agents. |
| Checking the checker: diversity is not guaranteed independence | H8-04 / S148, [Correlated Errors in Large Language Models](https://arxiv.org/abs/2506.07962), June 2025 | The study concerns multiple-choice tasks and résumé screening, not direct measurement of code-review quality. Use it to motivate a question, not a code-review failure percentage. |
| Authority and logs: inspect the actual execution boundary | H3-09, H9-02 / S069, [METR + Redwood investigation](https://metr.org/hugging-face-incident-report-aug-2026.pdf), 26 August | A research environment with reduced safeguards. Preserve the distinction between agent-visible transcripts and the grader/monitor logs described by OpenAI. |
| Monitoring: test controls through independent attempts | H10-05 / S067, [METR red team](https://metr.org/blog/2026-03-25-red-teaming-anthropic-agent-monitoring/), March with May addendum | One expert's evaluation with access supplied by the evaluated lab; the full report is not public. It does not establish a general safety rate. |
| Economics: count repeated review and downstream work | H12-04 / S150, [Cloudflare AI code review](https://blog.cloudflare.com/ai-code-review/), 20 April: average $1.19 per run and 2.7 runs per merge request in the reported sample | Vendor measurement, 10 March–9 April. Cost per review run is not cost per accepted change; overrides are not a measured false-positive rate. |

## Questions that the episode should resolve

1. What should limit intake: available agent slots, review capacity, or the age
   of the oldest change awaiting admission? Queue-age control is a proposed
   operating heuristic, not an established optimal threshold.
2. What must survive an agent crash: task intent, revision, test evidence,
   permissions and a ledger of side effects? Which effects can safely be retried?
3. Which checks bind to a commit, a merged tree or a deployed artifact? What
   invalidates approval after a rebase, conflict resolution or dependency change?
4. How does a team grant, delegate, revoke and audit authority across subagents?
   Who can stop the whole task tree, and how is stopping verified?
5. What belongs in the cost of an accepted change: unsuccessful attempts,
   review, CI, human rework, rollback and operational recovery?

A useful comparison is the complete path from task to accepted outcome. Avoid
ranking companies by isolated claims from different products, windows or methods.
Most strong lab-specific evidence in the original dossier is vendor self-report.

## Before recording

- [ ] Reopen the primary sources actually selected for the script. Add the
  access date and any changed claim here; keep the historical ledger intact.
- [ ] Pin versions for any live product documentation added to the conversation.
  Do not carry October prices, permissions or defaults forward as current facts.
- [ ] Choose one confirmed, non-confidential example from each participating
  host; record the example's scope without private customer or employee details.
- [ ] Choose a counterexample: a small team or low-risk change where extra
  orchestration would cost more than it saves.
- [ ] Agree which claims need numbers on air. Keep the caveat and denominator
  next to every number rather than in a generic disclaimer.
- [ ] Confirm participants and recording logistics separately. No date, duration,
  media identity or actual speech-source summary is established by this sheet.

Raw recordings and transcripts go in ignored `.private/`. After the recording,
use the real speech source to write the summary; this research is not a transcript.
