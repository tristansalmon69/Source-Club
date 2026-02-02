import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export function AuthCallback() {
    const navigate = useNavigate()

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                navigate('/')
            }
        })
    }, [navigate])

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-100">
            <p>Vérification en cours...</p>
        </div>
    )
}
