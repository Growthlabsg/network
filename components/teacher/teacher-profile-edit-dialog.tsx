'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Teacher } from '@/lib/mock-teachers';
import { getTeacherProfileCompletion } from '@/lib/teacher-profile-completion';
import { TEACHER_EXPERTISE } from '@/lib/mock-teachers';
import { X, Plus, Trash2, Upload, User, ImageIcon, CheckCircle2, Circle } from 'lucide-react';

const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp,image/gif';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export interface TeacherProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher | null;
  onSave: (data: Partial<Teacher>) => void;
}

function listToText(arr: string[] | undefined): string {
  return arr?.join('\n') ?? '';
}

function textToList(s: string): string[] {
  return s.split(/\n|,/).map((x) => x.trim()).filter(Boolean);
}

function faqsToEditable(faqs: { question: string; answer: string }[] | undefined): { question: string; answer: string }[] {
  if (!faqs?.length) return [{ question: '', answer: '' }];
  return faqs.map((f) => ({ question: f.question, answer: f.answer }));
}

export function TeacherProfileEditDialog({ open, onOpenChange, teacher, onSave }: TeacherProfileEditDialogProps) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [expertiseText, setExpertiseText] = useState('');
  const [sessionsCompleted, setSessionsCompleted] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [available, setAvailable] = useState(true);
  const [about, setAbout] = useState('');
  const [howToBook, setHowToBook] = useState('');
  const [recognitionText, setRecognitionText] = useState('');
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([{ question: '', answer: '' }]);
  const [website, setWebsite] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!teacher || !open) return;
    setName(teacher.name);
    setTitle(teacher.title ?? '');
    setCompany(teacher.company ?? '');
    setLocation(teacher.location);
    setDescription(teacher.description);
    setExpertiseText(listToText(teacher.expertise));
    setSessionsCompleted(teacher.sessionsCompleted != null ? String(teacher.sessionsCompleted) : '');
    setHourlyRate(teacher.hourlyRate ?? '');
    setAvailable(teacher.available);
    setAbout(teacher.about ?? '');
    setHowToBook(teacher.howToBook ?? '');
    setRecognitionText(listToText(teacher.recognition));
    setFaqs(faqsToEditable(teacher.faqs));
    setWebsite(teacher.website ?? '');
    setLinkedIn(teacher.linkedIn ?? '');
    setLogo(teacher.logo ?? '');
    setBanner(teacher.banner ?? '');
  }, [teacher, open]);

  const handleSave = () => {
    const faqsFiltered = faqs
      .filter((f) => f.question.trim() || f.answer.trim())
      .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }));
    onSave({
      name: name.trim() || undefined,
      title: title.trim() || undefined,
      company: company.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      expertise: textToList(expertiseText),
      sessionsCompleted: sessionsCompleted.trim() ? parseInt(sessionsCompleted, 10) : undefined,
      hourlyRate: hourlyRate.trim() || undefined,
      available,
      about: about.trim() || undefined,
      howToBook: howToBook.trim() || undefined,
      recognition: textToList(recognitionText),
      faqs: faqsFiltered.length ? faqsFiltered : undefined,
      website: website.trim() || undefined,
      linkedIn: linkedIn.trim() || undefined,
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
    const data: Partial<Teacher> & { logo?: string; banner?: string } = {
      name: name.trim() || undefined,
      title: title.trim() || undefined,
      company: company.trim() || undefined,
      location: location.trim() || undefined,
      description: description.trim() || undefined,
      logo: logo.trim() || undefined,
      banner: banner.trim() || undefined,
      expertise: textToList(expertiseText),
      sessionsCompleted: sessionsCompleted.trim() ? parseInt(sessionsCompleted, 10) : undefined,
      hourlyRate: hourlyRate.trim() || undefined,
      available,
      about: about.trim() || undefined,
      howToBook: howToBook.trim() || undefined,
      recognition: textToList(recognitionText),
      faqs: faqsFiltered.length ? faqsFiltered.map((f) => ({ question: f.question.trim(), answer: f.answer.trim() })) : undefined,
      website: website.trim() || undefined,
      linkedIn: linkedIn.trim() || undefined,
    };
    return getTeacherProfileCompletion(data);
  }, [name, title, company, location, description, expertiseText, sessionsCompleted, hourlyRate, available, about, howToBook, recognitionText, faqs, website, linkedIn, logo, banner]);

  if (!open) return null;

  const section = (titleText: string, children: React.ReactNode) => (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-growthlab-slate border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">{titleText}</h3>
      {children}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => onOpenChange(false)} aria-hidden />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex flex-col border-l border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h2 className="text-lg font-semibold text-growthlab-slate">Edit teacher profile</h2>
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-lg p-2 text-muted hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-growthlab-slate">Profile completion</span>
              <span className="text-sm font-medium text-primary">{completion.percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-4">
              <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${completion.percent}%` }} />
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
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">Fill all required fields so your teacher profile is complete and visible in the directory.</p>
            )}
          </div>

          {section('Basics', (
            <>
              <label className="block text-xs font-medium text-muted mb-1">Full name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mb-3" placeholder="e.g. Dr. Sarah Chen" />
              <label className="block text-xs font-medium text-muted mb-1">Title / role</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mb-3" placeholder="e.g. Former Google Engineering Director" />
              <label className="block text-xs font-medium text-muted mb-1">Company / institution</label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} className="mb-3" placeholder="e.g. TechStart Ventures" />
              <label className="block text-xs font-medium text-muted mb-1">Location</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} className="mb-3" placeholder="e.g. Singapore" />
              <label className="block text-xs font-medium text-muted mb-1">Short bio</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20" placeholder="One paragraph for directory" />
            </>
          ))}

          {section('Profile photo & banner', (
            <>
              <div className="mb-6">
                <label className="block text-xs font-medium text-muted mb-2">Profile photo</label>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-24 w-24 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-600 overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                      {logo ? <img src={logo} alt="Photo preview" className="h-full w-full object-cover" /> : <User className="h-10 w-10 text-slate-400" />}
                    </div>
                    <div className="flex gap-2">
                      <input ref={logoInputRef} type="file" accept={ACCEPT_IMAGES} className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) try { setLogo(await readFileAsDataUrl(f)); } catch { /* ignore */ } e.target.value = ''; }} />
                      <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => logoInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-1.5" /> Upload
                      </Button>
                      {logo && <Button type="button" variant="outline" size="sm" className="rounded-lg text-muted" onClick={() => setLogo('')}>Remove</Button>}
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
                  {banner ? <img src={banner} alt="Banner preview" className="w-full h-full object-cover" /> : <ImageIcon className="h-10 w-10 text-slate-400" />}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input ref={bannerInputRef} type="file" accept={ACCEPT_IMAGES} className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (f) try { setBanner(await readFileAsDataUrl(f)); } catch { /* ignore */ } e.target.value = ''; }} />
                    <Button type="button" variant="outline" size="sm" className="rounded-lg" onClick={() => bannerInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-1.5" /> Upload banner
                    </Button>
                    {banner && <Button type="button" variant="outline" size="sm" className="rounded-lg text-muted" onClick={() => setBanner('')}>Remove</Button>}
                    <Input value={banner.startsWith('data:') ? '' : banner} onChange={(e) => setBanner(e.target.value)} placeholder="Paste banner URL" className="flex-1 min-w-[200px]" />
                  </div>
                </div>
              </div>
            </>
          ))}

          {section('Teaching', (
            <>
              <label className="block text-xs font-medium text-muted mb-1">Expertise (one per line or comma-separated)</label>
              <textarea value={expertiseText} onChange={(e) => setExpertiseText(e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm mb-3" placeholder="AI/ML, Product Strategy, Scaling" />
              <div className="flex flex-wrap gap-2 mb-4">
                {TEACHER_EXPERTISE.map((tag) => {
                  const list = textToList(expertiseText);
                  const active = list.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setExpertiseText(active ? list.filter((x) => x !== tag).join(', ') : [...list, tag].filter(Boolean).join(', '))}
                      className={active ? 'rounded-full px-3 py-1 text-xs font-medium bg-primary/15 text-primary border border-primary/30' : 'rounded-full px-3 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-muted border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              <label className="block text-xs font-medium text-muted mb-1">Sessions completed</label>
              <Input type="number" value={sessionsCompleted} onChange={(e) => setSessionsCompleted(e.target.value)} placeholder="e.g. 127" className="mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Hourly rate</label>
              <Input value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="e.g. $500/hour" className="mb-3" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="rounded border-slate-300 text-primary focus:ring-primary" />
                <span className="text-sm text-growthlab-slate">Available for sessions</span>
              </label>
            </>
          ))}

          {section('About & how to book', (
            <>
              <label className="block text-xs font-medium text-muted mb-1">About (long-form)</label>
              <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">How to book a session</label>
              <textarea value={howToBook} onChange={(e) => setHowToBook(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm mb-3" />
              <label className="block text-xs font-medium text-muted mb-1">Recognition / As seen in</label>
              <textarea value={recognitionText} onChange={(e) => setRecognitionText(e.target.value)} rows={2} className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm" />
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
                <Plus className="h-4 w-4 mr-2" /> Add FAQ
              </Button>
            </>
          ))}

          {section('Contact', (
            <>
              <label className="block text-xs font-medium text-muted mb-1">Website URL</label>
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} type="url" className="mb-3" placeholder="https://..." />
              <label className="block text-xs font-medium text-muted mb-1">LinkedIn URL</label>
              <Input value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} placeholder="https://linkedin.com/in/..." />
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
