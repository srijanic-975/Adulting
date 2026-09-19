import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          Adulting Co-Pilot
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Navigating life transitions doesn&apos;t have to be terrifying. We translate gatekept
          jargon into simple terms so you can sign leases and handle taxes with confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/analyzer"
            className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Try Document Analyzer
          </Link>
          <Link
            href="/paywall"
            className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            View Pricing
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Lease Reader</h3>
            <p className="text-sm text-slate-600">Spot red flags before they cost you your deposit.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Tax Assistant</h3>
            <p className="text-sm text-slate-600">Plain English guides for filing for the first time.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-2">Health Ins.</h3>
            <p className="text-sm text-slate-600">Demystify deductibles, co-pays, and premiums.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
