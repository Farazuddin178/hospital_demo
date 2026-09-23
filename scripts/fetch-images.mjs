import { writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";
import zlib from "node:zlib";

const BASE = "https://images.unsplash.com/photo-";

// name, unsplash id, aspect (w/h), [mobile width, desktop width], alt text
const SET = [
  ["care-band",         "1519494026892-80bbd2d6fd0d", 21/9, [1200, 2000], "Nurses and physicians conferring in a bright hospital corridor"],
  ["care-model",        "1576091160550-2173dba999ef", 4/5,  [560, 960],   "A physician listening to a seated patient during a consultation"],
  ["patient-story",     "1594824476967-48c8b964273f", 4/3,  [560, 960],   "A doctor smiling with a patient after a follow-up visit"],
  ["campus",            "1584515933487-779824d29309", 3/2,  [600, 1040],  "The main entrance of the Oxygen Hospital campus"],
  ["provider-cardio",   "1622253692010-333f2da6031d", 1,    [380, 700],   "Portrait of a cardiologist in a white coat"],
  ["provider-peds",     "1559839734-2b71ea197ec2",    1,    [380, 700],   "Portrait of a paediatrician smiling"],
  ["provider-ortho",    "1612349317150-e413f6a5b16d", 1,    [380, 700],   "Portrait of an orthopaedic surgeon"],
  ["provider-neuro",    "1579684385127-1ef15d508118", 1,    [380, 700],   "Portrait of a neurologist in a consulting room"],
  ["article-emergency", "1587351021759-3e566b6af7cc", 3/2,  [500, 880],   "An emergency response team moving through an ambulance bay"],
  ["article-recovery",  "1516549655169-df83a0774514", 3/2,  [500, 880],   "A clinician reviewing recovery notes with a patient"],
  ["article-team",      "1631217868264-e5b90bb7e133", 3/2,  [500, 880],   "Members of the care team meeting at a nurses station"],
];

const img = (id, w, h, q, fm = "webp") =>
  `${BASE}${id}?w=${w}&h=${h}&fit=crop&crop=faces,entropy&fm=${fm}&q=${q}`;

async function grab(u) {
  const res = await fetch(u);
  if (!res.ok) throw new Error(`${res.status} ${u}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Decode a tiny non-interlaced PNG and average its pixels -> "#rrggbb". */
function averageColor(png) {
  let pos = 8, width = 0, height = 0, colorType = 0, bitDepth = 0;
  const idat = [];
  while (pos < png.length) {
    const len = png.readUInt32BE(pos);
    const type = png.toString("ascii", pos + 4, pos + 8);
    const body = png.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      bitDepth = body[8];
      colorType = body[9];
    } else if (type === "IDAT") idat.push(body);
    else if (type === "IEND") break;
    pos += 12 + len;
  }
  if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) return null;
  const channels = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);
  // Undo the per-scanline PNG filters (types 0-4).
  for (let y = 0; y < height; y++) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? out[y * stride + x - channels] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = x >= channels && y > 0 ? out[(y - 1) * stride + x - channels] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[y * stride + x] = v & 0xff;
    }
  }
  let r = 0, g = 0, bl = 0, n = 0;
  for (let i = 0; i < out.length; i += channels) { r += out[i]; g += out[i + 1]; bl += out[i + 2]; n++; }
  const hex = (v) => Math.round(v / n).toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(bl)}`;
}

const manifest = {};
let mobile = 0, desktop = 0;

for (const [name, id, ar, [wSm, wLg], alt] of SET) {
  const hSm = Math.round(wSm / ar);
  const hLg = Math.round(wLg / ar);
  // The 2x variant sits at a lower quality: at double density the difference is
  // invisible but the byte saving is not.
  const small = await grab(img(id, wSm, hSm, 74));
  const large = await grab(img(id, wLg, hLg, 62));
  await writeFile(`public/images/${name}-${wSm}.webp`, small);
  await writeFile(`public/images/${name}-${wLg}.webp`, large);
  mobile += small.length;
  desktop += large.length;

  const color = averageColor(await grab(img(id, 6, Math.max(1, Math.round(6 / ar)), 90, "png"))) ?? "#e4eef5";

  manifest[name] = {
    src: `/images/${name}-${wLg}.webp`,
    srcSet: `/images/${name}-${wSm}.webp ${wSm}w, /images/${name}-${wLg}.webp ${wLg}w`,
    width: wLg,
    height: hLg,
    color,
    alt,
  };
  console.log(
    name.padEnd(18),
    `${(small.length / 1024).toFixed(0)}KB / ${(large.length / 1024).toFixed(0)}KB`.padEnd(14),
    color
  );
}

await writeFile("src/lib/image-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`\nmobile set ${(mobile / 1024).toFixed(0)}KB  |  desktop set ${(desktop / 1024).toFixed(0)}KB`);
