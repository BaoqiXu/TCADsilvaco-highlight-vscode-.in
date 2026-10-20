# Silvaco DeckBuild Syntax Highlighting

**English** | [简体中文](README.zh-CN.md)

A lightweight VS Code extension for reading and editing Silvaco TCAD `.in` and `.deck` files.

Keep your simulation files together in VS Code, edit them with syntax highlighting, and run them in DeckBuild when you are ready.

## Why this extension?

This project grew out of a simple workflow: connect to a Linux machine with Remote SSH, open a simulation folder in VS Code, browse different deck versions, and make small edits before running DeckBuild manually.

VS Code already provides the file explorer, search, side-by-side comparisons, and Git integration. This extension adds language highlighting and basic editing support for Silvaco decks. It is useful whether you write a deck yourself or review one generated with AI.

## Features

- Syntax highlighting for common DeckBuild, ATLAS, ATHENA, and Victory statements.
- Highlighting for parameters, materials, model names, variables, strings, comments, and numbers, including scientific notation.
- `#` line comments through VS Code's **Toggle Line Comment** command.
- Bracket matching and automatic quote/parenthesis pairing.
- Folding markers using `# region` and `# endregion`.
- A declarative TextMate grammar with no extension runtime code or runtime dependencies.

Highlight colors depend on your VS Code theme. Highlighting identifies text patterns; it does not validate simulator syntax or device physics. Coverage is partial and may differ between Silvaco versions.

Version 0.4.0 focuses on editing. It does not provide completion, simulation templates, or simulation launch commands.

## Install

Requires VS Code **1.85.0 or later**. Silvaco is not required to use the editor features.

### From a VSIX

1. Obtain `silvaco-deckbuild-0.4.0.vsix` from a release attachment, if available, or build it using the steps below.
2. Open the Command Palette and run **Extensions: Install from VSIX...**.
3. Select the VSIX and open an `.in` or `.deck` file.
4. If needed, click the language mode in the status bar and choose **Silvaco DeckBuild**.

### Build from source

Use Node.js **22.12 or later** and npm:

```sh
npm ci
npm test
npm run package
```

The package command creates `silvaco-deckbuild-0.4.0.vsix` in the project root. Install it using the steps above. To preview changes during development, open this repository in VS Code and press **F5**.

## A simple Remote SSH workflow

1. Connect to your Linux machine using Microsoft's [Remote - SSH](https://code.visualstudio.com/docs/remote/ssh) extension.
2. Open the remote simulation folder in VS Code.
3. Make sure this extension is enabled in that window. If VS Code offers **Install in SSH: ...**, use that action, or install the VSIX from the connected window.
4. Browse, compare, and edit decks, then save your changes.
5. In your usual Linux desktop session, open or reload the saved file in DeckBuild and run it manually.

Remote SSH handles the connection and remote files. It does not open the DeckBuild GUI for you. If DeckBuild already has the file open, make sure it has loaded the version you just saved before running it.

A project folder might look like this; the names are only an organizational example:

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

VS Code's Explorer provides the file tree. You can select two files and use **Select for Compare** / **Compare with Selected** to inspect changes. Git is optional if you also want a record of edits over time.

## Editing tips

### Fold sections

Add markers around a section, then use the folding control in the editor gutter:

```text
# region Mesh
# Your mesh statements here
# endregion
```

### File associations

The `.in` suffix is shared by many tools. If you only want certain files to use Silvaco highlighting, configure **workspace** file associations, for example:

```json
{
  "files.associations": {
    "*.tcad.in": "silvaco"
  }
}
```

This adds an explicit association; it does not remove the extension's default `.in` association. For unrelated `.in` files, select the appropriate language manually or add a more specific association for their names or paths.

## Development and feedback

Grammar rules live in `syntaxes/silvaco.tmLanguage.json`; editor behavior lives in `language-configuration.json`. Tests compile the grammar with TextMate and Oniguruma and check representative tokens and fixtures. Fixtures are highlighting samples, not validated simulation examples.

For a highlighting issue, include a short reproducible deck excerpt, the expected and actual highlighting, your VS Code version, theme, and relevant Silvaco module/version. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License and affiliation

[MIT](LICENSE) © 2026 babyqi.

This is an independent community project, not affiliated with, sponsored by, or endorsed by Silvaco, Inc. Product names and trademarks belong to their respective owners. The extension does not include Silvaco software, manuals, or licenses.
