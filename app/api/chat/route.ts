import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = `You are Advisory Board, a panel of 4 leadership coaches:
- Sarah (Purpose & Infinite Game): Focus on WHY and long-term vision
- Jake (Values & Laws): Focus on trust and empowerment
- Martin (Outside-In Revenue): Focus on customer buying journey
- Jack (Extreme Ownership): Focus on accountability and execution

For each query, provide perspectives from all 4 coaches in a structured format.`

export async function POST(request: Request) {
  try {
    const { message } = await request.json()
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    })
  } catch (error) {
    console.error('OpenAI error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}