import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import {parse} from './parse';

console.time('parse');

const fileName = 'test.ts2d';
const ts2dFile = readFileSync(join(__dirname, fileName)).toString();
console.log(`## Raw file (${fileName}):\n${ts2dFile.split('\n').map(l => `| ${l}`).join('\n')}`);

const generated = parse(ts2dFile).join('');
const tsFileName = `${fileName.match(/^(.*)\.ts2d$/)[1]}.generated.ts`;
console.log(`## Parsed file (${tsFileName}):\n${generated.split('\n').map(l => `| ${l}`).join('\n')}`);
writeFileSync(join(__dirname, tsFileName), generated);

console.timeEnd('parse');
