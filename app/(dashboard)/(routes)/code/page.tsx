"use client";

import { useProModal } from "@/hooks/use-pro-modal";
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
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);

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
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }
    } finally {
      router.refresh();
    }
  };

  const predefinedPlaceholder = [
    "Can you generate a React component that fetches data from an API and displays it?",
    "How do I write a Python script to read a CSV file and output summary statistics?",
    "Can you provide a Java function that sorts an array of integers using merge sort?",
    "Can you create a SQL query to find the top 5 highest salaries in a company database?",
    "Can you generate a CSS animation for a button hover effect with a bounce?",
    "How do I create a Node.js script to set up an Express server?",
    "Can you generate a TypeScript function to filter an array of objects?",
    "How do I implement user authentication in a Next.js app using Clerk?",
    "Can you provide a code snippet for sending an email using EmailJS in React?",
    "How do I write a function in JavaScript to calculate the percentage change between two numbers?"
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
