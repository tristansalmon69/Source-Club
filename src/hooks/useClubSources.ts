import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { SourceWithDetails } from '../types/database'

export function useClubSources(clubId: string | undefined) {
    const [sources, setSources] = useState<SourceWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!clubId) {
            setSources([])
            setLoading(false)
            return
        }

        fetchSources()
    }, [clubId])

    const fetchSources = async () => {
        if (!clubId) return

        try {
            setLoading(true)
            setError(null)

            const { data, error: fetchError } = await supabase
                .from('sources')
                .select(`
          *,
          profile:profiles(*),
          club:clubs(*)
        `)
                .eq('club_id', clubId)
                .order('created_at', { ascending: false })

            if (fetchError) throw fetchError

            setSources(data || [])
        } catch (err: any) {
            setError(err.message)
            console.error('Error fetching club sources:', err)
        } finally {
            setLoading(false)
        }
    }

    return { sources, loading, error, refetch: fetchSources }
}
