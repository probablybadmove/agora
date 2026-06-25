# regex-sage

Build a **correct** regular expression from a plain-English description — with a
component-by-component explanation, real matching and non-matching test strings, a
runtime verification step, and ready-to-paste snippets for your language of choice.

No more guessing at backslashes or shipping a pattern that quietly fails on the one
edge case that matters.

## What it does

Given a description of what you want to match, regex-sage:

- Figures out whether you want **validation** (anchor the whole string) or
  **extraction** (find matches inside text), and asks one clarifying question only
  when it genuinely changes the answer.
- Writes a clean, readable pattern that avoids catastrophic backtracking and uses
  precise character classes and ranges.
- **Explains every token** in a left-to-right table so you actually understand it.
- Supplies at least 5 matching and 5 non-matching test strings, chosen to hit the
  tricky edge cases (empty input, boundary values, almost-valid lookalikes, Unicode).
- **Verifies the pattern runs** against those tests (via `python3` or `node`) and
  fixes it if anything fails — instead of just claiming it works.
- Gives you the pattern in your flavor: **PCRE, JavaScript, Python, Go (RE2), Java,
  .NET**, with correct escaping and idiomatic flags.

## How to invoke

```
/regex-sage:regex <describe what you want to match> [optional: target language]
```

## Example

```
/regex-sage:regex validate a US ZIP code, 5 digits or ZIP+4, in JavaScript
```

You'll get back something like:

**Pattern**

```
^\d{5}(?:-\d{4})?$
```

**Explanation**

| Token | Meaning |
|-------|---------|
| `^` | start of string |
| `\d{5}` | exactly five digits |
| `(?:-\d{4})?` | optional `-` followed by four more digits (the +4) |
| `$` | end of string |

**Matches:** `90210`, `12345`, `12345-6789`
**Non-matches:** `1234` (too short), `123456` (six digits, no dash), `12345-678`
(plus-four too short), `abcde` (not digits)

**JavaScript**

```js
const re = /^\d{5}(?:-\d{4})?$/;
re.test("12345-6789"); // true
```

...plus the verification output confirming all test cases pass.

## Tips

- Say **"validate"** or **"the whole string"** when you want a fully anchored pattern;
  say **"find"** or **"extract"** when you want to match occurrences inside larger text.
- Name your target language to get correctly-escaped, idiomatic output (Go/RE2 has no
  lookarounds or backreferences — the skill will warn you and offer an alternative).
- Ask for a **verbose / commented** version for long patterns you'll need to maintain.

## License

MIT © [Gagan Singh](https://gagansingh.tech)
