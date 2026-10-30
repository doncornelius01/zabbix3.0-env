# Orbit calculator

A responsive, dependency-free scientific calculator with expression editing, scientific notation (`6.02e23`), radians-based trigonometry, logarithms, powers, percentages, calculation history, and session memory.

## Develop

Requires Python 3 and Node.js 18 or newer for tests. No dependency installation is needed.

```sh
npm start
```

The static server listens on port 3000. Run `npm test` for expression-engine tests.

## Controls

- Type an expression or use the keypad. Enter calculates; Escape clears.
- EXP inserts `e+` for scientific notation; SCI switches result formatting.
- MS stores the current expression's result; MR recalls memory; MC clears it. M+ and M− add or subtract the current expression's result from memory.
- ANS inserts the last successful answer. Click a history entry to restore it.
- Percent divides the preceding number by 100. Powers associate to the right; `-2^2` is `-4`.

Memory and history last for the current page session. Expressions are parsed locally without executing JavaScript. Google Fonts are optional; system fonts provide an offline fallback.
