import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Eteya — AI som driver ditt företag'
export const size = { width: 1200, height: 630 }

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
        backgroundColor: '#080808',
        padding: '80px',
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: '#F5F5F5',
          letterSpacing: '-2px',
          lineHeight: 1,
        }}
      >
        ETEYA
      </div>
      <div style={{ fontSize: 32, color: '#9B9B9B', marginTop: 24 }}>
        AI som driver ditt företag.
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          right: 80,
          fontSize: 18,
          color: '#6EE7B7',
        }}
      >
        eteya.ai
      </div>
    </div>,
    { ...size }
  )
}
