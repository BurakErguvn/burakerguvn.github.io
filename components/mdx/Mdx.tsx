import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxOptions } from "@/lib/mdx-options";
import { Pre } from "./Pre";
import { Mermaid } from "./Mermaid";
import { Theorem, Definition, Lemma, Callout } from "./Callouts";
import { ZoomableImg } from "./ZoomableImg";

const components = {
  pre: Pre,
  img: ZoomableImg,
  Mermaid,
  Theorem,
  Definition,
  Lemma,
  Callout,
};

const options = { mdxOptions };

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} options={options} components={components} />;
}
