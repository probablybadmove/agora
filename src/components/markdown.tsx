import { Fragment, type ReactNode } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { CodeBlock } from '@/components/code-block';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * A small, dependency-free Markdown renderer covering exactly what Agora's copy uses:
 * headings, paragraphs, fenced code blocks, bullet/numbered lists, and inline
 * **bold**, `code`, and [links](url).
 */
export function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  return (
    <View style={styles.doc}>
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </View>
  );
}

type Block =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'code'; code: string }
  | { kind: 'list'; ordered: boolean; items: string[] };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    // fenced code
    if (line.trim().startsWith('```')) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        buf.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push({ kind: 'code', code: buf.join('\n') });
      continue;
    }

    // heading
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      blocks.push({ kind: 'heading', level: h[1].length, text: h[2].trim() });
      i++;
      continue;
    }

    // list (consecutive bullets or numbers)
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, '').trim());
        i++;
      }
      blocks.push({ kind: 'list', ordered, items });
      continue;
    }

    // paragraph (join consecutive plain lines)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !/^(#{1,4})\s+/.test(lines[i]) &&
      !/^\s*([-*]|\d+\.)\s+/.test(lines[i])
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push({ kind: 'paragraph', text: para.join(' ') });
  }

  return blocks;
}

function Block({ block }: { block: Block }) {
  const theme = useTheme();

  switch (block.kind) {
    case 'code':
      return <CodeBlock code={block.code} />;
    case 'heading': {
      const type = block.level <= 1 ? 'title' : block.level === 2 ? 'heading' : 'subtitle';
      return (
        <ThemedText type={type} style={block.level >= 3 ? styles.h3 : styles.h2}>
          {block.text}
        </ThemedText>
      );
    }
    case 'list':
      return (
        <View style={styles.list}>
          {block.items.map((item, idx) => (
            <View key={idx} style={styles.li}>
              <ThemedText type="default" style={{ color: theme.accent }}>
                {block.ordered ? `${idx + 1}.` : '•'}
              </ThemedText>
              <ThemedText type="default" themeColor="textSecondary" style={styles.liText}>
                <Inline text={item} />
              </ThemedText>
            </View>
          ))}
        </View>
      );
    case 'paragraph':
      return (
        <ThemedText type="default" themeColor="textSecondary" style={styles.p}>
          <Inline text={block.text} />
        </ThemedText>
      );
  }
}

/** Inline formatting: **bold**, `code`, [text](url). */
function Inline({ text }: { text: string }): ReactNode {
  const theme = useTheme();
  const tokens: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push(<Fragment key={key++}>{text.slice(last, m.index)}</Fragment>);
    if (m[2]) {
      tokens.push(
        <ThemedText key={key++} type="default" style={styles.bold}>
          {m[2]}
        </ThemedText>
      );
    } else if (m[4]) {
      tokens.push(
        <ThemedText
          key={key++}
          type="code"
          style={[styles.inlineCode, { color: theme.text, backgroundColor: theme.backgroundSelected }]}>
          {m[4]}
        </ThemedText>
      );
    } else if (m[6]) {
      const url = m[7];
      tokens.push(
        <ThemedText
          key={key++}
          type="default"
          style={[styles.link, { color: theme.primary }]}
          onPress={() => Linking.openURL(url)}>
          {m[6]}
        </ThemedText>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return <>{tokens}</>;
}

const styles = StyleSheet.create({
  doc: { gap: Spacing.three, width: '100%' },
  h2: { marginTop: Spacing.two },
  h3: { marginTop: Spacing.one },
  p: { maxWidth: 720 },
  list: { gap: Spacing.two, maxWidth: 720 },
  li: { flexDirection: 'row', gap: Spacing.two, alignItems: 'flex-start' },
  liText: { flex: 1 },
  bold: { fontWeight: '700' },
  inlineCode: {
    borderRadius: Radius.sm,
    paddingHorizontal: 5,
  },
  link: { textDecorationLine: 'underline', fontWeight: '500' },
});
