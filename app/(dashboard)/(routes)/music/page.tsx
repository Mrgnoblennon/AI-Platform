"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Music } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { formSchema } from "./constants";

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

const MusicPage = () => {
  const [music, setMusic] = useState<string>();
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
      setMusic(undefined);

      const response = await axios.post("/api/music", values)
      
      setMusic(response.data?.audio);

      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  const predefinedPlaceholder = [
    "Create a calming ambient track.",
    "Generate an upbeat pop song.",
    "Compose a dramatic classical piece.",
    "Create a jazzy tune with a saxophone.",
    "Generate a rock track with guitar riffs.",
    "Create a hip-hop beat with strong bass.",
    "Compose an electronic dance track.",
    "Generate a soothing acoustic guitar piece.",
    "Create an uplifting orchestral piece.",
    "Generate an epic cinematic soundtrack."
  ];

  const randomPlaceholder = predefinedPlaceholder[Math.floor(Math.random() * predefinedPlaceholder.length)];

  return (
    <div>
      <Heading 
        title="Music Generation"
        description="Turn your prompt into music."
        icon={Music}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
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
          {!music && !isLoading && (
            <Empty 
              label="No music generated"
            />
          )}
          {music && (
            <audio controls className="w-full mt-8">
              <source src={music}/>
            </audio>
          )}
        </div>
      </div>
    </div>
  );
}

export default MusicPage;
