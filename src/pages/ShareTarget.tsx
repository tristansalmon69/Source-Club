import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export function ShareTarget() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        // En PWA, le lien partagé atterrit souvent dans "text" s'il n'est pas proprement dans "url" (ex: iOS YouTube)
        const paramUrl = searchParams.get('url')
        const paramText = searchParams.get('text')

        let shareUrl = paramUrl || ''

        if (!shareUrl && paramText) {
            // Si le texte contient un lien, on essaie de l'extraire
            const urlMatch = paramText.match(/(https?:\/\/[^\s]+)/)
            if (urlMatch) {
                shareUrl = urlMatch[0]
            } else {
                shareUrl = paramText // fallback, peut-être qu'il est juste mal formaté
            }
        }

        const shareTitle = searchParams.get('title') || ''

        // On forwarde au dashboard qui ouvrira automatiquement le composant
        navigate('/', {
            state: {
                shareUrl,
                shareTitle,
                openAddModal: true
            },
            replace: true
        })
    }, [navigate, searchParams])

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f] text-white">
            <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Réception du lien partagé...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            </div>
        </div>
    )
}
