// In-depth reference sections for Module 0, split by language.
// Section kinds: table {cols, rows}, rules {items}, code {code}, text {text}.
// `both` renders in either language; `py`/`js` swap with the language toggle.
export const DEEPDIVE_M0 = {
  m0l1: {
    py: [
      { h: 'Every built-in data type in Python (CPython 3.12, 64-bit)', kind: 'table',
        cols: ['type', 'example', 'memory (sys.getsizeof)', 'mutable?', 'notes'],
        rows: [
          ['int', '42', '28 bytes small; +4 per extra 30 bits', 'no', 'ARBITRARY precision — never overflows, just grows'],
          ['float', '3.14', '24 bytes', 'no', 'IEEE-754 double: 15–17 significant digits; 0.1+0.2 != 0.3'],
          ['bool', 'True', '28 bytes', 'no', 'a subclass of int — True == 1, so sum([True,True]) == 2'],
          ['complex', '2+3j', '32 bytes', 'no', 'two doubles: real + imaginary'],
          ['str', '"hi"', '49 + ~1–4 bytes/char', 'no', 'Unicode; width adapts to the widest char (emoji cost 4/char)'],
          ['bytes', "b'hi'", '33 + 1 byte/char', 'no', 'raw 0–255 values; what files and networks actually carry'],
          ['NoneType', 'None', '16 bytes (one shared object)', 'no', 'the "no value" singleton; test with `is None`'],
          ['list', '[1, 2]', '56 + 8/slot (overallocates ~12%)', 'YES', 'the dynamic array of Module 2'],
          ['tuple', '(1, 2)', '40 + 8/slot', 'no', 'immutable list; hashable, so usable as a dict key'],
          ['dict', "{'a': 1}", '64 empty; grows in powers of 2', 'YES', 'the hash map of Module 2'],
          ['set', '{1, 2}', '216 empty', 'YES', 'hash table without values; frozenset is its immutable twin'],
          ['range', 'range(10**9)', '48 bytes regardless of length', 'no', 'lazy — computes values on demand'],
        ] },
      { h: 'The rules', kind: 'rules', items: [
        'Names bind, boxes don\'t exist twice: `b = a` copies a REFERENCE. For immutable values that\'s indistinguishable from a copy; for a list, both names now point at ONE list.',
        'Identifiers: letters, digits, underscores; can\'t start with a digit; case-sensitive (Age ≠ age); can\'t be a keyword (`if`, `class`, `for`…). Convention: snake_case for variables, UPPER_CASE for constants.',
        'Immutable types (int, float, str, tuple, bool) can never change in place — every "modification" builds a new object. That\'s why `s += "!"` in a loop is O(n²).',
        'Only immutable (hashable) values may be dict keys or set members — a list can\'t, a tuple can.',
        'Check types with isinstance(x, int), never `type(x) == int` (isinstance respects subclasses — remember bool!).',
        'Integer division of big ints is exact — Python ints never silently wrap around like C/Java ints (the Ariane 5 class of bug can\'t happen here).',
      ] },
      { h: 'See it yourself', kind: 'code', code: 'import sys\nprint(sys.getsizeof(0))          # 28\nprint(sys.getsizeof(10**100))    # 72 — the int GREW\nprint(sys.getsizeof(""))        # 49\nprint(sys.getsizeof("hi"))      # 51\nprint(sys.getsizeof([]))         # 56\nprint(True + True)                # 2 (bool is an int!)\nprint(0.1 + 0.2 == 0.3)          # False — floats approximate' },
    ],
    js: [
      { h: 'Every data type in JavaScript (V8, 64-bit)', kind: 'table',
        cols: ['type', 'example', 'memory (approx.)', 'mutable?', 'notes'],
        rows: [
          ['number', '42 or 3.14', 'small ints inline (31-bit "Smi"); else 16-byte heap double', 'no', 'ONE numeric type: IEEE-754 double. Integers exact only to ±2^53−1 (Number.MAX_SAFE_INTEGER)'],
          ['bigint', '42n', 'grows with magnitude', 'no', 'arbitrary precision; can\'t mix with number without converting'],
          ['string', '"hi"', '~12 + 2 bytes/UTF-16 unit (1 if latin-1 internally)', 'no', 'immutable; "😀".length === 2 — emoji take two units!'],
          ['boolean', 'true', 'shared singletons', 'no', 'true/false only'],
          ['undefined', 'undefined', 'singleton', 'no', '"never assigned" — what a missing property returns'],
          ['null', 'null', 'singleton', 'no', '"deliberately empty" — and typeof null === "object" (a 1995 bug kept forever)'],
          ['symbol', 'Symbol("id")', 'small', 'no', 'guaranteed-unique keys'],
          ['object', '{ a: 1 }', 'shape-dependent (hidden classes)', 'YES', 'everything non-primitive, incl. arrays and functions'],
          ['Array', '[1, 2]', '~8 bytes/element + header', 'YES', 'a specialised object; V8 keeps int-only arrays compact until you mix types'],
          ['Map / Set', 'new Map()', 'hash-table backed', 'YES', 'the real hash structures — prefer over plain objects for dynamic keys'],
        ] },
      { h: 'The rules', kind: 'rules', items: [
        'let = reassignable, const = the NAME can\'t rebind (the object it points to can still mutate!), var = legacy function-scoped hoisting — never use it.',
        'Identifiers: letters, digits, _, $; can\'t start with a digit; case-sensitive; camelCase by convention.',
        'All numbers are doubles: 0.1 + 0.2 !== 0.3 here too, and 9007199254740993 silently becomes ...992. Money → integer cents or BigInt.',
        'Primitives copy by value; objects and arrays copy by REFERENCE — `const b = a` on an array gives two names for one array. Clone with [...a] or structuredClone.',
        'typeof quirks to memorise: typeof null === "object", typeof NaN === "number", and NaN !== NaN (test with Number.isNaN).',
        'undefined is what YOU get; null is what you SET. APIs conventionally return null for "looked, found nothing".',
      ] },
      { h: 'See it yourself', kind: 'code', code: 'console.log(typeof 42, typeof 3.14);   // number number — one type\nconsole.log(0.1 + 0.2 === 0.3);          // false\nconsole.log(9007199254740992 + 1);       // 9007199254740992 (!)\nconsole.log(9007199254740992n + 1n);     // 9007199254740993n\nconsole.log("😀".length);               // 2 — UTF-16 units\nconsole.log(typeof null);                 // "object" — the famous bug\nconst a = [1, 2]; const b = a; b.push(3);\nconsole.log(a);                           // [1, 2, 3] — one array, two names' },
    ],
  },

  m0l2: {
    py: [
      { h: 'Conversion table — what casts to what', kind: 'table',
        cols: ['cast', 'input', 'result', 'rule'],
        rows: [
          ['int("12")', 'str', '12', 'parses optional sign + digits; anything else → ValueError'],
          ['int("7.5")', 'str', 'ValueError', 'int() does NOT parse decimals — use int(float("7.5"))'],
          ['int(3.9)', 'float', '3', 'TRUNCATES toward zero: int(-3.9) is -3'],
          ['round(3.5)', 'float', '4 (but round(2.5) is 2!)', "banker's rounding: ties go to the EVEN neighbour"],
          ['float("2.5")', 'str', '2.5', 'accepts "inf", "nan", "1e3" too'],
          ['str(42)', 'int', '"42"', 'never fails; repr() is its debugging sibling'],
          ['bool(x)', 'anything', 'False for 0, "", [], {}, None', 'everything else is True — even "False" and [0]'],
          ['int("ff", 16)', 'str', '255', 'second argument = base (2, 8, 16…)'],
          ['3 + 0.5', 'mixed', '3.5 (float)', 'implicit promotion: int → float in mixed arithmetic — the ONLY implicit coercion Python does'],
        ] },
      { h: 'The rules', kind: 'rules', items: [
        'Python is strongly typed: "12" + 1 raises TypeError instead of guessing. Every other conversion must be explicit.',
        'Casting never mutates — int(x) returns a NEW value; x is untouched.',
        'Truncation vs rounding is a business decision: int() cuts, round() uses banker\'s rounding, math.floor/ceil go down/up. Pick deliberately.',
        'Wrap boundary casts: try: n = int(raw) / except ValueError: complain. Users type "twelve".',
        'bool("False") is True — non-empty strings are truthy. Parse flags explicitly: raw.lower() in ("true", "1", "yes").',
      ] },
    ],
    js: [
      { h: 'Conversion table — explicit and the coercion traps', kind: 'table',
        cols: ['expression', 'result', 'rule'],
        rows: [
          ['Number("12")', '12', 'the safe explicit cast; Number("") is 0 (!), Number("x") is NaN'],
          ['parseInt("7.5px")', '7', 'parses leading digits, stops at junk; ALWAYS pass radix: parseInt(s, 10)'],
          ['parseFloat("7.5px")', '7.5', 'same, but keeps decimals'],
          ['Math.trunc(3.9)', '3', 'truncate toward zero; Math.round(3.5) is 4 (ties go UP, unlike Python)'],
          ['String(42)', '"42"', 'explicit and safe'],
          ['"2" + 1', '"21"', '+ with a string CONCATENATES — the classic cart bug'],
          ['"2" - 1', '1', '- coerces to numbers. Yes, + and - disagree'],
          ['"2" == 2', 'true', '== coerces before comparing — never use it'],
          ['"2" === 2', 'false', '=== compares type AND value — always use it'],
          ['Boolean(x)', 'false for 0, "", null, undefined, NaN', 'note: [] and {} are TRUTHY here (unlike Python!)'],
        ] },
      { h: 'The rules', kind: 'rules', items: [
        'JavaScript coerces implicitly and enthusiastically — the discipline is to never rely on it: cast with Number()/String()/Boolean() and compare with === / !==.',
        'NaN is the "cast failed" signal and it never equals anything, including itself. Test with Number.isNaN(x).',
        'Form inputs (input.value) are ALWAYS strings — same rule as Python: cast at the door.',
        'parseInt without a radix once interpreted "08" as octal; modern engines fixed it, but parseInt(s, 10) remains the professional habit.',
        'Empty array quirk chain: [] == false is true, but if ([]) runs the branch. This is why the toggle above says "explicit only".',
      ] },
    ],
  },

  m0l3: {
    py: [
      { h: 'The I/O toolbox', kind: 'table',
        cols: ['channel', 'read', 'write', 'notes'],
        rows: [
          ['console', 'input(prompt) → str', 'print(*args, sep=" ", end="\\n")', 'input ALWAYS returns str; print coerces via str()'],
          ['files', 'open(p).read() / .readlines()', 'open(p, "w").write(s)', 'use `with open(...) as f:` — closes even on error'],
          ['formatted output', '—', 'f"{name}: {price:.2f}"', 'f-strings: {value:format}; .2f = 2 decimals, >8 = right-align in 8'],
          ['command line', 'sys.argv (list of str)', '—', 'argv[0] is the script name'],
          ['environment', 'os.environ.get("KEY")', '—', 'how servers receive secrets'],
        ] },
      { h: 'The rules', kind: 'rules', items: [
        'input() strips the trailing newline but nothing else — .strip() user input before validating.',
        'print(a, b) inserts a space and adds a newline; print(x, end="") suppresses the newline for progress bars.',
        'I/O is ~1000× slower than arithmetic: read once into memory, compute, write once — never print inside a hot loop you care about.',
        'Files are bytes until decoded: open(p, encoding="utf-8") explicitly, or Windows will one day choose cp1252 for you.',
        'Keep compute functions print-free — return values and test them; print only at the edges.',
      ] },
    ],
    js: [
      { h: 'The I/O toolbox', kind: 'table',
        cols: ['channel', 'read', 'write', 'notes'],
        rows: [
          ['console', 'prompt("Age?") (browser)', 'console.log(...)', 'prompt returns a STRING or null on cancel'],
          ['web page', 'input.value (always a string)', 'element.textContent = ...', 'the DOM is the browser\'s real I/O surface'],
          ['network', 'await fetch(url).then(r => r.json())', 'fetch(url, { method: "POST", body })', 'asynchronous — arrives LATER; hence await'],
          ['formatted output', '—', '`${name}: ${price.toFixed(2)}`', 'template literals + toFixed/Intl.NumberFormat'],
          ['Node.js', 'process.argv, readline', 'process.stdout.write(s)', 'console.log adds the newline'],
        ] },
      { h: 'The rules', kind: 'rules', items: [
        'Everything user-facing arrives as a string (prompt, input.value, URL params) — cast at the door with Number().',
        'Network I/O is asynchronous: fetch returns a Promise; the answer does not exist yet on the next line. await it.',
        'console.log holds a live REFERENCE in browser devtools — an object logged then mutated shows the mutated version. console.log(JSON.stringify(x)) freezes the moment.',
        'prompt() blocks the entire page and returns null on cancel — real apps read from form fields instead.',
        'Same separation rule: functions return, the edge renders. That is what makes code testable.',
      ] },
    ],
  },

  m0l4: {
    both: [
      { h: 'Precedence — who computes first (top binds tightest)', kind: 'table',
        cols: ['level', 'operators', 'example'],
        rows: [
          ['1', '() parentheses', '(2 + 3) * 4 → 20'],
          ['2', '** (Python) / ** (JS)', '2 ** 3 ** 2 = 2 ** 9 = 512 — right-to-left!'],
          ['3', 'unary -x, not/!', '-3 ** 2 is -9 (power first)'],
          ['4', '* / // %', '7 + 3 * 2 → 13'],
          ['5', '+ -', ''],
          ['6', 'comparisons == != < <= > >=', '1 + 2 == 3 → True'],
          ['7', 'not / !', ''],
          ['8', 'and / &&', 'short-circuits: right side skipped if left is False'],
          ['9', 'or / ||', 'short-circuits: right side skipped if left is True'],
        ] },
    ],
    py: [
      { h: 'Python specifics', kind: 'rules', items: [
        '/ ALWAYS returns float (6 / 2 is 3.0); // floors; % takes the sign of the RIGHT operand: -7 % 3 == 2 — exactly right for circular indexing.',
        'Chained comparisons are real syntax: 0 <= x < 10 means (0 <= x) and (x < 10).',
        'and/or return the deciding OPERAND, not a bool: name = user or "guest" is the idiomatic default.',
        'Divmod in one call: q, r = divmod(17, 5) → (3, 2).',
        'No ++ in Python. x += 1 is the only increment.',
      ] },
    ],
    js: [
      { h: 'JavaScript specifics', kind: 'rules', items: [
        '/ is always float division; there is no // — use Math.floor(a / b). % takes the sign of the LEFT operand: -7 % 3 === -1 (!). Circular indexing needs ((i % n) + n) % n.',
        'NO chained comparisons: 0 <= x < 10 parses as (0 <= x) < 10 → comparing a boolean to 10. Write both sides with &&.',
        '&&/|| return the deciding operand (like Python); ?? is the modern default operator that only falls through on null/undefined — 0 ?? 5 is 0, but 0 || 5 is 5.',
        '=== and !== always; == coerces ("2" == 2).',
        '++/-- exist; prefer x += 1 in shared code for clarity.',
      ] },
    ],
  },

  m0l5: {
    both: [
      { h: 'What counts as false — the full list', kind: 'table',
        cols: ['Python (falsy)', 'JavaScript (falsy)'],
        rows: [
          ['False, None', 'false, null, undefined'],
          ['0, 0.0, 0j', '0, -0, 0n, NaN'],
          ['"" (empty string)', '"" (empty string)'],
          ['[], (), {}, set()', '— (empty arrays/objects are TRUTHY in JS!)'],
        ] },
    ],
    py: [
      { h: 'Python conditional forms', kind: 'rules', items: [
        'if / elif / else — first true branch wins, everything after is skipped unread.',
        'Ternary reads middle-out: grade = "pass" if score >= 50 else "retry".',
        'match/case (3.10+) is the multiway switch: match cmd: case "quit": ... case _: ...',
        'if items: is the idiom for "non-empty"; if x is None: for "unset" — because 0 and "" are falsy but often valid values!',
        'Guard clauses keep the happy path flat: if not user: return early.',
      ] },
    ],
    js: [
      { h: 'JavaScript conditional forms', kind: 'rules', items: [
        'if / else if / else — same first-true-wins chain.',
        'Ternary: const grade = score >= 50 ? "pass" : "retry".',
        'switch(x) compares with === and FALLS THROUGH without break — the classic bug; consider an object lookup instead.',
        'Because [] and {} are truthy, "non-empty" checks must be explicit: if (items.length), if (Object.keys(obj).length).',
        'Optional chaining + nullish default replace whole nests: user?.address?.city ?? "unknown".',
      ] },
    ],
  },

  m0l6: {
    both: [
      { h: 'Loop constructs side by side', kind: 'table',
        cols: ['intent', 'Python', 'JavaScript'],
        rows: [
          ['each item', 'for x in items:', 'for (const x of items)'],
          ['index + item', 'for i, x in enumerate(items):', 'items.forEach((x, i) => …)'],
          ['counted', 'for i in range(n):', 'for (let i = 0; i < n; i++)'],
          ['until condition', 'while not done:', 'while (!done)'],
          ['keys of a mapping', 'for k in d: / d.items()', 'for (const k in obj) / Object.entries'],
          ['transform', '[x * 2 for x in xs]', 'xs.map(x => x * 2)'],
          ['filter', '[x for x in xs if x > 0]', 'xs.filter(x => x > 0)'],
        ] },
      { h: 'The universal rules', kind: 'rules', items: [
        'break exits the loop; continue skips to the next lap — both apply to the INNERMOST loop only.',
        'Never mutate the collection you are iterating — copy it or build a new one.',
        'Nested loops over the same data multiply: n × n = the O(n²) alarm from Counting Steps.',
        'Every while needs a visible progress line; if you can\'t point to it, it\'s infinite.',
      ] },
    ],
    py: [
      { h: 'Python extras', kind: 'rules', items: [
        'for/else exists: the else runs only if the loop finished WITHOUT break — perfect for search-then-not-found.',
        'zip(a, b) walks two lists in lockstep; itertools has the rest (pairwise, product, chain).',
        'range is lazy — range(10**12) costs 48 bytes; list(range(10**12)) costs your RAM.',
      ] },
    ],
    js: [
      { h: 'JavaScript extras', kind: 'rules', items: [
        'for...of iterates VALUES (use it); for...in iterates KEYS (including inherited ones — avoid for arrays).',
        'forEach cannot break — use for...of when you might exit early; some/every/find break implicitly.',
        'let in the for-header gives each lap its own binding — the reason setTimeout in a loop finally works.',
      ] },
    ],
  },

  m0l7: {
    py: [
      { h: 'Scope resolution — LEGB', kind: 'table',
        cols: ['layer', 'meaning', 'example'],
        rows: [
          ['L — Local', 'inside the current function', 'the tax in price_with_tax'],
          ['E — Enclosing', 'the function wrapping this one', 'closures read the outer function\'s names'],
          ['G — Global', 'module top level', 'constants, imports'],
          ['B — Built-in', 'print, len, range…', 'shadowable — naming a variable `list` breaks list()'],
        ] },
      { h: 'The rules', kind: 'rules', items: [
        'Assignment inside a function creates a LOCAL, even if the name exists globally — reading falls through LEGB, writing does not. `global`/`nonlocal` override (and are usually a design smell).',
        'Default parameter values are evaluated ONCE at def time: def f(acc=[]) shares one list across every call. Use None + create inside — the most famous Python bug.',
        'Arguments pass object references: rebinding a parameter does nothing outside; MUTATING a passed list is visible outside.',
        'return ends the call immediately; a function without return returns None.',
        'Each call gets a fresh frame on the call stack (~depth limit 1000 — sys.setrecursionlimit); frames die at return, taking their locals with them.',
      ] },
    ],
    js: [
      { h: 'Scope resolution — lexical chain', kind: 'table',
        cols: ['layer', 'meaning', 'example'],
        rows: [
          ['block', '{ } with let/const', 'the loop-body variable'],
          ['function', 'parameters + locals', 'the frame that dies at return'],
          ['closure', 'the defining function\'s scope, kept alive', 'counters, event handlers'],
          ['module/global', 'top level', 'imports, window in browsers'],
        ] },
      { h: 'The rules', kind: 'rules', items: [
        'let/const are block-scoped; var is function-scoped and hoists as undefined — one more reason var is banned.',
        'Closures capture VARIABLES, not values: a function defined in a loop sees the variable\'s final value unless the loop uses let.',
        'Arrow functions have no own `this` — they borrow it lexically; classic function() gets its own (the source of a thousand bugs).',
        'Same pass-by-reference rule: reassigning a parameter is invisible outside; mutating a passed object is visible.',
        'Default parameters are evaluated PER CALL here — def f(acc = []) is safe in JS, unlike Python. Know which language you\'re in.',
      ] },
    ],
  },

  m0l8: {
    both: [
      { h: 'The trace-table method', kind: 'rules', items: [
        'One column per variable, one row per executed line. Evaluate the right-hand side completely BEFORE writing the assignment.',
        'On a loop: re-check the condition and write a fresh row every lap — no skipping, that is where bugs hide.',
        'On a function call: open a fresh mini-table for its locals; close it at return and write the returned value where the call was.',
        'Copy vs reference is THE trap: b = a copies the value for numbers/strings, but aliases the same object for lists/objects (both languages).',
        'Trace tiny inputs (n = 3) and the edges: empty, one element, duplicates, negative.',
      ] },
    ],
    py: [
      { h: 'Debugging tools when tracing by hand gets old', kind: 'rules', items: [
        'print(f"{i=} {total=}") — the = specifier prints name and value.',
        'breakpoint() drops you into pdb: n = next line, s = step into, c = continue, p x = print x.',
        'id(x) reveals aliasing: two names, same id → one object.',
      ] },
    ],
    js: [
      { h: 'Debugging tools when tracing by hand gets old', kind: 'rules', items: [
        'console.log({ i, total }) — object shorthand prints names and values.',
        'debugger; pauses DevTools right there: F10 step over, F11 step into, watch panel = live trace table.',
        'console.table(arrayOfObjects) renders your trace table for you.',
      ] },
    ],
  },

  m0l9: {
    both: [
      { h: 'The growth table — steps at different n', kind: 'table',
        cols: ['shape', 'n = 10', 'n = 1,000', 'n = 1,000,000', 'smell'],
        rows: [
          ['O(1)', '1', '1', '1', 'array index, hash lookup'],
          ['O(log n)', '~3', '~10', '~20', 'halving each step'],
          ['O(n)', '10', '1,000', '1,000,000', 'one loop'],
          ['O(n log n)', '~33', '~10,000', '~20,000,000', 'sort-shaped'],
          ['O(n²)', '100', '1,000,000', '10¹² — days', 'loop inside a loop'],
        ] },
      { h: 'Counting rules', kind: 'rules', items: [
        'Sequential loops ADD (n + n = still O(n)); nested loops over the same data MULTIPLY (n × n).',
        'A hidden loop counts: `x in list` (Python) and array.includes (JS) are O(n) scans — inside a loop they quietly build O(n²).',
        'Halving is the signature of log n: 1,000,000 → 20 steps. If your algorithm throws half away each round, it\'s logarithmic.',
        'Constants are invisible to growth but real to users — Module 4 formalises when they matter.',
      ] },
    ],
  },
};
