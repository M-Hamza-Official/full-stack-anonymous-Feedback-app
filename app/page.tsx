import Link from "next/link";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { Lock, Link2, LayoutDashboard, ArrowRight } from "lucide-react";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  viewport: 'width=device-width, initial-scale=1.0',
}
const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-mono" });

// The recurring "redaction bar" — stands in anywhere a name/identity would be
function Redacted({ width = "w-24" }: { width?: string }) {
  return (
    <span
      className={`inline-block h-[0.9em] ${width} bg-[#14151A] align-middle translate-y-[1px] rounded-[1px]`}
      aria-label="anonymous"
    />
  );
}

export default function Home() {
  return (
    <main
      className={`${fraunces.variable} ${inter.variable} ${mono.variable} font-[family-name:var(--font-body)] bg-[#F7F5F0] text-[#1B1B1F] min-h-screen`}
    >
      {/* Nav */}
      <header className="max-w-5xl mx-auto flex items-center justify-between px-6 py-6">
        <span className="font-[family-name:var(--font-display)] text-lg tracking-tight">
          open<span className="text-[#4A4A52]">Feedback</span>
        </span>
        <nav className="flex items-center gap-6 text-sm text-[#4A4A52]">
          <Link href="/sign-in" className="hover:text-[#1B1B1F] transition-colors">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="bg-[#1B1B1F] text-[#F7F5F0] px-4 py-2 rounded-sm text-sm hover:bg-[#14151A] transition-colors"
          >
            Get your link
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-24 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#4A4A52] mb-5">
            001 — Honest feedback, no names attached
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl leading-[1.05] mb-6">
            Say what you
            <br />
            really think.
          </h1>
          <p className="text-[#4A4A52] text-lg leading-relaxed mb-8 max-w-md">
            Share one link. Get honest messages from friends, followers, or
            teammates — sender always{" "}
            <span className="relative inline-block">
              <Redacted width="w-20" />
            </span>
            .
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-[#1B1B1F] text-[#F7F5F0] px-5 py-3 rounded-sm hover:bg-[#14151A] transition-colors"
            >
              Create my link <ArrowRight size={16} />
            </Link>
            <span className="text-sm text-[#4A4A52]">Free, takes 30 seconds</span>
          </div>
        </div>

        {/* Mock message card — the signature moment */}
        <div className="bg-white border border-[#DAD5C9] rounded-md p-6 shadow-[0_1px_0_#DAD5C9] rotate-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-[#4A4A52]">
              From <Redacted width="w-16" />
            </div>
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider bg-[#FFD23F] px-2 py-1 rounded-sm">
              New
            </span>
          </div>
          <p className="text-[#1B1B1F] leading-relaxed mb-4">
            "Honestly? Your presentation last week was the clearest one
            we've had all quarter. More of that."
          </p>
          <div className="flex items-center justify-between text-xs text-[#4A4A52] border-t border-[#DAD5C9] pt-4">
            <span>2 minutes ago</span>
            <span className="flex items-center gap-1">
              <Lock size={12} /> Sender not recorded
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-[#DAD5C9]">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-[#4A4A52] mb-10">
          002 — How it works
        </p>
        <div className="grid md:grid-cols-3 gap-10">
          <Feature
            icon={<Lock size={20} />}
            title="Anonymous by design"
            body="No accounts, no IP logs, no hidden identifiers tied to a message. What you send is what we keep — nothing else."
          />
          <Feature
            icon={<Link2 size={20} />}
            title="One link, anywhere"
            body="Drop your link in a bio, a group chat, or a slide. Anyone with it can send you a message in seconds."
          />
          <Feature
            icon={<LayoutDashboard size={20} />}
            title="A calm inbox"
            body="Messages land in a simple dashboard. Read them, archive them, or turn off new messages whenever you want."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-[#DAD5C9] text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl mb-4">
          Ready to hear from <Redacted width="w-24" />?
        </h2>
        <p className="text-[#4A4A52] mb-8">Your link is waiting. It takes less time than reading this page.</p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 bg-[#1B1B1F] text-[#F7F5F0] px-6 py-3 rounded-sm hover:bg-[#14151A] transition-colors"
        >
          Get your openFeedback link <ArrowRight size={16} />
        </Link>
      </section>

      <footer className="max-w-5xl mx-auto px-6 py-8 border-t border-[#DAD5C9] flex items-center justify-between text-xs text-[#4A4A52]">
        <span>© {new Date().getFullYear()} openFeedback</span>
        <span className="font-[family-name:var(--font-mono)]">Built by <Redacted width="w-14" /></span>
      </footer>
    </main>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <div className="w-9 h-9 rounded-sm bg-[#1B1B1F] text-[#F7F5F0] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-lg mb-2">{title}</h3>
      <p className="text-sm text-[#4A4A52] leading-relaxed">{body}</p>
    </div>
  );
}