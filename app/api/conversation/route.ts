import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from '@/lib/subscriptions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorised", { status : 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key not configured", { status : 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status : 400 });
    }

    const freetrial = await checkApiLimit();
    const isPro = await checkSubscription(); 

    if (!freetrial && !isPro) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    const completion = await openai.chat.completions.create({
      messages,
      model: 'gpt-3.5-turbo',
    });

    if (!isPro) {
      await increaseApiLimit();
    }
    
    return NextResponse.json(completion.choices[0]);
  } catch (error) {
    console.log("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

