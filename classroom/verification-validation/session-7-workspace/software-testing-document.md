# Techlith Lab Inventory — Software Testing Document

> Complete this document from your own Session 1–6 work products. Replace prompts with concise claims and cite the related requirement, test, metric, defect, or evidence ID. Leave unsupported claims out.

## 1. Document Control

- Author / team:
- Version:
- Date:
- Review status:
- Sources / evidence location:

## 2. System / SUT Overview

Describe the tested Techlith Lab Inventory scope, build or reference environment, and relevant boundaries. Identify which classroom source or Main Application behavior each observation came from.

## 3. Scope and Objectives

### In scope

### Out of scope

### Test objectives and priorities

## 4. Canonical Requirements

Use the canonical identifiers and wording. Do not create aliases.

| Requirement | Canonical summary | Included? / rationale |
| --- | --- | --- |
| REQ-INV-001 | Outbound quantity > 0. | |
| REQ-INV-002 | Outbound quantity <= current stock; exact-stock valid. | |
| REQ-INV-003 | Whole-number units such as pcs / unit only accept integers. | |
| REQ-INV-004 | Fractional units such as meter allow precision <= 3 decimals. | |
| REQ-INV-005 | ARCHIVED rejects new movement; existing history remains available. | |
| REQ-INV-006 | Successful movement keeps prevAmount / amount / nextAmount consistent. | |

## 5. Test Strategy

Summarize selected techniques, rationale, priorities, and risk coverage. Link the Session 1 objective and Session 2 technique mapping.

## 6. Test Environment

Record application/source version, runtime, tools, configuration, data setup, and environment limitations. Distinguish Main Application from isolated classroom sources.

## 7. Test Design Summary

Summarize selected scenarios, equivalence partitions, boundaries, experience-based ideas, code/fault/usage/model evidence, and reusable tests. Reference the test register.

## 8. Test Execution Summary

Report actual scope and results only from your execution records. Include release/build, test IDs, dates, evidence IDs, and any blocked or unexecuted cases. Do not infer a run from an expected result.

## 9. Coverage and Mutation Evidence

Separate normalized Session 4 classroom references from your actual Session 5 before/after values. Record metric source, command, source scope, denominator, interpretation, and limitations.

## 10. Model / State Evidence

Summarize state transitions and cross-state evidence, including ARCHIVED rejection, restore → ACTIVE, history persistence/availability, and consistency. Link evidence; identify gaps that remain.

## 11. Defect Summary

Summarize only defects supported by reproducible observations. Link defect IDs to requirements, tests, and evidence. Keep observation distinct from root-cause interpretation.

## 12. Retest and Regression

For each supported fix, identify release, retest case, observed result, regression scope, and evidence. State any untested affected behavior.

## 13. Requirement Traceability

Attach or summarize the completed RTM. Explain any requirement without test/evidence coverage and reference the follow-up risk.

## 14. Evidence Index

Attach or summarize the evidence index. Include source paths or commands, capture context, and integrity notes where relevant.

## 15. Residual Risk and Limitations

State known evidence gaps, environment constraints, untested scope, and uncertainty. Avoid claims beyond the tested context.

## 16. Conclusion

Write a conclusion supported by the documented scope and evidence. Do not prefill a pass/fail conclusion.

## 17. Recommendation

State a reasoned next action, owner or priority where useful, and evidence basis. Leave blank until your review is complete.

## 18. Appendix / References

List source documents, work products, commands, environment details, and evidence identifiers.
