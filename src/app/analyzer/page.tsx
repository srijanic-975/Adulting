"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Analyzer() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);

  const handleUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(true);
    }, 2000); // Simulate API delay
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-slate-50">
      <div className="w-full max-w-5xl mt-12 mb-8">
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium mb-8 inline-block transition-colors">
          &larr; Back to Home
        </Link>
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">AI Document Analyzer</h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            Upload your lease or contract. We&apos;ll explain the confusing parts and flag anything that could cost you money. No judgment, just plain English.
          </p>
        </div>

        {!analyzing && !results && (
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-16 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors cursor-pointer group" onClick={handleUpload}>
            <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload your lease</h3>
            <p className="text-slate-500 mb-6">Drag and drop your PDF here, or click to browse.</p>
            <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
              Select File
            </button>
          </div>
        )}

        {analyzing && (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-200">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Reading the fine print...</h3>
            <p className="text-slate-500">Our AI is translating the legal jargon. Hang tight.</p>
          </div>
        )}

        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Analysis Complete</h2>
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">3 Red Flags Found</span>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
                    <div className="flex items-start">
                      <div className="bg-red-500 text-white p-1 rounded-full mr-4 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Joint and Several Liability</h4>
                        <p className="text-sm text-slate-500 font-mono mb-3 bg-white p-2 rounded border border-red-200">&quot;Tenants are jointly and severally liable for all obligations...&quot;</p>
                        <p className="text-slate-700"><strong>What it means:</strong> If your roommate ghosts and stops paying rent, the landlord can legally force <em>you</em> to pay their share. You are on the hook for the entire apartment, not just your room.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-orange-50 border border-orange-100 rounded-2xl">
                    <div className="flex items-start">
                      <div className="bg-orange-500 text-white p-1 rounded-full mr-4 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">Automatic Renewal Clause</h4>
                        <p className="text-sm text-slate-500 font-mono mb-3 bg-white p-2 rounded border border-orange-200">&quot;This lease shall automatically renew for a successive term...&quot;</p>
                        <p className="text-slate-700"><strong>What it means:</strong> If you don&apos;t tell the landlord you are moving out 60 days before the lease ends, you are automatically locked in for another whole year.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-indigo-900 text-white p-6 rounded-3xl sticky top-6 shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                  Need Advice?
                </h3>
                <p className="text-indigo-200 mb-6 text-sm">
                  Still confused? Ask the AI specific questions about your lease. No judgment here.
                </p>
                <div className="bg-indigo-800 rounded-xl p-4 mb-4 h-48 flex flex-col justify-end">
                  <p className="text-xs text-indigo-300 italic">Conversation started...</p>
                </div>
                <input
                  type="text"
                  placeholder="Ask a question..."
                  className="w-full bg-white/10 border border-indigo-400/30 rounded-xl px-4 py-3 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <Link href="/paywall" className="block text-center w-full mt-6 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors text-sm">
                  Upgrade to Moving Pass for Unlimited Chat
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
