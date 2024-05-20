"use client";
import React from "react";
import { useCompletion } from "ai/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Copy, Loader } from "lucide-react";
import { Label } from "~/components/ui/label";
import MarkdownRenderer from "~/components/markdown-renderer";
import { toast } from "sonner";

export default function Home() {
  const [origin, setOrigin] = React.useState("https://www.amazon.com");
  const [productCount, setProductCount] = React.useState<string>("3");
  const formRef = React.useRef<HTMLFormElement>(null);

  const {
    completion,
    input,
    handleInputChange,
    handleSubmit: startGeneration,
    isLoading,
    error,
  } = useCompletion({
    api: "/api/roundup",
    body: {
      origin: origin,
      productCount: parseInt(productCount),
    },
  });

  React.useEffect(() => {
    if (error) {
      console.error(error?.stack);
      toast.error(error?.message);
    }
  }, [error]);

  return (
    <main className="px-2">
      <section className="mx-auto mt-20 max-w-2xl">
        <form ref={formRef} onSubmit={startGeneration} className="space-y-4">
          <div>
            <Label>Term</Label>
            <Input
              placeholder="term"
              value={input}
              onChange={handleInputChange}
              name="term"
              autoComplete="off"
            />
          </div>
          <div>
            <Label>Origin</Label>
            <Select
              defaultValue="https://www.amazon.com"
              name="origin"
              onValueChange={(v) => setOrigin(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="https://www.amazon.com">
                  Amazon.com
                </SelectItem>
                <SelectItem value="https://www.amazon.in">Amazon.in</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Product Count</Label>
            <Select
              defaultValue="3"
              name="productCount"
              onValueChange={(v) => setProductCount(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Product count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="7">7</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center"
            >
              {isLoading && <Loader className="mr-2 animate-spin" size={16} />}
              Generate
            </Button>
          </div>
        </form>
      </section>
      {completion && (
        <section className="relative mb-20 max-w-4xl mx-auto">
          <CopyButton text={completion} disabled={isLoading} />
          <MarkdownRenderer
            className="bg-secondary mt-20 rounded-md border px-8 py-6"
            markdown={completion}
          />
        </section>
      )}
    </main>
  );
}

function CopyButton({
  text,
  disabled = false,
}: {
  text: string;
  disabled?: boolean;
}) {
  function copy() {
    void navigator.clipboard.writeText(text);
  }
  return (
    <Button
      size="icon"
      variant="secondary"
      className="absolute right-4 top-4"
      disabled={disabled}
      onClick={copy}
    >
      <Copy size={16} />
    </Button>
  );
}

