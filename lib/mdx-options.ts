import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import { remarkMermaid } from "@/lib/remark-mermaid";

/** Shared MDX plugin chain for RSC render and optional serialize. */
export const mdxOptions = {
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
};
