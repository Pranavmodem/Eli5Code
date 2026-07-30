// Forty step-scripts — one visualizer per lesson.
// Every generator returns an array of frames. A frame carries { msg } plus the
// fields its render family needs, and optionally { predict: {q, a, b, t} } which
// makes the player stop and ask the learner to commit before revealing.

export const VIZ_OF = {
  m1l1: 'blueprint', m1l2: 'instances', m1l3: 'hasdoes', m1l4: 'ctor', m1l5: 'encap',
  m1l6: 'genetics', m1l7: 'dispatch', m1l8: 'polymatrix', m1l9: 'layers', m1l10: 'compose',
  m2l1: 'indexing', m2l2: 'dynarray', m2l3: 'list', m2l4: 'dlist', m2l5: 'stack',
  m2l6: 'queue', m2l7: 'hash', m2l8: 'collide', m2l9: 'bst', m2l10: 'graphviz',
  m3l1: 'bubble', m3l2: 'selection', m3l3: 'insertion', m3l4: 'merge', m3l5: 'quick',
  m3l6: 'linear', m3l7: 'binsearch', m3l8: 'bfs', m3l9: 'dfs', m3l10: 'callstack',
  m4l1: 'recipes', m4l2: 'switch1', m4l3: 'handshake', m4l4: 'pairs', m4l5: 'phonebook',
  m4l6: 'nlogn', m4l7: 'curves', m4l8: 'spacemem', m4l9: 'amort', m4l10: 'toolkit'
};

export const FAMILY = {
  blueprint: 'objects', instances: 'objects',
  hasdoes: 'panels', ctor: 'panels', encap: 'panels', layers: 'panels', compose: 'panels',
  genetics: 'graph', dispatch: 'graph', bst: 'graph', graphviz: 'graph', bfs: 'graph', dfs: 'graph',
  polymatrix: 'matrix', handshake: 'matrix', pairs: 'matrix', nlogn: 'matrix', spacemem: 'matrix', toolkit: 'matrix',
  indexing: 'cells', binsearch: 'cells', phonebook: 'cells', switch1: 'cells',
  bubble: 'bars', selection: 'bars', insertion: 'bars', merge: 'bars', quick: 'bars', linear: 'bars', dynarray: 'bars',
  list: 'nodes', dlist: 'nodes',
  stack: 'vstack', callstack: 'vstack',
  queue: 'hqueue',
  hash: 'buckets', collide: 'buckets',
  recipes: 'chart', curves: 'chart', amort: 'chart'
};

export const TITLE = {
  blueprint: 'One drawing, many houses', instances: 'Two houses, separate lives',
  hasdoes: 'What it has vs what it does', ctor: 'The build checklist', encap: 'Walls and a doorbell',
  genetics: 'Traits flowing down the family', dispatch: 'Which version actually runs',
  polymatrix: 'One message, many answers', layers: 'Peeling back the steering wheel',
  compose: 'Snapping parts on and off',
  indexing: 'Jumping straight to a slot', dynarray: 'Outgrowing the shelf',
  list: 'Following the clues', dlist: 'Footprints in both directions',
  stack: 'The tray pile', queue: 'The lunch line',
  hash: 'Straight to the page', collide: 'Two words on one page',
  bst: 'Descending the org chart', graphviz: 'Dots, lines and loops',
  bubble: 'Watch it sort', selection: 'Watch it select', insertion: 'Watch the hand fill',
  merge: 'Watch it split and zip', quick: 'Watch the room split',
  linear: 'Every drawer, one by one', binsearch: 'Watch the range halve',
  bfs: 'Ripples across the map', dfs: 'One corridor to the end',
  callstack: 'Dolls inside dolls',
  recipes: 'Shape beats stopwatch', switch1: 'The light switch',
  handshake: 'Greeting every guest', pairs: 'Everyone greets everyone',
  phonebook: 'Tearing the phone book', nlogn: 'Levels times width',
  curves: 'Four shapes of growth', spacemem: 'Counter space, not time',
  amort: 'The occasional big shop', toolkit: 'The whole toolbox'
};

export const CODE = {
  blueprint: 'class House {\n  constructor(colour) { this.colour = colour; }\n  openDoor() { return "creak"; }\n}\n// no house exists yet — this is the drawing',
  instances: 'const a = new House("white");\nconst b = new House("blue");\na.colour = "ochre";\nb.colour; // still "blue" — separate state',
  hasdoes: 'class House {\n  colour = "white";   // HAS\n  lightsOn = false;   // HAS\n  switchLights() {    // DOES\n    this.lightsOn = !this.lightsOn;\n  }\n}',
  ctor: 'constructor(colour, address) {\n  if (!colour) throw new Error("need a colour");\n  this.colour  = colour;\n  this.address = address;\n  this.ready   = true;   // invariants hold\n}',
  encap: 'class House {\n  #safeCode = "4821";        // private\n  ringBell() {               // public\n    return "who is it?";\n  }\n}\nhouse.#safeCode  // SyntaxError',
  genetics: 'class House { openDoor() { return "creak"; } }\nclass Townhouse extends House {}\nclass Cottage  extends House {}\n// both children get openDoor() for free',
  dispatch: 'const h: House = new Townhouse();\nh.openDoor();\n// declared type House,\n// actual type Townhouse ->\n// Townhouse.openDoor() runs',
  polymatrix: 'for (const thing of [dog, cat, car])\n  console.log(thing.makeSound());\n// bark / meow / honk\n// the loop knows none of the types',
  layers: 'steer(angle);        // you touch this\n  -> column.rotate(angle)\n    -> rack.translate(...)\n      -> hydraulics.assist(...)\n// the wheel hides all of it',
  compose: 'class Car {\n  constructor(engine) { this.engine = engine; }\n  swapEngine(e) { this.engine = e; }  // runtime\n}\nnew Car(new PetrolEngine());',
  indexing: 'a[6];\n// address = base + 6 * elementSize\n// one multiply, one add, one read\n// slots 0..5 are never touched',
  dynarray: 'append(v) {\n  if (this.len === this.cap) {\n    this.cap *= 2;          // O(n) copy\n    this.buf = copy(this.buf, this.cap);\n  }\n  this.buf[this.len++] = v; // O(1)\n}',
  list: 'insertAfter(node, value) {\n  const fresh = { value, next: node.next };\n  node.next = fresh;   // two writes,\n  return fresh;        // nothing shifts\n}',
  dlist: 'remove(node) {\n  node.prev.next = node.next;\n  node.next.prev = node.prev;\n}\n// no predecessor search needed',
  stack: 'push(v) { this.items.push(v); }\npop()   { return this.items.pop(); }\npeek()  { return this.items.at(-1); }\n// LIFO — one open end',
  queue: 'enqueue(v) { this.items.push(v); }\ndequeue()  { return this.items.shift(); }\n// FIFO — add at tail, take from head',
  hash: 'hash(key) {\n  let h = 0;\n  for (const ch of key) h += ch.charCodeAt(0);\n  return h % this.buckets.length;\n}',
  collide: 'put(k, v) {\n  const i = this.hash(k);\n  this.buckets[i].push([k, v]);  // chain\n}\n// load factor = entries / buckets\n// > 0.75 -> resize and rehash',
  bst: 'search(node, t) {\n  if (!node) return null;\n  if (t === node.v) return node;\n  return t < node.v\n    ? search(node.left,  t)\n    : search(node.right, t);\n}',
  graphviz: 'adj = {\n  A: ["B", "C"],\n  B: ["A", "D", "E"],\n};\n// space O(V + E) — good for sparse\n// matrix: O(V^2), O(1) edge lookup',
  bubble: 'for (let i = 0; i < n - 1; i++)\n  for (let j = 0; j < n - 1 - i; j++)\n    if (a[j] > a[j + 1])\n      swap(a, j, j + 1);',
  selection: 'for (let i = 0; i < n - 1; i++) {\n  let min = i;\n  for (let j = i + 1; j < n; j++)\n    if (a[j] < a[min]) min = j;\n  swap(a, i, min);\n}',
  insertion: 'for (let i = 1; i < n; i++) {\n  const key = a[i];\n  let j = i - 1;\n  while (j >= 0 && a[j] > key)\n    a[j + 1] = a[j--];\n  a[j + 1] = key;\n}',
  merge: 'function sort(a) {\n  if (a.length < 2) return a;\n  const m = a.length >> 1;\n  return merge(sort(a.slice(0, m)),\n               sort(a.slice(m)));\n}',
  quick: 'function part(a, lo, hi) {\n  const p = a[hi];\n  let i = lo;\n  for (let j = lo; j < hi; j++)\n    if (a[j] < p) swap(a, i++, j);\n  swap(a, i, hi);\n  return i;\n}',
  linear: 'for (let i = 0; i < n; i++)\n  if (a[i] === target) return i;\nreturn -1;\n// no ordering required',
  binsearch: 'let lo = 0, hi = n - 1;\nwhile (lo <= hi) {\n  const mid = (lo + hi) >> 1;\n  if (a[mid] === t) return mid;\n  if (a[mid] < t) lo = mid + 1;\n  else hi = mid - 1;\n}',
  bfs: 'const q = [start], seen = new Set([start]);\nwhile (q.length) {\n  const v = q.shift();      // FIFO\n  for (const w of adj[v])\n    if (!seen.has(w)) seen.add(w), q.push(w);\n}',
  dfs: 'const st = [start], seen = new Set();\nwhile (st.length) {\n  const v = st.pop();       // LIFO\n  if (seen.has(v)) continue;\n  seen.add(v);\n  for (const w of adj[v]) st.push(w);\n}',
  callstack: 'function count(doll) {\n  if (!doll.inner) return 1;   // base case\n  return 1 + count(doll.inner);\n}\n// each call waits for the one inside it',
  recipes: '// Chef A: 3 steps per guest\n// Chef B: 10 steps per guest\n// Chef C: half a step per PAIR\n// A and B are the same SHAPE. C is not.',
  switch1: 'lights.toggle();\n// one operation.\n// n = 1 bulb or n = 1,000,000 bulbs\n// the switch does not care',
  handshake: 'for (const guest of guests)\n  shake(guest);          // n handshakes',
  pairs: 'for (const a of guests)\n  for (const b of guests)\n    if (a !== b) shake(a, b);  // n^2',
  phonebook: 'while (lo <= hi) {\n  const mid = (lo + hi) >> 1;\n  if (name < page[mid]) hi = mid - 1;\n  else lo = mid + 1;\n}\n// 1,000,000 names -> ~20 tears',
  nlogn: '// log n levels of splitting\n// x n work to merge each level\n// = n log n total',
  curves: 'O(1)       a[i]\nO(log n)   binarySearch(a, t)\nO(n)       a.reduce(sum)\nO(n log n) a.sort()\nO(n^2)     for i: for j: compare(i, j)',
  spacemem: '// auxiliary space, excluding input\nbubbleSort   O(1)     in place\nquickSort    O(log n) call stack\nmergeSort    O(n)     scratch buffer',
  amort: 'append(v) {\n  if (len === cap) { cap *= 2; copy(); }  // rare\n  buf[len++] = v;                        // usual\n}\n// amortised O(1)',
  toolkit: '// pick by the dominant operation\nlookupById      -> hash map\niterateInOrder  -> array / tree\ninsertInMiddle  -> linked list\nalwaysTakeMax   -> heap'
};

const P = (q, a, b, t) => ({ q, a, b, t });

// ─── helpers ────────────────────────────────────────────────────────────────
const nums = (s, max) => {
  const n = String(s).split(/[^0-9]+/).filter(Boolean).map(Number).filter(v => v > 0 && v < 100).slice(0, max || 10);
  return n.length >= 3 ? n : [5, 3, 8, 1, 9, 2, 7, 4];
};
const range = (lo, hi) => { const r = []; for (let i = lo; i <= hi; i++) r.push(i); return r; };

// ─── OBJECTS family (Module 1, lessons 1–2) ─────────────────────────────────
function blueprint(ops) {
  const F = [], objs = [];
  const cls = { name: 'House', fields: ['colour: string', 'windows: number', 'address: string', 'openDoor(): string'] };
  const snap = (msg, clsHot, hot, predict) => F.push({ cls, clsHot, objs: objs.map(o => Object.assign({}, o)), hot, msg, predict });
  snap('This is the drawing. Rooms, windows, a front door — all described, none of it built.', true, -1);
  snap('Count the houses on the street: zero. A class allocates nothing at all.', true, -1,
    P('Does writing class House build a house?', 'Yes', 'No', false));
  (ops || [['new', 'House'], ['new', 'House']]).forEach(([op, arg], i) => {
    if (op === 'new') {
      objs.push({ id: objs.length + 1, type: arg, colour: arg === 'Townhouse' ? 'brick' : 'white' });
      snap(`new ${arg}() reads the drawing and builds house${objs.length} — the drawing itself is untouched and reusable.`, true, objs.length - 1);
    } else if (op === 'paint') {
      const t = objs[Math.min(arg, objs.length - 1)];
      if (t) { t.colour = 'ochre'; snap(`Painted house${t.id}. The drawing never said "ochre" — that is this object's own state.`, false, objs.indexOf(t)); }
    }
    void i;
  });
  snap(`${objs.length} building${objs.length === 1 ? '' : 's'} from one drawing. That ratio is the whole point of a class.`, true, -1);
  return F;
}
function instances(ops) {
  const F = [], objs = [{ id: 1, type: 'House', colour: 'white' }, { id: 2, type: 'House', colour: 'white' }];
  const cls = { name: 'House', fields: ['colour: string', 'windows: number', 'address: string'] };
  const snap = (msg, hot, predict) => F.push({ cls, clsHot: false, objs: objs.map(o => Object.assign({}, o)), hot, msg, predict });
  snap('Two houses, same drawing, identical so far. Both white.', -1);
  snap('Now paint house1 ochre. Watch house2 closely.', 0,
    P('Will house2 change too?', 'Yes', 'No', false));
  objs[0].colour = 'ochre';
  snap('house1 is ochre. house2 is still white — each object holds its own copy of every field.', 0);
  (ops || []).forEach(([op, arg]) => {
    const t = objs[Math.min(Number(arg) || 0, objs.length - 1)];
    if (op === 'paint' && t) {
      const c = ['white', 'blue', 'ochre', 'grey', 'brick'];
      t.colour = c[(c.indexOf(t.colour) + 1) % c.length];
      snap(`house${t.id} is now ${t.colour}. Still nobody else affected.`, objs.indexOf(t));
    } else if (op === 'new') {
      objs.push({ id: objs.length + 1, type: 'House', colour: 'white' });
      snap(`house${objs.length} arrives with fresh default state.`, objs.length - 1);
    }
  });
  snap('Identity matters: two objects can look identical and still be two different objects.', -1);
  return F;
}

// ─── PANELS family (Module 1, lessons 3–5, 9–10) ────────────────────────────
const pf = (panels, log, msg, predict) => ({ panels, log: log.slice(), msg, predict });
function hasdoes() {
  const F = [], log = [];
  let lightsOn = false, colour = 'white';
  const build = (hotHas, hotDoes) => ([
    { title: 'HAS — attributes (nouns)', rows: [{ t: `colour = "${colour}"`, s: hotHas === 0 ? 'hot' : '' }, { t: 'windows = 4', s: hotHas === 1 ? 'hot' : '' }, { t: `lightsOn = ${lightsOn}`, s: hotHas === 2 ? 'hot' : '' }] },
    { title: 'DOES — methods (verbs)', rows: [{ t: 'openDoor()', s: hotDoes === 0 ? 'hot' : '' }, { t: 'switchLights()', s: hotDoes === 1 ? 'hot' : '' }, { t: 'repaint(colour)', s: hotDoes === 2 ? 'hot' : '' }] }
  ]);
  F.push(pf(build(-1, -1), log, 'Two columns. Things the house HAS, and things the house DOES.'));
  F.push(pf(build(0, -1), log, 'colour is an attribute — you can point at it and read a value.'));
  F.push(pf(build(2, -1), log, 'lightsOn is an attribute too: false right now.'));
  F.push(pf(build(-1, 1), log, 'switchLights() is a method. It performs an action.',
    P('Will calling switchLights() change an attribute?', 'Yes', 'No', true)));
  lightsOn = true; log.push({ t: 'house.switchLights()  ->  lightsOn: false -> true', s: 'on' });
  F.push(pf(build(2, 1), log, 'The method reached into the object and flipped its own attribute. Behaviour changing state — that is the pairing.'));
  F.push(pf(build(-1, 2), log, 'repaint("blue") takes an argument. Methods can be handed information.',
    P('Does repaint() need to be told which house it is repainting?', 'Yes', 'No', false)));
  colour = 'blue'; log.push({ t: 'house.repaint("blue")  ->  colour: "white" -> "blue"', s: 'on' });
  F.push(pf(build(0, 2), log, 'No — the method already receives the instance implicitly (this / self). That is how it reaches its own fields.'));
  return F;
}
function ctor() {
  const F = [], log = [];
  const steps = ['allocate memory for the object', 'validate the arguments', 'assign colour', 'assign address', 'mark the object ready'];
  const build = (upto, hot, bad) => ([
    { title: 'CONSTRUCTOR CHECKLIST — runs once', rows: steps.map((t, i) => ({ t: `${i + 1}. ${t}`, s: i === hot ? 'hot' : i < upto ? 'on' : bad === i ? 'bad' : 'off' })) }
  ]);
  F.push(pf(build(0, -1), log, 'new House("white", "12 Elm St") is called. Nothing exists yet.'));
  F.push(pf(build(0, 0), log, 'Step 1: memory is set aside. The fields exist but hold nothing meaningful.',
    P('Is the object safe to use right now?', 'Yes', 'No', false)));
  log.push({ t: 'colour: undefined — do NOT use the object yet', s: 'bad' });
  F.push(pf(build(1, 1), log, 'Step 2: the arguments are checked. A missing colour would throw here, before anyone can hold a broken house.'));
  F.push(pf(build(2, 2), log, 'Step 3: colour = "white".'));
  log.push({ t: 'colour: "white"', s: 'on' });
  F.push(pf(build(3, 3), log, 'Step 4: address = "12 Elm St".'));
  log.push({ t: 'address: "12 Elm St"', s: 'on' });
  F.push(pf(build(4, 4), log, 'Step 5: every invariant now holds. The object is finally handed back to the caller.'));
  log.push({ t: 'ready: true — the reference is returned', s: 'on' });
  F.push(pf(build(5, -1), log, 'This checklist runs exactly once per object, ever. Call a method a thousand times — the constructor never runs again.',
    P('Does the constructor run again when you call openDoor()?', 'Yes', 'No', false)));
  return F;
}
function encap() {
  const F = [], log = [];
  const build = (hotIn, hotOut) => ([
    { title: 'INSIDE THE WALLS — private', rows: [{ t: '#wiring', s: hotIn === 0 ? 'hot' : '' }, { t: '#plumbing', s: hotIn === 1 ? 'hot' : '' }, { t: '#safeCode = "4821"', s: hotIn === 2 ? 'hot' : '' }] },
    { title: 'THE DOORBELL — public', rows: [{ t: 'ringBell()', s: hotOut === 0 ? 'hot' : '' }, { t: 'requestEntry(name)', s: hotOut === 1 ? 'hot' : '' }] }
  ]);
  F.push(pf(build(-1, -1), log, 'Private things behind the wall. Public things on the porch.'));
  F.push(pf(build(2, -1), log, 'A stranger tries to read the safe code directly: house.#safeCode',
    P('Does the language let them read it?', 'Yes', 'No', false)));
  log.push({ t: 'house.#safeCode  ->  BLOCKED (private field)', s: 'bad' });
  F.push(pf(build(2, -1), log, 'Blocked. The field is not part of the public surface, so no caller can depend on it — which means you are free to rename or delete it tomorrow.'));
  F.push(pf(build(-1, 0), log, 'The agreed way in is the doorbell.'));
  log.push({ t: 'house.ringBell()  ->  "who is it?"', s: 'on' });
  F.push(pf(build(0, 0), log, 'ringBell() is allowed, and internally it reads the wiring on your behalf. The house decided what to expose.'));
  log.push({ t: 'house.requestEntry("post")  ->  checks #safeCode, opens', s: 'on' });
  F.push(pf(build(2, 1), log, 'requestEntry() uses the private code without ever revealing it. Control, not secrecy for its own sake.',
    P('If you rename #safeCode tomorrow, does outside code break?', 'Yes', 'No', false)));
  F.push(pf(build(-1, -1), log, 'Nothing outside ever named it, so nothing outside can break. That freedom is what encapsulation buys.'));
  return F;
}
function layers() {
  const F = [], log = [];
  const L = ['Steering wheel — the only thing you touch', 'Steering column', 'Rack and pinion', 'Hydraulic assist', 'Tyre against road'];
  const build = (depth, hot) => ([
    { title: 'ABSTRACTION LAYERS', rows: L.map((t, i) => ({ t, s: i === hot ? 'hot' : i <= depth ? 'on' : 'off' })) }
  ]);
  F.push(pf(build(0, 0), log, 'You turn the wheel. As far as you are concerned, that is the whole mechanism.',
    P('To steer, do you need to know what a rack and pinion is?', 'Yes', 'No', false)));
  log.push({ t: 'steer(-15deg)', s: 'on' });
  for (let i = 1; i < L.length; i++) {
    F.push(pf(build(i, i), log, `Peel one layer: ${L[i]} is doing work you never asked about.`));
    log.push({ t: `  -> ${L[i].split(' —')[0].toLowerCase()} responds`, s: '' });
  }
  F.push(pf(build(4, -1), log, 'Five layers deep, and the interface never changed. Swap to electric assist and the wheel still just turns.',
    P('Replace the hydraulics with an electric motor — does your steering habit change?', 'Yes', 'No', false)));
  F.push(pf(build(0, 0), log, 'It does not. A good abstraction lets the inside be replaced without telling anyone.'));
  return F;
}
function compose(ops) {
  const F = [], log = [];
  let engine = 'PetrolEngine', stereo = 'BasicStereo';
  const build = (hot) => ([
    { title: 'CAR — owns its parts (has-a)', rows: [{ t: `engine: ${engine}`, s: hot === 0 ? 'hot' : 'on' }, { t: 'wheels: Wheel × 4', s: 'on' }, { t: `stereo: ${stereo}`, s: hot === 1 ? 'hot' : 'on' }] },
    { title: 'PARTS SHELF — swappable', rows: [{ t: 'ElectricEngine', s: hot === 0 ? 'hot' : 'off' }, { t: 'PremiumStereo', s: hot === 1 ? 'hot' : 'off' }, { t: 'RoofRack', s: 'off' }] }
  ]);
  F.push(pf(build(-1), log, 'The car does not inherit an engine. It holds one.'));
  F.push(pf(build(0), log, 'Swap the petrol engine for the electric one — while the car is running.',
    P('Could you swap a PARENT CLASS at runtime like this?', 'Yes', 'No', false)));
  engine = 'ElectricEngine'; log.push({ t: 'car.swapEngine(new ElectricEngine())', s: 'on' });
  F.push(pf(build(0), log, 'Done. You cannot pick new parents at runtime, but you can always swap a part you own.'));
  (ops || []).forEach(([op]) => {
    if (op === 'stereo') { stereo = stereo === 'BasicStereo' ? 'PremiumStereo' : 'BasicStereo'; log.push({ t: `car.stereo = new ${stereo}()`, s: 'on' }); F.push(pf(build(1), log, `Stereo swapped to ${stereo}. Same trick, different part.`)); }
  });
  F.push(pf(build(-1), log, 'Deep inheritance chains freeze your decisions early. Composition keeps them reversible.'));
  return F;
}

// ─── GRAPH family ───────────────────────────────────────────────────────────
const GRAPH = {
  nodes: [['A', 320, 26], ['B', 150, 100], ['C', 490, 100], ['D', 60, 190], ['E', 240, 190], ['F', 410, 190], ['G', 570, 190], ['H', 320, 262]],
  adj: { A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F', 'G'], D: ['B'], E: ['B', 'H'], F: ['C', 'H'], G: ['C'], H: ['E', 'F'] }
};
const TREE = {
  nodes: [['50', 320, 30], ['30', 170, 115], ['70', 470, 115], ['20', 90, 200], ['40', 250, 200], ['60', 390, 200], ['80', 550, 200]],
  adj: { '50': ['30', '70'], '30': ['20', '40'], '70': ['60', '80'], '20': [], '40': [], '60': [], '80': [] }
};
const GENES = {
  nodes: [['House', 320, 40], ['Townhouse', 150, 150], ['Cottage', 490, 150], ['StudioFlat', 150, 258]],
  adj: { House: ['Townhouse', 'Cottage'], Townhouse: ['StudioFlat'], Cottage: [], StudioFlat: [] }
};
const CHAIN = {
  nodes: [['Townhouse', 320, 40], ['House', 320, 145], ['Object', 320, 250]],
  adj: { Townhouse: ['House'], House: ['Object'], Object: [] }
};
const gf = (g, seen, cur, front, msg, caption, predict) => ({ g, visited: seen.slice(), cur, front: front.slice(), order: seen.slice(), msg, caption, predict });

function genetics() {
  const F = [];
  const all = ['House', 'Townhouse', 'Cottage', 'StudioFlat'];
  F.push(gf(GENES, [], null, [], 'One parent class, two children, one grandchild.', 'House declares: openDoor(), windows, address'));
  F.push(gf(GENES, ['House'], 'House', [], 'House declares openDoor(). Only House wrote that code.', 'openDoor() defined in: House',
    P('Do Townhouse and Cottage need to write openDoor() themselves?', 'Yes', 'No', false)));
  F.push(gf(GENES, ['House', 'Townhouse', 'Cottage'], 'House', ['Townhouse', 'Cottage'], 'They inherit it. One definition, and every child below can already open a door.', 'openDoor() available in: House, Townhouse, Cottage'));
  F.push(gf(GENES, all, 'StudioFlat', [], 'Inheritance keeps flowing: StudioFlat extends Townhouse, so it gets openDoor() second-hand.', 'openDoor() available in: all four'));
  F.push(gf(GENES, ['House'], 'House', all, 'Now add solarPanels to House.', 'adding: House.solarPanels',
    P('Do all three descendants get solarPanels?', 'Yes', 'No', true)));
  F.push(gf(GENES, all, null, [], 'All of them, instantly — that is the power and the danger. One edit to a base class reaches everything below it.', 'solarPanels available in: all four'));
  F.push(gf(GENES, ['Townhouse', 'StudioFlat'], 'Townhouse', [], 'Townhouse overrides openDoor() with an intercom buzz. Its own child inherits the NEW version, not the original.', 'openDoor() overridden in: Townhouse'));
  return F;
}
function dispatch() {
  const F = [];
  F.push(gf(CHAIN, [], null, [], 'A reference DECLARED as House is holding an object whose ACTUAL type is Townhouse.', 'const h: House = new Townhouse()'));
  F.push(gf(CHAIN, [], null, ['House'], 'You call h.openDoor(). The declared type is House.', 'call: h.openDoor()',
    P('Will House\'s version of openDoor() run?', 'Yes', 'No', false)));
  F.push(gf(CHAIN, [], 'Townhouse', ['Townhouse'], 'The runtime ignores the declared type and starts the lookup at the ACTUAL type: Townhouse.', 'lookup starts at: Townhouse'));
  F.push(gf(CHAIN, ['Townhouse'], 'Townhouse', [], 'Townhouse defines openDoor(). Found on the first hop — the search stops here and never reaches House.', 'resolved: Townhouse.openDoor() -> "buzz"'));
  F.push(gf(CHAIN, ['Townhouse'], null, [], 'This is dynamic dispatch. What runs is decided by the object, not by the variable that points at it.', 'returned: "buzz — intercom"'));
  F.push(gf(CHAIN, [], null, ['House'], 'Now try a method Townhouse does NOT define — say windowCount().', 'call: h.windowCount()',
    P('Does the lookup give up when Townhouse has no windowCount()?', 'Yes', 'No', false)));
  F.push(gf(CHAIN, ['Townhouse', 'House'], 'House', [], 'It walks UP the chain: not on Townhouse, so try House. Found. That upward walk is how inheritance is actually implemented.', 'resolved: House.windowCount()'));
  return F;
}
function bst() {
  const F = [];
  const target = '40';
  F.push(gf(TREE, [], null, [], 'A search tree. Everything left of a node is smaller; everything right is bigger.', 'searching for 40'));
  F.push(gf(TREE, [], '50', ['30', '70'], 'Start at the root: 50. Is 40 bigger or smaller?', 'compare 40 vs 50',
    P('Do we go left or right?', 'Left', 'Right', true)));
  F.push(gf(TREE, ['50'], '30', ['20', '40'], '40 < 50, so go left — and the entire right subtree (70, 60, 80) is discarded in one comparison.', 'discarded: 70, 60, 80'));
  F.push(gf(TREE, ['50', '30'], '30', ['20', '40'], 'At 30. Is 40 bigger or smaller?', 'compare 40 vs 30',
    P('Do we go left or right?', 'Left', 'Right', false)));
  F.push(gf(TREE, ['50', '30'], '40', [], '40 > 30, go right. 20 is discarded too.', 'discarded: 20'));
  F.push(gf(TREE, ['50', '30', target], target, [], `Found 40 in three comparisons out of seven nodes. Each step threw away half of what was left — O(log n).`, 'found: 40'));
  F.push(gf(TREE, ['50', '70'], '70', [], 'Now search for 65: right at the root, then left at 70 — and we land on nothing. Absence proven in two comparisons.', 'searching for 65 -> not found',
    P('Would an unbalanced tree (a straight line of nodes) still be O(log n)?', 'Yes', 'No', false)));
  return F;
}
function graphviz() {
  const F = [];
  F.push(gf(GRAPH, [], null, [], 'Eight dots, ten lines. No root, no hierarchy — just relationships.', 'V = 8, E = 10'));
  F.push(gf(GRAPH, ['B'], 'B', ['A', 'D', 'E'], 'B has three neighbours: A, D and E. That count is its degree.', 'adj[B] = [A, D, E] — degree 3'));
  F.push(gf(GRAPH, ['D'], 'D', ['B'], 'D has exactly one neighbour. Degrees vary wildly, which is why we store a LIST per vertex rather than a full grid.', 'adj[D] = [B] — degree 1',
    P('Would an 8×8 matrix waste space on this graph?', 'Yes', 'No', true)));
  F.push(gf(GRAPH, ['A', 'B', 'E', 'H', 'F', 'C'], null, [], 'Here is the thing a tree can never have: A → B → E → H → F → C → A. A cycle. You can come back to where you started.', 'cycle found: A B E H F C A'));
  F.push(gf(GRAPH, ['A', 'B'], 'A', ['B'], 'Friendship is symmetric here — B is in A\'s list and A is in B\'s. That is an undirected edge, stored twice.', 'undirected: A-B appears in both lists',
    P('Is every tree also a graph?', 'Yes', 'No', true)));
  F.push(gf(GRAPH, GRAPH.nodes.map(n => n[0]), null, [], 'A tree is simply a graph that is connected and has no cycles. Everything you learn here applies there.', 'tree = connected + acyclic'));
  return F;
}
function bfs() { return traverse(true); }
function dfs() { return traverse(false); }
function traverse(isBfs) {
  const F = [], G = GRAPH, seen = new Set(), order = [];
  const front = ['A'];
  const snap = (cur, msg, predict) => F.push({ g: G, visited: [...seen], order: order.slice(), cur, front: front.slice(), msg, caption: `${isBfs ? 'Queue' : 'Stack'}: ${front.join(', ') || 'empty'}`, predict });
  snap(null, isBfs ? 'Start at A. A queue holds who to visit next — first in, first out.' : 'Start at A. A stack holds where to go next — last in, first out.');
  let guard = 0;
  while (front.length && guard++ < 40) {
    const v = isBfs ? front.shift() : front.pop();
    if (seen.has(v)) continue;
    const wasFirst = order.length === 0;
    seen.add(v); order.push(v);
    snap(v, `Visit ${v}.${wasFirst ? '' : isBfs ? ' Everything one step from here joins the BACK of the queue.' : ' Its neighbours go on TOP of the stack, so we dive into the newest one next.'}`);
    const nb = G.adj[v].filter(w => !seen.has(w) && front.indexOf(w) < 0);
    nb.forEach(w => front.push(w));
    if (nb.length) {
      const nxt = isBfs ? front[0] : front[front.length - 1];
      snap(v, `Added ${nb.join(', ')}. ${isBfs ? 'They wait their turn behind everyone already queued.' : 'The last one added will be taken first.'}`,
        order.length === 2 ? P(`Will ${nxt} be visited next?`, 'Yes', 'No', true) : undefined);
    }
  }
  F.push({
    g: G, visited: [...seen], order: order.slice(), cur: null, front: [],
    caption: `Order: ${order.join(' → ')}`,
    msg: isBfs
      ? `All eight reached in distance order: ${order.join(' → ')}. Because we never skip ahead, the first time BFS reaches a node it arrived by the shortest route.`
      : `All eight reached by diving deep: ${order.join(' → ')}. Notice how far from A we get before coming back — DFS gives no shortest-path guarantee.`
  });
  return F;
}

// ─── MATRIX family ──────────────────────────────────────────────────────────
const mf = (cols, rows, msg, caption, predict) => ({ cols, rows, msg, caption, predict });
function polymatrix() {
  const F = [];
  const types = ['Dog', 'Cat', 'Car'];
  const cols = ['makeSound()', 'move()'];
  const ans = { Dog: ['"woof"', 'runs on four legs'], Cat: ['"meow"', 'slinks'], Car: ['"honk"', 'drives'] };
  const build = (n) => types.map((t, r) => ({
    label: t, cells: cols.map((c, i) => {
      const idx = r * 2 + i;
      return { t: idx < n ? ans[t][i] : '?', s: idx < n ? 'on' : idx === n ? 'hot' : 'off' };
    })
  }));
  F.push(mf(cols, build(0), 'Three unrelated types. Two messages you want to send to all of them.', 'for (const thing of things) thing.makeSound()'));
  F.push(mf(cols, build(0), 'The loop is about to shout makeSound() at a Dog.', 'sending: makeSound()',
    P('Does the loop need to check what type it is holding?', 'Yes', 'No', false)));
  for (let n = 1; n <= 6; n++) F.push(mf(cols, build(n), n === 1 ? 'The Dog answers in its own way. The loop never asked what it was.' : `Every type answers the same message differently. ${n} of 6 filled.`, `filled ${n} / 6`));
  F.push(mf(cols, build(6), 'Now add a Duck class tomorrow.', 'new type: Duck',
    P('Does the loop above need editing?', 'Yes', 'No', false)));
  F.push(mf(cols, [...build(6), { label: 'Duck', cells: [{ t: '"quack"', s: 'on' }, { t: 'waddles', s: 'on' }] }], 'Not one character. The call site depends on the message, not the type — that is why polymorphism makes code extensible.', 'Duck slots in for free'));
  return F;
}
function handshake(n) {
  const F = [], N = Math.min(14, Math.max(3, n || 8));
  const build = (k) => [{ label: 'Guests', cells: Array.from({ length: N }, (_, i) => ({ t: i < k ? '✓' : '·', s: i < k ? 'on' : i === k ? 'hot' : 'off' })) }];
  F.push(mf([], build(0), `${N} guests at the door. One handshake each.`, `handshakes: 0`));
  for (let k = 1; k <= N; k++) {
    F.push(mf([], build(k), `Handshake ${k}. One guest, one greeting — nothing nested.`, `handshakes: ${k}`,
      k === 2 ? P(`With ${N * 2} guests, would you do about ${N * 2} handshakes?`, 'Yes', 'No', true) : undefined));
  }
  F.push(mf([], build(N), `${N} guests, ${N} handshakes. Double the guests and you double the work — a straight line. O(n).`, `total: ${N} = n`));
  return F;
}
function pairs(n) {
  const F = [], N = Math.min(9, Math.max(3, n || 6));
  const build = (k) => Array.from({ length: N }, (_, r) => ({
    label: `G${r + 1}`,
    cells: Array.from({ length: N }, (_, c) => {
      const idx = r * N + c;
      if (r === c) return { t: '—', s: 'off' };
      return { t: idx < k ? '·' : '', s: idx < k ? 'on' : idx === k ? 'hot' : 'off' };
    })
  }));
  F.push(mf(Array.from({ length: N }, (_, i) => `G${i + 1}`), build(0), `Now every guest must greet every other guest. ${N} × ${N} pairings.`, 'greetings: 0'));
  const total = N * N;
  const stride = Math.max(1, Math.floor(total / 12));
  for (let k = stride; k < total; k += stride) {
    F.push(mf(Array.from({ length: N }, (_, i) => `G${i + 1}`), build(k), `Filling the grid — ${k} of ${total}. Notice it grows in AREA, not length.`, `greetings: ${k}`,
      k === stride * 2 ? P(`Go from ${N} to ${N * 2} guests — is it about twice the work?`, 'Yes', 'No', false) : undefined));
  }
  F.push(mf(Array.from({ length: N }, (_, i) => `G${i + 1}`), build(total), `${N} guests → ${N * N - N} greetings. Double the guests to ${N * 2} and it is ${N * 2 * N * 2 - N * 2} — four times, not twice. That is O(n²), and it is why nested loops over the same data are the classic performance trap.`, `total: ${N}² = ${total}`));
  return F;
}
function nlogn(n) {
  const N = [4, 8, 16, 32].indexOf(n) >= 0 ? n : 8;
  const F = [], levels = Math.round(Math.log2(N));
  const build = (upto) => Array.from({ length: levels }, (_, L) => ({
    label: `level ${L + 1}`,
    cells: Array.from({ length: N }, (_, i) => ({ t: '·', s: L < upto ? 'on' : L === upto ? 'hot' : 'off' }))
  }));
  F.push(mf([], build(0), `Sorting ${N} items by splitting. How many times can you halve ${N} before you reach single items?`, `n = ${N}`,
    P(`Is it about ${levels} times?`, 'Yes', 'No', true)));
  for (let L = 1; L <= levels; L++) {
    F.push(mf([], build(L), `Level ${L}: merging costs one pass over all ${N} items — no matter how many groups that pass is split into.`, `${L} level${L > 1 ? 's' : ''} × ${N} items = ${L * N} units of work`));
  }
  F.push(mf([], build(levels), `${levels} levels × ${N} items = ${levels * N} units. That product is n log n: the log n comes from the halving, the n from each merge pass. Close enough to a straight line that it is rarely your bottleneck.`, `${N} log ${N} = ${levels * N}`));
  return F;
}
function spacemem() {
  const F = [];
  const cols = ['aux memory', 'grows with n?', 'why'];
  const rows = [
    ['bubbleSort', ['O(1)', 'no', 'swaps inside the original array'], 0],
    ['quickSort', ['O(log n)', 'slowly', 'one stack frame per level of recursion'], 1],
    ['mergeSort', ['O(n)', 'yes', 'a scratch buffer as big as the input'], 2],
    ['countingSort', ['O(k)', 'with the RANGE', 'one counter per possible value'], 3]
  ];
  const build = (upto, hot) => rows.map(([label, cells], i) => ({
    label, cells: cells.map(t => ({ t: i < upto || i === hot ? t : '', s: i === hot ? 'hot' : i < upto ? 'on' : 'off' }))
  }));
  F.push(mf(cols, build(0, -1), 'Time is not the only budget. Space complexity counts the EXTRA memory an algorithm needs, ignoring the input itself.'));
  F.push(mf(cols, build(0, 0), 'Bubble sort does all its work by swapping inside the array you gave it. Constant extra space — "in place".', 'O(1)',
    P('Does an in-place algorithm need more memory as n grows?', 'Yes', 'No', false)));
  F.push(mf(cols, build(1, 1), 'Quicksort is in place too — except for the call stack. One frame per level of recursion, so O(log n) when it splits evenly.', 'O(log n)'));
  F.push(mf(cols, build(2, 2), 'Merge sort must write the merged run somewhere. That scratch buffer is the same size as the input: O(n).', 'O(n)',
    P('Would you pick merge sort on a device with almost no spare RAM?', 'Yes', 'No', false)));
  F.push(mf(cols, build(3, 3), 'And counting sort grows with the RANGE of values, not the count — brilliant for small ranges, catastrophic for large ones.', 'O(k)'));
  F.push(mf(cols, build(4, -1), 'Recursion depth counts as space. That is exactly why a missing base case does not just loop forever — it overflows the stack.'));
  return F;
}
function toolkit() {
  const F = [];
  const cols = ['lookup by key', 'read by index', 'insert in middle', 'take the max', 'keep in order'];
  const rows = [
    ['Array', ['O(n)', 'O(1)', 'O(n)', 'O(n)', 'sort first']],
    ['Linked list', ['O(n)', 'O(n)', 'O(1)', 'O(n)', 'no']],
    ['Hash map', ['O(1)', 'no', 'O(1)', 'O(n)', 'no']],
    ['Balanced tree', ['O(log n)', 'no', 'O(log n)', 'O(log n)', 'yes']],
    ['Heap', ['O(n)', 'no', 'O(log n)', 'O(1)', 'no']]
  ];
  const build = (hotCol, hotRow) => rows.map(([label, cells], r) => ({
    label, cells: cells.map((t, c) => ({ t, s: r === hotRow && c === hotCol ? 'hot' : c === hotCol ? 'on' : '' }))
  }));
  F.push(mf(cols, build(-1, -1), 'The whole toolbox on one grid. You are never memorising this — you are learning to read down a column.'));
  F.push(mf(cols, build(0, -1), 'Say the dominant operation is "fetch the user with this ID". Read down the lookup column.', 'need: lookup by key',
    P('Is a hash map the right pick here?', 'Yes', 'No', true)));
  F.push(mf(cols, build(0, 2), 'O(1) beats everything else in that column. Hash map — provided you truly never need order.'));
  F.push(mf(cols, build(4, -1), 'Change the requirement: now you need results in sorted order and range queries.', 'need: keep in order',
    P('Does the hash map still win?', 'Yes', 'No', false)));
  F.push(mf(cols, build(4, 3), 'It cannot help at all — a hash deliberately scatters keys. The balanced tree pays O(log n) and gives you order for it.'));
  F.push(mf(cols, build(3, 4), 'And if you only ever want the largest item, a heap does it in O(1) while everything else scans.', 'need: take the max'));
  F.push(mf(cols, build(-1, -1), 'One question answers most design decisions: what is the operation I will do most, and what happens to it when the data is a hundred times bigger?'));
  return F;
}

// ─── CELLS family ───────────────────────────────────────────────────────────
const cf = (cells, msg, caption, predict) => ({ cells, msg, caption, predict });
function indexing(arr) {
  const F = [], a = arr;
  const build = (hot, dim) => a.map((v, i) => ({ v, i, tag: i === hot ? 'READ' : '', s: i === hot ? 'hot' : dim ? 'off' : '' }));
  F.push(cf(build(-1, false), 'A shelf of numbered slots, every slot exactly the same width. That uniformity is the whole trick.', `${a.length} slots`));
  F.push(cf(build(-1, false), 'Read slot 6.', 'a[6]',
    P('Must we walk past slots 0 to 5 to get there?', 'Yes', 'No', false)));
  F.push(cf(build(6, true), 'No walking. address = base + 6 × slotSize — one multiply, one add, one read. The other slots are never touched.', 'a[6] in one step — O(1)'));
  F.push(cf(build(0, true), 'Slot 0 costs exactly the same as slot 6, or slot 6,000,000.', 'a[0] — same cost'));
  F.push(cf(build(2, true), 'This is random access, and only a contiguous block of equal-size elements can offer it.', 'a[2] — same cost',
    P('Could a linked list do this in one step?', 'Yes', 'No', false)));
  F.push(cf(build(-1, false), 'It could not — no arithmetic reaches a node, so it must follow pointers. Contiguity is what you are paying for.', 'O(1) random access'));
  return F;
}
function binsearch(arr, t) {
  const F = [], a = arr.slice().sort((x, y) => x - y);
  const target = t;
  let lo = 0, hi = a.length - 1;
  const build = (mid, found) => a.map((v, i) => ({
    v, i, tag: i === mid ? 'MID' : i === lo && i >= lo && i <= hi ? 'LO' : i === hi && i >= lo ? 'HI' : '',
    s: found && i === mid ? 'found' : i === mid ? 'hot' : i < lo || i > hi ? 'off' : 'in'
  }));
  F.push(cf(build(-1, false), `Sorted first — without that, none of this is allowed. Hunting for ${target}.`, `${a.length} values, target ${target}`));
  let guard = 0;
  while (lo <= hi && guard++ < 12) {
    const mid = (lo + hi) >> 1;
    F.push(cf(build(mid, false), `Look only at the middle of ${lo}–${hi}: ${a[mid]}.`, `range ${lo}–${hi} (${hi - lo + 1} left)`,
      a[mid] === target ? undefined : P(`Is ${target} in the LEFT half?`, 'Left', 'Right', target < a[mid])));
    if (a[mid] === target) { F.push(cf(build(mid, true), `Found ${target} at index ${mid}.`, `done in ${guard} comparisons`)); return F; }
    if (a[mid] < target) { lo = mid + 1; F.push(cf(build(mid, false), `${a[mid]} < ${target}, so everything to the LEFT is impossible. Half the remaining data just vanished.`, `range ${lo}–${hi}`)); }
    else { hi = mid - 1; F.push(cf(build(mid, false), `${a[mid]} > ${target}, so everything to the RIGHT is impossible. Half gone.`, `range ${lo}–${hi}`)); }
  }
  F.push(cf(build(-1, false), `${target} is not in the array — and it took only ${guard} looks to PROVE that, not ${a.length}.`, 'not found'));
  return F;
}
function phonebook() {
  const F = [];
  const names = ['Adeyemi', 'Bhatt', 'Chen', 'Duarte', 'Eriksson', 'Fontaine', 'Gupta', 'Haruki', 'Ivanov', 'Jandali', 'Kovács', 'Larsson', 'Mbeki', 'Nakamura', 'Okonkwo', 'Pham'];
  const target = 'Mbeki';
  let lo = 0, hi = names.length - 1, guard = 0;
  const build = (mid) => names.map((v, i) => ({
    v, i, tag: i === mid ? 'OPEN' : '', s: v === target && lo === hi ? 'found' : i === mid ? 'hot' : i < lo || i > hi ? 'off' : 'in'
  }));
  F.push(cf(build(-1), `16 pages. Finding "${target}" by reading page 1, then page 2, then page 3 would be madness.`, `16 pages, looking for ${target}`));
  while (lo <= hi && guard++ < 8) {
    const mid = (lo + hi) >> 1;
    F.push(cf(build(mid), `Tear it open in the middle: "${names[mid]}".`, `pages ${lo}–${hi} (${hi - lo + 1} left)`,
      names[mid] === target ? undefined : P(`Is "${target}" before "${names[mid]}"?`, 'Before', 'After', target < names[mid])));
    if (names[mid] === target) { F.push(cf(build(mid), `Found "${target}" in ${guard} tears.`, `done in ${guard} tears`)); break; }
    if (names[mid] < target) { lo = mid + 1; F.push(cf(build(mid), `"${target}" comes after "${names[mid]}" — throw away the first half of what was left.`, `pages ${lo}–${hi}`)); }
    else { hi = mid - 1; F.push(cf(build(mid), `"${target}" comes before "${names[mid]}" — throw away the back half.`, `pages ${lo}–${hi}`)); }
  }
  F.push(cf(build(-1), `16 pages took 4 tears. 1,000 pages takes 10. A million takes 20. Every DOUBLING of the book costs exactly one more tear — that is what O(log n) feels like.`, '2^20 = 1,048,576 -> 20 tears',
    P('Would a phone book in random order still work this way?', 'Yes', 'No', false)));
  return F;
}
function switch1() {
  const F = [];
  const sizes = [4, 8, 16, 32];
  const build = (n, lit) => Array.from({ length: n }, (_, i) => ({ v: '', i, tag: i === 0 ? 'SWITCH' : '', s: i === 0 ? (lit ? 'found' : 'hot') : lit ? 'in' : 'off' }));
  F.push(cf(build(4, false), '4 bulbs, one switch. Flipping it is one operation.', 'n = 4, operations = 1'));
  F.push(cf(build(4, true), 'All four lit. One operation.', 'n = 4, operations = 1',
    P('With 32 bulbs, does the switch take longer to flip?', 'Yes', 'No', false)));
  sizes.slice(1).forEach(n => {
    F.push(cf(build(n, false), `Now ${n} bulbs.`, `n = ${n}, operations = 1`));
    F.push(cf(build(n, true), `Still one flip. The size of the problem never entered the calculation.`, `n = ${n}, operations = 1`));
  });
  F.push(cf(build(32, true), 'O(1) does not mean "fast" — a slow constant is still constant. It means the cost is INDEPENDENT of n. Array indexing, hash lookup and stack push all live here.', 'O(1): cost independent of n'));
  return F;
}

// ─── BARS family ────────────────────────────────────────────────────────────
function barsSort(kind, raw) {
  const F = [], a = raw.slice(), n = a.length, lock = new Set();
  const snap = (hi, act, msg, pivot, predict) => F.push({ arr: a.slice(), hi: hi || [], act: !!act, lock: [...lock], pivot: pivot == null ? null : pivot, msg, predict });
  snap([], false, `${n} numbers, out of order. Press play — or step through one comparison at a time.`);
  if (kind === 'bubble') {
    for (let i = 0; i < n - 1; i++) {
      let sw = false;
      for (let j = 0; j < n - 1 - i; j++) {
        snap([j, j + 1], false, `Compare ${a[j]} and ${a[j + 1]}.`, null,
          i === 0 && j < 3 ? P('Will these two swap?', 'Swap', 'Stay', a[j] > a[j + 1]) : undefined);
        if (a[j] > a[j + 1]) { const b = a[j]; [a[j], a[j + 1]] = [a[j + 1], a[j]]; sw = true; snap([j, j + 1], true, `${b} is bigger — it swaps right. A big number can only move one seat per comparison.`); }
        else snap([j, j + 1], false, `${a[j]} is already the smaller one. Nothing moves.`);
      }
      lock.add(n - 1 - i);
      snap([], false, `Pass ${i + 1} complete: ${a[n - 1 - i]} has bubbled all the way to its final seat.`, null,
        i === 0 ? P('Does one pass sort the whole array?', 'Yes', 'No', false) : undefined);
      if (!sw) { for (let k = 0; k < n - 1 - i; k++) lock.add(k); snap([], false, 'A whole pass with zero swaps — so the array must already be sorted. That early exit is what gives bubble sort its O(n) best case.'); return F; }
    }
    lock.add(0); snap([], false, `Sorted. ${n} items cost roughly ${Math.round(n * n / 2)} comparisons — and doubling n would roughly quadruple that.`);
  } else if (kind === 'selection') {
    for (let i = 0; i < n - 1; i++) {
      let mi = i;
      snap([i], false, `Round ${i + 1}: scan everything from position ${i} onwards and find the smallest.`);
      for (let j = i + 1; j < n; j++) {
        snap([mi, j], false, `Is ${a[j]} smaller than the current smallest, ${a[mi]}?`, null,
          i === 0 && j === 1 ? P('Will this become the new smallest?', 'Yes', 'No', a[j] < a[mi]) : undefined);
        if (a[j] < a[mi]) { mi = j; snap([mi], false, `New smallest: ${a[mi]}.`); }
      }
      if (mi !== i) { [a[i], a[mi]] = [a[mi], a[i]]; snap([i, mi], true, `One swap — ${a[i]} goes to position ${i}. Notice how little movement there was for all that looking.`); }
      else snap([i], false, `${a[i]} was already smallest. Zero swaps this round.`);
      lock.add(i);
    }
    lock.add(n - 1);
    snap([], false, `Sorted in ${n - 1} rounds and at most ${n - 1} swaps. Always O(n²) comparisons — but only O(n) writes, which matters when writing is expensive.`);
  } else if (kind === 'insertion') {
    lock.add(0);
    snap([0], false, 'A single card is already a sorted hand. Everything left of the line stays sorted from here on.');
    for (let i = 1; i < n; i++) {
      const key = a[i]; let j = i - 1;
      snap([i], true, `Pick up ${key}. Where does it belong in the sorted part?`, null,
        i === 1 ? P(`Will ${key} need to move left?`, 'Yes', 'No', a[j] > key) : undefined);
      while (j >= 0 && a[j] > key) { snap([j, j + 1], false, `${a[j]} is bigger than ${key} — slide it one place right to make room.`); a[j + 1] = a[j]; j--; }
      a[j + 1] = key; lock.add(i);
      snap([j + 1], true, `${key} drops into position ${j + 1}. The sorted hand is now ${i + 1} cards long.`);
    }
    snap([], false, 'Sorted. If the input had arrived nearly sorted, almost none of that sliding would have happened — that is why real sorting libraries fall back to insertion sort on small runs.');
  } else if (kind === 'quick') {
    const part = (lo, hi) => {
      const p = a[hi]; let i = lo;
      snap([hi], true, `Pivot: ${p}. Everyone smaller goes to its left, everyone bigger to its right.`, hi);
      for (let j = lo; j < hi; j++) {
        snap([j, hi], false, `Is ${a[j]} smaller than the pivot ${p}?`, hi,
          lo === 0 && j === 0 ? P('Does this one belong on the left?', 'Left', 'Right', a[j] < p) : undefined);
        if (a[j] < p) { if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; snap([i, j], true, `Yes — ${a[i]} moves into the left group.`, hi); } else snap([i], true, `Yes — ${a[i]} is already on the left.`, hi); i++; }
      }
      [a[i], a[hi]] = [a[hi], a[i]]; lock.add(i);
      snap([i], true, `The pivot drops into position ${i} — and it is finished forever. Nothing will ever move it again.`, null,
        lo === 0 ? P('Is either side sorted yet?', 'Yes', 'No', false) : undefined);
      return i;
    };
    const qs = (lo, hi) => { if (lo >= hi) { if (lo === hi) lock.add(lo); return; } const p = part(lo, hi); qs(lo, p - 1); qs(p + 1, hi); };
    qs(0, n - 1);
    snap([], false, 'Sorted. Each pivot was placed exactly once. Pick pivots near the middle and this is O(n log n); pick the largest every time and it degrades to O(n²).');
  } else {
    const merge = (lo, mid, hi) => {
      const left = a.slice(lo, mid + 1), right = a.slice(mid + 1, hi + 1);
      snap(range(lo, hi), false, `Two sorted runs: [${left.join(', ')}] and [${right.join(', ')}]. Zip them by always taking the smaller FRONT card.`, null,
        lo === 0 && hi === n - 1 ? P(`Will ${Math.min(left[0], right[0])} be written first?`, 'Yes', 'No', true) : undefined);
      let i = 0, j = 0, k = lo;
      while (i < left.length && j < right.length) { const take = left[i] <= right[j]; a[k] = take ? left[i++] : right[j++]; snap([k], true, `${a[k]} is the smaller front card — write it to position ${k}.`); k++; }
      while (i < left.length) { a[k] = left[i++]; snap([k], true, `Right run is empty; ${a[k]} comes across unchallenged.`); k++; }
      while (j < right.length) { a[k] = right[j++]; snap([k], true, `Left run is empty; ${a[k]} comes across unchallenged.`); k++; }
      snap(range(lo, hi), false, `Positions ${lo}–${hi} are now one sorted run of ${hi - lo + 1}.`);
    };
    const ms = (lo, hi) => { if (lo >= hi) return; const mid = (lo + hi) >> 1; snap(range(lo, hi), false, `Split ${lo}–${hi} down the middle. Splitting is free — the merging does all the work.`); ms(lo, mid); ms(mid + 1, hi); merge(lo, mid, hi); };
    ms(0, n - 1);
    for (let k = 0; k < n; k++) lock.add(k);
    snap([], false, 'Sorted. Roughly log₂n levels of splitting, each costing one pass over n items — n log n, and identical whether the input arrived random, sorted or reversed.');
  }
  return F;
}
function linear(raw, t) {
  const F = [], a = raw.slice();
  F.push({ arr: a.slice(), hi: [], act: false, lock: [], pivot: null, msg: `Looking for ${t}. The data is in no particular order, so there is no clever shortcut available.` });
  for (let i = 0; i < a.length; i++) {
    const hit = a[i] === t;
    F.push({
      arr: a.slice(), hi: [i], act: hit, lock: [], pivot: null,
      msg: hit ? `Found ${t} at index ${i} — after ${i + 1} look${i ? 's' : ''}.` : `${a[i]} is not ${t}. Next drawer.`,
      predict: i === 0 ? P(`Could ${t} still be in the very last slot?`, 'Yes', 'No', true) : undefined
    });
    if (hit) { F.push({ arr: a.slice(), hi: [i], act: true, lock: range(0, a.length - 1), pivot: null, msg: `On average you check half the drawers; in the worst case, all of them. O(n) — but it works on ANY data, sorted or not, with zero preparation.` }); return F; }
  }
  F.push({ arr: a.slice(), hi: [], act: false, lock: [], pivot: null, msg: `${t} is not here — and proving that required opening all ${a.length} drawers. Absence is always the worst case for linear search.` });
  return F;
}
function dynarray() {
  const F = [];
  let cap = 4, len = 0; const buf = [];
  const snap = (hi, act, msg, copying, predict) => F.push({ arr: buf.slice(), cap, hi: hi || [], act: !!act, lock: [], pivot: null, copying: !!copying, msg, predict });
  snap([], false, `A shelf with room for ${cap} books, holding 0. Capacity and length are different numbers.`);
  const appends = [12, 30, 21, 45, 9, 38, 27, 51, 6];
  appends.forEach((v, i) => {
    if (len === cap) {
      snap([], false, `The shelf is full at ${cap}. There is no way to stretch it — the memory after it belongs to something else.`, false,
        i === 4 ? P('Does it grow by one slot to fit this book?', 'Yes', 'No', false) : undefined);
      const old = cap; cap *= 2;
      snap([], false, `Buy a shelf of ${cap} — DOUBLE, not one bigger. That choice is the entire reason append is cheap.`, true);
      for (let k = 0; k < len; k++) snap([k], true, `Carry book ${k} across. This is the O(n) part, and it is why a single append can occasionally be slow.`, true);
      snap([], false, `All ${old} books moved. ${cap - len} empty slots waiting.`, false);
    }
    buf.push(v); len++;
    snap([len - 1], true, `Append ${v} into the next free slot. One write — O(1).`);
  });
  snap([], false, `9 appends caused 2 resizes. Because capacity doubles, resizes get exponentially rarer, so the cost spread across all appends is constant: amortised O(1).`, false,
    P('If it grew by ONE slot each time instead of doubling, would append still be amortised O(1)?', 'Yes', 'No', false));
  snap([], false, 'It would not — every single append would copy everything, giving O(n) each and O(n²) overall. Doubling is not an implementation detail; it is the whole design.');
  return F;
}

// ─── NODES family ───────────────────────────────────────────────────────────
function list(ops) {
  const F = [], nodes = [];
  const snap = (hi, msg, predict) => F.push({ nodes: nodes.slice(), hi: hi || [], back: false, msg, caption: nodes.length ? `${nodes.length} node${nodes.length > 1 ? 's' : ''} — head → ${nodes.join(' → ')} → null` : 'empty list', predict });
  snap([], 'An empty list. No numbered slots — just clues waiting to point at each other.');
  (ops || [['head', 7], ['tail', 3], ['tail', 9], ['after', 1, 5], ['del', 2]]).forEach(([op, x, y]) => {
    if (op === 'head') {
      nodes.unshift(Number(x) || x);
      snap([0], `Insert ${x} at the head: the new node points at the old head, and "head" now points at the new node. Two writes, no matter how long the list is.`);
    } else if (op === 'tail') {
      if (!nodes.length) { nodes.push(Number(x) || x); snap([0], `First node: ${x}.`); }
      else {
        snap([0], `Insert ${x} at the tail. There is no index to jump with, so we have to walk.`, P('Can we reach the last node in one step?', 'Yes', 'No', false));
        for (let i = 0; i < nodes.length; i++) snap([i], `At node ${i} (${nodes[i]}) — follow its pointer to the next one.`);
        nodes.push(Number(x) || x);
        snap([nodes.length - 2, nodes.length - 1], `Reached the end after ${nodes.length - 1} hops. NOW the insert itself is one pointer write. The walking was the expensive part — that is the trade.`);
      }
    } else if (op === 'after') {
      const at = Math.min(Math.max(0, Number(x)), nodes.length - 1);
      for (let i = 0; i <= at; i++) snap([i], `Walk to node ${i}…`);
      snap([at], `Splice ${y} in after node ${at}.`, P('Will the nodes after it shift along, like an array?', 'Yes', 'No', false));
      nodes.splice(at + 1, 0, Number(y) || y);
      snap([at, at + 1], `Nothing shifted. Node ${at} now points at ${y}, and ${y} points at whatever came next. Two pointer writes and the rest of the list never even knew.`);
    } else if (op === 'del') {
      const at = Math.min(Math.max(0, Number(x)), nodes.length - 1);
      for (let i = 0; i < at; i++) snap([i], `Walk to node ${i}…`);
      snap([at], `Remove node ${at} (${nodes[at]}): make its neighbour point straight past it.`);
      nodes.splice(at, 1);
      snap([], 'Gone. One pointer rewritten. The removed node is simply unreachable now.');
    }
  });
  snap([], `Final list: ${nodes.join(' → ') || 'empty'}. Cheap to restructure, expensive to reach into — the exact opposite of an array.`);
  return F;
}
function dlist(ops) {
  const F = [], nodes = [];
  const snap = (hi, back, msg, predict) => F.push({ nodes: nodes.slice(), hi: hi || [], back, msg, caption: nodes.length ? `head ⇄ ${nodes.join(' ⇄ ')} ⇄ null` : 'empty list', predict });
  [4, 8, 15, 16].forEach(v => nodes.push(v));
  snap([], false, 'Same list, but every node now also remembers where it came from. Two pointers per node instead of one.');
  snap([0], false, 'Walk forward: node 0.');
  for (let i = 1; i < nodes.length; i++) snap([i], false, `→ node ${i} (${nodes[i]}), following next.`);
  snap([nodes.length - 1], false, 'At the tail. In a singly linked list you would now be stuck — the only way back is to start over from the head.',
    P('Can this list walk backwards from here?', 'Yes', 'No', true));
  for (let i = nodes.length - 2; i >= 0; i--) snap([i], true, `← node ${i} (${nodes[i]}), following prev. No restart needed.`);
  snap([2], false, `Now the real payoff. Someone hands you a reference to node 2 (${nodes[2]}) and says "delete it".`,
    P('In a SINGLY linked list, could you delete it without searching for its predecessor?', 'Yes', 'No', false));
  snap([1, 3], true, 'Here you just wire prev and next to each other: node.prev.next = node.next, node.next.prev = node.prev. O(1), no search.');
  nodes.splice(2, 1);
  snap([], false, 'Deleted. The cost was one extra pointer per node, plus more writes on every mutation. Access is still O(n) — you bought direction, not speed.');
  (ops || []).forEach(([op, x]) => { if (op === 'head') { nodes.unshift(Number(x) || x); snap([0], false, `Insert ${x} at the head — now four pointer writes instead of two, because the old head must point back.`); } });
  return F;
}

// ─── VSTACK family ──────────────────────────────────────────────────────────
function stack(ops) {
  const F = [], items = [];
  const snap = (hi, msg, predict) => F.push({ items: items.slice(), hi, dir: 'up', msg, caption: items.length ? `top → ${items[items.length - 1]}, depth ${items.length}` : 'empty', predict });
  snap(-1, 'An empty tray pile. There is exactly one place you can reach: the top.');
  (ops || [['push', 4], ['push', 9], ['push', 2], ['pop'], ['push', 6], ['pop'], ['pop'], ['pop']]).forEach(([op, x], n) => {
    if (op === 'push') { items.push(x); snap(items.length - 1, `Push ${x} onto the top. Everything below is now buried.`, n === 2 ? P('Can you reach the bottom tray without moving the ones above it?', 'Yes', 'No', false) : undefined); }
    else {
      if (!items.length) { snap(-1, 'Nothing left to take — popping an empty stack is an error you must guard against.'); return; }
      const v = items[items.length - 1];
      snap(items.length - 1, `Pop takes the most recent tray: ${v}. The bottom one has not moved since the pile was started.`, n === 3 ? P(`Will pop return ${v}?`, 'Yes', 'No', true) : undefined);
      items.pop(); snap(-1, `${v} is off. Push and pop are both O(1) — one end, no shifting.`);
    }
  });
  snap(-1, 'This shape is everywhere: function calls, undo history, browser back, depth-first search. Anywhere you must finish the newest thing before returning to the previous one.');
  return F;
}
function callstack() {
  const F = [], frames = [];
  const depth = 4;
  const snap = (hi, msg, predict) => F.push({ items: frames.map(f => f.label), returns: frames.map(f => f.ret), hi, dir: 'up', msg, caption: `stack depth ${frames.length}`, predict });
  snap(-1, 'count(doll) on a set of nested dolls. Each call will ask the same question of a smaller doll.');
  for (let i = 0; i < depth; i++) {
    frames.push({ label: `count(doll ${i + 1})`, ret: '…waiting' });
    snap(frames.length - 1, i < depth - 1
      ? `Call ${i + 1}: doll ${i + 1} has something inside, so it CANNOT answer yet. It pushes a new frame and waits.`
      : `Call ${depth}: this doll is solid — the base case. It can answer immediately.`,
      i === 0 ? P('Does the first call return before the ones inside it?', 'Yes', 'No', false) : undefined);
  }
  frames[frames.length - 1].ret = 'return 1';
  snap(frames.length - 1, 'The base case returns 1. Without it, the stack would keep growing until it overflows.',
    P('Which frame finishes first — the outermost or the innermost?', 'Outermost', 'Innermost', false));
  for (let i = depth - 2; i >= 0; i--) {
    frames.pop();
    frames[i].ret = `return ${depth - i}`;
    snap(i, `Frame ${i + 2} is gone. Its answer flows into frame ${i + 1}, which finally computes 1 + ${depth - i - 1} = ${depth - i}.`);
  }
  snap(0, `The outermost call returns ${depth} last of all. Recursion goes down building frames, then unwinds paying them back.`);
  frames.pop();
  snap(-1, `Every frame costs memory, so depth costs O(depth) space. That is why deep recursion overflows the stack while an equivalent loop does not.`);
  return F;
}

// ─── HQUEUE family ──────────────────────────────────────────────────────────
function queue(ops) {
  const F = [], items = [];
  const snap = (hi, msg, predict) => F.push({ items: items.slice(), hi, msg, caption: items.length ? `head → ${items[0]} … tail → ${items[items.length - 1]}` : 'empty', predict });
  snap(-1, 'An empty lunch line. Two ends that do different jobs: you join at the back, you are served at the front.');
  (ops || [['push', 'Ada'], ['push', 'Bo'], ['push', 'Cy'], ['pop'], ['push', 'Di'], ['pop'], ['pop']]).forEach(([op, x], n) => {
    if (op === 'push') { items.push(x); snap(items.length - 1, `${x} joins the back of the line.`, n === 2 ? P('Can Cy be served before Ada?', 'Yes', 'No', false) : undefined); }
    else {
      if (!items.length) { snap(-1, 'The line is empty.'); return; }
      const v = items[0];
      snap(0, `Serve the front: ${v}. Nobody cut in — arrival order is respected exactly.`, n === 3 ? P(`Will ${v} be served next?`, 'Yes', 'No', true) : undefined);
      items.shift(); snap(-1, `${v} is served. With a ring buffer or a linked list, both ends are O(1) — no shuffling everyone forward.`);
    }
  });
  snap(-1, 'FIFO is why breadth-first search finds shortest paths, and why task schedulers and print queues feel fair. Swap this for a stack and the whole behaviour changes.');
  return F;
}

// ─── BUCKETS family ─────────────────────────────────────────────────────────
const hashOf = (k, n) => { let s = 0; for (const c of String(k)) s += c.charCodeAt(0); return s % n; };
function hash(ops) {
  const F = [], N = 7, buckets = Array.from({ length: N }, () => []);
  const count = () => buckets.reduce((s, b) => s + b.length, 0);
  const snap = (hi, msg, predict) => F.push({ buckets: buckets.map(b => b.slice()), hi, msg, caption: `${count()} entries in ${N} pages — load factor ${(count() / N).toFixed(2)}`, predict });
  snap(-1, `${N} empty pages. Nothing is sorted, and we will never scan looking for a key.`);
  (ops || [['put', 'cat'], ['put', 'dog'], ['put', 'otter'], ['put', 'bird']]).forEach(([op, k], n) => {
    const i = hashOf(k, N);
    snap(-1, `Adding "${k}". First, turn the key itself into a page number: sum its character codes, then take the remainder mod ${N}.`,
      n === 0 ? P('Do we search the pages to find a free one?', 'Yes', 'No', false) : undefined);
    snap(i, `hash("${k}") = page ${i}. No searching happened — that was pure arithmetic on the key.`);
    buckets[i].push(k);
    snap(i, `"${k}" written to page ${i}. Insert is O(1) on average.`);
  });
  const g = 'dog';
  snap(hashOf(g, N), `Now look up "${g}". Hash it again — the same key always produces the same page, so we go straight there and read only that page.`,
    P('Does lookup time depend on how many entries the map holds?', 'Yes', 'No', false));
  snap(-1, 'Not while the pages stay short. That "straight to the page" move is the single most useful O(1) in practice — and the reason hash maps are everywhere.');
  return F;
}
function collide() {
  const F = [], N = 5, buckets = Array.from({ length: N }, () => []);
  const count = () => buckets.reduce((s, b) => s + b.length, 0);
  const snap = (hi, msg, predict, probe) => F.push({ buckets: buckets.map(b => b.slice()), hi, probe, msg, caption: `${count()} entries / ${N} pages — load factor ${(count() / N).toFixed(2)}`, predict });
  snap(-1, `Only ${N} pages this time, to force the problem into the open.`);
  ['cat', 'act', 'tac', 'dog', 'god', 'bird', 'sun'].forEach((k, n) => {
    const i = hashOf(k, N);
    const clash = buckets[i].length > 0;
    if (n === 1) snap(-1, `"${k}" is an anagram of "cat" — identical character codes.`, P('Will it hash to the same page as "cat"?', 'Yes', 'No', true));
    snap(i, `hash("${k}") = page ${i}.`);
    buckets[i].push(k);
    snap(i, clash
      ? `Collision. Page ${i} already held ${buckets[i].slice(0, -1).map(x => `"${x}"`).join(', ')}. We do not overwrite and we do not fail — both entries live on the page as a short chain.`
      : `"${k}" written to page ${i}.`);
  });
  snap(hashOf('tac', N), 'Reading "tac": hash to its page, then scan the chain comparing keys. Three entries means up to three comparisons — still tiny, but no longer one step.',
    P('If every key collided into one page, what would lookup cost?', 'O(1)', 'O(n)', false), 'tac');
  snap(-1, `That is the failure mode: all n keys in one chain degrades lookup to O(n) — a hash map wearing a linked list's clothes. Load factor is ${(count() / N).toFixed(2)}, well past the usual 0.75 threshold.`);
  snap(-1, 'So real maps watch the load factor, allocate a bigger bucket array, and rehash every key into it. The resize is O(n) and rare — amortised away, exactly like a dynamic array.');
  return F;
}

// ─── CHART family ───────────────────────────────────────────────────────────
const FNS = {
  '1': () => 1,
  'log': (x) => Math.log2(Math.max(2, x)),
  'n': (x) => x,
  'nlog': (x) => x * Math.log2(Math.max(2, x)),
  'n2': (x) => x * x
};
function curves(n) {
  const F = [];
  const set = (keys, msg, note, predict) => F.push({ series: keys, n, msg, note, predict });
  set(['n'], 'One curve to start: O(n). Straight line — twice the data, twice the work.', 'O(n): the honest baseline');
  set(['n', '1'], 'O(1) is flat. It does not care about n at all.', 'O(1) vs O(n)');
  set(['n', '1', 'log'], 'O(log n) barely lifts off the floor. Doubling n adds a single step.', 'O(log n) is almost flat');
  set(['n', '1', 'log', 'nlog'], 'O(n log n) hugs the linear line — a little steeper, same neighbourhood. This is what good sorting costs.', 'O(n log n) ≈ n, practically speaking',
    P('Will O(n²) stay in the same neighbourhood?', 'Yes', 'No', false));
  set(['n', '1', 'log', 'nlog', 'n2'], 'O(n²) leaves the chart. At small n it was indistinguishable from the rest — that is exactly why quadratic code passes testing and dies in production.', 'O(n²) grows in area');
  set(['n', '1', 'log', 'nlog', 'n2'], 'Drag the n slider below and watch the curves swap places. Asymptotic class only decides the winner once n is large enough.', 'drag n — the ranking changes',
    P('At n = 8, is an O(n²) algorithm noticeably worse than O(n log n)?', 'Yes', 'No', false));
  return F;
}
function recipes(n) {
  const F = [];
  const set = (series, msg, note, predict) => F.push({ series, n, msg, note, custom: true, predict });
  set([{ k: 'n', mul: 3, name: 'Chef A — 3 steps per guest', c: 'var(--color-accent-600)' }],
    'Chef A needs 3 steps per guest. For 100 guests, 300 steps.', 'A: 3n');
  set([{ k: 'n', mul: 3, name: 'Chef A — 3 steps per guest', c: 'var(--color-accent-600)' }, { k: 'n', mul: 10, name: 'Chef B — 10 steps per guest', c: 'var(--color-accent-400)' }],
    'Chef B is three times slower per guest — 10 steps each. Clearly worse in the kitchen tonight.', 'B: 10n — same shape, worse constant',
    P('Are A and B the same Big O?', 'Yes', 'No', true));
  set([{ k: 'n', mul: 3, name: 'Chef A — 3n', c: 'var(--color-accent-600)' }, { k: 'n', mul: 10, name: 'Chef B — 10n', c: 'var(--color-accent-400)' }],
    'They are. Both are O(n): both lines are straight, and doubling the guest list doubles either one. Big O deliberately throws the constant away, because the constant depends on the kitchen and the SHAPE does not.', 'both O(n)');
  set([{ k: 'n', mul: 3, name: 'Chef A — 3n', c: 'var(--color-accent-600)' }, { k: 'n', mul: 10, name: 'Chef B — 10n', c: 'var(--color-accent-400)' }, { k: 'n2', mul: 0.5, name: 'Chef C — n²/2', c: 'var(--color-accent-900)' }],
    'Chef C only needs half a step per PAIR of guests — far cheaper than either of them at a dinner party for four.', 'C: n²/2 — cheapest at small n',
    P('Is Chef C still the best choice at a 300-guest wedding?', 'Yes', 'No', false));
  set([{ k: 'n', mul: 3, name: 'Chef A — 3n', c: 'var(--color-accent-600)' }, { k: 'n', mul: 10, name: 'Chef B — 10n', c: 'var(--color-accent-400)' }, { k: 'n2', mul: 0.5, name: 'Chef C — n²/2', c: 'var(--color-accent-900)' }],
    'C crosses both of them and never comes back. A different SHAPE always eventually beats a different constant — that is the one thing Big O is built to tell you, and it is why we ignore the stopwatch.', 'shape wins, eventually');
  return F;
}
function amort() {
  const F = [];
  let cap = 1, len = 0; const cols = [];
  const snap = (msg, predict) => F.push({ cols: cols.slice(), avgLine: true, msg, note: `${cols.length} appends, ${cols.filter(c => c.spike).length} resizes — running average ${(cols.reduce((s, c) => s + c.cost, 0) / Math.max(1, cols.length)).toFixed(2)} writes/append`, predict });
  for (let i = 0; i < 24; i++) {
    let cost = 1, spike = false;
    if (len === cap) { cost = 1 + len; spike = true; cap *= 2; }
    len++;
    cols.push({ cost, spike, label: String(i + 1) });
    if (i === 0) snap('Append 1: one write. Cheap.');
    else if (spike && cols.filter(c => c.spike).length <= 3) snap(`Append ${i + 1} found the buffer full: it copied ${cost - 1} existing items plus one write. An expensive spike.`,
      cols.filter(c => c.spike).length === 2 ? P('Will the NEXT append also be expensive?', 'Yes', 'No', false) : undefined);
    else if (i === 5 || i === 11 || i === 17) snap(`Append ${i + 1}: back to one write. The spikes are getting further apart — each doubling buys twice as many cheap appends as the last.`);
  }
  snap('24 appends, 5 spikes. The tall bars never get more frequent, only rarer, so the average settles near a constant: amortised O(1).',
    P('Is any INDIVIDUAL append guaranteed to be O(1)?', 'Yes', 'No', false));
  snap('No — and that is the honest caveat. Amortised O(1) is a promise about the whole sequence, not about the one call that happens to trigger the copy. For latency-sensitive code, that occasional spike is the thing that bites.');
  return F;
}

// ─── dispatcher ─────────────────────────────────────────────────────────────
export function buildFrames(viz, opts) {
  const o = opts || {};
  const arr = nums(o.input, viz === 'binsearch' ? 12 : 10);
  const t = o.target == null ? 37 : o.target;
  switch (viz) {
    case 'blueprint': return blueprint(o.ops);
    case 'instances': return instances(o.ops);
    case 'hasdoes': return hasdoes();
    case 'ctor': return ctor();
    case 'encap': return encap();
    case 'layers': return layers();
    case 'compose': return compose(o.ops);
    case 'genetics': return genetics();
    case 'dispatch': return dispatch();
    case 'bst': return bst();
    case 'graphviz': return graphviz();
    case 'bfs': return bfs();
    case 'dfs': return dfs();
    case 'polymatrix': return polymatrix();
    case 'handshake': return handshake(o.n);
    case 'pairs': return pairs(o.n);
    case 'nlogn': return nlogn(o.n);
    case 'spacemem': return spacemem();
    case 'toolkit': return toolkit();
    case 'indexing': return indexing(arr);
    case 'binsearch': return binsearch(arr, t);
    case 'phonebook': return phonebook();
    case 'switch1': return switch1();
    case 'bubble': case 'selection': case 'insertion': case 'merge': case 'quick': return barsSort(viz, arr);
    case 'linear': return linear(arr, t);
    case 'dynarray': return dynarray();
    case 'list': return list(o.ops);
    case 'dlist': return dlist(o.ops);
    case 'stack': return stack(o.ops);
    case 'callstack': return callstack();
    case 'queue': return queue(o.ops);
    case 'hash': return hash(o.ops);
    case 'collide': return collide();
    case 'curves': return curves(o.n || 64);
    case 'recipes': return recipes(o.n || 64);
    case 'amort': return amort();
    default: return [{ msg: 'No visualizer for this lesson.' }];
  }
}
export { FNS };
