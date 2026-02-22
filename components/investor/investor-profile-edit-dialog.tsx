'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Investor } from '@/lib/mock-investors';
import { getProfileCompletion } from '@/lib/investor-profile-completion';
import { X, Plus, Trash2, Upload, Building2, ImageIcon, CheckCircle2, Circle } from 'lucide-react';

const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp,image/gif';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export interface InvestorProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investor: Investor | null;
  onSave: (data: Partial<Investor>) => void;
}

function listToText(arr: string[] | undefined): string {
  return arr?.join('\n') ?? '';
}

function textToList(s: string): string[] {
  return s
    .split(/\n|,/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function faqsToEditable(faqs: { question: string; answer: string }[] | undefined): { question: string; answer: string }[] {
  if (!faqs?.length) return [{ question: '', answer: '' }];
  return faqs.map((f) => ({ question: f.question, answer: f.answer }));
}

export function InvestorProfileEditDialog({
  open,
  onOpenChange,
  investor,
  onSave,
}: InvestorProfileEditDialogProps) {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [investmentRange, setInvestmentRange] = useState('');
  const [portfolioCount, setPortfolioCount] = useState('');
  const [focus, setFocus] = useState('');
  const [industriesText, setIndustriesText] = useState('');
  const [stagesText, setStagesText] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [website, setWebsite] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [avgResponseDays, setAvgResponseDays] = useState('');
  const [about, setAbout] = useState('');
  const [investmentThesis, setInvestmentThesis] = useState('');
  const [companyStory, setCompanyStory] = useState('');
  const [howToApply, setHowToApply] = useState('');
  const [keyFactsText, setKeyFactsText] = useState('');
  const [geographiesText, setGeographiesText] = useState('');
  const [recognitionText, setRecognitionText] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [portfolioHighlightsText, setPortfolioHighlightsText] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [twitter, setTwitter] = useState('');
  const [contactPrivate, setContactPrivate] = useState(false);
  const [dealsLast12Months, setDealsLast12Months] = useState('');
  const [preferredIntro, setPreferredIntro] = useState<'warm' | 'cold' | 'both'>('both');
  const [leadOrFollow, setLeadOrFollow] = useState<'Lead' | 'Follow' | 'Both'>('Both');
  const [activeDeals, setActiveDeals] = useState('');
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([{ question: '', answer: '' }]);
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!investor || !open) return;
    setName(investor.name);
    setTagline(investor.tagline ?? '');
    setType(investor.type);
    setLocation(investor.location);
    setDescription(investor.description);
    setInvestmentRange(investor.investmentRange);
    setPortfolioCount(String(investor.portfolioCount ?? ''));
    setFocus(investor.focus);
    setIndustriesText(listToText(investor.industries));
    setStagesText(listToText(investor.stages));
    setFoundedYear(investor.foundedYear != null ? String(investor.foundedYear) : '');
    setWebsite(investor.website ?? '');
    setResponseTime(investor.responseTime ?? '');
    setAvgResponseDays(investor.avgResponseDays != null ? String(investor.avgResponseDays) : '');
    setAbout(investor.about ?? '');
    setInvestmentThesis(investor.investmentThesis ?? '');
    setCompanyStory(investor.companyStory ?? '');
    setHowToApply(investor.howToApply ?? '');
    setKeyFactsText(listToText(investor.keyFacts));
    setGeographiesText(listToText(investor.geographies));
    setRecognitionText(listToText(investor.recognition));
    setTeamSize(investor.teamSize ?? '');
    setPortfolioHighlightsText(listToText(investor.portfolioHighlights));
    setLinkedIn(investor.linkedIn ?? '');
    setTwitter(investor.twitter ?? '');
    setContactPrivate(investor.contactPrivate ?? false);
    setDealsLast12Months(investor.dealsLast12Months != null ? String(investor.dealsLast12Months) : '');
    setPreferredIntro(investor.preferredIntro ?? 'both');
    setLeadOrFollow(investor.leadOrFollow ?? 'Both');
    setActiveDeals(investor.activeDeals ?? '');
    setFaqs(faqsToEditable(investor.faqs));
    setLogo(investor.logo ?? '');
    setBanner(investor.banner ?? '');
  }, [investor, open]);

  const handleSave = () => {
    const faqsFiltered = faqs.filter((f) => f.question.trim() || f.answer.trim()).map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }));
    onSave({
      name: name.trim() || undefined,
      tagline: tagline.trim() || undefined,
      type: type.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      investmentRange: investmentRange.trim() || undefined,
      portfolioCount: portfolioCount.trim() ? parseInt(portfolioCount, 10) : undefined,
      focus: focus.trim() || undefined,
      industries: textToList(industriesText),
      stages: textToList(stagesText),
      foundedYear: foundedYear.trim() ? parseInt(foundedYear, 10) : undefined,
      website: website.trim() || undefined,
      responseTime: responseTime.trim() || undefined,
      avgResponseDays: avgResponseDays.trim() ? parseInt(avgResponseDays, 10) : undefined,
      about: about.trim() || undefined,
      investmentThesis: investmentThesis.trim() || undefined,
      companyStory: companyStory.trim() || undefined,
      howToApply: howToApply.trim() || undefined,
      keyFacts: textToList(keyFactsText),
      geographies: textToList(geographiesText),
      recognition: textToList(recognitionText),
      teamSize: teamSize.trim() || undefined,
      portfolioHighlights: textToList(portfolioHighlightsText),
      linkedIn: linkedIn.trim() || undefined,
      twitter: twitter.trim() || undefined,
      contactPrivate,
      dealsLast12Months: dealsLast12Months.trim() ? parseInt(dealsLast12Months, 10) : undefined,
      preferredIntro,
      leadOrFollow,
      activeDeals: activeDeals.trim() || undefined,
      faqs: faqsFiltered.length ? faqsFiltered : undefined,
      logo: logo.trim() || undefined,
      banner: banner.trim() || undefined,
    });
    onOpenChange(false);
  };

  const addFaq = () => setFaqs((p) => [...p, { question: '', answer: '' }]);
  const removeFaq = (i: number) => setFaqs((p) => p.filter((_, j) => j !== i));
  const updateFaq = (i: number, field: 'question' | 'answer', value: string) =>
    setFaqs((p) => p.map((f, j) => (j === i ? { ...f, [field]: value } : f)));

  const completion = useMemo(() => {
    const faqsFiltered = faqs.filter((f) => f.question.trim() || f.answer.trim());
    const data: Partial<Investor> & { logo?: string; banner?: string } = {
      name: name.trim() || undefined,
      tagline: tagline.trim() || undefined,
      type: type.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      logo: logo.trim() || undefined,
      banner: banner.trim() || undefined,
      investmentRange: investmentRange.trim() || undefined,
      portfolioCount: portfolioCount.trim() ? parseInt(portfolioCount, 10) : undefined,
      focus: focus.trim() || undefined,
      industries: textToList(industriesText),
      stages: textToList(stagesText),
      preferredIntro,
      leadOrFollow,
      about: about.trim() || undefined,
      investmentThesis: investmentThesis.trim() || undefined,
      companyStory: companyStory.trim() || undefined,
      howToApply: howToApply.trim() || undefined,
      responseTime: responseTime.trim() || undefined,
      avgResponseDays: avgResponseDays.trim() ? parseInt(avgResponseDays, 10) : undefined,
      keyFacts: textToList(keyFactsText),
      portfolioHighlights: textToList(portfolioHighlightsText),
      recognition: textToList(recognitionText),
      geographies: textToList(geographiesText),
      teamSize: teamSize.trim() || undefined,
      faqs: faqsFiltered.length ? faqsFiltered.map((f) => ({ question: f.question.trim(), answer: f.answer.trim() })) : undefined,
      website: website.trim() || undefined,
      linkedIn: linkedIn.trim() || undefined,
      twitter: twitter.trim() || undefined,
    };
    return getProfileCompletion(data);
  }, [
    name, tagline, type, location, description, logo, banner, investmentRange, portfolioCount, focus,
    industriesText, stagesText, preferredIntro, leadOrFollow, about, investmentThesis, companyStory,
    howToApply, responseTime, avgResponseDays, keyFactsText, portfolioHighlightsText, recognitionText,
    geographiesText, teamSize, faqs, website, linkedIn, twitter,
  ]);

  if (!open) return null;

  const section = (title: string, children: React.ReactNode) => (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-growthlab-slate border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} aria-hidden />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex flex-col border-l border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h2 className="text-lg font-semibold text-growthlab-slate">Edit profile</h2>
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg p-2 text-muted hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Profile completion checklist */}
          <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-growthlab-slate">Profile completion</span>
              <span className="text-sm font-medium text-primary">{completion.percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-4">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${completion.percent}%` }}
              />
            </div>
            <p className="text-xs text-muted mb-3">
              Required: {completion.requiredFilled}/{completion.requiredTotal} · Recommended: {completion.recommendedFilled}/{completion.recommendedTotal}
            </p>
            <ul className="space-y-1.5 max-h-32 overflow-y-auto">
              {completion.items.filter((i) => i.required).map((item) => (
                <li key={item.id} className="flex items-center gap-2 text-xs">
                  {item.filled ? <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> : <Circle className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />}
                  <span className={item.filled ? 'text-growthlab-slate' : 'text-muted'}>{item.label}</span>
                </li>
              ))}
            </ul>
            {!completion.isComplete && (
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">Fill all required fields so your profile is complete and visible to startups.</p>
            )}
          </div>

          {section('Basics', (
            <>
              <label className="block text-xs font-medium text-muted mb-1">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mb-3" placeholder="Fund or firm name" />
              <label className="block text-xs font-medium text-muted mb-1">Tagline</label>
              <Input value={tagline} onChange={(e) => setTagline(e.target.value)} className="mb-3" placeholder="Short headline" />
              <label className="block text-xs font-medium text-muted mb-1">Type</label>
              <Input value={type} onChange={(e) => setType(e.target.value)} className="mb-3" placeholder="e.g. VC Fund, Angel" />
              <label className="block text-xs font-medium text-muted mb-1">Location</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} className="mb-3" placeholder="City or region" />
              <label className="block text-xs font-medium text-muted mb-1">Short description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20" placeholder="One paragraph for directory" />
            </>
          ))}
          {section('Investment', (
            <>
              <label className="block text-xs font-medium text-muted mb-1">Check size / investment range</label>
              <Input value={investmentRange} onChange={(e) => setInvestmentRange(e.target.value)} className="mb-3" placeholder="e.g. $500K – $5M" />
              <label className="block text-xs font-medium text-muted mb-1">Portfolio companies (count)</label>
              <Input type="number" value={portfolioCount} onChange={(e) => setPortfolioCount(e.target.value)} className="mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Focus (short)</label>
              <Input value={focus} onChange={(e) => setFocus(e.target.value)} className="mb-3" placeholder="e.g. Fintech, E-commerce" />
              <label className="block text-xs font-medium text-muted mb-1">Industries (one per line or comma-separated)</label>
              <textarea value={industriesText} onChange={(e) => setIndustriesText(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm mb-3" placeholder="Fintech\nE-commerce\nSaaS" />
              <label className="block text-xs font-medium text-muted mb-1">Stages</label>
              <Input value={stagesText} onChange={(e) => setStagesText(e.target.value)} placeholder="Seed, Series A" className="mb-3" />
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Preferred intro</label>
                  <select value={preferredIntro} onChange={(e) => setPreferredIntro(e.target.value as 'warm' | 'cold' | 'both')} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
                    <option value="warm">Warm</option>
                    <option value="cold">Cold</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">Lead or follow</label>
                  <select value={leadOrFollow} onChange={(e) => setLeadOrFollow(e.target.value as 'Lead' | 'Follow' | 'Both')} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm">
                    <option value="Lead">Lead</option>
                    <option value="Follow">Follow</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
              <label className="block text-xs font-medium text-muted mb-1">Active deals / status</label>
              <Input value={activeDeals} onChange={(e) => setActiveDeals(e.target.value)} placeholder="e.g. Actively investing" />
            </>
          ))}
          {section('About & thesis', (
            <>
              <label className="block text-xs font-medium text-muted mb-1">About (long-form)</label>
              <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Investment thesis / Why we invest</label>
              <textarea value={investmentThesis} onChange={(e) => setInvestmentThesis(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Company story</label>
              <textarea value={companyStory} onChange={(e) => setCompanyStory(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
            </>
          ))}
          {section('Process', (
            <>
              <label className="block text-xs font-medium text-muted mb-1">How to apply</label>
              <textarea value={howToApply} onChange={(e) => setHowToApply(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Response time (e.g. Within 2 weeks)</label>
              <Input value={responseTime} onChange={(e) => setResponseTime(e.target.value)} className="mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Avg response (days)</label>
              <Input type="number" value={avgResponseDays} onChange={(e) => setAvgResponseDays(e.target.value)} className="mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Deals last 12 months</label>
              <Input type="number" value={dealsLast12Months} onChange={(e) => setDealsLast12Months(e.target.value)} />
            </>
          ))}
          {section('Highlights & social proof', (
            <>
              <label className="block text-xs font-medium text-muted mb-1">Key facts (one per line)</label>
              <textarea value={keyFactsText} onChange={(e) => setKeyFactsText(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Portfolio highlights (company names, one per line)</label>
              <textarea value={portfolioHighlightsText} onChange={(e) => setPortfolioHighlightsText(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Recognition / As seen in</label>
              <textarea value={recognitionText} onChange={(e) => setRecognitionText(e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Geographies (one per line)</label>
              <textarea value={geographiesText} onChange={(e) => setGeographiesText(e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Team size</label>
              <Input value={teamSize} onChange={(e) => setTeamSize(e.target.value)} placeholder="e.g. 12 investment professionals" />
            </>
          ))}
          {section('FAQ', (
            <>
              {faqs.map((f, i) => (
                <div key={i} className="mb-4 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-muted">Q&A {i + 1}</span>
                    <button type="button" onClick={() => removeFaq(i)} className="text-muted hover:text-rose-600 p-1" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Input value={f.question} onChange={(e) => updateFaq(i, 'question', e.target.value)} placeholder="Question" className="mb-2" />
                  <textarea value={f.answer} onChange={(e) => updateFaq(i, 'answer', e.target.value)} rows={2} placeholder="Answer" className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFaq} className="rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </>
          ))}
          {section('Profile photo & banner', (
            <>
              <div className="mb-6">
                <label className="block text-xs font-medium text-muted mb-2">Profile photo (logo)</label>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-24 w-24 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                      {logo ? (
                        <img src={logo} alt="Logo preview" className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-10 w-10 text-slate-400" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept={ACCEPT_IMAGES}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const dataUrl = await readFileAsDataUrl(file);
                            setLogo(dataUrl);
                          } catch {
                            // ignore
                          }
                          e.target.value = '';
                        }}
                      />
                      <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => logoInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-1.5" />
                        Upload
                      </Button>
                      {logo && (
                        <Button type="button" variant="outline" size="sm" className="rounded-lg text-muted" onClick={() => setLogo('')}>
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted mb-1">Or paste image URL</p>
                    <Input value={logo.startsWith('data:') ? '' : logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://..." />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-2">Banner image</label>
                <div className="space-y-3">
                  <div className="aspect-[3/1] max-h-32 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                    {banner ? (
                      <img src={banner} alt="Banner preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={bannerInputRef}
                      type="file"
                      accept={ACCEPT_IMAGES}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const dataUrl = await readFileAsDataUrl(file);
                          setBanner(dataUrl);
                        } catch {
                          // ignore
                        }
                        e.target.value = '';
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => bannerInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-1.5" />
                      Upload banner
                    </Button>
                    {banner && (
                      <Button type="button" variant="outline" size="sm" className="rounded-lg text-muted" onClick={() => setBanner('')}>
                        Remove
                      </Button>
                    )}
                    <span className="text-xs text-muted">or</span>
                    <Input
                      value={banner.startsWith('data:') ? '' : banner}
                      onChange={(e) => setBanner(e.target.value)}
                      placeholder="Paste banner image URL"
                      className="flex-1 min-w-[200px]"
                    />
                  </div>
                </div>
              </div>
            </>
          ))}
          {section('Contact & links', (
            <>
              <label className="block text-xs font-medium text-muted mb-1">Website URL</label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} type="url" className="mb-3" placeholder="https://..." />
              <label className="block text-xs font-medium text-muted mb-1">LinkedIn URL</label>
              <Input value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} className="mb-3" placeholder="https://linkedin.com/..." />
              <label className="block text-xs font-medium text-muted mb-1">Twitter / X (handle or URL)</label>
              <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} className="mb-3" placeholder="@handle or https://..." />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={contactPrivate} onChange={(e) => setContactPrivate(e.target.checked)} className="rounded border-slate-300" />
                <span className="text-sm text-growthlab-slate">Contact only via in-app message (no public email/website)</span>
              </label>
            </>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg">Cancel</Button>
          <Button onClick={handleSave} className="btn-primary rounded-lg">Save changes</Button>
        </div>
      </div>
    </>
  );
}
