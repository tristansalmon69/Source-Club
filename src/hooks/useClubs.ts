import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'
import type { Club } from '../types/database'

export function useClubs() {
    const { user } = useAuth()
    const [clubs, setClubs] = useState<Club[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) {
            setClubs([])
            setLoading(false)
            return
        }

        fetchClubs()
    }, [user])

    const fetchClubs = async () => {
        try {
            setLoading(true)
            setError(null)

            // Get clubs where user is a member
            const { data, error: fetchError } = await supabase
                .from('clubs')
                .select(`
          *,
          club_members!inner(user_id)
        `)
                .eq('club_members.user_id', user!.id)
                .order('created_at', { ascending: false })

            if (fetchError) throw fetchError

            setClubs(data || [])
        } catch (err: any) {
            setError(err.message)
            console.error('Error fetching clubs:', err)
        } finally {
            setLoading(false)
        }
    }

    return { clubs, loading, error, refetch: fetchClubs }
}
