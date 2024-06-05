"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { MessageSquare } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema } from "./constants";

import { Heading } from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";

const ConversationPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });
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
        title="Conversation"
        description="Our most advanced conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
          Messages Content
        </div>
      </div>
    </div>
  );
}
 
export default ConversationPage;