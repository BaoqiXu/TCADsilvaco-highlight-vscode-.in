# Silvaco DeckBuild 语法高亮

[English](README.md) | **简体中文**

一个轻量的 VS Code 扩展，用于阅读和编辑 Silvaco TCAD 的 `.in`、`.deck` 文件。

在 VS Code 里整理仿真文件、查看代码、修改参数，准备好后再去 DeckBuild 中运行。

## 为什么做这个扩展？

它来自一个很简单的使用习惯：通过 Remote SSH 连接 Linux，在 VS Code 中打开仿真文件夹，查看不同版本的 deck，修改并保存，然后自己在 DeckBuild 中点击运行。

文件树、搜索、并排比较和 Git 集成都由 VS Code 提供。这个扩展补上 Silvaco 代码的语法高亮和基础编辑支持。无论是自己写代码，还是检查 AI 生成的代码，都可以用它来辅助阅读。

## 功能

- 常见 DeckBuild、ATLAS、ATHENA 和 Victory 语句高亮。
- 参数、材料、模型名称、变量、字符串、注释和数字高亮，包括科学计数法。
- 通过 VS Code 的 **切换行注释（Toggle Line Comment）** 命令添加或取消 `#` 注释。
- 括号匹配，以及引号、圆括号自动配对。
- 使用 `# region` 和 `# endregion` 标记折叠区段。
- 使用声明式 TextMate 语法，无扩展运行时代码和运行时依赖。

具体颜色由 VS Code 主题决定。高亮只是识别文本模式，不代表命令语法或器件物理正确。当前覆盖部分常见语句，不同 Silvaco 版本可能存在差异。

0.4.0 版专注于编辑体验，不提供代码补全、仿真模板或启动仿真的命令。

## 安装

需要 **VS Code 1.85.0 或更新版本**。使用编辑功能不需要安装 Silvaco。

### 安装 VSIX

1. 如果仓库 Release 提供了附件，下载 `silvaco-deckbuild-0.4.0.vsix`；也可以按照下方步骤自行构建。
2. 打开命令面板，执行 **扩展：从 VSIX 安装…（Extensions: Install from VSIX...）**。
3. 选择 VSIX，然后打开 `.in` 或 `.deck` 文件。
4. 如果没有自动识别，点击状态栏的语言模式，选择 **Silvaco DeckBuild**。

### 从源码构建

使用 **Node.js 22.12 或更新版本**及 npm：

```sh
npm ci
npm test
npm run package
```

项目根目录会生成 `silvaco-deckbuild-0.4.0.vsix`，按上述步骤安装即可。开发时可在 VS Code 中打开本仓库，按 **F5** 预览修改。

## 通过 Remote SSH 使用

1. 使用微软的 [Remote - SSH](https://code.visualstudio.com/docs/remote/ssh) 扩展连接 Linux。
2. 在 VS Code 中打开远程的仿真文件夹。
3. 确认本扩展在当前窗口中已启用。如果出现 **安装到 SSH: …（Install in SSH: ...）**，点击安装；也可以在已连接的窗口里从 VSIX 安装。
4. 在文件树中浏览、比较和修改 deck，然后保存。
5. 回到平时使用的 Linux 桌面会话，在 DeckBuild 中打开或重新加载刚保存的文件，再手动运行。

Remote SSH 负责连接和远程文件访问，不会替你打开 DeckBuild 图形界面。如果 DeckBuild 已经打开了这个文件，运行前确认它已加载刚保存的版本。

例如，可以这样组织文件夹；下面只是命名示意：

```text
device-study/
├── baseline/
│   └── device.in
├── mesh-study/
│   ├── coarse.in
│   └── fine.in
├── model-study/
│   ├── without-traps.in
│   └── with-traps.in
├── results/
└── notes.md
```

文件树由 VS Code 的资源管理器提供。右键一个文件选择 **选择以进行比较**，再右键另一个文件选择 **与已选项目进行比较**，即可查看区别。如果还想记录每次修改的历史，可以另行使用 Git。

## 编辑小技巧

### 折叠代码区段

在一段代码前后加入标记，使用编辑器行号旁的折叠按钮：

```text
# region Mesh
# 在这里放置网格语句
# endregion
```

### 文件类型关联

`.in` 也被其他软件使用。可以在 **工作区设置** 中为特定文件指定语言，例如：

```json
{
  "files.associations": {
    "*.tcad.in": "silvaco"
  }
}
```

这个设置增加明确的关联规则，不会取消扩展对 `.in` 的默认关联。对于其他软件的 `.in` 文件，可以手动切换语言，或为其文件名、路径配置更具体的关联规则。

## 开发与反馈

语法规则位于 `syntaxes/silvaco.tmLanguage.json`，编辑行为位于 `language-configuration.json`。测试使用 TextMate 和 Oniguruma 编译语法，检查代表性词元和示例文件。测试文件只用于验证高亮，不是已经通过仿真验证的例程。

反馈高亮问题时，请附上最小代码片段、预期和实际效果、VS Code 版本、主题，以及相关 Silvaco 模块和版本。贡献方式见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证与声明

[MIT](LICENSE) © 2026 babyqi。

本项目是独立开发的社区扩展，与 Silvaco, Inc. 无隶属、赞助或官方认可关系。产品名称与商标属于各自权利人。扩展不包含 Silvaco 软件、手册或许可证。
