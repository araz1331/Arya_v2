"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Target,
  Mail,
  MessageCircle,
  Handshake,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  findProspects,
  generateOutreach,
  handleConversation,
  closeDeal,
} from "@/lib/actions/sales-agent";

type Tab = "find" | "outreach" | "conversation" | "close";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "find", label: "Find Prospects", icon: Target },
  { id: "outreach", label: "Contact", icon: Mail },
  { id: "conversation", label: "Conversation", icon: MessageCircle },
  { id: "close", label: "Close Deal", icon: Handshake },
];

export default function SalesAgentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("find");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Find prospects
  const [product, setProduct] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [geography, setGeography] = useState("");
  const [budgetSignals, setBudgetSignals] = useState("");

  // Outreach
  const [prospectContext, setProspectContext] = useState("");
  const [channel, setChannel] = useState<"email" | "linkedin" | "cold-call">("email");
  const [tone, setTone] = useState<"professional" | "casual" | "urgent">("professional");

  // Conversation
  const [objection, setObjection] = useState("");
  const [stage, setStage] = useState<"discovery" | "demo" | "proposal" | "negotiation">("discovery");

  // Close
  const [dealContext, setDealContext] = useState("");
  const [hesitation, setHesitation] = useState("");

  function resetAndRun() {
    setError(null);
    setResult(null);
  }

  async function handleFindProspects(e: React.FormEvent) {
    e.preventDefault();
    resetAndRun();
    setIsLoading(true);
    try {
      const output = await findProspects({
        productOrService: product || "our product/service",
        industry: industry || "any",
        targetCompanySize: companySize || "SMB to Enterprise",
        geography: geography || undefined,
        budgetSignals: budgetSignals || undefined,
      });
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed. Check GEMINI_API_KEY.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOutreach(e: React.FormEvent) {
    e.preventDefault();
    resetAndRun();
    setIsLoading(true);
    try {
      const output = await generateOutreach({
        productOrService: product || "our product/service",
        prospectContext: prospectContext || "decision maker at target company",
        channel,
        tone,
      });
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed. Check GEMINI_API_KEY.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConversationSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetAndRun();
    setIsLoading(true);
    try {
      const output = await handleConversation({
        productOrService: product || "our product/service",
        prospectObjection: objection || "I'm not sure we need this",
        stage,
      });
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed. Check GEMINI_API_KEY.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleClose(e: React.FormEvent) {
    e.preventDefault();
    resetAndRun();
    setIsLoading(true);
    try {
      const output = await closeDeal({
        productOrService: product || "our product/service",
        dealContext: dealContext || "prospect is interested but not committed",
        prospectHesitation: hesitation || undefined,
      });
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed. Check GEMINI_API_KEY.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div role="main" className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-semibold">Universal Sales Agent</h1>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Identify → Contact → Communicate → Close</h2>
          <p className="mt-2 text-white/60">
            AI-powered sales for any industry. Find buyers, reach out, handle objections, and close
            deals.
          </p>
        </div>

        {/* Product context - shared across all tabs */}
        <Card className="mb-8 border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-sm">Your Product / Service</CardTitle>
            <CardDescription className="text-white/60">
              Context used across all tools. Fill once.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="e.g. B2B project management software for construction firms"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
            />
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "bg-indigo-600 hover:bg-indigo-500"
                  : "border-white/20 text-white/80 hover:bg-white/10"
              }
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "find" && (
          <form onSubmit={handleFindProspects} className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Find Prospects</CardTitle>
                <CardDescription className="text-white/60">
                  Identify ideal buyers and where to find them
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Input
                      placeholder="e.g. Healthcare, SaaS, Manufacturing"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Size</Label>
                    <Input
                      placeholder="e.g. 50-500 employees, Enterprise"
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Geography (optional)</Label>
                    <Input
                      placeholder="e.g. North America, EMEA"
                      value={geography}
                      onChange={(e) => setGeography(e.target.value)}
                      className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Budget / Spend Signals (optional)</Label>
                    <Input
                      placeholder="e.g. Recently funded, hiring for ops"
                      value={budgetSignals}
                      onChange={(e) => setBudgetSignals(e.target.value)}
                      className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
              Find Prospects
            </Button>
          </form>
        )}

        {activeTab === "outreach" && (
          <form onSubmit={handleOutreach} className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Contact Prospects</CardTitle>
                <CardDescription className="text-white/60">
                  Generate outreach messages for your channel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Prospect Context</Label>
                  <Textarea
                    placeholder="e.g. VP of Operations at a 200-person logistics company, recently expanded to 3 new regions"
                    value={prospectContext}
                    onChange={(e) => setProspectContext(e.target.value)}
                    rows={2}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Channel</Label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value as typeof channel)}
                      className="flex h-10 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white"
                    >
                      <option value="email">Email</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="cold-call">Cold Call</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as typeof tone)}
                      className="flex h-10 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
              Generate Outreach
            </Button>
          </form>
        )}

        {activeTab === "conversation" && (
          <form onSubmit={handleConversationSubmit} className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Handle Objections</CardTitle>
                <CardDescription className="text-white/60">
                  Get responses for prospect objections and keep the conversation moving
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>What did the prospect say?</Label>
                  <Textarea
                    placeholder="e.g. Your price is too high / We're happy with our current vendor / I need to run this by my team"
                    value={objection}
                    onChange={(e) => setObjection(e.target.value)}
                    rows={2}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sales Stage</Label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as typeof stage)}
                    className="flex h-10 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white"
                  >
                    <option value="discovery">Discovery</option>
                    <option value="demo">Demo</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                  </select>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
              Get Response
            </Button>
          </form>
        )}

        {activeTab === "close" && (
          <form onSubmit={handleClose} className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle>Close the Deal</CardTitle>
                <CardDescription className="text-white/60">
                  Closing techniques, scripts, and next steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Deal Context</Label>
                  <Textarea
                    placeholder="e.g. Prospect liked the demo, asked for pricing. Budget approved. Decision maker."
                    value={dealContext}
                    onChange={(e) => setDealContext(e.target.value)}
                    rows={2}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prospect Hesitation (optional)</Label>
                  <Input
                    placeholder="e.g. I need to think about it / We need to check with legal"
                    value={hesitation}
                    onChange={(e) => setHesitation(e.target.value)}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
              </CardContent>
            </Card>
            <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Handshake className="mr-2 h-4 w-4" />}
              Get Closing Strategy
            </Button>
          </form>
        )}

        {error && (
          <Card className="mt-8 border-red-500/30 bg-red-500/10">
            <CardContent className="pt-6">
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="mt-8 border-white/10 bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Result</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-white/20 text-white/90"
              >
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/90">
                {result}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
