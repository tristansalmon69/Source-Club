import { X, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'

interface InviteModalProps {
    isOpen: boolean
    onClose: () => void
    inviteCode: string
    clubName: string
}

export function InviteModal({ isOpen, onClose, inviteCode, clubName }: InviteModalProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Inviter des membres</CardTitle>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-100 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-slate-400">
                        Partage ce code pour inviter des amis à rejoindre <strong className="text-slate-100">{clubName}</strong>
                    </p>

                    <div className="bg-slate-800/50 rounded-lg p-6 text-center">
                        <p className="text-3xl font-mono font-bold text-indigo-400 tracking-wider">
                            {inviteCode}
                        </p>
                    </div>

                    <Button
                        onClick={handleCopy}
                        className="w-full"
                        variant={copied ? "secondary" : "primary"}
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Copié !
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 mr-2" />
                                Copier le code
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
