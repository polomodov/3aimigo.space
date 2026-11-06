# 3 AImigo #13 — Infrastructure for agent-driven development

> Editorial status: English translation of the historical announcement draft. No broadcast date or recording URL is confirmed; this copy does not mean an announcement has been sent.

You leave several tasks with agents in the evening. In the morning you have
proposed changes, test results and new questions. Who checks the result, allows
a merge or stops a dangerous action? And what if there are thousands of agents?

In episode 13, we plan to discuss how development infrastructure changes under
agent workloads. We will follow a change from the initial task to release:

- How do you control the flow of tasks and preserve their history after an agent fails?
- What happens to CI, version control and merge queues?
- How do you verify the result — and the verifier itself?
- How do you grant and revoke agents' permissions?
- How do you calculate the cost of an accepted change, including unsuccessful attempts, checks and rollbacks?

We will compare approaches from Anthropic, OpenAI and other companies and discuss
where a team can start.

📖 [Preparation for the conversation — the longread “Infrastructure for agent-driven development”](https://polomodov.tech/en/2026-10-16-agent-development-infrastructure/)

Bring your examples: where is agent-driven development already running into
infrastructure limits in your team?
