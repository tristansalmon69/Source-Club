interface MetadataResult {
    title: string | null
    description: string | null
    thumbnail: string | null
    domain: string
}

export async function fetchMetadata(url: string): Promise<MetadataResult> {
    try {
        // Extract domain as fallback
        const domain = new URL(url).hostname.replace('www.', '')

        // Try microlink.io API
        const response = await fetch(
            `https://api.microlink.io?url=${encodeURIComponent(url)}`
        )

        if (!response.ok) {
            throw new Error('Microlink API failed')
        }

        const data = await response.json()

        if (data.status === 'success' && data.data) {
            return {
                title: data.data.title || null,
                description: data.data.description || null,
                thumbnail: data.data.image?.url || data.data.logo?.url || null,
                domain
            }
        }

        // Fallback if no data
        return {
            title: null,
            description: null,
            thumbnail: null,
            domain
        }
    } catch (error) {
        console.error('Metadata extraction failed:', error)

        // Fallback: return domain only
        try {
            const domain = new URL(url).hostname.replace('www.', '')
            return {
                title: null,
                description: null,
                thumbnail: null,
                domain
            }
        } catch {
            // Invalid URL
            return {
                title: null,
                description: null,
                thumbnail: null,
                domain: 'unknown'
            }
        }
    }
}
