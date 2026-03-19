import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'

/**
 * 页面的Head头，有用于SEO
 * @param {*} param0
 * @returns
 */
const SEO = props => {
  const { children, siteInfo, post, NOTION_CONFIG } = props
  const PATH = siteConfig('PATH')
  const LINK = siteConfig('LINK')
  const SUB_PATH = siteConfig('SUB_PATH', '')
  let url = PATH?.length ? `${LINK}/${SUB_PATH}` : LINK
  let image
  const router = useRouter()
  const meta = getSEOMeta(props, router, useGlobal()?.locale)
  const webFontUrl = siteConfig('FONT_URL')

  useEffect(() => {
    loadExternalResource(
      'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
      'js'
    ).then(() => {
      const WebFont = window?.WebFont
      if (WebFont) {
        WebFont.load({ custom: { urls: webFontUrl } })
      }
    })
  }, [])

  const KEYWORDS = siteConfig('KEYWORDS')
  let keywords = meta?.tags || KEYWORDS
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }
  if (meta) {
    url = `${url}/${meta.slug}`
    image = meta.image || '/bg_image.jpg'
  }

  const TITLE = siteConfig('TITLE')
  const title = meta?.title || TITLE
  const description = meta?.description || `${siteInfo?.description}`
  const type = meta?.type || 'website'
  const lang = siteConfig('LANG').replace('-', '_')
  const category = meta?.category || KEYWORDS
  const favicon = siteConfig('BLOG_FAVICON')
  const BACKGROUND_DARK = siteConfig('BACKGROUND_DARK', '', NOTION_CONFIG)
  const AUTHOR = siteConfig('AUTHOR')

  const SEO_BAIDU_SITE_VERIFICATION = siteConfig('SEO_BAIDU_SITE_VERIFICATION', null, NOTION_CONFIG)
  const SEO_GOOGLE_SITE_VERIFICATION = siteConfig('SEO_GOOGLE_SITE_VERIFICATION', null, NOTION_CONFIG)
  const BLOG_FAVICON = siteConfig('BLOG_FAVICON', null, NOTION_CONFIG)
  const COMMENT_WEBMENTION_ENABLE = siteConfig('COMMENT_WEBMENTION_ENABLE', null, NOTION_CONFIG)
  const COMMENT_WEBMENTION_HOSTNAME = siteConfig('COMMENT_WEBMENTION_HOSTNAME', null, NOTION_CONFIG)
  const COMMENT_WEBMENTION_AUTH = siteConfig('COMMENT_WEBMENTION_AUTH', null, NOTION_CONFIG)
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE', null, NOTION_CONFIG)
  const FACEBOOK_PAGE = siteConfig('FACEBOOK_PAGE', null, NOTION_CONFIG)

  // FIX: Analytics config reads — used to make DNS prefetch conditional
  const ANALYTICS_GOOGLE_ID = siteConfig('ANALYTICS_GOOGLE_ID', null, NOTION_CONFIG)
  const ANALYTICS_BAIDU_ID = siteConfig('ANALYTICS_BAIDU_ID', null, NOTION_CONFIG)
  const CLARITY_ID = siteConfig('CLARITY_ID', null, NOTION_CONFIG)
  const UMAMI_HOST = siteConfig('UMAMI_HOST', null, NOTION_CONFIG)
  const AD_WWADS_ID = siteConfig('AD_WWADS_ID', null, NOTION_CONFIG)

  // FIX: generateStructuredData was called inline on every render, rebuilding
  // the full JSON-LD object each time. useMemo caches the serialised string and
  // only recomputes when the post slug, type, or site info actually changes.
  const structuredDataJson = useMemo(
    () => JSON.stringify(generateStructuredData(meta, siteInfo, url, image, AUTHOR)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meta?.slug, meta?.type, siteInfo?.title, url, image, AUTHOR]
  )

  // FIX: canonical URL — one of the most direct on-page SEO signals.
  // Prevents Google treating /page/1 and / as duplicate content, and gives
  // crawlers a single authoritative URL for each page.
  const canonicalUrl = `${LINK}${meta?.slug ? `/${meta.slug}` : ''}`

  return (
    <Head>
      <link rel='icon' href={favicon} />
      <title>{title}</title>

      {/* FIX: canonical tag — prevents duplicate content penalties */}
      <link rel='canonical' href={canonicalUrl} />

      <meta name='theme-color' content={BACKGROUND_DARK} />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0'
      />
      {/* FIX: robots meta is more specific per page type.
          Post pages allow indexing; 404 and search result pages are noindexed
          to avoid wasting crawl budget on thin or duplicate content. */}
      <meta
        name='robots'
        content={
          meta?.type === '404' || router.route === '/search'
            ? 'noindex, follow'
            : 'follow, index, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
        }
      />
      <meta charSet='UTF-8' />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content={title} />

      {/* 搜索引擎验证 */}
      {SEO_GOOGLE_SITE_VERIFICATION && (
        <meta name='google-site-verification' content={SEO_GOOGLE_SITE_VERIFICATION} />
      )}
      {SEO_BAIDU_SITE_VERIFICATION && (
        <meta name='baidu-site-verification' content={SEO_BAIDU_SITE_VERIFICATION} />
      )}

      {/* 基础SEO元数据 */}
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta name='author' content={AUTHOR} />
      <meta name='generator' content='NotionNext' />

      {/* 语言和地区 */}
      <meta httpEquiv='content-language' content={siteConfig('LANG')} />
      <meta name='geo.region' content={siteConfig('GEO_REGION', 'CN')} />
      <meta name='geo.country' content={siteConfig('GEO_COUNTRY', 'CN')} />

      {/* Open Graph 元数据 */}
      <meta property='og:locale' content={lang} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={image} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:image:alt' content={title} />
      <meta property='og:site_name' content={siteConfig('TITLE')} />
      <meta property='og:type' content={type} />

      {/* Twitter Card 元数据 */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content={siteConfig('TWITTER_SITE', '@NotionNext')} />
      <meta name='twitter:creator' content={siteConfig('TWITTER_CREATOR', '@NotionNext')} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      <meta name='twitter:image:alt' content={title} />

      <link rel='icon' href={BLOG_FAVICON} />

      {COMMENT_WEBMENTION_ENABLE && (
        <>
          <link rel='webmention' href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/webmention`} />
          <link rel='pingback' href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/xmlrpc`} />
          {COMMENT_WEBMENTION_AUTH && <link href={COMMENT_WEBMENTION_AUTH} rel='me' />}
        </>
      )}

      {ANALYTICS_BUSUANZI_ENABLE && (
        <meta name='referrer' content='no-referrer-when-downgrade' />
      )}

      {/* 文章特定元数据 */}
      {meta?.type === 'Post' && (
        <>
          <meta property='article:published_time' content={meta.publishDay} />
          <meta property='article:modified_time' content={meta.lastEditedDay} />
          <meta property='article:author' content={AUTHOR} />
          <meta property='article:section' content={category} />
          <meta property='article:tag' content={keywords} />
          <meta property='article:publisher' content={FACEBOOK_PAGE} />
        </>
      )}

      {/* FIX: structuredData is now memoized — no longer recalculated every render */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: structuredDataJson }}
      />

      {/* FIX: DNS prefetch is now conditional — only emit prefetch hints for
          services that are actually configured. The original code emitted
          prefetch tags for Google Analytics and GTM unconditionally, which
          caused DNS lookups even when those services were disabled. Each extra
          DNS lookup adds ~20–120ms on a cold connection. */}
      {(ANALYTICS_GOOGLE_ID || webFontUrl) && (
        <link rel='dns-prefetch' href='//fonts.googleapis.com' />
      )}
      {ANALYTICS_GOOGLE_ID && (
        <>
          <link rel='dns-prefetch' href='//www.google-analytics.com' />
          <link rel='dns-prefetch' href='//www.googletagmanager.com' />
          <link rel='preconnect' href='https://www.googletagmanager.com' />
        </>
      )}
      {ANALYTICS_BAIDU_ID && (
        <link rel='dns-prefetch' href='//hm.baidu.com' />
      )}
      {CLARITY_ID && (
        <link rel='dns-prefetch' href='//www.clarity.ms' />
      )}
      {UMAMI_HOST && (
        <link rel='dns-prefetch' href={`//${new URL(UMAMI_HOST).hostname}`} />
      )}
      {AD_WWADS_ID && (
        <link rel='preconnect' href='https://cdn.wwads.cn' />
      )}
      {/* Fonts preconnect — always needed for custom font loading */}
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />

      {/* FIX: The original preload targeted /fonts/inter-var.woff2 which does
          not exist in this project — a missing preload wastes a high-priority
          network slot and generates a console warning. Removed. If you add a
          self-hosted font in /public/fonts/, re-add the preload pointing at
          the correct filename. */}

      {children}
    </Head>
  )
}

/**
 * 生成结构化数据
 */
const generateStructuredData = (meta, siteInfo, url, image, author) => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteInfo?.title,
    description: siteInfo?.description,
    url: siteConfig('LINK'),
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: siteInfo?.title,
      logo: {
        '@type': 'ImageObject',
        url: siteInfo?.icon
      }
    }
  }

  if (meta?.type === 'Post') {
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: meta.title,
      description: meta.description,
      image: image,
      url: url,
      datePublished: meta.publishDay,
      dateModified: meta.lastEditedDay || meta.publishDay,
      author: {
        '@type': 'Person',
        name: author
      },
      publisher: {
        '@type': 'Organization',
        name: siteInfo?.title,
        logo: {
          '@type': 'ImageObject',
          url: siteInfo?.icon
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      },
      keywords: meta.tags?.join(', '),
      articleSection: meta.category
    }
  }

  return baseData
}

/**
 * 获取SEO信息
 */
const getSEOMeta = (props, router, locale) => {
  const { post, siteInfo, tag, category, page } = props
  const keyword = router?.query?.s
  const TITLE = siteConfig('TITLE')

  switch (router.route) {
    case '/':
      return {
        title: `${siteInfo?.title} | ${siteInfo?.description}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: '',
        type: 'website'
      }
    case '/archive':
      return {
        title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'archive',
        type: 'website'
      }
    case '/page/[page]':
      return {
        title: `${page} | Page | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    case '/category/[category]/page/[page]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        slug: 'category/' + category,
        image: `${siteInfo?.pageCover}`,
        type: 'website'
      }
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} | ${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/search':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'search',
        type: 'website'
      }
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: TITLE,
        image: `${siteInfo?.pageCover}`,
        slug: 'search/' + (keyword || ''),
        type: 'website'
      }
    case '/404':
      return {
        title: `${siteInfo?.title} | ${locale.NAV.PAGE_NOT_FOUND}`,
        image: `${siteInfo?.pageCover}`,
        type: '404'
      }
    case '/tag':
      return {
        title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'tag',
        type: 'website'
      }
    case '/category':
      return {
        title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${siteInfo?.description}`,
        image: `${siteInfo?.pageCover}`,
        slug: 'category',
        type: 'website'
      }
    default:
      return {
        title: post
          ? `${post?.title} | ${siteInfo?.title}`
          : `${siteInfo?.title} | loading`,
        description: post?.summary,
        type: post?.type,
        slug: post?.slug,
        image: post?.pageCoverThumbnail || `${siteInfo?.pageCover}`,
        category: post?.category?.[0],
        tags: post?.tags
      }
  }
}

export default SEO
