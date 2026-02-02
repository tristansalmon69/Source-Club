import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateClub } from '../../hooks/useClubMutations'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { InviteModal } from '../../components/InviteModal'
import { Loader2 } from 'lucide-react'

const EMOJI_OPTIONS = ['🔥', '👨‍👩‍👧', '♟️', '💼', '🎮', '📚', '🎵', '⚽', '🍿', '💡', '🌍', '💻', '🎬', '🍕']
const THEME_OPTIONS = ['Famille', 'Sport', 'Tech', 'Culture', 'Gaming', 'Actualités', 'Autre']

export function CreateClub() {
    const navigate = useNavigate()
    const { createClub, loading, error } = useCreateClub()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [icon, setIcon] = useState('🔥')
    const [theme, setTheme] = useState('Autre')
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [createdClub, setCreatedClub] = useState<{ id: string; name: string; invite_code: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const club = await createClub({
            name,
            description: description || undefined,
            icon,
            theme
        })

        if (club) {
            setCreatedClub(club)
            setShowInviteModal(true)
        }
    }

    const handleCloseModal = () => {
        setShowInviteModal(false)
        if (createdClub) {
            navigate(`/clubs/${createdClub.id}`)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Créer un club</h1>
                <p className="text-slate-400 mt-1">
                    Crée un espace pour partager des sources avec tes amis
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations du club</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nom du club *</label>
                            <Input
                                type="text"
                                placeholder="Les Freros"
                                value={name}
                                onChange={(e) => setName(e.target.value.slice(0, 30))}
                                required
                                maxLength={30}
                            />
                            <p className="text-xs text-slate-500">{name.length}/30 caractères</p>
                        </div>

                        {/* Emoji */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Emoji</label>
                            <div className="flex flex-wrap gap-2">
                                {EMOJI_OPTIONS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => setIcon(emoji)}
                                        className={`text-3xl p-2 rounded-lg transition-all ${icon === emoji
                                                ? 'bg-indigo-600/20 ring-2 ring-indigo-500'
                                                : 'bg-slate-800 hover:bg-slate-700'
                                            }`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description (optionnel)</label>
                            <textarea
                                placeholder="Un club pour partager nos découvertes..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                                rows={3}
                                maxLength={200}
                                className="flex w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            />
                            <p className="text-xs text-slate-500">{description.length}/200 caractères</p>
                        </div>

                        {/* Theme */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Thème</label>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="flex h-10 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                {THEME_OPTIONS.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate('/')}
                                className="flex-1"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || !name}
                                className="flex-1"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Création...
                                    </>
                                ) : (
                                    'Créer le club'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Invite Modal */}
            {createdClub && (
                <InviteModal
                    isOpen={showInviteModal}
                    onClose={handleCloseModal}
                    inviteCode={createdClub.invite_code}
                    clubName={createdClub.name}
                />
            )}
        </div>
    )
}
