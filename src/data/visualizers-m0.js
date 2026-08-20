// Visualizers for Module 0 (Programming Foundations).
// Same frame contract as visualizers.js; reuses the existing render families.
const P = (q, a, b, t) => ({ q, a, b, t });
const pf = (panels, log, msg, predict) => ({ panels, log: log.slice(), msg, predict });
const cf = (cells, msg, caption, predict) => ({ cells, msg, caption, predict });
const mf = (cols, rows, msg, caption, predict) => ({ cols, rows, msg, caption, predict });

export const VIZ_OF_M0 = {
  m0l1: 'varbox', m0l2: 'castbox', m0l3: 'iotrace', m0l4: 'optable', m0l5: 'condflow',
  m0l6: 'looptrack', m0l7: 'funcstack', m0l8: 'tracerun', m0l9: 'stepcount'
};
export const FAMILY_M0 = {
  varbox: 'panels', castbox: 'panels', iotrace: 'panels', optable: 'matrix',
  condflow: 'graph', looptrack: 'cells', funcstack: 'vstack', tracerun: 'panels', stepcount: 'chart'
};
export const TITLE_M0 = {
  varbox: 'Boxes with labels', castbox: 'Repotting a value', iotrace: 'Two mail slots',
  optable: 'The calculator buttons that matter', condflow: 'The fork in the road',
  looptrack: 'Laps around the track', funcstack: 'Machines on the stack',
  tracerun: 'Be the machine', stepcount: 'Two chefs, one wedding'
};

function varbox() {
  const F = [];
  const build = (age, name, on, hot) => ([
    { title: 'MEMORY — the shelf of boxes', rows: [
      { t: `age: int = ${age}`, s: hot === 0 ? 'hot' : '' },
      { t: name === null ? '(no box called name yet)' : `name: str = "${name}"`, s: hot === 1 ? 'hot' : name === null ? 'off' : '' },
      { t: on === null ? '(no box called lights_on yet)' : `lights_on: bool = ${on}`, s: hot === 2 ? 'hot' : on === null ? 'off' : '' },
    ]}
  ]);
  const log = [];
  F.push(pf(build(12, null, null, -1), log, 'One box so far: the label says age, the contents say 12, and the box shape is "whole number".'));
  log.push({ t: 'name = "Ada"', s: 'on' });
  F.push(pf(build(12, 'Ada', null, 1), log, 'A second box appears — different label, different SHAPE: this one holds text.',
    P('Can the age box hold "twelve" (text) without changing shape?', 'Yes', 'No', false)));
  log.push({ t: 'lights_on = True', s: 'on' });
  F.push(pf(build(12, 'Ada', 'True', 2), log, 'A bool box is the smallest shape there is: on or off, nothing else.'));
  log.push({ t: 'age = age + 1', s: 'on' });
  F.push(pf(build(13, 'Ada', 'True', 0), log, 'Reassignment: the machine computes age + 1 = 13 FIRST, then swaps the contents. The old 12 is gone.',
    P('Does the name box change too?', 'Yes', 'No', false)));
  log.push({ t: 'age = "old"  # rebind to a str', s: 'bad' });
  F.push(pf([{ title: 'MEMORY — the shelf of boxes', rows: [
    { t: 'age: str = "old"   <- same label, NEW shape', s: 'hot' },
    { t: 'name: str = "Ada"', s: '' },
    { t: 'lights_on: bool = True', s: '' }] }], log,
    'Python lets a label move to a differently-shaped box. Legal — but a favourite source of confusion. Typed languages would refuse this line.'));
  return F;
}

function castbox() {
  const F = [];
  const step = (rows, log, msg, predict) => F.push(pf([{ title: 'VALUE — and the pot it lives in', rows }], log, msg, predict));
  const log = [];
  step([{ t: '"12"  (str — two characters)', s: 'hot' }], log,
    'A user typed their age. It ARRIVED as text: the characters 1 and 2 standing side by side. No number in sight.');
  log.push({ t: '"12" + 1  ->  TypeError', s: 'bad' });
  step([{ t: '"12"  (str)', s: 'hot' }, { t: '1  (int)', s: '' }], log,
    'Try the maths anyway? The machine refuses: it will not add a number to text.',
    P('Should the machine just guess what you meant?', 'Yes', 'No', false));
  log.push({ t: 'age = int("12")', s: 'on' });
  step([{ t: '12  (int — a real number now)', s: 'hot' }], log,
    'int("12") lifts the value out of the text pot into the number pot. THIS is casting.');
  log.push({ t: 'age + 1  ->  13', s: 'on' });
  step([{ t: '13  (int)', s: 'hot' }], log, 'Now the maths works. Cast at the door, compute inside.');
  step([{ t: 'int(3.9)  ->  3', s: 'hot' }, { t: 'NOT 4 — truncation, never rounding', s: 'bad' }], log,
    'Careful: casting a float to int CUTS the decimals off. 3.9 becomes 3.',
    P('What does int(-3.9) give?', '-3', '-4', true));
  step([{ t: 'int("hello")  ->  ValueError', s: 'bad' }, { t: 'there is no number hiding in "hello"', s: 'off' }], log,
    'And some repottings are impossible. Python raises an error instead of guessing — wrap risky casts in try/except.');
  return F;
}

function iotrace() {
  const F = [];
  const build = (rows) => ([{ title: 'THE PROGRAM — a sealed room, two slots', rows }]);
  const log = [];
  F.push(pf(build([{ t: 'IN slot: (waiting...)', s: 'hot' }, { t: 'OUT slot: (nothing yet)', s: 'off' }]), log,
    'The program printed a prompt and is now frozen at input() — nothing happens until the world posts something through the IN slot.'));
  log.push({ t: '>> user types: Ada', s: 'on' });
  F.push(pf(build([{ t: 'IN slot: "Ada"  (a string)', s: 'hot' }, { t: 'OUT slot: (nothing yet)', s: 'off' }]), log,
    'A value arrives. Whatever the human meant, it comes through the slot as TEXT.',
    P('If the user had typed 42, would it arrive as a number?', 'Yes', 'No', false)));
  log.push({ t: 'name = input()  ->  "Ada"', s: 'on' });
  F.push(pf(build([{ t: 'name = "Ada"', s: '' }, { t: 'OUT slot: (nothing yet)', s: 'off' }]), log,
    'The program stores the delivery in a box and wakes up.'));
  log.push({ t: 'print(f"Hi {name}!")', s: 'on' });
  F.push(pf(build([{ t: 'name = "Ada"', s: '' }, { t: 'OUT slot: Hi Ada!', s: 'hot' }]), log,
    'And replies through the OUT slot. Every program you have ever used is this loop wearing better clothes.'));
  log.push({ t: 'age = int(input())  — the IN+cast combo', s: 'on' });
  F.push(pf(build([{ t: 'IN slot: "12" -> int -> 12', s: 'hot' }, { t: 'OUT slot: Hi Ada!', s: '' }]), log,
    'The classic pairing from the last lesson: read text, cast immediately, THEN compute. Validate at the door.'));
  return F;
}

function optable() {
  const F = [];
  const rows = (hot) => [
    { label: '7 / 2',  cells: [{ t: '3.5', s: hot === 0 ? 'hot' : 'on' }, { t: 'true division', s: hot === 0 ? 'hot' : '' }] },
    { label: '7 // 2', cells: [{ t: hot >= 1 ? '3' : '?', s: hot === 1 ? 'hot' : hot > 1 ? 'on' : 'off' }, { t: 'floor: throw away leftover', s: hot === 1 ? 'hot' : '' }] },
    { label: '7 % 2',  cells: [{ t: hot >= 2 ? '1' : '?', s: hot === 2 ? 'hot' : hot > 2 ? 'on' : 'off' }, { t: 'keep ONLY the leftover', s: hot === 2 ? 'hot' : '' }] },
    { label: '2 ** 10',cells: [{ t: hot >= 3 ? '1024' : '?', s: hot === 3 ? 'hot' : hot > 3 ? 'on' : 'off' }, { t: 'power', s: hot === 3 ? 'hot' : '' }] },
    { label: '14 % 12',cells: [{ t: hot >= 4 ? '2' : '?', s: hot === 4 ? 'hot' : hot > 4 ? 'on' : 'off' }, { t: 'the clock wraps: 14:00 -> 2', s: hot === 4 ? 'hot' : '' }] },
  ];
  const cols = ['result', 'what it means'];
  F.push(mf(cols, rows(0), 'Division with / always gives the decimal answer, even when it divides evenly.', '7 / 2'));
  F.push(mf(cols, rows(1), '// answers "how many WHOLE times does it fit?" Two fits into seven three whole times.', '7 // 2',
    P('What is 9 // 4?', '2', '2.25', true)));
  F.push(mf(cols, rows(2), '% is the partner: it keeps only what // threw away. 7 = 3×2 + 1 — the 1 is the remainder.', '7 % 2',
    P('n % 2 == 0 — what does this test?', 'n is even', 'n is positive', true)));
  F.push(mf(cols, rows(3), '** is repeated multiplication. 2**10 = 1024 — a number you will meet again in "Counting Steps".', '2 ** 10'));
  F.push(mf(cols, rows(4), 'The remainder is secretly the "wrap around" button: 14 o\'clock is 2 on a 12-hour clock. Hash maps in Module 2 run entirely on this trick.', '14 % 12'));
  return F;
}

function condflow() {
  const g = {
    nodes: [['start', 300, 30], ['score>=80?', 300, 110], ['great', 130, 200], ['score>=50?', 440, 200], ['pass', 320, 285], ['retry', 560, 285]],
    adj: { start: ['score>=80?'], 'score>=80?': ['great', 'score>=50?'], 'score>=50?': ['pass', 'retry'], great: [], pass: [], retry: [] }
  };
  const gf = (visited, cur, msg, caption, predict) => ({ g, visited, cur, front: [], order: visited, msg, caption, predict });
  const F = [];
  F.push(gf([], null, 'A program is a road. A conditional is a fork: each diamond asks one yes/no question and the walker takes exactly one branch.', 'score = 73'));
  F.push(gf(['start'], 'start', 'The walker sets off with score = 73 in hand.', 'score = 73'));
  F.push(gf(['start'], 'score>=80?', 'First signpost: is 73 >= 80? No — so the "great" road is never walked.', '73 >= 80 -> False',
    P('Will the walker ever visit the great box on this run?', 'Yes', 'No', false)));
  F.push(gf(['start', 'score>=80?'], 'score>=50?', 'The elif: is 73 >= 50? Yes.', '73 >= 50 -> True'));
  F.push(gf(['start', 'score>=80?', 'score>=50?'], 'pass', 'One path taken, every other path skipped without being read. That is the whole machine.', 'grade = "pass"'));
  F.push(gf(['start', 'score>=80?', 'score>=50?', 'pass'], null,
    'Now imagine the questions swapped — >= 50 asked FIRST. A score of 95 would hit the general question, answer yes, and "great" would be unreachable. Chain order is a real bug.',
    'specific conditions before general ones',
    P('With >= 50 checked first, what would score 95 print?', '"pass"', '"great"', true)));
  return F;
}

function looptrack() {
  const F = [];
  const items = [4, 7, 2];
  const build = (hot, done) => items.map((v, i) => ({ v, i, tag: i === hot ? 'i' : '', s: i === hot ? 'hot' : i < done ? 'off' : '' }));
  F.push(cf(build(-1, 0), 'Three prices on the track, an empty accumulator waiting. The loop will visit each item exactly once.', 'total = 0'));
  F.push(cf(build(0, 0), 'Lap 1: price is 4. total += 4.', 'total = 4'));
  F.push(cf(build(1, 1), 'Lap 2: price is 7. total += 7.', 'total = 11',
    P('What will total be after the LAST lap?', '13', '11', true)));
  F.push(cf(build(2, 2), 'Lap 3: price is 2. total += 2.', 'total = 13'));
  F.push(cf(build(-1, 3), 'The track ends; the loop exits by itself. That is a for loop: known laps, one item handed to you per lap.', 'total = 13 — accumulator pattern'));
  F.push(cf(build(-1, 3), 'A while loop is the same track with no finish line painted: it keeps lapping WHILE its condition holds. The body must push toward the exit...', 'while n < 100: n = n * 2'));
  F.push(cf([{ v: '∞', i: 0, tag: '!', s: 'hot' }], 'Forget the progress line (n = n * 2) and the condition never turns false: the program laps forever. Every while loop needs a visible reason it will stop.', 'the infinite loop — a rite of passage',
    P('while n < 100: print(n) — with n starting at 1, does this ever stop?', 'Yes', 'No', false)));
  return F;
}

function funcstack() {
  const F = [];
  const snap = (items, hi, msg, caption, predict) => F.push({ items, hi, dir: 'up', msg, caption, predict });
  snap(['main()'], 0, 'The program itself is a machine already running — the bottom of the pile.', 'call stack, depth 1');
  snap(['main()', 'price_with_tax(10.0)'], 1,
    'main presses a vending machine\'s button: a new frame goes ON TOP, with its own private kitchen — price=10.0, and soon tax.', 'depth 2 — locals: price, rate, tax');
  snap(['main()', 'price_with_tax(10.0)', 'round(10.8, 2)'], 2,
    'That machine presses ANOTHER button mid-recipe. Machines stack on machines; only the top one is actually cooking.', 'depth 3',
    P('Which function is running right now?', 'round', 'main', true));
  snap(['main()', 'price_with_tax(10.0)'], 1,
    'round returns 10.8 and its frame is lifted off and destroyed. We are back inside price_with_tax, exactly where it paused.', 'depth 2 — return resumes the caller');
  snap(['main()'], 0,
    'price_with_tax returns; its kitchen — price, rate, tax — is thrown away whole. Ask for tax out here and you get a NameError: that is scope.', 'depth 1 — locals died with the frame',
    P('Can main() still read the tax variable?', 'Yes', 'No', false));
  snap(['main()', 'f(3)', 'f(2)', 'f(1)'], 3,
    'Preview: a machine that presses ITS OWN button stacks copies of itself. That is recursion — the "Dolls inside dolls" lesson later runs on exactly this picture.', 'same mechanism, pointed at itself');
  return F;
}

function tracerun() {
  const F = [];
  const build = (n, total, out, hotVar) => ([
    { title: 'TRACE TABLE — the boxes', rows: [
      { t: `n = ${n}`, s: hotVar === 0 ? 'hot' : '' },
      { t: `total = ${total}`, s: hotVar === 1 ? 'hot' : '' }] },
    { title: 'OUTPUT so far', rows: out.length ? out.map(o => ({ t: o, s: '' })) : [{ t: '(nothing printed yet)', s: 'off' }] }
  ]);
  const log = [];
  log.push({ t: 'total = 0', s: 'on' });
  F.push(pf(build('—', 0, [], 1), log, 'Become the machine. One line at a time, and we keep the trace table honest.'));
  log.push({ t: 'lap 1: n = 3 -> odd -> total += 3', s: 'on' });
  F.push(pf(build(3, 3, ['3 3'], 1), log, 'Lap 1: n is 3. 3 % 2 == 1, so the if fires: total becomes 3. Then the print.',
    P('Lap 2 brings n = 1. Will the if fire?', 'Yes', 'No', true)));
  log.push({ t: 'lap 2: n = 1 -> odd -> total += 1', s: 'on' });
  F.push(pf(build(1, 4, ['3 3', '1 4'], 1), log, 'Lap 2: 1 is odd, total becomes 4. Notice we WROTE THE ROW AGAIN — every lap, no skipping.'));
  log.push({ t: 'lap 3: n = 4 -> even -> skip the if', s: 'on' });
  F.push(pf(build(4, 4, ['3 3', '1 4', '4 4'], 0), log, 'Lap 3: 4 % 2 is 0 — the if body is skipped entirely, total stays 4, but the print still runs.',
    P('What is the final line?', 'final: 4', 'final: 8', true)));
  log.push({ t: 'print("final:", total)', s: 'on' });
  F.push(pf(build(4, 4, ['3 3', '1 4', '4 4', 'final: 4'], 1), log,
    'final: 4. If you predicted every step, you just executed a program with your bare hands. Bugs live wherever your prediction and the machine disagree — tracing is how you hunt them.'));
  return F;
}

function stepcount() {
  const F = [];
  const set = (series, n, msg, note, predict) => F.push({ series, n, msg, note, custom: true, predict });
  const A = { k: 'n', mul: 1, name: 'Chef A — one pass (n steps)', c: 'var(--color-accent-600)' };
  const B = { k: 'n2', mul: 0.5, name: 'Chef B — every pair (~n²/2)', c: 'var(--color-accent-900)' };
  set([A], 8, 'Chef A preps each plate once: 8 guests, 8 units of work. Double the guests, double the work — a straight, honest line.', 'one loop -> linear');
  set([A, B], 8, 'Chef B introduces every plate to every other plate. At 8 guests the two chefs look almost identical — small n forgives everything.', 'dinner party: no visible difference',
    P('At 8 guests, is Chef B noticeably slower?', 'Yes', 'Barely', false));
  set([A, B], 40, 'Grow the party to 40. Chef A: 40 steps. Chef B: ~800. The curves are separating.', 'nested loop -> quadratic');
  set([A, B], 100, 'At a 100-guest wedding: A does 100, B does ~5,000. Same dinners. The SHAPE was different all along — the laptop just hid it.', 'the shape beats the stopwatch',
    P('At 500 guests, roughly how much work for Chef B?', '~125,000', '~500', true));
  set([A, B, { k: 'logn', mul: 1, name: 'the halving trick (log n)', c: 'var(--color-accent-400)' }], 100,
    'One more curve, as a promise: methods that HALVE the problem each step barely rise at all — 1,000,000 items in 20 steps. Binary search lives down there. Module 4 gives all of this its proper name: Big O.', 'log n — nearly flat');
  return F;
}

export function buildM0(viz) {
  switch (viz) {
    case 'varbox': return varbox();
    case 'castbox': return castbox();
    case 'iotrace': return iotrace();
    case 'optable': return optable();
    case 'condflow': return condflow();
    case 'looptrack': return looptrack();
    case 'funcstack': return funcstack();
    case 'tracerun': return tracerun();
    case 'stepcount': return stepcount();
    default: return [{ msg: 'No visualizer for this lesson.' }];
  }
}
