import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../components/AuthProvider'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card'

export function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // The intended destination from ProtectedRoute
    const fromPath = (location.state as any)?.from?.pathname || '/'
    const fromSearch = (location.state as any)?.from?.search || ''
    const fromRoute = `${fromPath}${fromSearch}`

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { error } = await signIn(email, password)
            if (error) {
                setError(error.message)
            } else {
                navigate(fromRoute, { replace: true })
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
                <CardTitle className="text-center">Connexion</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-slate-400">
                    Pas encore de compte ?{' '}
                    <Link to="/auth/signup" state={location.state} className="text-indigo-400 hover:text-indigo-300 hover:underline">
                        S'inscrire
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
