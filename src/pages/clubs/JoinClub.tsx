import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJoinClub } from '../../hooks/useClubMutations'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Loader2, Users } from 'lucide-react'
import type { Club } from '../../types/database'

export function JoinClub() {
    const navigate = useNavigate()
    const { joinClub, searchClub, loading, error } = useJoinClub()

    const [inviteCode, setInviteCode] = useState('')
    const [previewClub, setPreviewClub] = useState<Club | null>(null)
    const [searching, setSearching] = useState(false)

    const handleSearch = async () => {
        if (!inviteCode || inviteCode.length !== 8) return

        setSearching(true)
        const club = await searchClub(inviteCode)
        setPreviewClub(club)
        setSearching(false)
    }

    const handleJoin = async () => {
        const club = await joinClub(inviteCode)
        if (club) {
            navigate(`/clubs/${club.id}`)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Rejoindre un club</h1>
                <p className="text-slate-400 mt-1">
                    Entre le code d'invitation pour rejoindre un club
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Code d'invitation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-3">
                        <Input
                            type="text"
                            placeholder="abc12345"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toLowerCase().slice(0, 8))}
                            maxLength={8}
                            className="flex-1 font-mono text-lg"
                        />
                        <Button
                            onClick={handleSearch}
                            disabled={searching || inviteCode.length !== 8}
                        >
                            {searching ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Recherche...
                                </>
                            ) : (
                                'Rechercher'
                            )}
                        </Button>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Club Preview */}
            {previewClub && (
                <Card>
                    <CardHeader>
                        <CardTitle>Aperçu du club</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl">{previewClub.icon}</div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-100">{previewClub.name}</h3>
                                {previewClub.description && (
                                    <p className="text-slate-400 mt-1">{previewClub.description}</p>
                                )}
                                {previewClub.theme && (
                                    <p className="text-sm text-slate-500 mt-2">Thème : {previewClub.theme}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Users className="h-4 w-4" />
                            <span>Club créé le {new Date(previewClub.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>

                        <Button
                            onClick={handleJoin}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Rejoindre...
                                </>
                            ) : (
                                'Rejoindre ce club'
                            )}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
