---
id: publish-verification-test
slug: /publish-verification-test
title: Publishing Verification Test
sidebar_position: 2
description: Record verification results for document saves, GitHub commits, and GitHub Actions runs.
---

# Publishing Verification Test

This document records the results of a complete test. Update the test marker with each change so you can find it in the GitHub file and on the built page.

## Test Marker

**Current marker: FLOW-TEST-001**

Increase the number for each test, for example `FLOW-TEST-002`.

## Verification Steps

1. Update the current test marker in the CMS.
2. Save the changes.
3. Check the document contents and commit history on GitHub.
4. Check whether GitHub Actions has started a new run.
5. If the workflow publishes the site, check that the published page shows the new marker.

> Verification criterion: The saved file, GitHub commit history, and workflow results should all correspond to the same change.

## Results

| Check | Result | Notes |
| --- | --- | --- |
| CMS save | Pending verification | Record the save time |
| GitHub file update | Pending verification | Record the commit ID |
| GitHub Actions run | Pending verification | Record the run ID |
| Built page content | Pending verification | Check the test marker |

## Example Test Record

```text
Test marker: FLOW-TEST-001
Save time: To be filled in
GitHub commit: To be filled in
Workflow result: To be filled in
Page content: To be filled in
```

## Test Conclusion

Fill this in after completing the first test.
