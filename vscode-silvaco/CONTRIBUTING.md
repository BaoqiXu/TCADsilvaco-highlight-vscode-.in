# Contributing / 参与贡献

Small, reproducible highlighting fixes are welcome. Keep changes focused on reading and editing decks.

1. Use Node.js 22.12+ and run `npm ci`.
2. Edit `syntaxes/silvaco.tmLanguage.json` or `language-configuration.json`.
3. For grammar fixes, add a minimal regression case in `test/grammar.test.js` or `test/fixtures/`.
4. Run `npm test` and `npm run package`.
5. Press F5 in VS Code to inspect the result in an Extension Development Host.

Explain the expected highlighting and the relevant simulator/module version. For new language tokens, provide a public reference or describe the source you checked. Share only short examples you are allowed to publish; do not upload proprietary manuals or private project decks.

Tests check highlighting, not simulator acceptance or physical correctness. Please keep proposed AI integration, simulation runners, and large deck template collections outside the scope of this lightweight edition.

欢迎提交小而明确的高亮修复：提供最小复现片段、预期效果和相关模拟器版本，修改规则后运行测试与打包，并用 F5 检查实际显示效果。新增关键词请提供公开参考或说明核对依据；只提交可以公开的简短示例。

测试验证的是高亮，不是仿真语法或物理正确性。本版本专注于查看和编辑代码。
