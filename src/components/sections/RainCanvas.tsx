'use client'

import { useEffect, useRef } from 'react'

interface Streak {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
}

export function RainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size to match parent
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect) {
        canvas.width = rect.width
        canvas.height = rect.height
      }
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Create 36 streaks matching the original CSS positions
    // Streaks are positioned diagonally (rotated -45deg in original)
    const streaks: Streak[] = [
      { x: 0, y: 235, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 235, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 117.5, length: 4, speed: 2, opacity: 0.3 },
      { x: 0, y: 252, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 252, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 126, length: 4, speed: 2, opacity: 0.3 },
      { x: 0, y: 150, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 150, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 75, length: 4, speed: 2, opacity: 0.3 },
      { x: 0, y: 253, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 253, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 126.5, length: 4, speed: 2, opacity: 0.3 },
      { x: 0, y: 204, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 204, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 102, length: 4, speed: 2, opacity: 0.3 },
      { x: 0, y: 134, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 134, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 67, length: 4, speed: 2, opacity: 0.3 },
      { x: 0, y: 179, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 179, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 89.5, length: 4, speed: 2, opacity: 0.3 },
      { x: 0, y: 299, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 299, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 149.5, length: 4, speed: 2, opacity: 0.3 },
      { x: 0, y: 215, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 215, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 107.5, length: 4, speed: 2, opacity: 0.3 },
      { x: 0, y: 281, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 281, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 140.5, length: 4, speed: 2, opacity: 0.3 },
      { x: 0, y: 158, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 158, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 79, length: 4, speed: 2, opacity: 0.3 },
      { x: 0, y: 210, length: 100, speed: 2, opacity: 0.5 },
      { x: 300, y: 210, length: 100, speed: 2, opacity: 0.5 },
      { x: 150, y: 105, length: 4, speed: 2, opacity: 0.3 },
    ]
    
    // Capture canvas and context references to inner scope
    const c = canvas
    const cx = ctx as CanvasRenderingContext2D
    
    // Animation loop - use captured references
    function animate() {
      cx.clearRect(0, 0, c.width, c.height)
      
      // Save context state
      cx.save()
      
      // Rotate entire canvas -45deg to match original CSS
      cx.translate(c.width / 2, c.height / 2)
      cx.rotate(-45 * Math.PI / 180)
      cx.translate(-c.width / 2, -c.height / 2)
      
      streaks.forEach(streak => {
        // Update position (moving down)
        streak.y += streak.speed
        
        // Reset to top when reaching bottom
        if (streak.y > c.height + 200) {
          streak.y = -streak.length - 200
        }
        
        // Draw streak as a line
        cx.beginPath()
        cx.strokeStyle = `rgba(255, 255, 255, ${streak.opacity})`
        cx.lineWidth = 4
        cx.moveTo(streak.x, streak.y)
        cx.lineTo(streak.x, streak.y + streak.length)
        cx.stroke()
      })
      
      // Restore context state
      cx.restore()
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  )
}
