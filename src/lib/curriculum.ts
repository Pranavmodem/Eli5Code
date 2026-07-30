export type VisualizerKey =
  | "blueprint"
  | "objects"
  | "capsule"
  | "inheritance"
  | "polymorphism"
  | "abstraction"
  | "array"
  | "linked-list"
  | "stack-queue"
  | "tree"
  | "hash-map"
  | "bubble-sort"
  | "merge-sort"
  | "quick-sort"
  | "binary-search"
  | "bfs"
  | "dfs"
  | "big-o"
  | "memory"
  | null;

export interface Lesson {
  id: string;
  title: string;
  analogy: string;
  emoji: string;
  days: [number, number]; // inclusive day range in the 60-day plan
  eli5: string[];
  tech: string[];
  visualizer: VisualizerKey;
}

export interface Module {
  id: string;
  order: number;
  title: string;
  tagline: string;
  emoji: string;
  color: string; // tailwind text color accent
  lessons: Lesson[];
}

export const HOURS_PER_DAY = 2;
export const TOTAL_DAYS = 60;
export const MILESTONES = [
  { day: 30, strength: 80, label: "Day 30 — 80% coding strength" },
  { day: 60, strength: 90, label: "Day 60 — 90% coding strength" },
];

export const modules: Module[] = [
  {
    id: "oop",
    order: 1,
    title: "Object-Oriented Programming",
    tagline: "Blueprints, houses, genetics & multi-tools",
    emoji: "🏗️",
    color: "text-neon",
    lessons: [
      {
        id: "classes-blueprints",
        title: "Classes are Blueprints",
        analogy: "A class is an architect's blueprint — a plan, not a building.",
        emoji: "📐",
        days: [1, 2],
        eli5: [
          "Imagine an architect draws a blueprint for a house. The blueprint says: \"every house built from me will have 2 doors, 4 windows, and a red roof.\" But you can't live inside a blueprint! It's just the plan. A class is exactly that: a drawing that describes what something WILL look like when you build it.",
          "The blueprint also lists things the house can DO: open the garage, ring the doorbell. In code, those are called methods — the actions written on the plan. One blueprint, and you can build a whole neighborhood from it.",
        ],
        tech: [
          "A class is a user-defined type that bundles state (fields/properties) and behavior (methods) into a single unit. It defines the shape of data and the operations permitted on that data, but allocates no memory for instance data by itself.",
          "class House { constructor(color) { this.color = color; } ringDoorbell() { ... } } — the class declares members and a constructor, which runs at instantiation time to initialize per-instance state.",
        ],
        visualizer: "blueprint",
      },
      {
        id: "objects-houses",
        title: "Objects are Houses",
        analogy: "Objects are the actual houses built from the blueprint.",
        emoji: "🏠",
        days: [3, 4],
        eli5: [
          "Now the builders arrive. Using ONE blueprint, they build three houses: a blue one on Oak Street, a green one on Elm Street, and a red one downtown. Each house is real — you can knock on its door. Each is an object: a real thing built from the class.",
          "Every house came from the same plan, but each has its own paint color and its own address. If you paint one house purple, the others don't change. Objects share the plan but keep their own stuff.",
        ],
        tech: [
          "An object is an instance of a class: memory allocated at runtime holding that instance's field values, with methods dispatched through the class. `new House(\"blue\")` invokes the constructor and returns a reference to the new instance.",
          "Instances are independent: mutating `houseA.color` never affects `houseB.color`. Identity (the reference) is distinct from equality (comparing field values) — two houses can look identical yet be different objects in memory.",
        ],
        visualizer: "objects",
      },
      {
        id: "encapsulation-capsule",
        title: "Encapsulation is a Pill Capsule",
        analogy: "The medicine works without you touching what's inside.",
        emoji: "💊",
        days: [5, 6],
        eli5: [
          "A pill capsule hides the medicine inside a smooth shell. You swallow it — you never open it up and touch the powder. That's encapsulation: the object hides its inner parts and only gives you safe buttons to press.",
          "Think of a vending machine: you press B4, a snack drops out. You don't reach inside the motors. If the machine let everyone grab the wires, it would break in a day. Hiding the insides keeps things safe.",
        ],
        tech: [
          "Encapsulation restricts direct access to an object's internal state, exposing behavior through a controlled public interface. Fields are marked private; reads/writes go through getters, setters, or intent-revealing methods that can validate invariants.",
          "Benefits: invariants can't be violated from outside (e.g. balance can never go negative if `withdraw()` checks it), and internals can be refactored freely as long as the public API is stable.",
        ],
        visualizer: "capsule",
      },
      {
        id: "inheritance-genetics",
        title: "Inheritance is Genetics",
        analogy: "Kids get their parents' traits — then add their own.",
        emoji: "🧬",
        days: [7, 8],
        eli5: [
          "You got your eye color from your parents without asking for it — it came free with being their kid. Inheritance in code is the same: a child class automatically gets everything its parent class has.",
          "A `Dog` inherits from `Animal`, so it can eat and sleep like every animal — for free. Then it adds its own trick: barking. The child doesn't rewrite the family traits; it just adds new ones on top.",
        ],
        tech: [
          "Inheritance lets a subclass acquire the fields and methods of a superclass, forming an is-a relationship. `class Dog extends Animal` — Dog receives Animal's interface and implementation, and may add members or override methods.",
          "Overriding replaces an inherited method with a specialized version; `super` calls the parent implementation. Prefer shallow hierarchies — deep inheritance chains couple code tightly, which is why composition is often favored.",
        ],
        visualizer: "inheritance",
      },
      {
        id: "polymorphism-multitool",
        title: "Polymorphism is a Multi-tool",
        analogy: "One handle, many blades — same grip, different behavior.",
        emoji: "🛠️",
        days: [9, 10],
        eli5: [
          "A Swiss Army knife has ONE handle, but flip it around and it's a knife, scissors, or a bottle opener. You hold it the same way every time; what it does depends on which tool is out. Polymorphism means \"many shapes\": one command, many behaviors.",
          "Tell every animal in the zoo to \"speak\". The dog barks, the cat meows, the duck quacks. You gave one order — each animal answered its own way. You don't need to know which animal it is to ask.",
        ],
        tech: [
          "Polymorphism lets code call a method on a supertype reference while the runtime dispatches to the subtype's override. `animals.forEach(a => a.speak())` executes Dog.speak or Cat.speak per element — this is dynamic (late) binding.",
          "This enables the Open/Closed Principle: adding `class Duck extends Animal` requires zero changes to the loop. Interfaces/duck-typing achieve the same decoupling without shared implementation.",
        ],
        visualizer: "polymorphism",
      },
      {
        id: "abstraction-dashboard",
        title: "Abstraction is a Car Dashboard",
        analogy: "Steering wheel and pedals — not pistons and spark plugs.",
        emoji: "🚗",
        days: [11, 12],
        eli5: [
          "To drive a car you use a wheel and two pedals. You do NOT need to know how fuel explodes inside the engine. The dashboard is a simple face on top of a very complicated machine — that's abstraction: showing only what matters.",
          "Good code does this everywhere. A `sendEmail()` button hides servers, protocols, and retries. You press \"send\"; the machinery stays under the hood.",
        ],
        tech: [
          "Abstraction reduces complexity by exposing essential operations and hiding implementation detail behind an interface or abstract class. Callers program against the contract (`Payment.charge()`), not the concrete mechanics (Stripe vs PayPal).",
          "Abstract classes declare methods without bodies that subclasses must implement, letting you define a stable contract while implementations vary and evolve independently.",
        ],
        visualizer: "abstraction",
      },
    ],
  },
  {
    id: "data-structures",
    order: 2,
    title: "Data Structures Visualized",
    tagline: "Bookshelves, treasure hunts, cafeterias & org charts",
    emoji: "🗂️",
    color: "text-neon-purple",
    lessons: [
      {
        id: "arrays-bookshelves",
        title: "Arrays are Bookshelves",
        analogy: "Numbered slots on one shelf — jump straight to slot 7.",
        emoji: "📚",
        days: [13, 16],
        eli5: [
          "An array is a bookshelf with numbered slots: 0, 1, 2, 3... If someone says \"grab the book in slot 7\", you walk straight there — instant. You never search; the slot number takes you right to it.",
          "But here's the catch: the shelf slots are glued together. If you want to squeeze a new book into slot 2, you must shove EVERY book after it one slot to the right. Reading is fast; inserting in the middle is a workout.",
        ],
        tech: [
          "An array stores elements in one contiguous memory block. Index access is O(1): address = base + index × elementSize — pure arithmetic, no traversal.",
          "Insertion/deletion at index i is O(n) because subsequent elements must shift. Dynamic arrays (JS arrays, Python lists) resize by allocating a larger block and copying, giving amortized O(1) appends.",
        ],
        visualizer: "array",
      },
      {
        id: "linked-lists-treasure",
        title: "Linked Lists are Treasure Hunts",
        analogy: "Each clue points to the next clue's location.",
        emoji: "🗺️",
        days: [17, 20],
        eli5: [
          "A treasure hunt starts with one clue. That clue tells you where the NEXT clue is hidden, which points to the next, until the final clue says \"STOP — treasure here!\" A linked list works exactly like this: each node holds a value and directions to the next node.",
          "Want the 5th clue? Sorry — you MUST follow clues 1→2→3→4 first. No jumping ahead. But adding a new clue at the start is instant: write one clue pointing to the old first clue. Watch it happen in the visualizer below!",
        ],
        tech: [
          "A singly linked list is a chain of nodes: { value, next }. The list keeps a head pointer; the final node's next is null. Nodes live anywhere in memory — no contiguity requirement.",
          "Access by index is O(n) (sequential traversal), but insertion at the head is O(1): newNode.next = head; head = newNode. Doubly linked lists add prev pointers, enabling O(1) removal given a node reference.",
        ],
        visualizer: "linked-list",
      },
      {
        id: "stacks-queues-cafeteria",
        title: "Stacks & Queues are Cafeterias",
        analogy: "Plate stacks (last in, first out) vs lunch lines (first in, first out).",
        emoji: "🍽️",
        days: [21, 24],
        eli5: [
          "In a cafeteria, clean plates get stacked. Which plate do you grab? The TOP one — the last plate added is the first one taken. That's a Stack: Last In, First Out (LIFO).",
          "Now look at the lunch line. The kid who lined up FIRST gets served first; newcomers join the back. That's a Queue: First In, First Out (FIFO). Try both in the visualizer — push plates, serve students.",
        ],
        tech: [
          "Stack: push and pop operate on one end (the top), both O(1). Used for undo history, the call stack, DFS, and expression parsing.",
          "Queue: enqueue at the tail, dequeue at the head, both O(1) with a linked list or circular buffer. Used for task schedulers, BFS, and message/print queues.",
        ],
        visualizer: "stack-queue",
      },
      {
        id: "trees-org-charts",
        title: "Trees are Org Charts",
        analogy: "One CEO on top, managers below, employees below them.",
        emoji: "🌳",
        days: [25, 28],
        eli5: [
          "A company org chart has one CEO at the top. Managers report to the CEO, and employees report to managers. Everyone (except the CEO) has exactly ONE boss. That's a tree: the CEO is the root, and people with nobody under them are leaves.",
          "Why bother? Finding someone is fast. \"Who handles refunds?\" → ask the CEO → Support VP → Refunds manager. Three questions instead of interviewing all 1,000 employees. Each step cuts the search area massively.",
        ],
        tech: [
          "A tree is a connected acyclic hierarchy: each node has one parent (except the root) and zero or more children. Binary trees cap children at two; Binary Search Trees order them (left < node < right).",
          "BST search/insert/delete run in O(log n) when balanced — each comparison discards half the tree. Unbalanced trees degrade to O(n), which is why self-balancing variants (AVL, Red-Black) exist.",
        ],
        visualizer: "tree",
      },
      {
        id: "hashmaps-dictionaries",
        title: "Hash Maps are Dictionaries",
        analogy: "\"Zebra\" is under Z — you never scan from page 1.",
        emoji: "📖",
        days: [29, 32],
        eli5: [
          "To find \"zebra\" in a dictionary, you don't read from page 1 — you jump straight to the Z section. The word itself TELLS you where it lives. A hash map does this with math: it turns any key into a slot number instantly.",
          "Sometimes two words want the same slot (a \"collision\") — like two coats on one hook. Fine: hang both on the hook and glance through them. As long as no hook gets overloaded, lookups stay lightning fast.",
        ],
        tech: [
          "A hash map applies a hash function to a key to compute a bucket index: index = hash(key) % capacity. Average-case get/set/delete are O(1).",
          "Collisions are handled by chaining (bucket holds a list) or open addressing (probe for the next free slot). When the load factor exceeds a threshold (~0.75), the table resizes and rehashes to keep buckets short.",
        ],
        visualizer: "hash-map",
      },
    ],
  },
  {
    id: "algorithms",
    order: 3,
    title: "Algorithms in Motion",
    tagline: "Watch sorting, searching & traversals frame-by-frame",
    emoji: "⚡",
    color: "text-neon-green",
    lessons: [
      {
        id: "bubble-sort",
        title: "Bubble Sort",
        analogy: "The biggest bubble floats to the top, one comparison at a time.",
        emoji: "🫧",
        days: [33, 35],
        eli5: [
          "Line up kids by height, but with one rule: you may only compare TWO neighbors at a time. If the left kid is taller, they swap places. Walk down the line doing this and the tallest kid \"bubbles\" all the way to the end — guaranteed.",
          "Then you walk the line again for the second-tallest, and again, until nobody needs to swap. It's simple and honest, but slow for big groups — you'll see WHY when you watch the visualizer count its steps.",
        ],
        tech: [
          "Bubble sort makes repeated passes, comparing adjacent pairs and swapping when out of order. After pass k, the k largest elements occupy their final positions at the end.",
          "Time: O(n²) average/worst, O(n) best (already sorted, with an early-exit flag when a pass makes no swaps). Space: O(1), in-place. Stable. Educational value: high. Production value: almost none.",
        ],
        visualizer: "bubble-sort",
      },
      {
        id: "merge-sort",
        title: "Merge Sort",
        analogy: "Sort two half-decks separately, then riffle them together.",
        emoji: "🃏",
        days: [36, 38],
        eli5: [
          "Sorting 100 cards is hard. Sorting 1 card is automatic — it's already sorted! Merge sort splits the deck in half, splits again and again until every pile is a single card, then merges piles back together in order.",
          "Merging two sorted piles is easy: compare the top card of each, take the smaller, repeat. The magic is that splitting takes few steps (halving gets small FAST) and every merge is a simple walk-through.",
        ],
        tech: [
          "Merge sort is divide-and-conquer: recursively sort each half, then merge the two sorted halves with a two-pointer linear pass.",
          "Time: O(n log n) in ALL cases — log n levels of splitting, O(n) merge work per level. Space: O(n) auxiliary for the merge buffer. Stable, and the standard choice for sorting linked lists and external (on-disk) data.",
        ],
        visualizer: "merge-sort",
      },
      {
        id: "quick-sort",
        title: "Quick Sort",
        analogy: "Pick a captain; shorter kids left, taller kids right. Repeat.",
        emoji: "🎯",
        days: [39, 41],
        eli5: [
          "Pick one kid as the \"captain\" (the pivot). Everyone shorter stands left; everyone taller stands right. The captain is now in their PERFECT final spot — nobody will ever move them again.",
          "Now repeat the trick in the left group and the right group, with new captains, until every group has one kid. Danger: if you keep unluckily picking the tallest kid as captain, nothing splits and it turns slow — that's why good implementations pick captains randomly.",
        ],
        tech: [
          "Quicksort partitions around a pivot so smaller elements precede it and larger follow, placing the pivot at its final index, then recurses on both sides.",
          "Time: O(n log n) average, O(n²) worst (adversarial pivots, e.g. sorted input with first-element pivot — mitigated by random/median-of-three selection). Space: O(log n) recursion. In-place and cache-friendly, which is why it wins in practice.",
        ],
        visualizer: "quick-sort",
      },
      {
        id: "binary-search",
        title: "Binary Search",
        analogy: "The \"higher or lower\" number guessing game.",
        emoji: "🔍",
        days: [42, 44],
        eli5: [
          "I'm thinking of a number from 1 to 100. You guess 50. \"Higher!\" — boom, you just deleted the entire bottom half with one guess. Guess 75. \"Lower!\" — another 25 numbers gone. You'll corner any number in 7 guesses, max.",
          "That's binary search: always guess the MIDDLE, keep the half that can contain the answer, throw the rest away. The only rule: the list must already be sorted, or \"higher/lower\" means nothing. Watch the visualizer shrink the search zone below.",
        ],
        tech: [
          "Binary search maintains lo/hi bounds on a sorted array: probe mid = lo + ((hi − lo) >> 1); on mismatch discard the impossible half by moving lo or hi. Loop until found or lo > hi.",
          "Time: O(log n) — 1,000,000 elements need at most 20 probes. Classic pitfalls: (lo+hi)/2 integer overflow in fixed-width languages, and off-by-one boundary errors (use lo <= hi with hi = mid − 1 / lo = mid + 1).",
        ],
        visualizer: "binary-search",
      },
      {
        id: "bfs-ripples",
        title: "Breadth-First Search (BFS)",
        analogy: "Ripples in a pond — spread outward ring by ring.",
        emoji: "🌊",
        days: [45, 47],
        eli5: [
          "Drop a stone in a pond: ripples spread out in perfect rings — everything 1 meter away gets wet first, then 2 meters, then 3. BFS explores a network the same way: your friends first, then friends-of-friends, then THEIR friends.",
          "Because it sweeps level by level, the FIRST time BFS reaches something, it got there by the shortest possible path. That's why maps and \"degrees of separation\" features love it.",
        ],
        tech: [
          "BFS explores a graph level-by-level using a queue: dequeue a node, enqueue its unvisited neighbors, mark visited on enqueue (to avoid duplicates). Layers correspond to distance from the source.",
          "Time: O(V + E); space: O(V) for the queue and visited set. Guarantees shortest paths in unweighted graphs. The queue is what enforces \"finish this ring before starting the next\".",
        ],
        visualizer: "bfs",
      },
      {
        id: "dfs-maze",
        title: "Depth-First Search (DFS)",
        analogy: "Solving a maze: go deep, hit a wall, backtrack.",
        emoji: "🧗",
        days: [48, 50],
        eli5: [
          "In a corn maze you pick a path and follow it as DEEP as it goes. Dead end? Walk back to the last fork and try the next branch. You're not exploring ring-by-ring like BFS — you're committing to one route at a time.",
          "Drop a breadcrumb at every fork so you never repeat a path. That breadcrumb trail is exactly what programmers call \"the stack\" — it remembers the way back.",
        ],
        tech: [
          "DFS explores as far as possible along each branch before backtracking, via recursion (the call stack) or an explicit stack. Mark nodes visited to handle cycles.",
          "Time: O(V + E); space: O(V) worst-case stack depth. Does NOT find shortest paths, but underpins topological sort, cycle detection, connected components, and backtracking solvers (sudoku, N-queens).",
        ],
        visualizer: "dfs",
      },
    ],
  },
  {
    id: "big-o",
    order: 4,
    title: "Time & Space Complexity",
    tagline: "See how systems slow down as data grows",
    emoji: "📈",
    color: "text-neon-amber",
    lessons: [
      {
        id: "big-o-intro",
        title: "What is Big O?",
        analogy: "Not \"how fast today\" — \"how much slower with 10× the work\".",
        emoji: "⏱️",
        days: [51, 53],
        eli5: [
          "Two pizza shops both make one pizza in 10 minutes. Now order 100 pizzas. Shop A has one oven: 1,000 minutes. Shop B adds ovens as orders grow: still ~10 minutes. Big O ignores today's speed and asks the only question that matters at scale: what happens when the order gets HUGE?",
          "That's why programmers don't brag \"my code ran in 3ms.\" They ask \"what happens at a million users?\" Big O is the language for that answer. Drag the slider in the chart below and watch the curves separate.",
        ],
        tech: [
          "Big O notation bounds an algorithm's growth rate as input size n → ∞, ignoring constant factors and lower-order terms: 3n² + 50n + 9000 is O(n²), because n² dominates asymptotically.",
          "We typically state worst-case time complexity, and separately space complexity for auxiliary memory. Constants matter in practice for small n — an O(n²) algorithm can beat O(n log n) on 20 elements — but growth rate always wins eventually.",
        ],
        visualizer: "big-o",
      },
      {
        id: "o1-vs-on-vs-on2",
        title: "O(1) vs O(n) vs O(n²)",
        analogy: "Grab one book vs read every title vs compare every pair.",
        emoji: "🚦",
        days: [54, 56],
        eli5: [
          "O(1) — \"grab the book from slot 7\": same speed whether the shelf holds 10 books or 10 million. O(n) — \"read every title to find the red one\": double the books, double the time. Fair enough.",
          "O(n²) — \"compare every book with every other book\": 10 books = 100 comparisons, but 1,000 books = 1,000,000 comparisons. This is the curve that quietly destroys apps: fine in the demo, frozen in production. It's exactly why bubble sort chokes and merge sort doesn't.",
        ],
        tech: [
          "O(1): hash lookups, array indexing, stack push/pop. O(log n): binary search, balanced-BST ops. O(n): single pass. O(n log n): efficient comparison sorts — the proven lower bound. O(n²): nested loops over the same input.",
          "Spot it in code: one loop over n → O(n); two nested loops → O(n²); halving each step → O(log n). Sequential phases add (take the max); nested work multiplies.",
        ],
        visualizer: "big-o",
      },
      {
        id: "space-complexity",
        title: "Space Complexity",
        analogy: "Solving a puzzle on a desk vs needing a warehouse.",
        emoji: "🧠",
        days: [57, 58],
        eli5: [
          "Some people solve a jigsaw puzzle on the dining table (small workspace). Others spread pieces across three rooms. Both finish — one needed WAY more space. Space complexity measures the extra desk-room your algorithm needs, not just its time.",
          "There's often a trade: remember answers you've already computed (more space) so you never re-compute them (less time). That trick — caching — is half of what makes big websites fast.",
        ],
        tech: [
          "Space complexity counts auxiliary memory as a function of n, excluding the input itself. In-place bubble sort: O(1). Merge sort's buffer: O(n). Recursion counts stack frames: naive Fibonacci is O(n) deep.",
          "The time-space trade-off is fundamental: memoization turns exponential O(2ⁿ) recursion into O(n) time at the cost of an O(n) table. Interviewers routinely accept extra space to buy speed — say the trade aloud.",
        ],
        visualizer: "memory",
      },
      {
        id: "optimizing-systems",
        title: "Building Efficient Systems",
        analogy: "Don't polish the doorknob while the foundation is cracked.",
        emoji: "🏆",
        days: [59, 60],
        eli5: [
          "If your morning routine takes 60 minutes and 40 of them are \"finding your keys\", buy a key hook — don't brush your teeth faster. Optimizing means finding the ONE slowest part (the bottleneck) and fixing that first. Everything else is polishing doorknobs.",
          "The pro recipe: make it work → measure where it's slow → swap the bad structure or algorithm (list scan → hash map, bubble → merge) → measure again. You now have every tool from all four modules. That's the hero part of zero-to-hero. 🎓",
        ],
        tech: [
          "Optimization workflow: profile first (never guess), find the dominant term, then reduce it — replace O(n) membership scans with O(1) hash sets, O(n²) sorts with O(n log n), repeated computation with memoization, and deep copies with references.",
          "System-level levers follow the same math: indexes turn O(n) table scans into O(log n) B-tree seeks; caches trade space for time; batching amortizes fixed costs. Big O is the shared vocabulary across all of it.",
        ],
        visualizer: "big-o",
      },
    ],
  },
];

export const allLessons: Lesson[] = modules.flatMap((m) => m.lessons);

export function getModule(moduleId: string): Module | undefined {
  return modules.find((m) => m.id === moduleId);
}

export function getLesson(moduleId: string, lessonId: string) {
  const mod = getModule(moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  return mod && lesson ? { module: mod, lesson } : undefined;
}

export function lessonForDay(day: number): { module: Module; lesson: Lesson } | undefined {
  for (const m of modules) {
    for (const l of m.lessons) {
      if (day >= l.days[0] && day <= l.days[1]) return { module: m, lesson: l };
    }
  }
  return undefined;
}

/** Next lesson after the given one, across module boundaries. */
export function nextLesson(moduleId: string, lessonId: string) {
  const flat = modules.flatMap((m) => m.lessons.map((l) => ({ module: m, lesson: l })));
  const idx = flat.findIndex((e) => e.module.id === moduleId && e.lesson.id === lessonId);
  return idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : undefined;
}
