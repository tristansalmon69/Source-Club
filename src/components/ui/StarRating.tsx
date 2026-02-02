import { Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'

interface StarRatingProps {
    value?: number | null
    onChange?: (rating: number | null) => void
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export function StarRating({ value, onChange, readonly = false, size = 'md' }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState<number | null>(null)

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    }

    const displayRating = hoverRating ?? value ?? 0

    const handleClick = (rating: number) => {
        if (readonly || !onChange) return
        // If clicking the same rating, clear it
        onChange(value === rating ? null : rating)
    }

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(null)}
                    className={cn(
                        'transition-all',
                        !readonly && 'cursor-pointer hover:scale-110',
                        readonly && 'cursor-default'
                    )}
                >
                    <Star
                        className={cn(
                            sizeClasses[size],
                            'transition-colors',
                            star <= displayRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-600'
                        )}
                    />
                </button>
            ))}
        </div>
    )
}
