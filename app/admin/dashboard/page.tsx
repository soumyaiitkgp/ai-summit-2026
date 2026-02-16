'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { NewsItem, TopicTag } from '@/lib/types'
import { relativeTime } from '@/lib/utils'

const TOPIC_TAGS: TopicTag[] = ['policy', 'startups', 'research', 'keynotes', 'funding', 'ethics', 'infrastructure', 'general']

type Tab = 'stories' | 'dispatch' | 'sessions'

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('stories')
  const [stories, setStories] = useState<NewsItem[]>([])
  const [dispatchText, setDispatchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Story form state
  const [form, setForm] = useState({
    type: 'news' as 'news' | 'quote' | 'update',
    title: '',
    summary: '',
    link: '',
    source: 'Editorial',
    day: 1,
    topicTag: 'general' as TopicTag,
    curatorNote: '',
    speaker: '',
    speakerTitle: '',
    featured: false,
    pinned: false,
    breaking: false,
  })

  useEffect(() => {
    loadStories()
    loadDispatch()
  }, [])

  async function loadStories() {
    try {
      const res = await fetch('/api/admin/stories')
      if (res.status === 401) { router.push('/admin'); return }
      const data = await res.json()
      setStories(data.stories || [])
    } catch {}
  }

  async function loadDispatch() {
    try {
      const res = await fetch('/api/admin/dispatch')
      const data = await res.json()
      if (data.dispatch?.text) setDispatchText(data.dispatch.text)
    } catch {}
  }

  async function publishStory(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setMsg('✓ Story published!')
        setForm({ type: 'news', title: '', summary: '', link: '', source: 'Editorial', day: 1, topicTag: 'general', curatorNote: '', speaker: '', speakerTitle: '', featured: false, pinned: false, breaking: false })
        loadStories()
      } else {
        setMsg('Error publishing. Is Supabase configured?')
      }
    } catch (err) {
      setMsg('Network error: ' + String(err))
    } finally {
      setLoading(false)
    }
  }

  async function deleteStory(id: string) {
    await fetch(`/api/admin/stories?id=${id}`, { method: 'DELETE' })
    loadStories()
  }

  async function saveDispatch() {
    setLoading(true)
    try {
      await fetch('/api/admin/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: dispatchText }),
      })
      setMsg('✓ Dispatch saved!')
    } catch {
      setMsg('Error saving dispatch')
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin')
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-bold text-xl">Editorial Dashboard</h1>
          <p className="text-slate-400 text-sm">AI Summit 2026 · Content Manager</p>
        </div>
        <button onClick={logout} className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500">
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-700 pb-2">
        {(['stories', 'dispatch', 'sessions'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            {t === 'stories' ? '📝 Stories' : t === 'dispatch' ? '✍️ Dispatch' : '📅 Sessions'}
          </button>
        ))}
      </div>

      {msg && (
        <div className={`mb-4 rounded-lg px-4 py-2 text-sm font-medium ${msg.startsWith('✓') ? 'bg-green-900/40 text-green-400 border border-green-500/30' : 'bg-red-900/40 text-red-400 border border-red-500/30'}`}>
          {msg}
        </div>
      )}

      {/* Stories tab */}
      {tab === 'stories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compose form */}
          <div>
            <h2 className="text-white font-semibold mb-4">Add Story</h2>
            <form onSubmit={publishStory} className="space-y-3">
              {/* Type */}
              <div className="flex gap-2">
                {(['news', 'quote', 'update'] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setForm((p) => ({ ...p, type: t }))}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${form.type === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                    {t === 'news' ? '📰' : t === 'quote' ? '"' : '📌'} {t}
                  </button>
                ))}
              </div>

              <input required value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder={form.type === 'quote' ? 'The quote text' : 'Headline'}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />

              <textarea value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                placeholder={form.type === 'quote' ? 'Context / session' : '2-3 sentence summary'}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none" />

              {form.type !== 'quote' && (
                <input value={form.link} onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                  placeholder="Source URL (optional)"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
              )}

              {form.type === 'quote' && (
                <>
                  <input value={form.speaker} onChange={(e) => setForm((p) => ({ ...p, speaker: e.target.value }))}
                    placeholder="Speaker name"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                  <input value={form.speakerTitle} onChange={(e) => setForm((p) => ({ ...p, speakerTitle: e.target.value }))}
                    placeholder="Speaker title / role"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />
                </>
              )}

              <input value={form.curatorNote} onChange={(e) => setForm((p) => ({ ...p, curatorNote: e.target.value }))}
                placeholder="Editor's note (optional — shown in italic)"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500" />

              <div className="grid grid-cols-2 gap-2">
                <select value={form.day} onChange={(e) => setForm((p) => ({ ...p, day: Number(e.target.value) }))}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:border-blue-500">
                  {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>Day {d}</option>)}
                </select>
                <select value={form.topicTag} onChange={(e) => setForm((p) => ({ ...p, topicTag: e.target.value as TopicTag }))}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm focus:outline-none focus:border-blue-500">
                  {TOPIC_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex gap-4 text-sm text-slate-400">
                {([['pinned', '📌 Pinned'], ['featured', '⭐ Featured'], ['breaking', '⚡ Breaking']] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" checked={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))} className="accent-blue-500" />
                    {label}
                  </label>
                ))}
              </div>

              <button type="submit" disabled={loading || !form.title}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition-colors">
                {loading ? 'Publishing…' : 'Publish Story'}
              </button>
            </form>
          </div>

          {/* Story list */}
          <div>
            <h2 className="text-white font-semibold mb-4">Published ({stories.length})</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {stories.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-8">No stories yet. Add one!</p>
              )}
              {stories.map((s) => (
                <div key={s.id} className="bg-slate-800/50 rounded-xl p-3 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{s.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{s.source} · Day {s.day} · {relativeTime(s.publishedAt)}</p>
                    <div className="flex gap-1 mt-1">
                      {s.pinned && <span className="text-xs bg-slate-700 text-orange-400 px-1.5 py-0.5 rounded">Pinned</span>}
                      {s.breaking && <span className="text-xs bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded">Breaking</span>}
                      {s.featured && <span className="text-xs bg-blue-900/50 text-blue-400 px-1.5 py-0.5 rounded">Featured</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteStory(s.id)} className="text-slate-600 hover:text-red-400 transition-colors text-xs shrink-0">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dispatch tab */}
      {tab === 'dispatch' && (
        <div className="max-w-2xl">
          <h2 className="text-white font-semibold mb-2">Editor's Dispatch</h2>
          <p className="text-slate-400 text-sm mb-4">
            Shown prominently at the top of the feed. Update 2-3 times per day. Tell readers what actually matters today.
          </p>
          <textarea
            value={dispatchText}
            onChange={(e) => setDispatchText(e.target.value)}
            placeholder="Day 2 is shaping up to be the most important day of the summit. The morning keynote just dropped a major announcement about India's national AI policy — and the room reacted strongly. Here's what we're watching for the rest of the day..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          />
          <button onClick={saveDispatch} disabled={loading || !dispatchText}
            className="mt-3 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition-colors">
            {loading ? 'Saving…' : 'Save Dispatch'}
          </button>
        </div>
      )}

      {/* Sessions tab */}
      {tab === 'sessions' && (
        <div>
          <h2 className="text-white font-semibold mb-2">Session Status</h2>
          <p className="text-slate-400 text-sm mb-4">
            Mark sessions as Live or Concluded. The active session appears in the Pulse Bar.
          </p>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center text-slate-500">
            <p className="text-2xl mb-2">📅</p>
            <p className="text-sm">Session management requires Supabase to be configured.</p>
            <p className="text-xs mt-1">
              Once configured, you can click "Set Live" on any session and it will appear in the Pulse Bar.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
