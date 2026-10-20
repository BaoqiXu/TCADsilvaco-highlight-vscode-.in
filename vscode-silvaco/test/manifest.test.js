'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

test('the highlighting-only package has no runtime entry point or execution features', () => {
  assert.equal(manifest.main, undefined);
  assert.equal(manifest.browser, undefined);
  assert.equal(manifest.activationEvents, undefined);
  assert.deepEqual(Object.keys(manifest.dependencies || {}), []);
  for (const key of ['commands', 'taskDefinitions', 'snippets', 'configuration', 'menus']) {
    assert.equal(manifest.contributes[key], undefined, key);
  }
});

test('language and grammar contributions point to shipped files', () => {
  const language = manifest.contributes.languages.find(item => item.id === 'silvaco');
  assert.deepEqual(language.extensions, ['.in', '.deck']);
  assert.ok(fs.existsSync(path.join(root, language.configuration)));
  const grammar = manifest.contributes.grammars.find(item => item.language === language.id);
  assert.ok(fs.existsSync(path.join(root, grammar.path)));
  const source = JSON.parse(fs.readFileSync(path.join(root, grammar.path), 'utf8'));
  assert.equal(grammar.scopeName, source.scopeName);
});

test('editor configuration supports comments, dotted words, and region folding', () => {
  const configuration = JSON.parse(fs.readFileSync(path.join(root, 'language-configuration.json'), 'utf8'));
  assert.equal(configuration.comments.lineComment, '#');
  assert.equal('x.mesh'.match(new RegExp(configuration.wordPattern))[0], 'x.mesh');
  assert.match('# region Mesh', new RegExp(configuration.folding.markers.start));
  assert.match('# endregion', new RegExp(configuration.folding.markers.end));
});
