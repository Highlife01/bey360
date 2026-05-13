import { useEffect } from 'react';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, type SeoPage } from '../data/seoPages';

interface SEOProps {
  page?: SeoPage;
  title?: string;
  description?: string;
  path?: string;
  noindex?: boolean;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function buildSchema(page: SeoPage | undefined, canonical: string) {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: 'Bey360 Online Muhasebe',
    url: SITE_URL,
    logo: `${SITE_URL}/images/brand/bey360-command-logo-header.png`,
    description:
      'Bey360, işletmeler için online ön muhasebe, cari takip, stok yönetimi, fatura, e-Fatura ve e-Arşiv yönetim yazılımıdır.',
    email: 'info@bey360.com.tr',
    sameAs: [
      'https://www.beyogluteknoloji.com',
      'https://www.instagram.com/beyogluteknoloji/',
    ],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/arama?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  if (!page) return [organization, website];

  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': page.schemaType ?? 'WebPage',
    name: page.h1,
    headline: page.h1,
    description: page.description,
    url: canonical,
    applicationCategory: page.schemaType === 'SoftwareApplication' ? 'BusinessApplication' : undefined,
    operatingSystem: page.schemaType === 'SoftwareApplication' ? 'Web' : undefined,
    offers:
      page.schemaType === 'SoftwareApplication' || page.schemaType === 'Product'
        ? {
            '@type': 'Offer',
            priceCurrency: 'TRY',
            price: '0',
            availability: 'https://schema.org/InStock',
          }
        : undefined,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.h1,
        item: canonical,
      },
    ],
  };

  return [organization, website, pageSchema, faqSchema, breadcrumb];
}

export default function SEO({ page, title, description, path, noindex = false }: SEOProps) {
  useEffect(() => {
    const nextTitle = page?.title ?? title ?? 'Bey360 | Online Ön Muhasebe ve e-Fatura Programı';
    const nextDescription =
      page?.description ??
      description ??
      'Bey360 ile cari, stok, kasa, banka, gelir-gider, fatura, e-Fatura ve e-Arşiv süreçlerinizi tek panelden yönetin.';
    const nextPath = page?.path ?? path ?? '/';
    const canonical = `${SITE_URL}${nextPath === '/' ? '' : nextPath}`;

    document.documentElement.lang = 'tr';
    document.title = nextTitle;

    upsertMeta('meta[name="description"]', { name: 'description', content: nextDescription });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large',
    });
    upsertMeta('meta[name="keywords"]', {
      name: 'keywords',
      content: page?.keywords.join(', ') ?? 'online ön muhasebe programı, e fatura programı, cari stok takip',
    });

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: nextTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: nextDescription });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: DEFAULT_OG_IMAGE });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'tr_TR' });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: page?.schemaType === 'Article' ? 'article' : 'website' });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: nextTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: nextDescription });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: DEFAULT_OG_IMAGE });
    upsertLink('canonical', canonical);

    let schemaScript = document.head.querySelector<HTMLScriptElement>('script[data-bey360-schema="true"]');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.dataset.bey360Schema = 'true';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(buildSchema(page, canonical));
  }, [description, noindex, page, path, title]);

  return null;
}
