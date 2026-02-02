import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Club, ClubMember, Profile } from '../types/database'

interface ClubWithMembers extends Club {
    members: (ClubMember & { profile: Profile })[]
    member_count: number
}

export function useClub(clubId: string | undefined) {
    const [club, setClub] = useState<ClubWithMembers | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!clubId) {
            setClub(null)
            setLoading(false)
            return
        }

        fetchClub()
    }, [clubId])

    const fetchClub = async () => {
        if (!clubId) return

        try {
            setLoading(true)
            setError(null)

            // Fetch club details
            const { data: clubData, error: clubError } = await supabase
                .from('clubs')
                .select('*')
                .eq('id', clubId)
                .single()

            if (clubError) throw clubError

            // Fetch club members with profiles
            const { data: membersData, error: membersError } = await supabase
                .from('club_members')
                .select(`
          *,
          profile:profiles(*)
        `)
                .eq('club_id', clubId)

            if (membersError) throw membersError

            setClub({
                ...clubData,
                members: membersData || [],
                member_count: membersData?.length || 0
            })
        } catch (err: any) {
            setError(err.message)
            console.error('Error fetching club:', err)
        } finally {
            setLoading(false)
        }
    }

    return { club, loading, error, refetch: fetchClub }
}
