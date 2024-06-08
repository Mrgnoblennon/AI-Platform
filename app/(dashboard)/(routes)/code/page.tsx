"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";

import { Code } from "lucide-react";

import { formSchema } from "./constants";

import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CodePage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/code', {
        messages: [{ role: "user", content: values.prompt }]
      });

      const assistantMessage = response.data?.message?.content;

      if (assistantMessage) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "user", content: values.prompt },
          { role: "assistant", content: assistantMessage },
        ]);
      }

      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  const predefinedPlaceholder = [
    "How do I calculate the radius of a circle?",
    "What is the current tallest building in the world?",
    "When was the invention of the first computer?",
    "Can you explain the theory of relativity?",
    "What are the benefits of meditation?",
    "How does machine learning work?",
    "What are the latest trends in artificial intelligence?",
    "How can I improve my coding skills?",
    "What are some healthy diet tips?",
    "How do I start learning a new language?"
  ];

  const randomPlaceholder = predefinedPlaceholder[Math.floor(Math.random() * predefinedPlaceholder.length)];

  return (
    <div>
      <Heading 
        title="Code Generation"
        description="Generate code using descriptive text."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField 
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder={randomPlaceholder}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full "
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty 
              label="No conversation started"
            />
          )}
          <div className="flex flex-col-reverse gap-y-4 max-w-[900px]">
            {messages.map((message, index) => (
              <div key={index}
                className={cn(
                  "p-8 w-full flex items-start  gap-x-8 rounded-lg",
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                )}
              >
                {message.role === "user" ?  <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                        <pre {...props} />
                      </div>
                    ),
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    )
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-[150px]" />
    </div>
  );
}

export default CodePage;
