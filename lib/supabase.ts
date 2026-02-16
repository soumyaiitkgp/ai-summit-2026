import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return null if not configured — features will gracefully degrade
    return null
  }

  return createClient(url, key)
}

export const supabase = getSupabaseClient()

// Story storage (manual curated items)
export async function getManualStories() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Supabase getManualStories error:', error.message)
    return []
  }
  return data || []
}

export async function createManualStory(story: Record<string, unknown>) {
  if (!supabase) return null
  const { data, error } = await supabase.from('stories').insert([story]).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateManualStory(id: string, updates: Record<string, unknown>) {
  if (!supabase) return null
  const { data, error } = await supabase.from('stories').update(updates).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteManualStory(id: string) {
  if (!supabase) return
  const { error } = await supabase.from('stories').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// Predictions
export async function getPredictions(day?: number) {
  if (!supabase) return []
  let query = supabase.from('predictions').select('*').order('created_at')
  if (day) query = query.eq('day', day)
  const { data, error } = await query
  if (error) return []
  return data || []
}

export async function votePrediction(id: string, vote: 'yes' | 'no') {
  if (!supabase) return null
  const col = vote === 'yes' ? 'yes_count' : 'no_count'
  const { data, error } = await supabase.rpc('increment_vote', { row_id: id, col_name: col })
  if (error) throw new Error(error.message)
  return data
}

export async function setPredictionOutcome(id: string, outcome: 'yes' | 'no') {
  if (!supabase) return
  const { error } = await supabase.from('predictions').update({ outcome }).eq('id', id)
  if (error) throw new Error(error.message)
}

// Questions (question board)
export async function getQuestions(sessionId?: string) {
  if (!supabase) return []
  let query = supabase.from('questions').select('*').order('upvotes', { ascending: false })
  if (sessionId) query = query.eq('session_id', sessionId)
  const { data, error } = await query
  if (error) return []
  return data || []
}

export async function createQuestion(q: Record<string, unknown>) {
  if (!supabase) return null
  const { data, error } = await supabase.from('questions').insert([q]).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function upvoteQuestion(id: string) {
  if (!supabase) return
  const { error } = await supabase.rpc('increment_upvote', { row_id: id })
  if (error) throw new Error(error.message)
}

// Curator dispatch
export async function getCuratorDispatch() {
  if (!supabase) return null
  const { data } = await supabase.from('dispatch').select('*').order('created_at', { ascending: false }).limit(1).single()
  return data
}

export async function setCuratorDispatch(text: string) {
  if (!supabase) return
  await supabase.from('dispatch').upsert([{ id: 1, text, updated_at: new Date().toISOString() }])
}

// Coverage gap items
export async function getCoverageGaps(day?: number) {
  if (!supabase) return []
  let query = supabase.from('coverage_gaps').select('*').order('published_at', { ascending: false })
  if (day) query = query.eq('day', day)
  const { data } = await query
  return data || []
}

export async function createCoverageGap(item: Record<string, unknown>) {
  if (!supabase) return null
  const { data, error } = await supabase.from('coverage_gaps').insert([item]).select().single()
  if (error) throw new Error(error.message)
  return data
}
