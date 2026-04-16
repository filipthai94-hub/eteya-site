import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eteya.ai'
  const now = new Date()

  return [
    // Hemsida
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // Om Oss / About
    {
      url: `${baseUrl}/sv/om-oss`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Kontakt / Contact
    {
      url: `${baseUrl}/sv/kontakt`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // AI Besparing / AI Savings
    {
      url: `${baseUrl}/sv/ai-besparing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/ai-savings`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // ROI Test (noindex men ändå i sitemap för referens)
    {
      url: `${baseUrl}/sv/roi-test`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // Kundcase / Case Studies - Översikt
    {
      url: `${baseUrl}/sv/kundcase`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/case-studies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Kundcase / Case Studies - Individuella
    {
      url: `${baseUrl}/sv/kundcase/telestore`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/en/case-studies/telestore`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sv/kundcase/nordicrank`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sv/kundcase/sannegarden`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sv/kundcase/mbflytt`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sv/kundcase/trainwithalbert`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // Policies
    {
      url: `${baseUrl}/sv/integritetspolicy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sv/villkor`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/en/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/en/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
