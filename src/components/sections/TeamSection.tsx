import React from 'react';
import styles from './TeamSection.module.css';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  linkedin?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Filip Thai',
    role: 'Founder & CEO',
    bio: 'Driver Eteya med visionen att göra AI tillgänglig för alla företag.',
    linkedin: 'https://linkedin.com/in/filip-thai',
  },
  {
    name: 'Eva Svensson',
    role: 'CTO',
    bio: 'Ledar teknikutvecklingen med fokus på skalbar AI-arkitektur.',
    linkedin: 'https://linkedin.com/in/eva-svensson',
  },
  {
    name: 'Marcus Johnson',
    role: 'Head of Strategy',
    bio: 'Skapar strategiska ramar för AI-transformering av företag.',
    linkedin: 'https://linkedin.com/in/marcus-johnson',
  },
];

const TeamSection: React.FC = () => {
  return (
    <section className={styles.teamSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>Vårt Team</h2>
        <p className={styles.subtitle}>De bakom Eteya:s vision</p>
        
        <div className={styles.grid}>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.imageContainer}>
                <div className={styles.placeholderImage}>
                  <span className={styles.placeholderInitials}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
                <p className={styles.bio}>{member.bio}</p>
                <div className={styles.linkedinContainer}>
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.linkedinLink}
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
