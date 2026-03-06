import { useState, useRef, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../AuthProvider'
import { LogOut } from 'lucide-react'
import { Button } from '../ui/Button'
import { ClubSidebar } from './ClubSidebar'
import { BottomNav } from './BottomNav'
import { AddSourceModal } from '../AddSourceModal'

export function Layout() {
    const { signOut } = useAuth()
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    // Discord Button Position State
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const dragStartPos = useRef({ x: 0, y: 0 })
    const buttonRef = useRef<HTMLAnchorElement>(null)

    // Handle drag start
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true)
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
        dragStartPos.current = { x: clientX - position.x, y: clientY - position.y }
    }

    // Handle drag move
    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return

            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

            let newX = clientX - dragStartPos.current.x
            let newY = clientY - dragStartPos.current.y

            // Constrain to viewport (roughly)
            const padding = 20
            const maxW = window.innerWidth - 70 - padding
            const maxH = window.innerHeight - 70 - padding

            newX = Math.min(Math.max(-maxW + 40, newX), 0)
            newY = Math.min(Math.max(-maxH + 100, newY), 0)

            setPosition({ x: newX, y: newY })
        }

        const handleEnd = () => setIsDragging(false)

        if (isDragging) {
            window.addEventListener('mousemove', handleMove)
            window.addEventListener('mouseup', handleEnd)
            window.addEventListener('touchmove', handleMove)
            window.addEventListener('touchend', handleEnd)
        }

        return () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mouseup', handleEnd)
            window.removeEventListener('touchmove', handleMove)
            window.removeEventListener('touchend', handleEnd)
        }
    }, [isDragging])
    return (
        <div className="flex h-screen bg-[#0a0a0f] text-slate-100 overflow-x-hidden">
            {/* Club Sidebar - Desktop Only */}
            <div className="hidden md:flex">
                <ClubSidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 md:pb-0">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between border-b border-slate-800 bg-[#0a0a0f]/95 backdrop-blur-sm p-4 sticky top-0 z-20">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        SourceClub
                    </h1>
                    <Button variant="ghost" size="sm" onClick={() => signOut()}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                </header>

                {/* Desktop Header */}
                <header className="hidden md:flex items-center justify-between border-b border-slate-800 bg-[#0a0a0f] p-6 sticky top-0 z-20">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                        SourceClub
                    </h1>
                    <Button variant="ghost" onClick={() => signOut()}>
                        <LogOut className="h-5 w-5 mr-2" />
                        Déconnexion
                    </Button>
                </header>

                <div className="p-4 md:p-8 max-w-5xl mx-auto px-4 md:px-8">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation - Mobile Only */}
            <BottomNav onAddClick={() => setIsAddModalOpen(true)} />

            {/* Global Add Source Modal (triggered from BottomNav) */}
            <AddSourceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    // Refetch logic might need context or event bus if we want global refresh
                    // For now, simple close. The feed won't auto-refresh unless we pass a refresh callback 
                    // or rely on the query invalidation if we used react-query (here it's custom hooks).
                    // We might need to expose context for triggering refetch later.
                    setIsAddModalOpen(false)
                    window.location.reload() // Temporary dirty fix to ensure feed updates until Context/Query is set up
                }}
            />

            {/* Floating Discord Feedback Button - DRAGGABLE */}
            <a
                ref={buttonRef}
                href="https://discord.gg/xJXh8K7CCM"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Rejoindre le Discord"
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
                    touchAction: 'none'
                }}
                className={`group fixed bottom-36 right-4 md:bottom-24 md:right-8 z-50 flex items-center gap-3 cursor-move select-none ${isDragging ? 'scale-110 active:scale-95' : ''}`}
                onClick={(e) => {
                    // Prevent navigation if we dragged more than 5px
                    if (Math.abs(position.x) > 5 || Math.abs(position.y) > 5) {
                        // This logic is tricky with absolute translation. 
                        // Instead, let's just allow click if it's very minor movement.
                    }
                }}
            >
                {/* Tooltip — toujours visible sur desktop au hover, masqué pendant le drag */}
                {!isDragging && (
                    <span className="hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 pointer-events-none w-52 rounded-xl bg-slate-800/95 border border-slate-700 px-3 py-2 text-xs text-slate-200 leading-snug shadow-xl text-right">
                        Tes idées prennent vie ici. Bug, feature, suggestion → envoie.
                    </span>
                )}

                {/* Button */}
                <span className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-indigo-900/40 transition-all duration-200 group-hover:shadow-xl group-hover:shadow-indigo-800/60 ring-2 ring-white/10" style={{ backgroundColor: '#5865F2' }}>
                    {/* Discord SVG logo */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                </span>
            </a>
        </div>
    )
}
