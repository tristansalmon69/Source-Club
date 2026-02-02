import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/AuthProvider'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card'

export function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { signUp } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (username.length < 3) {
            setError('Le nom d\'utilisateur doit contenir au moins 3 caractères.')
            return
        }

        setLoading(true)

        try {
            const { error } = await signUp(email, password, username)
            if (error) {
                setError(error.message)
            } else {
                // Redirect to dashboard or login? Often auto-login or confirm email.
                // Assuming auto-login or redirect to pending verification.
                // Usually Supabase auto-confirms if unused. 
                // We'll redirect to login or check implementation plan. "Après inscription, créer le profil...".
                // AuthProvider sign up returns session if auto confirm is on.
                navigate('/')
            }
        } catch (err) {
            setError('Une erreur est survenue.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Inscription</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Nom d'utilisateur
                        </label>
                        <Input
                            type="text"
                            placeholder="Pseudo"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Email
                        </label>
                        <Input
                            type="email"
                            placeholder="exemple@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Mot de passe
                        </label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Inscription...' : 'S\'inscrire'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-slate-400">
                    Déjà un compte ?{' '}
                    <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                        Se connecter
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
