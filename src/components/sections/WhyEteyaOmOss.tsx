'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './WhyEteyaOmOss.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function WhyEteyaOmOss({ label, heading, items }: {
  label: string; heading: string; items: Array<{ title: string; body: string }>
}) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current!,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} data-reveal>
      <div className={styles.metodikInner}>
        <div className={styles.metodikLeft}>
          <div className={styles.metodikLeftSticky}>
            <h2 className={styles.sectionTitle}>{heading}</h2>
          </div>
        </div>
        <div className={styles.metodikRight}>
          <ul className={styles.metodikList}>
            {items.map((item, i) => (
              <li key={i} className={styles.metodikItem}>
                <div className={styles.metodikItemContent}>
                  <h3 className={styles.metodikItemTitle}>{item.title}</h3>
                  <p className={styles.metodikItemBody}>{item.body}</p>
                </div>
                <span className={styles.metodikItemNum}>{String(i + 1).padStart(2, '0')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}