import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../components/AuthProvider'
import type { Club } from '../types/database'

export function useCreateClub() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createClub = async (clubData: {
        name: string
        description?: string
        icon?: string
        theme?: string
    }): Promise<Club | null> => {
        if (!user) {
            setError('User not authenticated')
            return null
        }

        try {
            setLoading(true)
            setError(null)

            const { data, error: insertError } = await supabase
                .from('clubs')
                .insert({
                    name: clubData.name,
                    description: clubData.description || null,
                    icon: clubData.icon || '🔥',
                    theme: clubData.theme || null,
                    created_by: user.id
                })
                .select()
                .single()

            if (insertError) throw insertError

            return data
        } catch (err: any) {
            setError(err.message)
            console.error('Error creating club:', err)
            return null
        } finally {
            setLoading(false)
        }
    }

    return { createClub, loading, error }
}

export function useJoinClub() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const joinClub = async (inviteCode: string): Promise<Club | null> => {
        if (!user) {
            setError('User not authenticated')
            return null
        }

        try {
            setLoading(true)
            setError(null)

            // Find club by invite code
            const { data: clubData, error: clubError } = await supabase
                .from('clubs')
                .select('*')
                .eq('invite_code', inviteCode)
                .single()

            if (clubError) throw new Error('Code d\'invitation invalide')

            // Check if already a member
            const { data: existingMember } = await supabase
                .from('club_members')
                .select('id')
                .eq('club_id', clubData.id)
                .eq('user_id', user.id)
                .single()

            if (existingMember) {
                throw new Error('Tu es déjà membre de ce club')
            }

            // Join club
            const { error: joinError } = await supabase
                .from('club_members')
                .insert({
                    club_id: clubData.id,
                    user_id: user.id,
                    role: 'member'
                })

            if (joinError) throw joinError

            return clubData
        } catch (err: any) {
            setError(err.message)
            console.error('Error joining club:', err)
            return null
        } finally {
            setLoading(false)
        }
    }

    const searchClub = async (inviteCode: string): Promise<Club | null> => {
        try {
            setError(null)

            const { data, error: searchError } = await supabase
                .from('clubs')
                .select('*')
                .eq('invite_code', inviteCode)
                .single()

            if (searchError) throw new Error('Code d\'invitation invalide')

            return data
        } catch (err: any) {
            setError(err.message)
            return null
        }
    }

    return { joinClub, searchClub, loading, error }
}

export function useClubMutations() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateClub = async (clubId: string, updates: {
        name?: string
        description?: string
        icon?: string
        theme?: string
    }): Promise<boolean> => {
        try {
            setLoading(true)
            setError(null)
            const { error: updateError } = await supabase
                .from('clubs')
                .update(updates)
                .eq('id', clubId)

            if (updateError) throw updateError
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const deleteClub = async (clubId: string): Promise<boolean> => {
        try {
            setLoading(true)
            setError(null)
            const { error: deleteError } = await supabase
                .from('clubs')
                .delete()
                .eq('id', clubId)

            if (deleteError) throw deleteError
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    const leaveClub = async (clubId: string): Promise<boolean> => {
        if (!user) return false
        try {
            setLoading(true)
            setError(null)
            const { error: leaveError } = await supabase
                .from('club_members')
                .delete()
                .eq('club_id', clubId)
                .eq('user_id', user.id)

            if (leaveError) throw leaveError
            return true
        } catch (err: any) {
            setError(err.message)
            return false
        } finally {
            setLoading(false)
        }
    }

    return { updateClub, deleteClub, leaveClub, loading, error }
}
