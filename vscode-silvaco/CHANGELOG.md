# Changelog

## 0.4.0 — 2026-10-19

- Focus the extension on syntax highlighting and basic editing for `.in` and `.deck` files.
- Retain comments, bracket matching, quote/parenthesis pairing, and region folding.
- Remove runtime completion, snippets, simulation commands, task providers, and simulation settings from this edition.
- Remove the JavaScript extension entry point; highlighting is entirely declarative.
- Add English and Simplified Chinese documentation for local editing and the Remote SSH workflow.
- Add Windows/Linux CI for grammar tests and VSIX packaging.

### Upgrading from 0.3.0

The previous completion provider, snippets, and `Silvaco: Run Current Deck` / `Stop Simulation` commands are no longer included. Existing `silvaco.*` simulation settings and `type: "silvaco"` tasks are no longer used. Continue running decks manually in DeckBuild.

从 0.3.0 升级后，旧版补全、代码片段与仿真运行／停止命令不再提供；原有 `silvaco.*` 仿真设置和 `type: "silvaco"` 任务不再使用。请继续在 DeckBuild 中手动运行。
