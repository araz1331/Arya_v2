"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { huntSalesCandidates } from "@/lib/actions/sales-agent";

export default function SalesAgentPage() {
  const [roleTitle, setRoleTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [keySkills, setKeySkills] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleHunt(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const output = await huntSalesCandidates({
        roleTitle: roleTitle || "Sales Representative",
        experienceLevel,
        industry: industry || "Technology",
        companySize: companySize || "50-200",
        keySkills: keySkills || "B2B sales, pipeline management",
      });
      setResult(output);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to run hunt. Check GEMINI_API_KEY in .env.local."
      );
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
          <h1 className="text-xl font-semibold">Sales Agent / Hunter</h1>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Hunt Sales Candidates</h2>
          <p className="mt-2 text-white/60">
            Configure your search criteria. AI will generate candidate profiles, sourcing channels,
            and outreach templates.
          </p>
        </div>

        <form onSubmit={handleHunt} className="space-y-6">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Search Criteria</CardTitle>
              <CardDescription className="text-white/60">
                Describe the sales role you&apos;re hiring for
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Role Title</Label>
                  <Input
                    id="role"
                    placeholder="e.g. Enterprise Account Executive"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <select
                    id="experience"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/20 bg-white/5 px-3 py-2 text-white"
                  >
                    <option value="junior">Junior (0-2 years)</option>
                    <option value="mid">Mid (2-5 years)</option>
                    <option value="senior">Senior (5-10 years)</option>
                    <option value="lead">Lead / VP (10+ years)</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g. SaaS, Fintech"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Size</Label>
                  <Input
                    id="company"
                    placeholder="e.g. 50-200, Enterprise"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Key Skills</Label>
                <Textarea
                  id="skills"
                  placeholder="e.g. B2B sales, MEDDIC, pipeline management, CRM"
                  value={keySkills}
                  onChange={(e) => setKeySkills(e.target.value)}
                  rows={2}
                  className="border-white/20 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Hunting...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Hunt Candidates
              </>
            )}
          </Button>
        </form>

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
              <CardTitle>Hunt Results</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-white/20 text-white/90"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/90">
                  {result}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
