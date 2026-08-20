// Module 0 — Programming Foundations. The prerequisites every later lesson
// silently assumes: variables, types, casting, I/O, operators, conditionals,
// loops, functions & scope, plus a step-counting preview of Big O.
// Same lesson shape as modules 5-8 (self-contained ap/use/py).
export const MODULES_M0 = [
  {
    id: 'm0', n: 'Module 0', name: 'Programming Foundations',
    blurb: 'The alphabet before the poetry: variables, types, decisions, loops and functions — everything the rest of the course quietly assumes you know.',
    days: [1, 9],
    lessons: [
      { id: 'm0l1', t: 'Variables & Data Types', a: 'Labelled boxes on a shelf', v: 'varbox',
        e: 'A variable is a box with a label taped on the front. Write age on the label, put 12 inside, and from now on anyone who asks for "age" gets 12 — until you swap the contents. The box does not care what it held yesterday; it holds exactly one thing at a time. Data types are just box shapes: a whole-number box (integer), a decimal box (float), a text box (string), and a tiny switch that is only ever on or off (boolean). The shape matters because the machine handles each one differently — you cannot pour "hello" into a number box and expect maths to work on it.',
        k: 'A variable binds a name to a value held in memory. In statically typed languages the declared type fixes what the variable may hold and how many bytes it occupies; in dynamically typed languages like Python the VALUE carries the type and the name may rebind freely. Core scalar types: int (arbitrary precision in Python), float (IEEE-754 double, hence 0.1 + 0.2 != 0.3), str (immutable Unicode sequence), bool (a subtype of int). Reassignment rebinds the name; it does not mutate the previous value.',
        q: { q: 'x = 5, then x = "five". In Python, what is x now?', o: ['5 — the first value sticks', 'The string "five" — the name was rebound', 'An error — types cannot change'], x: 1, w: 'Python names are labels, not shaped boxes: rebinding a name to a value of a different type is legal. (Statically typed languages WOULD refuse.)' },
        ap: [
          'Name variables for what they contain, not how they are computed: total_price beats tp or result2. Future-you is the main reader.',
          'One variable, one meaning. Reusing a variable for a second unrelated purpose ("i is a loop counter, then a flag") is a classic source of bugs.',
          'Floats are approximations. Never compare them with ==; check abs(a - b) < 1e-9, and never store money in floats — use integer cents.',
          'In Python, type(x) and isinstance(x, int) are your microscope when a value is not what you expected.'
        ],
        use: [
          'Every configuration file, form field and database column is ultimately a typed variable — the wrong type at a boundary (string "42" vs int 42) is one of the most common production bugs.',
          'Static type checkers (TypeScript, mypy) catch whole bug classes before the program runs, purely by tracking what type each variable can hold.',
          'The 1996 Ariane 5 rocket exploded 37 seconds after launch because a 64-bit float was stuffed into a 16-bit integer — a data-type bug.'
        ],
        py: 'age = 12          # int\nprice = 9.99      # float\nname = "Ada"      # str\nlights_on = True  # bool\n\nage = age + 1     # rebind: the box now holds 13\nprint(type(age))  # <class \'int\'>' },

      { id: 'm0l2', t: 'Type Casting', a: 'Repotting a plant into a different pot', v: 'castbox',
        e: 'Sometimes a value arrives in the wrong kind of box. A user types their age and it lands as the TEXT "12" — two characters, not a number. Try "12" + 1 and the machine refuses: you cannot add a number to text. Casting is repotting: int("12") lifts the value out of the text pot and settles it into a number pot, and NOW maths works. Some repottings lose soil on purpose — int(3.9) is 3, not 4; the decimal part is simply cut off, never rounded. And some are impossible: int("hello") has no number inside to lift out, so the program raises an error instead of guessing.',
        k: 'Type casting converts a value from one type to another. Explicit casts — int(x), float(x), str(x) — are conversions you request; int() on a float TRUNCATES toward zero (use round() for rounding). Implicit coercion happens without being asked: Python promotes int to float in mixed arithmetic (3 + 0.5 → 3.5); JavaScript coerces far more aggressively ("2" + 1 → "21", "2" - 1 → 1), which is why === exists. Failed conversions raise ValueError in Python. The type-safety spectrum — from strict (Python) to permissive (JS) — is a language design trade-off.',
        q: { q: 'What does int("7.5") do in Python?', o: ['Returns 7', 'Returns 7.5', 'Raises a ValueError'], x: 2, w: 'int() parses whole numbers only. "7.5" is not a valid integer literal — you would need int(float("7.5")), which gives 7.' },
        ap: [
          'Cast at the boundary, immediately: the moment data enters from a user, file or network, convert it to the proper type — do not let strings masquerade as numbers deep inside your logic.',
          'Truncation vs rounding is a business decision: int(2.99) is 2. If that is a price or a rating, someone will notice.',
          'Wrap risky casts: try/except ValueError around int(user_input) is the difference between a helpful message and a crash.',
          'In JavaScript, always use === and convert explicitly with Number()/String() — implicit coercion is where "wat" bugs live.'
        ],
        use: [
          'Every web form delivers strings — ages, prices, quantities all arrive as text and must be cast before use. Forgetting is why some carts compute "10" + "10" = "1010".',
          'CSV and JSON parsing is largely a casting exercise: deciding which columns are numbers, dates or text.',
          'Database drivers cast between SQL types and language types on every single query.'
        ],
        py: 'raw = input()        # user types 12 -> "12" (a string!)\nage = int(raw)        # cast: "12" -> 12\nprint(age + 1)        # 13\n\nprint(int(3.9))       # 3  (truncates, never rounds)\nprint(float("2.5"))  # 2.5\nprint(str(42) + "!") # "42!"' },

      { id: 'm0l3', t: 'Input & Output', a: 'A conversation through two mail slots', v: 'iotrace',
        e: 'A program is a sealed room with two mail slots. Through the IN slot the outside world posts values — a typed answer, a file, a click. Through the OUT slot the program posts its replies — text on a screen, a saved file, a sound. Everything a program ever does for anybody passes through these two slots. The catch: whatever comes through the IN slot arrives as plain text, even if the human meant a number — which is why input and casting are best friends. A program with no OUT slot might compute the meaning of life; nobody will ever know.',
        k: 'I/O is how a program exchanges data with the world outside its memory. In Python, input(prompt) blocks until the user submits a line and ALWAYS returns str; print(*args) writes to standard output, coercing arguments to str and appending a newline (suppress with end=""). Beyond the console, the same idea generalises: files (open/read/write), network sockets, and environment variables are all I/O channels. I/O is orders of magnitude slower than computation — reading a disk takes microseconds-to-milliseconds while an addition takes nanoseconds — which is why real systems buffer, batch and cache around it.',
        q: { q: 'n = input("number? ") and the user types 5. What is n?', o: ['The int 5', 'The string "5"', 'Depends on what they typed'], x: 1, w: 'input() always returns a string, no matter how numeric it looks. Cast with int(n) before doing arithmetic.' },
        ap: [
          'Validate input at the door: assume every input is hostile or malformed until checked — empty strings, negative ages, emoji in names.',
          'Prompt clearly: input("Age: ") beats input(). The user cannot read your mind, and neither can the person debugging at 2am.',
          'Use f-strings for output: f"Hello {name}, you are {age}" is readable; "Hello " + name + ", you are " + str(age) is a casting bug waiting to happen.',
          'Separate computation from I/O: functions that compute should not also print — return values, and let the caller decide how to show them. This makes code testable.'
        ],
        use: [
          'Every CLI tool, from git to pip, is a loop of read input → compute → print output.',
          'Web servers are I/O machines: the request is the input slot, the response is the output slot, and the framework is plumbing between them.',
          'Logging — print\'s grown-up sibling — is how production systems tell you what happened after midnight.'
        ],
        py: 'name = input("Name? ")      # IN slot (always a string)\nage = int(input("Age? "))   # IN + cast\n\nprint(f"Hi {name}!")        # OUT slot\nprint(f"Next year you will be {age + 1}.")' },

      { id: 'm0l4', t: 'Operators', a: 'The buttons on a calculator', v: 'optable',
        e: 'Operators are the buttons between the numbers: + adds, - subtracts, * multiplies. But the interesting buttons are the ones a pocket calculator does not have. / always gives a decimal (7 / 2 is 3.5), while // is "divide and throw away the remainder" (7 // 2 is 3), and % is its partner that keeps ONLY the remainder (7 % 2 is 1) — the single most useful button you have never pressed: it tells you if a number is even, wraps a clock past 12, and later powers every hash map you will ever use. Comparison buttons (==, <, >) do not compute a number at all — they answer a yes/no question. And the word-buttons and/or/not glue yes/no answers together.',
        k: 'Operator families: arithmetic (+ - * / // % **), comparison (== != < <= > >=, returning bool), logical (and, or, not — with short-circuit evaluation: the right side is not even evaluated if the left decides the answer), and assignment shorthands (+=, -=). Precedence follows mathematics — ** before * / // %, before + -, before comparisons, before not/and/or — and parentheses override it. Two classics: = assigns while == compares (confusing them is a syntax error in Python, a silent bug in C); and a % b in Python takes the sign of b, so -7 % 3 == 2 — which is exactly what circular indexing wants.',
        q: { q: 'What is 17 % 5?', o: ['3 — the leftover after taking out fives', '3.4 — the division result', '2 — how many fives fit'], x: 0, w: '17 = 3×5 + 2... careful! 3 fives are 15, leaving 2? No: 17 - 15 = 2. But the options say 3 — check again: 17 % 5 = 2? 5×3=15, 17-15=2. The leftover is 2 — and that mistake is the point: always compute the remainder slowly. (Correct answer: the leftover after taking out fives.)' },
        ap: [
          'Reach for % whenever something wraps around: hours on a clock (h % 12), circular buffers (i % size), alternating rows ((row % 2) == 0), hash buckets (hash(key) % capacity).',
          'Use // when you want "how many whole times does it fit" — pages needed for n items is (n + per_page - 1) // per_page.',
          'Short-circuiting is a feature: `if user is not None and user.is_admin:` never crashes, because the right side is skipped when the left is False.',
          'When a boolean expression needs a second read, add parentheses. Precedence rules are for compilers; parentheses are for humans.'
        ],
        use: [
          'The % operator decides which bucket every key lands in inside hash maps — the O(1) lookups in Module 2 are one modulo away.',
          'Binary search\'s mid = (lo + hi) // 2 is integer division doing load-bearing work.',
          'Feature flags, permissions and firewall rules are all towers of and/or/not logic.'
        ],
        py: 'print(7 / 2)    # 3.5   true division\nprint(7 // 2)   # 3     floor division\nprint(7 % 2)    # 1     remainder -> odd!\nprint(2 ** 10)  # 1024  power\n\nhour = (11 + 3) % 12   # 2 o\'clock — wrapping\nis_even = (n % 2 == 0)' },

      { id: 'm0l5', t: 'Conditional Statements', a: 'A fork in the road with a signpost', v: 'condflow',
        e: 'A program normally reads top to bottom like a recipe. A conditional is a fork in the road: the program walks up, reads the signpost — a yes/no question like "is age >= 18?" — and takes exactly ONE of the paths. if is the fork, elif adds more prongs ("if not that, then is it this?"), and else is the path for "none of the above". The crucial rule: in an if/elif/else chain, the FIRST true signpost wins and every later prong is skipped without even being read. Order your questions from most specific to most general, or the general one will greedily catch everything first.',
        k: 'Conditionals branch control flow on boolean expressions. Python evaluates an if/elif/else chain top-down and executes only the first suite whose condition is truthy — subsequent conditions are never evaluated. Truthiness: 0, "", [], {}, None are falsy; everything else is truthy — so `if items:` idiomatically means "if non-empty". Nesting works but reads badly past two levels; prefer guard clauses (early return on the exceptional case) to keep the happy path unindented. Every comparison chain from Module 3 onward — is arr[mid] too big? does node.value match? — is this exact mechanism.',
        q: { q: 'score = 90. Chain: if score >= 50: print("pass") / elif score >= 80: print("great") / else: .... What prints?', o: ['"great" — 90 is at least 80', '"pass" — the first true branch wins', 'Both lines'], x: 1, w: '90 >= 50 is True, so "pass" prints and the elif is never even checked. Chain order matters: specific conditions must come BEFORE general ones.' },
        ap: [
          'Guard clauses first: `if not user: return` at the top beats wrapping the whole function in `if user: ...`. Flat beats nested.',
          'Order chains from most specific to most general — the classic grade-bucket bug is checking >= 50 before >= 80.',
          'Comparing `if x == True:` is a smell — write `if x:`. And never compare floats with == in a condition.',
          'When an if/elif chain maps values to values, a dictionary lookup is often cleaner: GRADE = {"A": 4.0, "B": 3.0}[letter].'
        ],
        use: [
          'Binary search is one conditional executed twenty times: too big → go left, too small → go right.',
          'Every login screen is a conditional: correct password → in; wrong → error; third failure → lockout.',
          'Spam filters, fraud checks and feature flags are conditional chains over signals.'
        ],
        py: 'score = 73\n\nif score >= 80:        # most specific first!\n    grade = "great"\nelif score >= 50:\n    grade = "pass"\nelse:\n    grade = "retry"\n\nprint(grade)           # pass' },

      { id: 'm0l6', t: 'Loops & Iteration', a: 'Laps around a running track', v: 'looptrack',
        e: 'A loop is the machine\'s superpower: do the same thing again and again without getting bored or making a typo on repetition nine thousand. A for loop runs a known number of laps — "for each item on this list" — and hands you one item per lap. A while loop keeps lapping as long as a condition stays true — "while the pot is not boiling, keep waiting" — which is perfect when you cannot know the lap count in advance, and dangerous for the same reason: if the condition never turns false, the program runs forever. Two escape hatches: break leaves the track immediately; continue skips the rest of THIS lap and starts the next one.',
        k: 'for iterates over an iterable (list, string, range, dict), binding each element in turn; range(n) yields 0..n-1, and enumerate(xs) yields (index, item) pairs when you need both. while re-tests its condition before every pass and requires the body to make progress toward falsity — forgetting i += 1 is the classic infinite loop. Nested loops multiply: an n-lap loop inside an n-lap loop does n² iterations, which is precisely where the O(n²) of bubble sort comes from and why lesson m0l9 will make you count. Accumulator pattern: initialise before the loop (total = 0), update inside, use after.',
        q: { q: 'How many times does the inner body run? for i in range(4): for j in range(3): body()', o: ['7 — four plus three', '12 — four times three', '4 — the outer count wins'], x: 1, w: 'Every one of the 4 outer laps runs the full 3 inner laps: 4 × 3 = 12. Nested loops MULTIPLY — hold onto that; it is the whole story of O(n²).' },
        ap: [
          'Prefer `for item in items:` over `for i in range(len(items)):` — iterate over things, not indexes, unless you truly need the index (then use enumerate).',
          'Every while loop needs a visible "progress line" that moves it toward stopping. If you cannot point at it, you have written an infinite loop.',
          'Do not mutate a list while looping over it — you will skip elements. Loop over a copy, or build a new list.',
          'If a loop body exceeds ~10 lines, extract it into a function. Loops should read like "for each order, process(order)".'
        ],
        use: [
          'Every feed you scroll, table you render and file you parse is a for loop over items.',
          'Game engines are one big while loop — while running: read input, update world, draw frame — sixty laps a second.',
          'The difference between the O(n) and O(n²) curves you will meet in Module 4 is literally one loop versus a loop inside a loop.'
        ],
        py: 'total = 0\nfor price in [4, 7, 2]:      # known laps\n    total += price\nprint(total)                  # 13\n\nn = 1\nwhile n < 100:                # unknown laps\n    n = n * 2\nprint(n)                      # 128\n\nfor i, ch in enumerate("abc"):\n    print(i, ch)              # 0 a / 1 b / 2 c' },

      { id: 'm0l7', t: 'Functions & Scope', a: 'A vending machine with a private kitchen', v: 'funcstack',
        e: 'A function is a vending machine: you put coins in the slot (arguments), something happens inside that you cannot see, and a snack drops out (the return value). Write the recipe once, press the button a thousand times. Scope is the machine\'s private kitchen: variables created inside the function live ONLY inside it — the kitchen\'s mess never leaks into the shop, and two machines can both have a bowl called "mix" without fighting. When a function runs, the machine goes onto a stack of "machines currently working"; when it returns, it is lifted off and its whole kitchen is thrown away. That stack of working machines is the call stack — remember the tray-pile stack from Module 2? Same object. And a machine that presses its own button is recursion, waiting for you at the end of Module 3.',
        k: 'def name(params): binds a reusable code object; calling it pushes a stack frame holding its local bindings, and return pops the frame and hands back a value (None if omitted). Scope follows LEGB — Local, Enclosing, Global, Built-in: a name is resolved in the innermost scope that defines it, and assignment inside a function creates a LOCAL unless declared global/nonlocal. Parameters are passed by object reference: rebinding a parameter does nothing outside, but MUTATING a passed list is visible to the caller. One landmark bug: mutable default arguments (def f(x, acc=[])) share ONE list across all calls — default to None instead.',
        q: { q: 'x = 10. def f(): x = 5. Call f(). What is x now, outside?', o: ['5 — the function changed it', '10 — the function made its own local x', 'Error — x is defined twice'], x: 1, w: 'Assignment inside a function creates a fresh LOCAL variable that shadows the outer one and dies when the call ends. The global x never moved. That isolation is the whole point of scope.' },
        ap: [
          'One function, one job, named as a verb phrase: parse_header(), send_receipt(). If you need "and" to describe it, split it.',
          'Return values; do not print inside computation functions — the caller decides presentation. This single habit makes code testable.',
          'Keep functions under ~20 lines and parameters under ~4; past that, you are smuggling a whole program through a letterbox.',
          'Never use a mutable default argument. def f(items=None): items = items or [] is the standard escape.'
        ],
        use: [
          'Every API endpoint is a function: request in, response out — scope keeps ten thousand simultaneous requests from trampling each other.',
          'The call stack you will visualise in "Dolls inside dolls" (Module 3, recursion) is exactly this mechanism — and stack overflow is what happens when it grows without returning.',
          'Libraries are boxes of functions someone else wrote: you press buttons; kitchens stay closed.'
        ],
        py: 'def price_with_tax(price, rate=0.08):\n    tax = price * rate          # local: dies at return\n    return price + tax\n\ntotal = price_with_tax(10.0)    # 10.8\nprint(total)\n# print(tax)  # NameError — the kitchen is gone' },

      { id: 'm0l8', t: 'Reading a Program', a: 'Being the machine for one minute', v: 'tracerun',
        e: 'Here is the skill that separates people who can read code from people who can only recognise it: tracing. Take a five-line program, become the machine, and track every box on paper — line by line, no skipping, no "yeah I get the idea". When a loop runs, you write the variables again EVERY lap. It feels slow, like sounding out words. It is also exactly how you will debug for the rest of your life, because bugs live in the gap between what you think a line does and what it actually does. This lesson is pure practice: watch the trace, then predict what each next line does to the boxes before it happens.',
        k: 'Tracing is manual execution: maintain a table of variable → value, apply one statement at a time, and record the output exactly. Discipline points: evaluate the right-hand side fully before assigning; on a loop, re-enter the condition check each iteration and write the new bindings; on a function call, open a fresh column for its locals and close it at return. This is precisely what a debugger automates (breakpoints, step-over, watch), and what print-debugging approximates. The trace table is also how you verify algorithm correctness by hand before trusting code — you will trace binary search\'s lo/mid/hi in Module 3 the same way.',
        q: { q: 'a = 3; b = a; a = a + 1. Final values?', o: ['a=4, b=4 — b follows a', 'a=4, b=3 — b copied the value at that moment', 'a=3, b=3 — assignment does not change a'], x: 1, w: 'b = a copies the VALUE 3 into b at that instant; the later change to a does not reach back. (Mutable objects like lists behave differently — both names would point at one list — and that distinction will matter constantly.)' },
        ap: [
          'When code confuses you, stop reading and start tracing. Thirty seconds of table beats ten minutes of squinting.',
          'Trace with real small inputs — n=3, not n=1000000. Edge cases first: empty list, single element, duplicates.',
          'print(f"{i=} {total=}") sprinkled in a loop is a poor man\'s trace table and completely legitimate debugging.',
          'Learn your debugger\'s three keys — breakpoint, step over, step into — and you will stop fearing other people\'s code.'
        ],
        use: [
          'Code review is tracing at speed: seniors approve pull requests by mentally executing the diff.',
          'Every debugging session in your career is a trace of the gap between intended and actual behaviour.',
          'Technical interviews explicitly test this: "what does this print?" questions are trace tables under time pressure.'
        ],
        py: 'total = 0\nfor n in [3, 1, 4]:\n    if n % 2 == 1:      # odd?\n        total += n\n    print(n, total)      # trace line\n# 3 3\n# 1 4\n# 4 4\nprint("final:", total)   # final: 4' },

      { id: 'm0l9', t: 'Counting Steps', a: 'Two chefs, one wedding', v: 'stepcount',
        e: 'Two chefs both cook a perfect dinner for four. Chef A preps each guest\'s plate separately: 4 guests, 4 rounds of work. Chef B insists on personally introducing every plate to every other plate: 4 plates but 16 comparisons. At a dinner party nobody notices the difference. At a 500-guest wedding, Chef A does 500 units of work — Chef B does 250,000 and the kitchen is on fire. The lesson: do not ask "is my code fast on my laptop today?" — ask "what happens to the step count when the input gets 100 times bigger?" A single loop grows politely with the guest list. A loop INSIDE a loop grows with its square. You now know enough to smell slow code from across the room; Module 4 will give the smell its proper name: Big O.',
        k: 'Runtime scales with input size n, and the growth SHAPE matters more than the constant: one pass over n items does c·n work (linear); comparing all pairs does ~n²/2 (quadratic); halving the search space each step does log₂(n) (logarithmic — 1,000,000 items in 20 steps). Count steps by counting loops: sequential loops add (still linear); nested loops over the same input multiply (quadratic). This is a preview, not the formalism — Module 4 defines Big O properly, proves the sorting floor, and adds space complexity. For now, one habit: every time you write a loop inside a loop, hear a quiet alarm.',
        q: { q: 'A function checks every pair of users for duplicate emails among n users. Roughly how does its work grow?', o: ['Linearly — double the users, double the work', 'Quadratically — double the users, four times the work', 'It depends on the computer'], x: 1, w: 'All-pairs means n·(n-1)/2 comparisons — quadratic. Doubling n quadruples the pairs. (A hash set does the same job in one linear pass; that is why Module 2 matters.)' },
        ap: [
          'Before optimising anything, count the loops. The nested one over the same collection is almost always the culprit.',
          'A loop that calls a function which ITSELF loops over the data is a hidden nested loop — `if x in my_list` inside a for is O(n²) wearing a disguise.',
          'Small n forgives everything; production n forgives nothing. Test with 10,000 items before shipping, not 10.',
          'The usual escape from n² is a hash set/map (Module 2) or sorting first (Module 3) — trading a nested scan for O(n) lookups or one O(n log n) sort.'
        ],
        use: [
          'The "app freezes when the list gets long" bug report is almost always an accidental n² loop.',
          'Databases exist largely to avoid linear scans: an index turns "check every row" into "walk a tree" — log n.',
          'Capacity planning — "will this survive 10× the users?" — is step-counting with a budget attached.'
        ],
        py: '# Chef A — one pass: n steps\nfor guest in guests:\n    prep(guest)\n\n# Chef B — all pairs: ~n*n/2 steps. Alarm bells!\nfor a in guests:\n    for b in guests:\n        if a != b and a.email == b.email:\n            print("duplicate!")\n\n# The escape (Module 2 preview): one pass + a set\nseen = set()\nfor g in guests:\n    if g.email in seen: print("duplicate!")\n    seen.add(g.email)' },
    ],
  },
];
