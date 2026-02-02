import { Plus } from 'lucide-react'

interface FloatingAddButtonProps {
    onClick: () => void
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-all hover:scale-110 flex items-center justify-center z-40"
            title="Ajouter une source"
        >
            <Plus className="h-6 w-6" />
        </button>
    )
}
