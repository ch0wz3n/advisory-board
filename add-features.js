const fs = require('fs');
const path = require('path');

console.log('🚀 Adding Advisory Board Features...\n');

// Helper to create directories
function mkdirSync(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Helper to write files
function writeFileSync(filePath, content) {
    const dir = path.dirname(filePath);
    mkdirSync(dir);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${filePath}`);
}

// Update app/page.tsx with the real UI
writeFileSync('app/page.tsx', `'use client'

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold">Advisory Board</h1>
      </header>
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to Advisory Board</h2>
          <p className="text-lg text-gray-600 mb-8">
            Your AI-powered leadership coaching platform with four expert perspectives
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-bold">Sarah</h3>
              <p className="text-sm text-gray-600">Purpose & Infinite Game</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-bold">Jake</h3>
              <p className="text-sm text-gray-600">Values & Laws</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-bold">Martin</h3>
              <p className="text-sm text-gray-600">Outside-In Revenue</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-bold">Jack</h3>
              <p className="text-sm text-gray-600">Extreme Ownership</p>
            </div>
          </div>
          <form action="/chat" method="get">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Start Coaching Session
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}`);

// Create the chat page
writeFileSync('app/chat/page.tsx', `'use client'
import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Advisory Board Chat</h1>
        <a href="/" className="text-blue-600 hover:underline">Back to Home</a>
      </header>
      
      <main className="flex-1 overflow-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Welcome! Share your leadership challenge or initiative.</p>
              <p className="text-sm mt-2">I'll analyze it through four expert perspectives.</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={i} className={\`p-4 rounded-lg \${
              msg.role === 'user' ? 'bg-blue-100 ml-12' : 'bg-gray-100 mr-12'
            }\`}>
              <div className="font-semibold mb-1">
                {msg.role === 'user' ? 'You' : 'Advisory Board'}
              </div>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))}
          
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Analyzing through 4 lenses...</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your initiative or challenge..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Send'}
          </button>
        </form>
      </footer>
    </div>
  )
}`);

// Create the API route
writeFileSync('app/api/chat/route.ts', `import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SYSTEM_PROMPT = \`You are Advisory Board, a panel of 4 leadership coaches:
- Sarah (Purpose & Infinite Game): Focus on WHY and long-term vision
- Jake (Values & Laws): Focus on trust and empowerment
- Martin (Outside-In Revenue): Focus on customer buying journey
- Jack (Extreme Ownership): Focus on accountability and execution

For each query, provide perspectives from all 4 coaches in a structured format.\`

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
}`);

console.log('\n✅ Advisory Board features added!');
console.log('\nNext steps:');
console.log('1. Run locally: npm run dev');
console.log('2. Test the chat at http://localhost:3000');
console.log('3. Commit and push to GitHub');
console.log('4. Vercel will auto-deploy');
