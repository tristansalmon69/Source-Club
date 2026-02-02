import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'
import type { SourceWithDetails } from '../types/database'

export function useUserSources() {
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
    }, [user])

    const fetchSources = async () => {
        if (!user) return

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
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (fetchError) throw fetchError

            setSources(data || [])
        } catch (err: any) {
            setError(err.message)
            console.error('Error fetching user sources:', err)
        } finally {
            setLoading(false)
        }
    }

    return { sources, loading, error, refetch: fetchSources }
}
