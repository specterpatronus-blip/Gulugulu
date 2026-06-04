# Lessons Learned - Minigame Stability & Reactivity

## 1. Vue.js Rendering & Out of Bounds Reactive State
- **Problem**: When a reactive state index variable (`idx`) is used in the template (e.g. `g3.data[g3.idx].angle`), incrementing `idx` beyond the bounds of the array immediately triggers a re-render in Vue. If `g3.data[idx]` evaluates to `undefined`, Vue throws an uncatchable `TypeError` when reading properties on it, freezing the rendering tree.
- **Solution**: Avoid incrementing index counters beyond the array boundaries. Instead, detect if the index is on the last element (`idx === data.length - 1`), trigger the win sequence (`win()`), and leave the index unchanged.

## 2. Purgation of Unused Libraries / Global Namespaces
- **Problem**: When removing scripts from templates (like `confetti.browser.min.js` to optimize page size or frame rates), any residual references in JavaScript files (like calling `confetti({...})`) will throw a `ReferenceError`. Because this error occurs synchronously inside game win/loss handlers, it prevents succeeding statements (like setting `gameWon.value = true`) from executing.
- **Solution**: Always perform a project-wide search (`grep_search`) for any references to deleted libraries to clean up their API invocations. Alternatively, wrap external library calls in protective checks (e.g., `typeof confetti !== 'undefined'`).

## 3. Mathematical Consistency & Curricular Grounding
- **Problem**: Generating quiz questions programmatically can result in invalid scenarios (e.g., triangles violating the Triangle Inequality Theorem), ambiguous/duplicate answers (e.g., multiple equivalent fractions generated as distractors), or age-inappropriate challenges (e.g., exponentiation in early primary school).
- **Solution**:
  - Always validate random math generators against geometric theorems (like $a + b > c$).
  - Filter and check distractors dynamically (e.g., cross-multiplying $a \cdot d \neq b \cdot c$ to verify non-equivalence in fractions).
  - Align task vocabulary and complexity strictly with curriculum standards (e.g., DBA Colombia).

## 4. Centering the Research Problem on Internet Disconnection
- **Problem**: Over-emphasizing geographical terrain and physical difficulties of terrain/installation in presentation materials (like slide decks) dilutes the primary scientific problem statement. The core academic issue is the absolute lack of internet connection and how it impacts access to digital knowledge and classroom equality.
- **Solution**: Keep the problem statement focused strictly on internet disconnection as the primary variable. Present topography only as a minor physical context, while focusing the problem slides on the immediate educational consequences of having no internet access.

## 5. SQLite FTS5 Column Weights & Unindexed Shifts
- **Problem**: In SQLite FTS5, columns marked as `UNINDEXED` do not receive weights in the `bm25()` ranking function. The weight arguments in `bm25(fts_table, w0, w1, ...)` map sequentially in order of the *indexed* columns only. Incorrectly including a weight for an `UNINDEXED` column shifts the parameters, assigning a weight of `0.0` to the actual first indexed column (such as the title), which destroys text relevance ranking.
- **Solution**: Align the weight parameters passed to `bm25()` strictly with the *indexed* columns in the FTS5 table structure, completely skipping unindexed columns when mapping weights.


