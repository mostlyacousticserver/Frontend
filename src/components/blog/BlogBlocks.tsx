"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { BlogMedia } from "@/components/blog/BlogMedia";
import { isLinkNode } from "@/lib/blog-content";
import { cn } from "@/lib/utils";
import type {
  BlogBlock,
  BlogContentV1,
  BlogInlineNode,
  BlogTextNode,
} from "@/types/blog";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

export function BlogBlocks({
  content,
  animated = false,
}: {
  content: BlogContentV1;
  animated?: boolean;
}) {
  return (
    <div className="space-y-5 sm:space-y-6">
      {content.blocks.map((block, index) => (
        <BlogBlockView
          key={`${block.type}-${index}`}
          block={block}
          animated={animated}
        />
      ))}
    </div>
  );
}

function BlogBlockView({
  block,
  animated,
}: {
  block: BlogBlock;
  animated: boolean;
}) {
  if (block.type === "heading") {
    const className = cn(
      "pt-2 font-sans font-bold tracking-[-0.015em] text-[#111111]",
      block.level === 1
        ? "text-[22px] sm:text-[28px] md:text-[32px]"
        : block.level === 2
          ? "text-[18px] sm:text-[22px] md:text-[26px]"
          : "text-[16px] sm:text-[18px] md:text-[20px]",
    );
    const children = <InlineNodes nodes={block.children} />;
    if (animated) {
      if (block.level === 1) {
        return (
          <motion.h1 {...fadeUp} className={className}>
            {children}
          </motion.h1>
        );
      }
      if (block.level === 2) {
        return (
          <motion.h2 {...fadeUp} className={className}>
            {children}
          </motion.h2>
        );
      }
      return (
        <motion.h3 {...fadeUp} className={className}>
          {children}
        </motion.h3>
      );
    }
    if (block.level === 1) return <h1 className={className}>{children}</h1>;
    if (block.level === 2) return <h2 className={className}>{children}</h2>;
    return <h3 className={className}>{children}</h3>;
  }

  if (block.type === "paragraph") {
    const className =
      "font-sans text-[14px] leading-7 text-[#4B5563] sm:text-[15px] sm:leading-8 md:text-[16px]";
    const children = <InlineNodes nodes={block.children} />;
    if (animated) {
      return (
        <motion.p {...fadeUp} className={className}>
          {children}
        </motion.p>
      );
    }
    return <p className={className}>{children}</p>;
  }

  if (block.type === "list") {
    const className = cn(
      "space-y-2.5 rounded-xl border border-[#E9EEF3] bg-[#FAFBFC] p-4 sm:space-y-3 sm:rounded-2xl sm:p-5 md:p-6",
      block.style === "ordered" && "list-decimal pl-8",
    );
    const items = block.items.map((item, index) => (
      <li
        key={index}
        className="flex items-start gap-2.5 font-sans text-[13px] leading-6 text-[#4B5563] sm:gap-3 sm:text-[14px] sm:leading-7 md:text-[15px]"
      >
        {block.style === "unordered" ? (
          <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#11C5BB] sm:mt-2.5"
            aria-hidden
          />
        ) : null}
        <span>
          <InlineNodes nodes={item.children} />
        </span>
      </li>
    ));
    if (animated) {
      return block.style === "ordered" ? (
        <motion.ol {...fadeUp} className={className}>
          {items}
        </motion.ol>
      ) : (
        <motion.ul {...fadeUp} className={className}>
          {items}
        </motion.ul>
      );
    }
    return block.style === "ordered" ? (
      <ol className={className}>{items}</ol>
    ) : (
      <ul className={className}>{items}</ul>
    );
  }

  if (block.type === "quote") {
    const inner = (
      <>
        <p className="font-serif text-[15px] italic leading-7 text-[#27405A] sm:text-[17px] sm:leading-8 md:text-[20px]">
          &ldquo;
          <InlineNodes nodes={block.children} />
          &rdquo;
        </p>
        {block.cite ? (
          <footer className="mt-2.5 font-sans text-[12px] font-semibold text-[#0DA694] sm:mt-3 sm:text-[13px]">
            — {block.cite}
          </footer>
        ) : null}
      </>
    );
    const className =
      "rounded-r-xl border-l-4 border-[#11C5BB] bg-[#EFFCF9] px-4 py-4 sm:rounded-r-2xl sm:px-5 sm:py-5 md:px-7 md:py-6";
    if (animated) {
      return (
        <motion.blockquote {...fadeUp} className={className}>
          {inner}
        </motion.blockquote>
      );
    }
    return <blockquote className={className}>{inner}</blockquote>;
  }

  if (block.type === "code") {
    const inner = (
      <>
        {block.language ? (
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            {block.language}
          </span>
        ) : null}
        <code>{block.code}</code>
      </>
    );
    const className =
      "overflow-x-auto rounded-xl bg-zinc-950 p-4 text-[13px] leading-6 text-zinc-100 sm:rounded-2xl sm:p-5";
    if (animated) {
      return (
        <motion.pre {...fadeUp} className={className}>
          {inner}
        </motion.pre>
      );
    }
    return <pre className={className}>{inner}</pre>;
  }

  if (block.type === "divider") {
    return <hr className="border-[#E9EEF3]" />;
  }

  if (!block.url?.trim()) return null;

  const figure = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-[#F3F4F6] shadow-[0_8px_24px_rgba(15,23,42,0.08)] sm:aspect-[16/9] sm:rounded-[18px]">
        <BlogMedia stored={block.url} alt={block.alt || ""} rounded="rounded-none" />
      </div>
      {block.caption ? (
        <figcaption className="mt-2 text-center font-sans text-[11px] text-[#9CA3AF] sm:mt-3 sm:text-[12px]">
          {block.caption}
        </figcaption>
      ) : null}
    </>
  );

  if (animated) {
    return (
      <motion.figure {...fadeUp} className="py-1 sm:py-2">
        {figure}
      </motion.figure>
    );
  }
  return <figure className="py-1 sm:py-2">{figure}</figure>;
}

function InlineNodes({ nodes }: { nodes: BlogInlineNode[] }) {
  return nodes.map((node, index) => {
    if (isLinkNode(node)) {
      return (
        <a
          key={index}
          href={node.href}
          className="text-[#0DA694] underline decoration-[#0DA694]/30 underline-offset-2 hover:decoration-[#0DA694]"
          target="_blank"
          rel="noreferrer"
        >
          {node.children.map((child, childIndex) => (
            <MarkedText key={childIndex} node={child} />
          ))}
        </a>
      );
    }
    return <MarkedText key={index} node={node} />;
  });
}

function MarkedText({ node }: { node: BlogTextNode }) {
  let content: ReactNode = node.text;
  if (node.code) {
    content = (
      <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.9em]">
        {content}
      </code>
    );
  }
  if (node.bold) content = <strong>{content}</strong>;
  if (node.italic) content = <em>{content}</em>;
  if (node.underline) content = <u>{content}</u>;
  if (node.strike) content = <s>{content}</s>;
  return content;
}
