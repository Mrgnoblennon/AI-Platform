"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { VideoIcon } from "lucide-react";
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

const VideoPage = () => {
  const [video, setVideo] = useState<string>();
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
      setVideo(undefined);

      const response = await axios.post("/api/video", values)
      
      setVideo(response.data[0]);

      form.reset();
    } catch (error: any) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  const predefinedPlaceholder = [
    "Create a calming nature scene.",
    "Generate an energetic dance clip.",
    "Compose a dramatic classical visual.",
    "Create a jazzy club scene.",
    "Generate a rock concert video.",
    "Create a vibrant urban hip-hop scene.",
    "Compose an electrifying dance party.",
    "Generate a serene beach sunset.",
    "Create a heroic fantasy battle.",
    "Generate an epic space adventure."
  ];

  const randomPlaceholder = predefinedPlaceholder[Math.floor(Math.random() * predefinedPlaceholder.length)];

  return (
    <div>
      <Heading 
        title="Video Generation"
        description="Turn your prompt into a video."
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
          {!video && !isLoading && (
            <Empty 
              label="No video generated"
            />
          )}
          {video && (
            <video loop controls className="w-full aspect-video mt-8 rounded-lg border bg-black">
              <source src={video} />
            </video>
          )}
        </div>
        <div className="w-full h-[150px]" />
      </div>
    </div>
  );
}

export default VideoPage;
