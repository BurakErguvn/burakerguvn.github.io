import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

import { remarkMermaid } from "@/lib/remark-mermaid";
import { Pre } from "./Pre";
import { Mermaid } from "./Mermaid";
import { Theorem, Definition, Lemma, Callout } from "./Callouts";

const components = {
  pre: Pre,
  Mermaid,
  Theorem,
  Definition,
  Lemma,
  Callout,
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath, remarkMermaid],
    rehypePlugins: [
      rehypeKatex,
      [rehypePrettyCode, { theme: "github-dark", keepBackground: false }] as never,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: { className: ["anchor"], ariaHidden: true, tabIndex: -1 },
          content: [{ type: "text", value: "#" }],
        },
      ] as never,
    ],
  },
};

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} options={options} components={components} />;
}
