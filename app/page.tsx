'use client'

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
}