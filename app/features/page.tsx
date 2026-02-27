import Link from "next/link";
import {
  Bot,
  CreditCard,
  Users,
  Sparkles,
  MessageCircle,
  GitBranch,
  FileSearch,
  Calendar,
  Shield,
  Zap,
  Database,
  Plug,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    id: "agent-builder",
    icon: Bot,
    title: "AI Agent Builder",
    description:
      "Create and configure custom AI hiring agents powered by Gemini. Tailor agents to your workflow, role requirements, and company culture.",
    category: "Core",
  },
  {
    id: "billing",
    icon: CreditCard,
    title: "Billing & Subscriptions",
    description:
      "Manage subscriptions and payment methods with Stripe. Flexible plans, secure checkout, and real-time billing status.",
    category: "Core",
  },
  {
    id: "ai-matching",
    icon: Sparkles,
    title: "AI-Powered Matching",
    description:
      "Dual-ranking algorithms pair role fit with candidate intent. Evaluate across 300+ attributes including soft skills and behavioral traits.",
    category: "Recruiting",
  },
  {
    id: "candidate-sourcing",
    icon: Users,
    title: "Candidate Sourcing",
    description:
      "Access 900M+ candidate profiles across 70+ sourcing channels. Increase sourcing productivity by up to 80% and reduce costs by 50%.",
    category: "Recruiting",
  },
  {
    id: "ira-chatbot",
    icon: MessageCircle,
    title: "Ira AI Chatbot",
    description:
      "Interactive chatbot that automates early-stage candidate interactions 24/7. Engage both active and passive candidates with personalized outreach.",
    category: "Recruiting",
  },
  {
    id: "resume-parsing",
    icon: FileSearch,
    title: "Resume Parsing",
    description:
      "Automated resume extraction and job matching. Parse and structure candidate data for instant compatibility scoring.",
    category: "Recruiting",
  },
  {
    id: "interview-scheduling",
    icon: Calendar,
    title: "Interview Scheduling",
    description:
      "Streamline interview coordination and talent pool management. Reduce time-to-submit by 50% with smart scheduling.",
    category: "Recruiting",
  },
  {
    id: "diversity-hiring",
    icon: GitBranch,
    title: "Diversity Hiring",
    description:
      "Built-in bias reduction and diversity recruiting tools. Boost diverse hires while reducing diversity recruiting costs by up to 50%.",
    category: "Recruiting",
  },
  {
    id: "integrations",
    icon: Plug,
    title: "60+ Integrations",
    description:
      "Seamless 2-way sync with ATS, CRM, and VMS platforms including Bullhorn, Greenhouse, iCIMS, and SmartRecruiters.",
    category: "Platform",
  },
  {
    id: "profiles-auth",
    icon: Database,
    title: "Profiles & Auth",
    description:
      "User profiles and authentication via Supabase. Secure, scalable identity management with Row Level Security.",
    category: "Platform",
  },
  {
    id: "file-storage",
    icon: Zap,
    title: "File Storage",
    description:
      "AWS S3-powered document and resume storage. Reliable, scalable file handling for candidate materials.",
    category: "Platform",
  },
  {
    id: "security-compliance",
    icon: Shield,
    title: "Security & Compliance",
    description:
      "Enterprise-grade data security, compliance management, and audit trails. Your hiring data stays protected.",
    category: "Platform",
  },
];

const categories = ["Core", "Recruiting", "Platform"];

export default function FeaturesPage() {
  return (
    <div role="main" className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f1/5%,transparent_50%)]" />
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            HireArya
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/features">
              <Button variant="ghost" className="text-white/90 hover:bg-white/10">
                Features
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Dashboard
              </Button>
            </Link>
          </div>
        </nav>
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight sm:text-6xl">
            All of Arya&apos;s Features
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            Everything you need to hire smarter. AI-powered recruiting, agent builder, billing, and
            enterprise integrations—all in one platform.
          </p>
        </div>
      </header>

      {/* Features grid */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        {categories.map((category) => (
          <div key={category} className="mb-20">
            <h2 className="mb-10 text-sm font-medium uppercase tracking-widest text-indigo-400">
              {category}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features
                .filter((f) => f.category === category)
                .map((feature) => (
                  <article
                    key={feature.title}
                    id={feature.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.04] scroll-mt-24"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 transition-colors group-hover:bg-indigo-500/20">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {feature.description}
                    </p>
                    <Link href={`/features#${feature.id}`} className="mt-4 block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/20 text-white/90 hover:bg-white/10"
                      >
                        Learn more
                      </Button>
                    </Link>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-12 text-center">
            <h2 className="text-2xl font-semibold">Ready to transform your hiring?</h2>
            <p className="mt-2 text-white/60">
              Get started with HireArya and experience AI-powered recruiting.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/">
                <Button className="bg-indigo-600 hover:bg-indigo-500">Go to Dashboard</Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
