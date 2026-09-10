"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
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

/** Client MDX renderer for serialized sources (Finder-opened posts / JSON API). */
export function MdxClient({
  source,
}: {
  source: MDXRemoteSerializeResult;
}) {
  return <MDXRemote {...source} components={components} />;
}
