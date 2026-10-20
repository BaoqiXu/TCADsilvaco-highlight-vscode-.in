'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vscodeTextmate = require('vscode-textmate');
const oniguruma = require('vscode-oniguruma');

const root = path.resolve(__dirname, '..');
const grammarPath = path.join(root, 'syntaxes', 'silvaco.tmLanguage.json');

let grammarPromise;

function loadGrammar() {
  if (!grammarPromise) {
    grammarPromise = (async () => {
      const wasm = fs.readFileSync(require.resolve('vscode-oniguruma/release/onig.wasm'));
      const arrayBuffer = wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength);
      await oniguruma.loadWASM(arrayBuffer);
      const registry = new vscodeTextmate.Registry({
        onigLib: Promise.resolve({
          createOnigScanner: (sources) => new oniguruma.OnigScanner(sources),
          createOnigString: (text) => new oniguruma.OnigString(text)
        }),
        loadGrammar: async (scopeName) => {
          if (scopeName !== 'source.silvaco') {
            return null;
          }
          return vscodeTextmate.parseRawGrammar(fs.readFileSync(grammarPath, 'utf8'), grammarPath);
        }
      });
      return registry.loadGrammar('source.silvaco');
    })();
  }
  return grammarPromise;
}

function scopesFor(tokens, line, text) {
  const start = line.indexOf(text);
  const token = tokens.find((candidate) => candidate.startIndex <= start && candidate.endIndex >= start + text.length);
  assert.ok(token, `No token found for ${JSON.stringify(text)} in ${JSON.stringify(line)}`);
  return token.scopes;
}

test('grammar compiles in the TextMate Oniguruma engine', async () => {
  assert.ok(await loadGrammar());
});

test('tokenizes simulator selection, parameters, signed numbers, strings, and comments', async () => {
  const grammar = await loadGrammar();
  const cases = [
    ['go atlas', 'go', 'keyword.control.deckbuild.silvaco'],
    ['go atlas', 'atlas', 'entity.name.type.simulator.silvaco'],
    ['x.mesh loc=-0.5 spac=1e-3', 'loc', 'variable.parameter.silvaco'],
    ['x.mesh loc=-0.5 spac=1e-3', '-0.5', 'constant.numeric.float.silvaco'],
    ['x.mesh loc=-0.5 spac=1e-3', '1e-3', 'constant.numeric.scientific.silvaco'],
    ['set x=1', 'x', 'variable.parameter.silvaco'],
    ['set label="a#b" # trailing comment', 'a#b', 'string.quoted.double.silvaco'],
    ['set label="a#b" # trailing comment', '# trailing comment', 'comment.line.number-sign.silvaco']
  ];

  for (const [line, text, expectedScope] of cases) {
    const result = grammar.tokenizeLine(line, vscodeTextmate.INITIAL);
    assert.ok(scopesFor(result.tokens, line, text).includes(expectedScope), `${text} should have scope ${expectedScope}`);
  }
});

test('recognizes a literal backslash followed by whitespace as a continuation', async () => {
  const grammar = await loadGrammar();
  const line = 'solve vgate=0 \\   ';
  const result = grammar.tokenizeLine(line, vscodeTextmate.INITIAL);
  assert.ok(scopesFor(result.tokens, line, '\\   ').includes('constant.character.escape.line-continuation.silvaco'));
});

test('representative decks contain highlighted first statements', async () => {
  const grammar = await loadGrammar();
  const fixtureNames = ['atlas-smoke.in', 'athena-smoke.in', 'victory-smoke.in'];
  for (const fixtureName of fixtureNames) {
    const lines = fs.readFileSync(path.join(__dirname, 'fixtures', fixtureName), 'utf8').split(/\r?\n/);
    let stack = vscodeTextmate.INITIAL;
    for (const line of lines) {
      const result = grammar.tokenizeLine(line, stack);
      stack = result.ruleStack;
      const statement = line.match(/^\s*([A-Za-z_][A-Za-z0-9_.]*)/);
      if (!statement) {
        continue;
      }
      const scopes = scopesFor(result.tokens, line, statement[1]);
      assert.ok(
        scopes.some((scope) => scope.startsWith('keyword.') || scope === 'support.function.model.silvaco'),
        `${fixtureName}: ${statement[1]} is not recognized in ${line}`
      );
    }
  }
});

test('known speculative or misspelled tokens are absent from the grammar', () => {
  const source = fs.readFileSync(grammarPath, 'utf8').toUpperCase();
  for (const token of ['ADMITANCE', 'DEEPRECTIVE', 'BUFFEREED', 'DEFECTASSISTTED']) {
    assert.ok(!source.includes(token), `${token} must not be shipped as a language token`);
  }
});
