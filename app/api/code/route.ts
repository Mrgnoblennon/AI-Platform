import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage = {
  role: "system",
  content: "Generate a code snippet. Describe it briefly. Show the code in markdown format. Then, describe the code in detail."
};

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

    if (!freetrial) {
      return new NextResponse("Free trial has expired", { status: 403 });
    }

    const completion = await openai.chat.completions.create({
      messages: [instructionMessage, ...messages],
      model: 'gpt-3.5-turbo',
    });

    await increaseApiLimit();

    return NextResponse.json(completion.choices[0]);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

