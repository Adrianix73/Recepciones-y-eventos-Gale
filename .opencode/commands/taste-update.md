---
description: Extraer Preferencias
agent: build
---

Review the most recent messages in this conversation (my prompts and your responses) and look for **EXPLICIT** preferences that I have stated about how I want code to be written. Typical signals include:

* "always use X instead of Y"
* "rewrite this, I use [library/pattern]"
* "I don't want you to do X"
* "from now on, for Z use W"

Do **NOT** count one-off requests that are specific to a single case without implying a general rule (e.g., "use snake_case in this file" by itself does not count unless I say "always," "from now on," or something similar).

## Exact file format

```text
# Taste (Continuously Learned by [OpenCode][oc])

[oc]: https://opencode.ai/

# <Category>
- <preference in one line>. Confidence: <0.00-1.00>
```

* Categories (`# Package Manager`, `# API Framework`, `# Testing`, etc.) are **not** fixed—create them based on the actual topic of each preference. Use short, title-cased English names like the examples.
* Each preference must be **one line**, written in English, ending with `. Confidence: 0.XX`.
* Group new preferences under an existing category if appropriate; otherwise, create a new category at the end of the file.

## Confidence Rules

* A preference mentioned for the first time → `Confidence: 0.61`.
* If an equivalent line already exists and this session reinforces it, or I continue following it without correction → increase it by `0.03` (maximum `0.99`; never set it to `1.00`).
* If a new preference **CONTRADICTS** an existing one → replace the old line with the new one using `Confidence: 0.51` (0.10 points below the initial value of 0.61, because it arises from a contradiction and there is not yet enough confidence that it is the definitive pattern), and do not keep both.
* Never remove a line solely because it has a low confidence score; only replace it if it is contradicted.


## Steps

1. Read `@taste/taste.md` as it currently exists.
2. Extract new or reinforced preferences from this session.
3. Apply the Confidence rules above.
4. Rewrite the entire file, preserving the header (`# Taste...`, the `[oc]:` link) and all valid categories/preferences, updated as needed.
5. At the end, provide a brief summary in the chat (**NOT** inside `taste.md`) indicating:

   * Which lines are new.
   * Which lines had their confidence increased.
   * Which lines were replaced due to contradictions.

Do not add meta-analysis comments or explanations inside `taste.md`—only the header, categories, and preference lines.
