import Image from "next/image";
import React from "react";
import Markdown from "react-markdown";

import { cn } from "~/lib/utils";

type Props = {
  markdown: string;
  className?: string;
};

export default function MarkdownRenderer({ markdown, className }: Props) {
  return (
    <div className={cn("", className)}>
      <Markdown
        components={{
          h1: ({ className, ...props }) => (
            <h1
              className={cn(
                "mt-2 scroll-m-20 text-3xl font-bold tracking-tight",
                className,
              )}
              {...props}
            />
          ),
          h2: ({ className, ...props }) => (
            <h2
              className={cn(
                "mt-10 scroll-m-20 border-b pb-1 text-2xl font-medium tracking-tight first:mt-0",
                className,
              )}
              {...props}
            />
          ),
          h3: ({ className, ...props }) => (
            <h3
              className={cn(
                "mt-8 scroll-m-20 text-xl font-medium tracking-tight",
                className,
              )}
              {...props}
            />
          ),
          h4: ({ className, ...props }) => (
            <h4
              className={cn(
                "mt-8 scroll-m-20 text-lg font-medium tracking-tight",
                className,
              )}
              {...props}
            />
          ),
          h5: ({ className, ...props }) => (
            <h5
              className={cn(
                "mt-8 scroll-m-20 text-base font-medium tracking-tight",
                className,
              )}
              {...props}
            />
          ),
          h6: ({ className, ...props }) => (
            <h6
              className={cn(
                "mt-8 scroll-m-20 text-base font-medium tracking-tight",
                className,
              )}
              {...props}
            />
          ),
          a: ({ className, ...props }) => (
            <a
              className={cn(
                "font-medium underline underline-offset-4",
                className,
              )}
              {...props}
            />
          ),
          p: ({ className, ...props }) => (
            <p
              className={cn(
                "text-primary/80 leading-7 [&:not(:first-child)]:mt-6",
                className,
              )}
              {...props}
            />
          ),
          ul: ({ className, ...props }) => (
            <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
          ),
          ol: ({ className, ...props }) => (
            <ol
              className={cn("my-6 ml-6 list-decimal", className)}
              {...props}
            />
          ),
          li: ({ className, ...props }) => (
            <li className={cn("mt-2", className)} {...props} />
          ),
          blockquote: ({ className, ...props }) => (
            <blockquote
              className={cn(
                "[&>*]:text-muted-foreground mt-6 border-l-2 pl-6 italic",
                className,
              )}
              {...props}
            />
          ),
          img: ({
            src,
            className,
            // width: _width,
            // height: _height,
            alt,
            ...props
          }: React.ImgHTMLAttributes<HTMLImageElement>) => {
            let fc = src;
            if (src?.startsWith("https://m.media-amazon.com/images/I/")) {
              // https://m.media-amazon.com/images/I/811nANw85hL.__AC_SX300_SY300_QL70_ML2_.jpg
              const arr = src.split(".");
              arr.splice(3, 1);
              fc = arr.join(".");
            }
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fc}
                className={cn("h-auto w-full rounded-md", className)}
                alt={alt}
                {...props}
              />
            );
          },
          hr: ({ ...props }) => <hr className="my-4 md:my-8" {...props} />,
          table: ({
            className,
            ...props
          }: React.HTMLAttributes<HTMLTableElement>) => (
            <div className="my-6 w-full overflow-y-auto">
              <table className={cn("w-full", className)} {...props} />
            </div>
          ),
          tr: ({
            className,
            ...props
          }: React.HTMLAttributes<HTMLTableRowElement>) => (
            <tr
              className={cn("even:bg-muted m-0 border-t p-0", className)}
              {...props}
            />
          ),
          th: ({ className, ...props }) => (
            <th
              className={cn(
                "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
                className,
              )}
              {...props}
            />
          ),
          td: ({ className, ...props }) => (
            <td
              className={cn(
                "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                className,
              )}
              {...props}
            />
          ),
          pre: ({ className, ...props }) => (
            <pre
              className={cn(
                "mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4",
                className,
              )}
              {...props}
            />
          ),
          code: ({ className, ...props }) => (
            <code
              className={cn(
                "relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm",
                className,
              )}
              {...props}
            />
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
