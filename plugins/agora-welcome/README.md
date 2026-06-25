# agora-welcome

The welcome desk for the **Agora** marketplace. This meta-plugin explains what
Agora is, teaches you how to install plugins, and lists the available plugin
categories — so a brand-new user can go from "what is this?" to "installed and
using it" in one conversation.

## What it does

- Explains the Agora marketplace in plain language.
- Teaches the install flow: `/plugin install <name>@agora`.
- Lists the marketplace categories (Meta, Design, Data, Engineering, Docs &
  Content) and points you at representative plugins in each.
- Adapts to your question: ask about a single category or plugin and it answers
  narrowly instead of dumping everything.
- When run inside a checked-out Agora repo, it can read the real sibling plugin
  manifests so the list it shows is current rather than memorized.

## Install

```
/plugin marketplace add <owner>/agora
/plugin install agora-welcome@agora
```

## How to invoke

```
/agora-welcome:agora
```

You can pass an optional argument — a question, a category, or a plugin name:

```
/agora-welcome:agora
/agora-welcome:agora how do I install a plugin?
/agora-welcome:agora design
/agora-welcome:agora some-plugin-name
```

## Example

```
> /agora-welcome:agora data

Agora's **Data** category covers SQL authoring, dataset profiling, and analysis
QA. A couple you can install right now:

  /plugin install <data-plugin>@agora     # write & optimize SQL across dialects
  /plugin install <profiler-plugin>@agora  # profile a new table's shape & quality

Want me to install one? Just give me the name.
```

## License

MIT © [Gagan Singh](https://gagansingh.tech)
