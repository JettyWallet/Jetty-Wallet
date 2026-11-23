interface BrandLogoProps {
    size?: number
    showName?: boolean
}

// Logo de Jetty Wallet: "j" blanca sobre cuadrado navy con el punto doble
// (turquesa y coral, con el cruce en blanco). Es el mismo diseño del favicon.
export function BrandLogo({ size = 44, showName = true }: BrandLogoProps) {
    return (
        <div className="flex items-center gap-3">
            <svg
                width={size}
                height={size}
                viewBox="0 0 64 64"
                role={showName ? undefined : 'img'}
                aria-hidden={showName ? true : undefined}
                aria-label={showName ? undefined : 'Jetty Wallet'}
            >
                <rect width="64" height="64" rx="16" fill="#0B2A4A" />
                <path
                    d="M40 27V41C40 47.5 36 51.5 29 51.5C24 51.5 20.5 49.5 18.5 46.5"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="35" cy="14" r="6.5" fill="#19B5A5" />
                <circle cx="44" cy="14" r="6.5" fill="#FF7A59" />
                <path d="M39.5 9.31A6.5 6.5 0 0 0 39.5 18.69A6.5 6.5 0 0 0 39.5 9.31Z" fill="#FFFFFF" />
            </svg>
            {showName && (
                <span className="text-2xl tracking-tight text-navy">
                    <span className="font-bold">Jetty</span> <span className="font-normal">Wallet</span>
                </span>
            )}
        </div>
    )
}