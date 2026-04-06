import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  
  return [
    // Homepage
    {
      url: 'https://eteya.ai',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://eteya.ai/en',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    
    // AI Besparing / AI Savings
    {
      url: 'https://eteya.ai/sv/ai-besparing',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://eteya.ai/en/ai-savings',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    
    // Case Studies
    {
      url: 'https://eteya.ai/sv/kundcase',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://eteya.ai/en/case-studies',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
    // Telestore Case Study (flagship case)
    {
      url: 'https://eteya.ai/sv/kundcase/telestore',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://eteya.ai/en/case-studies/telestore',
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
