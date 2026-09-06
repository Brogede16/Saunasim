import fs from 'node:fs';

const read = name => fs.readFileSync(new URL(name, import.meta.url), 'utf8');
const output = read('./index.html')
  .replace('<link rel="stylesheet" href="./style.css">', () => '<style>' + read('./style.css') + '</style>')
  .replace('<link rel="stylesheet" href="./theme.css">', () => '<style>' + read('./theme.css') + '</style>')
  .replace('<script src="./core.js"></script>', () => '<script>' + read('./core.js') + '</script>')
  .replace('<script src="./ui.js"></script>', () => '<script>' + read('./ui.js') + '</script>');
fs.writeFileSync(new URL('./sauna-empire-no-sprites-rc.html', import.meta.url), output);
console.log('Standalone build written: ' + Buffer.byteLength(output) + ' bytes');
