'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { REGIONS, type StartupRegion } from '@/lib/mock-startups';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2, Rocket } from 'lucide-react';

const INDUSTRIES = ['Artificial Intelligence', 'Financial Technology', 'Healthcare Technology', 'Clean Technology', 'Education Technology', 'Logistics & Transportation'];
const STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B'];
const SIZES = ['1-10', '11-50', '51-200', '201+'];
const PRODUCT_STATUSES = ['Live', 'Beta', 'Coming soon'] as const;

const TOTAL_STEPS = 7;

type ExhibitForm = {
  name: string;
  tagline: string;
  description: string;
  website: string;
  logo: string;
  coverImage: string;
  industry: string;
  stage: string;
  size: string;
  location: string;
  region: StartupRegion;
  foundedYear: string;
  funding: string;
  growthRate: string;
  employees: string;
  tags: string;
  hiring: boolean;
  openPositions: string;
  partnerships: boolean;
  contactEmail: string;
  linkedinUrl: string;
  twitterUrl: string;
  pitchDeckUrl: string;
  onePagerUrl: string;
  videoUrl: string;
  products: { name: string; description: string; category: string; status: string; url: string }[];
};

const defaultForm: ExhibitForm = {
  name: '',
  tagline: '',
  description: '',
  website: '',
  logo: '',
  coverImage: '',
  industry: '',
  stage: '',
  size: '',
  location: '',
  region: 'Asia Pacific',
  foundedYear: '',
  funding: '',
  growthRate: '',
  employees: '',
  tags: '',
  hiring: false,
  openPositions: '0',
  partnerships: false,
  contactEmail: '',
  linkedinUrl: '',
  twitterUrl: '',
  pitchDeckUrl: '',
  onePagerUrl: '',
  videoUrl: '',
  products: [],
};

export default function ExhibitStartupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<ExhibitForm>(defaultForm);
  const [submitted, setSubmitted] = useState(false);

  const update = (updates: Partial<ExhibitForm>) => setForm((p) => ({ ...p, ...updates }));

  const addProduct = () => {
    setForm((p) => ({
      ...p,
      products: [...p.products, { name: '', description: '', category: '', status: 'Live', url: '' }],
    }));
  };
  const updateProduct = (index: number, field: string, value: string) => {
    setForm((p) => ({
      ...p,
      products: p.products.map((prod, i) => (i === index ? { ...prod, [field]: value } : prod)),
    }));
  };
  const removeProduct = (index: number) => {
    setForm((p) => ({ ...p, products: p.products.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app: POST to API, then redirect to new profile or directory
    setTimeout(() => router.push('/startups'), 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 text-center py-16">
        <div className="rounded-full h-16 w-16 bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-growthlab-slate mb-2">Startup submitted</h1>
        <p className="text-muted mb-6">
          Your listing is being reviewed. You’ll be able to edit it from your profile once approved.
        </p>
        <Link href="/startups">
          <Button className="btn-primary rounded-lg">Back to Startup Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/startups"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Startup Directory
      </Link>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Rocket className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-growthlab-slate">Exhibit your startup</h1>
          <p className="text-sm text-muted">Add your startup to the directory so investors and partners can find you.</p>
        </div>
      </div>

      <div className="mb-6 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
      <p className="text-xs text-muted mb-6">
        Step {step} of {TOTAL_STEPS}
      </p>

      <form onSubmit={handleSubmit}>
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {/* Step 1 – Basics */}
            {step === 1 && (
              <div className="space-y-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Basics</p>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Startup name *</label>
                  <Input
                    required
                    value={form.name}
                    onChange={(e) => update({ name: e.target.value })}
                    placeholder="e.g. TechNova Solutions"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Tagline</label>
                  <Input
                    value={form.tagline}
                    onChange={(e) => update({ tagline: e.target.value })}
                    placeholder="Short one-liner for your profile"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => update({ description: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="What does your startup do? Who is it for?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Website</label>
                  <Input
                    type="url"
                    value={form.website}
                    onChange={(e) => update({ website: e.target.value })}
                    placeholder="https://..."
                    className="rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-growthlab-slate mb-1">Logo URL</label>
                    <Input
                      value={form.logo}
                      onChange={(e) => update({ logo: e.target.value })}
                      placeholder="https://..."
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-growthlab-slate mb-1">Cover / banner image URL</label>
                    <Input
                      value={form.coverImage}
                      onChange={(e) => update({ coverImage: e.target.value })}
                      placeholder="https://..."
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 – Company details */}
            {step === 2 && (
              <div className="space-y-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Company details</p>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Industry *</label>
                  <select
                    required
                    value={form.industry}
                    onChange={(e) => update({ industry: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Stage *</label>
                  <select
                    required
                    value={form.stage}
                    onChange={(e) => update({ stage: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select stage</option>
                    {STAGES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Company size</label>
                  <select
                    value={form.size}
                    onChange={(e) => update({ size: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select size</option>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>{s} employees</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Location *</label>
                  <Input
                    required
                    value={form.location}
                    onChange={(e) => update({ location: e.target.value })}
                    placeholder="e.g. Singapore"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Region *</label>
                  <select
                    required
                    value={form.region}
                    onChange={(e) => update({ region: e.target.value as StartupRegion })}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-growthlab-slate mb-1">Founded year *</label>
                    <Input
                      required
                      type="number"
                      min="1990"
                      max={new Date().getFullYear()}
                      value={form.foundedYear}
                      onChange={(e) => update({ foundedYear: e.target.value })}
                      placeholder="e.g. 2022"
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-growthlab-slate mb-1">Funding raised</label>
                    <Input
                      value={form.funding}
                      onChange={(e) => update({ funding: e.target.value })}
                      placeholder="e.g. $2.5M"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-growthlab-slate mb-1">Growth rate</label>
                    <Input
                      value={form.growthRate}
                      onChange={(e) => update({ growthRate: e.target.value })}
                      placeholder="e.g. 45%"
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-growthlab-slate mb-1">Team size (number)</label>
                    <Input
                      type="number"
                      min="0"
                      value={form.employees}
                      onChange={(e) => update({ employees: e.target.value })}
                      placeholder="e.g. 25"
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Tags (comma-separated)</label>
                  <Input
                    value={form.tags}
                    onChange={(e) => update({ tags: e.target.value })}
                    placeholder="e.g. AI, SaaS, Enterprise"
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 3 – Hiring & partnerships */}
            {step === 3 && (
              <div className="space-y-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Hiring & partnerships</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hiring}
                    onChange={(e) => update({ hiring: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-growthlab-slate">We are hiring</span>
                </label>
                {form.hiring && (
                  <div>
                    <label className="block text-sm font-medium text-growthlab-slate mb-1">Open positions</label>
                    <Input
                      type="number"
                      min="0"
                      value={form.openPositions}
                      onChange={(e) => update({ openPositions: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>
                )}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.partnerships}
                    onChange={(e) => update({ partnerships: e.target.checked })}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-growthlab-slate">Open to partnerships</span>
                </label>
              </div>
            )}

            {/* Step 4 – Contact & social */}
            {step === 4 && (
              <div className="space-y-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Contact & social</p>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Contact email *</label>
                  <Input
                    required
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => update({ contactEmail: e.target.value })}
                    placeholder="hello@yourstartup.com"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">LinkedIn company URL</label>
                  <Input
                    type="url"
                    value={form.linkedinUrl}
                    onChange={(e) => update({ linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/company/..."
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">X (Twitter) URL</label>
                  <Input
                    type="url"
                    value={form.twitterUrl}
                    onChange={(e) => update({ twitterUrl: e.target.value })}
                    placeholder="https://x.com/..."
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 5 – Resources */}
            {step === 5 && (
              <div className="space-y-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Resources (optional)</p>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Pitch deck URL</label>
                  <Input
                    type="url"
                    value={form.pitchDeckUrl}
                    onChange={(e) => update({ pitchDeckUrl: e.target.value })}
                    placeholder="https://..."
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">One-pager URL</label>
                  <Input
                    type="url"
                    value={form.onePagerUrl}
                    onChange={(e) => update({ onePagerUrl: e.target.value })}
                    placeholder="https://..."
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-growthlab-slate mb-1">Pitch / product video URL</label>
                  <Input
                    type="url"
                    value={form.videoUrl}
                    onChange={(e) => update({ videoUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Step 6 – Products */}
            {step === 6 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">Products (optional)</p>
                  <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={addProduct}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add product
                  </Button>
                </div>
                {form.products.length === 0 ? (
                  <p className="text-sm text-muted">Add products or offerings you want to list. You can skip this step.</p>
                ) : (
                  <ul className="space-y-4">
                    {form.products.map((prod, index) => (
                      <li key={index} className="rounded-xl border border-slate-200 dark:border-slate-600 p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-growthlab-slate">Product {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted hover:text-rose-600"
                            onClick={() => removeProduct(index)}
                            aria-label="Remove product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Product name"
                          value={prod.name}
                          onChange={(e) => updateProduct(index, 'name', e.target.value)}
                          className="rounded-lg"
                        />
                        <textarea
                          rows={2}
                          placeholder="Short description"
                          value={prod.description}
                          onChange={(e) => updateProduct(index, 'description', e.target.value)}
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Input
                            placeholder="Category (e.g. SaaS)"
                            value={prod.category}
                            onChange={(e) => updateProduct(index, 'category', e.target.value)}
                            className="rounded-lg"
                          />
                          <select
                            value={prod.status}
                            onChange={(e) => updateProduct(index, 'status', e.target.value)}
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                          >
                            {PRODUCT_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <Input
                          type="url"
                          placeholder="Product URL (optional)"
                          value={prod.url}
                          onChange={(e) => updateProduct(index, 'url', e.target.value)}
                          className="rounded-lg"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Step 7 – Review */}
            {step === 7 && (
              <div className="space-y-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Review</p>
                <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 p-4 space-y-3 text-sm">
                  <p><strong className="text-growthlab-slate">Name:</strong> {form.name || '—'}</p>
                  <p><strong className="text-growthlab-slate">Tagline:</strong> {form.tagline || '—'}</p>
                  <p><strong className="text-growthlab-slate">Industry:</strong> {form.industry || '—'}</p>
                  <p><strong className="text-growthlab-slate">Stage:</strong> {form.stage || '—'}</p>
                  <p><strong className="text-growthlab-slate">Location:</strong> {form.location || '—'}</p>
                  <p><strong className="text-growthlab-slate">Contact:</strong> {form.contactEmail || '—'}</p>
                  {form.products.length > 0 && (
                    <p><strong className="text-growthlab-slate">Products:</strong> {form.products.length}</p>
                  )}
                </div>
                <p className="text-xs text-muted">
                  By submitting, you agree to our directory terms. Your listing will be reviewed before going live.
                </p>
              </div>
            )}

            <div className="flex justify-between pt-6 mt-6 border-t border-slate-200 dark:border-slate-700">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg border-slate-300 dark:border-slate-600"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  className="btn-primary rounded-lg"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" className="btn-primary rounded-lg">
                  Submit listing
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
