import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-6">
            SparkTask <span className="text-blue-600">Railway</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Fortune 500-grade project management platform with academic rigor,
            PMBOK compliance, and railway-inspired workflow orchestration.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/demo"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Fortune 500 Demo
            </Link>
            <Link
              href="/projects"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Projects
            </Link>
          </div>
        </div>

        {/* Academic Anchors */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">PMBOK 7th Edition</h3>
            <p className="text-gray-600">
              Full compliance with Project Management Body of Knowledge standards
              for initiating, planning, executing, monitoring, and closing projects.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">ISO 31000:2018</h3>
            <p className="text-gray-600">
              Enterprise risk management framework with probability-impact matrices
              and systematic risk assessment protocols.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Lean + Kanban</h3>
            <p className="text-gray-600">
              Work-in-progress limits, continuous flow optimization, and
              academic-backed lean manufacturing principles.
            </p>
          </div>
        </div>

        {/* Railway Metaphor */}
        <div className="bg-blue-50 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Railway-Inspired Workflow</h2>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            Projects flow through stations like trains on a railway network. Each station represents
            a critical phase with specific deliverables, policy guards, and academic compliance checks.
            The AI Conductor orchestrates the journey, ensuring smooth transitions and identifying optimal routes.
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Initiation Station</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Planning Stations</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>Execution Station</span>
            </div>
            <div className="w-8 h-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Closing Station</span>
            </div>
          </div>
        </div>

        {/* Implementation Status */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Phase 1 Implementation</h2>
          <p className="text-gray-600 mb-4">
            Currently in monorepo setup with Next.js 14 App Router, following strict anti-drift governance.
          </p>
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">Monorepo Architecture Complete</span>
          </div>
        </div>
      </div>
    </main>
  )
}
