'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { NewsItem, TopicTag } from '@/lib/types'
import { relativeTime } from '@/lib/utils'

const TOPIC_TAGS: TopicTag[] = ['policy', 'startups', 'research', 'keynotes', 'funding', 'ethics', 'infrastructure', 'general']

type Tab = 'stories' | 'tweets' | 'question' | 'dispatch'

interface CuratedTweet {
  id: string
  tweet_id: string
  label?: string
  added_at: string
}

interface DailyQuestion {
  id: string
  question: string
  yes_count: number
  no_count: number
  active: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('stories')
  const [stories, setStories] = useState<NewsItem[]>([])
  const [tweets, setTweets] = useState<CuratedTweet[]>([])
  const [question, setQuestion] = useState<DailyQuestion | null>(null)
  const [dispatchText, setDispatchText] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Story form
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

  // Tweet form
  const [tweetUrl, setTweetUrl] = useState('')
  const [tweetLabel, setTweetLabel] = useState('')

  // Question form
  const [newQuestion, setNewQuestion] = useState('')

  useEffect(() => {
    loadStories()
    loadTweets()
    loadQuestion()
    loadDispatch()
  }, [])

  function showMsg(text: string) {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  async function loadStories() {
    try {
      const res = await fetch('/api/admin/stories')
      if (res.status === 401) { router.push('/admin'); return }
      const data = await res.json()
      setStories(data.stories || [])
    } catch {}
  }

  async function loadTweets() {
    try {
      const res = await fetch('/api/tweets')
      const data = await res.json()
      setTweets(data.tweets || [])
    } catch {}
  }

  async function loadQuestion() {
    try {
      const res = await fetch('/api/question')
      const data = await res.json()
      setQuestion(data.question || null)
    } catch {}
  }

  async function loadDispatch() {
    try {
      const res = await fetch('/api/admin/dispatch')
      const data = await res.json()
      if (data.dispatch?.text) setDispatchText(data.dispatch.text)
    } catch {}
  }

  // ── Stories ────────────────────────────────────────────────────────────────
  async function publishStory(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        showMsg('✓ Story published!')
        setForm({ type: 'news', title: '', summary: '', link: '', source: 'Editorial', day: 1, topicTag: 'general', curatorNote: '', speaker: '', speakerTitle: '', featured: false, pinned: false, breaking: false })
        loadStories()
      } else {
        showMsg('Error publishing. Is Supabase configured?')
      }
    } catch (err) {
      showMsg('Network error: ' + String(err))
    } finally {
      setLoading(false)
    }
  }

  async function deleteStory(id: string) {
    await fetch(`/api/admin/stories?id=${id}`, { method: 'DELETE' })
    loadStories()
  }

  // ── Tweets ──────────────────────────────────────────────────────────────────
  async function addTweet(e: React.FormEvent) {
    e.preventDefault()
    if (!tweetUrl.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweetUrl: tweetUrl.trim(), label: tweetLabel.trim() || undefined }),
      })
      if (res.ok) {
        showMsg('✓ Tweet added!')
        setTweetUrl('')
        setTweetLabel('')
        loadTweets()
      } else {
        const data = await res.json()
        showMsg(data.error || 'Error adding tweet. Is Supabase configured?')
      }
    } catch (err) {
      showMsg('Network error: ' + String(err))
    } finally {
      setLoading(false)
    }
  }

  async function deleteTweet(id: string) {
    await fetch(`/api/tweets?id=${id}`, { method: 'DELETE' })
    loadTweets()
  }

  // ── Question ──────────────────────────────────────────────────────────────
  async function postQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!newQuestion.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion.trim() }),
      })
      if (res.ok) {
        showMsg('✓ Question published!')
        setNewQuestion('')
        loadQuestion()
      } else {
        showMsg('Error saving question. Is Supabase configured?')
      }
    } catch (err) {
      showMsg('Network error: ' + String(err))
    } finally {
      setLoading(false)
    }
  }

  // ── Dispatch ──────────────────────────────────────────────────────────────
  async function saveDispatch() {
    setLoading(true)
    try {
      await fetch('/api/admin/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: dispatchText }),
      })
      showMsg('✓ Dispatch saved!')
    } catch {
      showMsg('Error saving dispatch')
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin')
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'stories', label: 'Stories', icon: '📝' },
    { id: 'tweets', label: 'Tweets', icon: '𝕏' },
    { id: 'question', label: 'Question', icon: '🗳️' },
    { id: 'dispatch', label: 'Dispatch', icon: '✍️' },
  ]

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-bold text-xl">Editorial Dashboard</h1>
          <p className="text-slate-400 text-sm">AI Summit 2026 · Content Manager</p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-800 pb-0">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === id
                ? 'border-blue-500 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <span className="mr-1.5">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Status message */}
      {msg && (
        <div className={`mb-4 rounded-xl px-4 py-2.5 text-sm font-medium ${
          msg.startsWith('✓')
            ? 'bg-green-900/40 text-green-400 border border-green-500/30'
            : 'bg-red-900/40 text-red-400 border border-red-500/30'
        }`}>
          {msg}
        </div>
      )}

      {/* ── STORIES TAB ───────────────────────────────────────────────────── */}
      {tab === 'stories' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-white font-semibold mb-4">Add Story</h2>
            <form onSubmit={publishStory} className="space-y-3">
              <div className="flex gap-2">
                {(['news', 'quote', 'update'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                      form.type === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {t === 'news' ? '📰' : t === 'quote' ? '"' : '📌'} {t}
                  </button>
                ))}
              </div>

              <input
                required
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder={form.type === 'quote' ? 'The quote text' : 'Headline'}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <textarea
                value={form.summary}
                onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                placeholder={form.type === 'quote' ? 'Context / session name' : '2-3 sentence summary'}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />

              {form.type !== 'quote' && (
                <input
                  value={form.link}
                  onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                  placeholder="Source URL (optional)"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              )}

              {form.type === 'quote' && (
                <>
                  <input
                    value={form.speaker}
                    onChange={(e) => setForm((p) => ({ ...p, speaker: e.target.value }))}
                    placeholder="Speaker name"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    value={form.speakerTitle}
                    onChange={(e) => setForm((p) => ({ ...p, speakerTitle: e.target.value }))}
                    placeholder="Speaker title / role"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </>
              )}

              <input
                value={form.curatorNote}
                onChange={(e) => setForm((p) => ({ ...p, curatorNote: e.target.value }))}
                placeholder="Editor's note (optional — shown in italic)"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={form.day}
                  onChange={(e) => setForm((p) => ({ ...p, day: Number(e.target.value) }))}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>Day {d}</option>)}
                </select>
                <select
                  value={form.topicTag}
                  onChange={(e) => setForm((p) => ({ ...p, topicTag: e.target.value as TopicTag }))}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  {TOPIC_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex gap-4 text-sm text-slate-400">
                {([['pinned', '📌 Pinned'], ['featured', '⭐ Featured'], ['breaking', '⚡ Breaking']] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))}
                      className="accent-blue-500"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || !form.title}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition-colors"
              >
                {loading ? 'Publishing…' : 'Publish Story'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-white font-semibold mb-4">Published ({stories.length})</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {stories.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">No stories yet.</p>
              ) : stories.map((s) => (
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
                  <button onClick={() => deleteStory(s.id)} className="text-slate-600 hover:text-red-400 transition-colors text-xs shrink-0 mt-0.5">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TWEETS TAB ────────────────────────────────────────────────────── */}
      {tab === 'tweets' && (
        <div className="max-w-2xl space-y-6">
          <div>
            <h2 className="text-white font-semibold mb-1">Curate a Tweet</h2>
            <p className="text-slate-400 text-sm mb-4">
              Paste any tweet URL — the ID is extracted automatically and embedded on the Social page.
            </p>
            <form onSubmit={addTweet} className="space-y-3">
              <input
                required
                value={tweetUrl}
                onChange={(e) => setTweetUrl(e.target.value)}
                placeholder="https://twitter.com/user/status/1234567890"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <input
                value={tweetLabel}
                onChange={(e) => setTweetLabel(e.target.value)}
                placeholder='Label (optional) — e.g. "Best quote of the day"'
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !tweetUrl.trim()}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition-colors"
              >
                {loading ? 'Adding…' : 'Add Tweet'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-white font-semibold mb-3">Curated ({tweets.length})</h2>
            {tweets.length === 0 ? (
              <div className="bg-slate-800/40 rounded-xl p-6 text-center text-slate-500">
                <p className="text-2xl mb-2">𝕏</p>
                <p className="text-sm">No tweets curated yet.</p>
                <p className="text-xs mt-1">Paste a tweet URL above to add your first embed.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tweets.map((t) => (
                  <div key={t.id} className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 text-sm font-mono truncate">
                          tweet/{t.tweet_id}
                        </span>
                        {t.label && (
                          <span className="text-xs text-orange-400 bg-orange-950/40 border border-orange-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                            {t.label}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5">
                        {new Date(t.added_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true, hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <a
                      href={`https://twitter.com/i/web/status/${t.tweet_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors text-xs shrink-0"
                    >
                      view ↗
                    </a>
                    <button
                      onClick={() => deleteTweet(t.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors text-xs shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── QUESTION TAB ──────────────────────────────────────────────────── */}
      {tab === 'question' && (
        <div className="max-w-xl space-y-6">
          {/* Current question */}
          {question && (
            <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700">
              <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-2">Active Question</p>
              <p className="text-white font-semibold text-lg mb-3">{question.question}</p>
              <div className="flex gap-4 text-sm">
                <div className="flex-1 bg-slate-900/60 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-green-400">{question.yes_count}</p>
                  <p className="text-slate-400 text-xs mt-1">Yes votes</p>
                </div>
                <div className="flex-1 bg-slate-900/60 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-red-400">{question.no_count}</p>
                  <p className="text-slate-400 text-xs mt-1">No votes</p>
                </div>
                <div className="flex-1 bg-slate-900/60 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold text-slate-300">{question.yes_count + question.no_count}</p>
                  <p className="text-slate-400 text-xs mt-1">Total</p>
                </div>
              </div>
              {question.yes_count + question.no_count > 0 && (
                <div className="mt-3 h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                    style={{ width: `${Math.round(question.yes_count / (question.yes_count + question.no_count) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* New question form */}
          <div>
            <h2 className="text-white font-semibold mb-1">
              {question ? 'Replace Active Question' : 'Post Today\'s Question'}
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Shown at the top of the feed. Binary yes/no vote. Posting a new question deactivates the current one.
            </p>
            <form onSubmit={postQuestion} className="space-y-3">
              <textarea
                required
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder='e.g. "Will India announce a national LLM by end of summit?"'
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
              <button
                type="submit"
                disabled={loading || !newQuestion.trim()}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition-colors"
              >
                {loading ? 'Publishing…' : question ? 'Replace Question' : 'Publish Question'}
              </button>
            </form>
          </div>

          {!question && (
            <div className="bg-slate-800/40 rounded-xl p-5 text-center text-slate-500 border border-dashed border-slate-700">
              <p className="text-2xl mb-2">🗳️</p>
              <p className="text-sm">No active question yet.</p>
              <p className="text-xs mt-1">The widget appears on the feed once you post a question.</p>
            </div>
          )}
        </div>
      )}

      {/* ── DISPATCH TAB ──────────────────────────────────────────────────── */}
      {tab === 'dispatch' && (
        <div className="max-w-2xl">
          <h2 className="text-white font-semibold mb-1">Editor's Dispatch</h2>
          <p className="text-slate-400 text-sm mb-4">
            Shown prominently at the top of the feed. Update 2–3× per day. Tell readers what actually matters right now.
          </p>
          <textarea
            value={dispatchText}
            onChange={(e) => setDispatchText(e.target.value)}
            placeholder="Day 2 is shaping up to be the most important day of the summit. The morning keynote just dropped a major announcement about India's national AI policy — and the room reacted strongly. Here's what we're watching for the rest of the day..."
            rows={8}
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-slate-500 text-xs">{dispatchText.length} characters</p>
            <button
              onClick={saveDispatch}
              disabled={loading || !dispatchText}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition-colors"
            >
              {loading ? 'Saving…' : 'Save Dispatch'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
