const fs = require('fs');
const p = 'src/components/lms/LmsChrome.tsx';
let s = fs.readFileSync(p, 'utf8');
// Wrap the account bar (first block after the fragment) in the publicPage guard.
s = s.replace(
  '  return (\n    <>\n      <div style={{ background: "#fff", borderBottom: "1px solid #e3eaf0", padding: "12px 48px" }} className="site-page-sec">',
  '  return (\n    <>\n      {!publicPage && (\n      <div style={{ background: "#fff", borderBottom: "1px solid #e3eaf0", padding: "12px 48px" }} className="site-page-sec">'
);
if (!s.includes('{!publicPage && (')) throw new Error('account bar not wrapped');
fs.writeFileSync(p, s);
console.log('ok');
