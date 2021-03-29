import { highlight } from 'highlight.js';
import { Marked } from '@ts-stack/markdown';

Marked.setOptions({ highlight: (code, lang) => highlight(lang, code).value });

console.log(Marked.parse('```js\n console.log("hello"); \n```'));
