import Link from 'next/link';

export default function Paywall() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-slate-50">
      <div className="w-full max-w-4xl mt-12 mb-8">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium mb-8 inline-block transition-colors">
          &larr; Back to Home
        </Link>
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900">Don&apos;t get played.</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            A predatory lease clause can cost you your <span className="font-semibold text-slate-900">$1,500</span> security deposit.
            A lawyer costs $200/hour to review it. Have our AI flag the red flags right now for $4.99.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Moving Season Pass */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border-2 border-indigo-500 relative flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Moving Season Pass</h2>
              <p className="text-slate-500 mt-2">Perfect for signing your lease and moving in.</p>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-slate-900">$7.99</span>
              <span className="text-slate-500 font-medium"> / 30 days</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-700">
                <svg className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Unlimited Document Analyzes
              </li>
              <li className="flex items-center text-slate-700">
                <svg className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Conversational AI Advice (24/7)
              </li>
              <li className="flex items-center text-slate-700">
                <svg className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Does not auto-renew!
              </li>
            </ul>
            <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
              Get the Pass
            </button>
          </div>

          {/* Single Document Pass */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Single Review</h2>
              <p className="text-slate-500 mt-2">Just need one lease or contract checked.</p>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-slate-900">$4.99</span>
              <span className="text-slate-500 font-medium"> / doc</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-slate-700">
                <svg className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                One Document Analysis
              </li>
              <li className="flex items-center text-slate-700">
                <svg className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Summary of Red Flags
              </li>
            </ul>
            <button className="w-full py-4 bg-white text-indigo-600 border border-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors">
              Buy One Review
            </button>
          </div>
        </div>

        {/* The Secret Weapon: Parental Sponsor */}
        <div className="mt-12 bg-indigo-900 text-white p-8 sm:p-12 rounded-3xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 shadow-lg">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Broke? Ask your parents.</h3>
            <p className="text-indigo-200 mb-6 md:mb-0">
              They don&apos;t want you losing your deposit either. Send them a link to sponsor an Annual Safety Net Plan ($20/year) so you can stop asking them confusing adulting questions.
            </p>
          </div>
          <button className="whitespace-nowrap px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center shadow-md">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            Send to Parents
          </button>
        </div>

      </div>
    </main>
  );
}
