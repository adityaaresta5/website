import { BlockNoteEditor } from "@blocknote/core";

const editor = BlockNoteEditor.create();
const keys = [];
for (let key in editor) {
  if (typeof editor[key] === 'function') {
    keys.push(key);
  }
}
console.log(keys.filter(k => k.toLowerCase().includes('html') || k.toLowerCase().includes('markdown') || k.toLowerCase().includes('blocks')));
