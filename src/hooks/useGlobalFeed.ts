import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'
import type { SourceWithDetails } from '../types/database'

export function useGlobalFeed(filterClubId?: string) {
    const { user } = useAuth()
    const [sources, setSources] = useState<SourceWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) {
            setSources([])
            setLoading(false)
            return
        }

        fetchSources()
    }, [user, filterClubId])

    const fetchSources = async () => {
        if (!user) return

        try {
            setLoading(true)
            setError(null)

            // Get all club IDs user belongs to
            const { data: memberData, error: memberError } = await supabase
                .from('club_members')
                .select('club_id')
                .eq('user_id', user.id)

            if (memberError) throw memberError

            const clubIds = memberData?.map(m => m.club_id) || []

            if (clubIds.length === 0) {
                setSources([])
                setLoading(false)
                return
            }

            // Build query
            let query = supabase
                .from('sources')
                .select(`
          *,
          profile:profiles(*),
          club:clubs(*)
        `)
                .in('club_id', clubIds)
                .order('created_at', { ascending: false })

            // Apply filter if specified
            if (filterClubId) {
                query = query.eq('club_id', filterClubId)
            }

            const { data, error: fetchError } = await query

            if (fetchError) throw fetchError

            setSources(data || [])
        } catch (err: any) {
            setError(err.message)
            console.error('Error fetching global feed:', err)
        } finally {
            setLoading(false)
        }
    }

    return { sources, loading, error, refetch: fetchSources }
}
