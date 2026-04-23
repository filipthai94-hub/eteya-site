'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import styles from './TeamSection.module.css'

interface TeamMember {
  name: string
  role: string
  bio: string
  image?: string
  initials?: string
  social?: {
    linkedin?: string
  }
}

const TeamSection: React.FC = () => {
  const t = useTranslations('team')
  const members: TeamMember[] = t.raw('members') as TeamMember[]

  return (
    <section className={styles.teamSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('heading')}</h2>
        <p className={styles.subtitle}>{t('label')}</p>
        
        <div className={styles.grid}>
          {members.map((member, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.imageContainer}>
                <div className={styles.placeholderImage}>
                  <span className={styles.placeholderInitials}>
                    {member.initials || member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
                <p className={styles.bio}>{member.bio}</p>
                {member.social?.linkedin && (
                  <div className={styles.linkedinContainer}>
                    <a 
                      href={member.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.linkedinLink}
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TeamSection
