# S1E13 recording outline

**Working title:** Infrastructure for agent-driven development / Инфраструктура
агентной разработки. This is a discussion plan, not a transcript, timestamp list
or account of a recorded conversation. No speaking order or host position is
assigned in advance. Evidence anchors are in [research.md](research.md).

## Opening case

**EN:** You leave several tasks with agents in the evening. In the morning you
have proposed changes, test results and new questions. Who verifies the result,
allows a merge or stops a dangerous action? What changes when there are thousands
of attempts rather than a few?

**RU:** Вечером оставляешь агентам несколько задач. Утром получаешь изменения,
результаты тестов и новые вопросы. Кто проверит результат, разрешит слияние или
остановит опасное действие? Что изменится, когда попыток будут тысячи?

Invite each host to identify the first bottleneck in a concrete, shareable
workflow. Keep this as an illustrative situation until a host confirms an actual
example. The central thread is the path **task → attempt → evidence → admission
→ operation**, with permissions and costs considered at every step.

## 1. Control intake and preserve the task's history

**Main question / Основной вопрос:** How do we control the flow of work and keep
its history when an agent fails? / Как дозировать поток задач и сохранять историю
после сбоя агента?

- Follow one task through intake, workspace allocation, retries and handover.
  What is the durable record, and what is disposable worker state?
- Compare a per-task orchestration pattern with the queue failure in GitHub's
  incident account. Use S032, S011 and S137; preserve product versus incident scope.
- Ask what can be retried safely. A persisted conversation is not proof that a
  payment, deployment or external write can be repeated without consequences.
- Counterargument: for a few low-risk tasks, a tracker and a human may already
  be enough. What measured pain justifies a dedicated orchestration layer?

**Transition:** Once an attempt produces a change, it starts consuming shared
verification capacity even if producing the code was cheap.

## 2. CI, version control and the meaning of a green result

**Main question / Основной вопрос:** What happens to CI, version control and merge
queues as the number of attempts grows? / Что происходит с CI, контролем версий и
очередями слияния, когда попыток становится больше?

- Use Anthropic's CI account (S003) to ask which work grows with attempts:
  environment setup, test selection, execution, flakes and repeated checks.
- Define the object of evidence: commit, merged tree or deployment artifact.
  What changes after main moves, a dependency updates or a conflict is resolved?
- Discuss Scion (S004) and Claude Code's commit-specific approvals (S008) as
  different designs. Do not present them as one company's universal merge policy.
- Counterargument: selective testing can lower cost while missing regressions.
  Which failures would trigger broader tests or a return to a stricter gate?

**Transition:** More green checks help only when the checks represent what the
team would actually accept.

## 3. Verify the result and the verifier

**Main question / Основной вопрос:** How do we verify the result and check the
verifier itself? / Как проверить результат — и самого проверяющего?

- Distinguish passing a benchmark, satisfying a test suite and being acceptable
  to a maintainer. Use S155 with its four-maintainer/296-PR scope and lack of
  iterative feedback; do not extrapolate its rate to all production code.
- Ask what a second reviewer can observe independently: requirements, tests,
  security policy, source context and outcomes after deployment.
- Use S148 to question correlated errors; explicitly note that it did not measure
  code-review performance. Different model names alone do not prove independence.
- Explore an escalation ladder for low-, medium- and high-impact changes. Ask
  what evidence would cause the team to add human review again.

**Transition:** Even a capable verifier cannot make an action legitimate if the
agent had no authority to perform it.

## 4. Grant, delegate, revoke and observe authority

**Main question / Основной вопрос:** How do we grant and revoke an agent's
permissions? / Как выдавать и отзывать полномочия агентов?

- Trace initiator, task, delegated permissions and expiry through a subagent.
  Can an agent ask another agent to perform an action it cannot perform itself?
- Separate the agent-visible trace from trusted execution logs. Use the
  METR/Redwood investigation (S069), retaining its research-environment scope.
- Discuss what a stop operation covers: worker, child agents, queued actions,
  outstanding credentials and already-started side effects.
- Use S067 as a prompt to test monitoring rather than assume complete coverage.
  Preserve the limited access and unpublished full-report qualifications.
- Counterargument: stronger isolation and approvals add friction. Which controls
  are mandatory for the action's risk, and which can be lightweight?

**Transition:** Controls and repeated work have a cost; the useful denominator
is an accepted outcome rather than the cheapest individual model call.

## 5. Cost of an accepted change and a first team experiment

**Main question / Основной вопрос:** How do we calculate the cost of an accepted
change, including failed attempts, checks and rollbacks? / Как считать стоимость
принятого изменения с учётом неудачных попыток, проверок и откатов?

- Use Cloudflare's review-run example (S150) to separate cost per run, cost per
  merge request and total delivery cost. Include retries, CI and people's time.
- Propose an accounting model, clearly labeled as our framework: sum attempt,
  review, CI, rework and recovery costs, then divide by accepted changes in the
  same observation window. Discuss attribution and delayed incident costs.
- Ask each host for one bounded experiment: a concrete task type, owner,
  acceptance criteria, permission boundary, measurements and a stop condition.
- Counterargument: measuring every component may cost more than a small pilot.
  Choose a minimal set sufficient to decide whether to expand, adjust or stop.

## Closing prompts

Ask the hosts, without supplying their answers:

1. What should a team change first when agent attempts outgrow its ability to
   accept them? / Что менять первым, когда попыток больше, чем команда успевает принять?
2. Which evidence would make you trust one more class of action to an agent? /
   Какое свидетельство позволит доверить агенту ещё один класс действий?
3. Which signal would make you tighten control again? / При каком сигнале нужно
   снова ужесточить контроль?

Invite listeners to share where agent-driven development already meets an
infrastructure limit in their teams. Link the published longread and public
preparation brief in the eventual episode materials. Add recording URLs and
verified chapter times only after the actual recording exists.
