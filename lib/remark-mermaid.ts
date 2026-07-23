/**
 * Convert fenced ```mermaid blocks into <Mermaid> JSX elements at the mdast
 * stage, so rehype-pretty-code never tries to tokenize them as a language.
 */
export function remarkMermaid() {
  return (tree: any) => {
    walk(tree);
  };
}

function walk(node: any) {
  if (!node || !Array.isArray(node.children)) return;
  const kids = node.children;
  for (let i = 0; i < kids.length; i++) {
    const c = kids[i];
    if (c && c.type === "code" && c.lang === "mermaid") {
      kids[i] = {
        type: "mdxJsxFlowElement",
        name: "Mermaid",
        attributes: [],
        children: [{ type: "text", value: c.value }],
      };
    } else {
      walk(c);
    }
  }
}
