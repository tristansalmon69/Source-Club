import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function PWAPrompt() {
    const [showPrompt, setShowPrompt] = useState(false)

    useEffect(() => {
        // Détecter iOS Safari (non standalone, donc dans le navigateur)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && (navigator as any).standalone)

        // On vérifie si l'utilisateur l'a déjà fermé récemment
        const dismissed = sessionStorage.getItem('pwaPromptDismissed')

        if (isIOS && isSafari && !isStandalone && !dismissed) {
            setShowPrompt(true)
        }
    }, [])

    if (!showPrompt) return null

    const handleDismiss = () => {
        sessionStorage.setItem('pwaPromptDismissed', 'true')
        setShowPrompt(false)
    }

    return (
        <div className="bg-indigo-600 px-4 py-3 flex items-start sm:items-center justify-between gap-4 text-white text-sm shadow-md z-50">
            <div className="flex-1">
                <span className="font-bold sm:inline block sm:mr-2">Astuce iOS :</span>
                Installe Melting Pote sur l'écran d'accueil (Bouton Partager puis "Sur l'écran d'accueil") pour profiter d'une expérience fluide et du partage rapide PWA !
            </div>
            <button onClick={handleDismiss} className="text-white hover:text-indigo-200 opacity-80 shrink-0 p-1 bg-white/10 rounded-full" aria-label="Fermer">
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}
