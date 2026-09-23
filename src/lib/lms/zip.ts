/**
 * A ZIP file, built in the browser.
 *
 * The reading kit is a set of PDFs handed over at the end of a course, and
 * handing them over one file at a time means seven downloads and seven
 * "keep this file?" prompts. One archive is one decision.
 *
 * Entries are stored, not deflated. A PDF is already compressed, so deflating
 * it again buys almost nothing and would cost a compressor — which is the
 * whole reason this is thirty lines rather than a dependency.
 */

/** CRC-32, which every entry's header has to carry. */
const TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) c = TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** DOS time and date, which is what a ZIP header stores. */
function dosStamp(at: Date) {
  const time = (at.getHours() << 11) | (at.getMinutes() << 5) | (Math.floor(at.getSeconds() / 2) & 0x1f);
  const date = ((at.getFullYear() - 1980) << 9) | ((at.getMonth() + 1) << 5) | at.getDate();
  return { time, date };
}

export type ZipEntry = { name: string; data: Uint8Array };

export function zipFiles(entries: ZipEntry[], at = new Date()): Blob {
  const { time, date } = dosStamp(at);
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = encoder.encode(entry.name);
    const crc = crc32(entry.data);

    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); // local file header
    lv.setUint16(4, 20, true); // version needed
    lv.setUint16(6, 0, true); // flags
    lv.setUint16(8, 0, true); // stored
    lv.setUint16(10, time, true);
    lv.setUint16(12, date, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, entry.data.length, true);
    lv.setUint32(22, entry.data.length, true);
    lv.setUint16(26, name.length, true);
    lv.setUint16(28, 0, true); // no extra field
    local.set(name, 30);

    const head = new Uint8Array(46 + name.length);
    const hv = new DataView(head.buffer);
    hv.setUint32(0, 0x02014b50, true); // central directory header
    hv.setUint16(4, 20, true); // version made by
    hv.setUint16(6, 20, true); // version needed
    hv.setUint16(8, 0, true);
    hv.setUint16(10, 0, true);
    hv.setUint16(12, time, true);
    hv.setUint16(14, date, true);
    hv.setUint32(16, crc, true);
    hv.setUint32(20, entry.data.length, true);
    hv.setUint32(24, entry.data.length, true);
    hv.setUint16(28, name.length, true);
    hv.setUint16(30, 0, true); // extra
    hv.setUint16(32, 0, true); // comment
    hv.setUint16(34, 0, true); // disk
    hv.setUint16(36, 0, true); // internal attributes
    hv.setUint32(38, 0, true); // external attributes
    hv.setUint32(42, offset, true); // where its local header is
    head.set(name, 46);

    parts.push(local, entry.data);
    central.push(head);
    offset += local.length + entry.data.length;
  }

  const size = central.reduce((n, c) => n + c.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); // end of central directory
  ev.setUint16(4, 0, true); // this disk
  ev.setUint16(6, 0, true); // disk with the directory
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, size, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true); // no comment

  return new Blob([...parts, ...central, end] as BlobPart[], { type: "application/zip" });
}
