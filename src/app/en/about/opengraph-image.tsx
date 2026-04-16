import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            About Us
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '36px',
              color: '#888888',
              margin: 0,
            }}
          >
            The people behind Eteya
          </p>

          {/* Tagline */}
          <p
            style={{
              fontSize: '24px',
              color: '#C8FF00',
              margin: '40px 0 0 0',
              fontFamily: 'monospace',
            }}
          >
            eteya.ai
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
