"use client";
import React from "react";
import { toast } from "sonner";
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
import { Loader } from "lucide-react";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";

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
    data,
  } = useCompletion({
    api: "/api/roundup",
    body: {
      origin: origin,
      productCount: parseInt(productCount),
    },
  });
  console.log("🚀 ~ Home ~ data:", data);

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
              disabled={isLoading}
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
        <section
          className={cn("bg-secondary mx-auto mt-20 h-80 max-w-4xl rounded-md p-6")}
        >
          {completion}
        </section>
      )}
    </main>
  );
}
