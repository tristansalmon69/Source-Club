import { cn } from '../../lib/utils'
import { CATEGORY_COLORS, type Category } from '../../lib/categoryDetection'

interface CategoryBadgeProps {
    category: Category
    className?: string
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                CATEGORY_COLORS[category],
                className
            )}
        >
            {category}
        </span>
    )
}
