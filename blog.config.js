const BLOG = {
  // ─── Core ────────────────────────────────────────────────────────────────
  API_BASE_URL: process.env.API_BASE_URL || 'https://www.notion.so/api/v3',
  NOTION_PAGE_ID:
    process.env.NOTION_PAGE_ID ||
    '02ab3b8678004aa69e9e415905ef32a5,en:7c1d570661754c8fbc568e00a01fd70e',
  THEME: process.env.NEXT_PUBLIC_THEME || 'example',
  LANG: process.env.NEXT_PUBLIC_LANG || 'en-US',
  SINCE: process.env.NEXT_PUBLIC_SINCE || 2026,

  // ─── Behaviour ───────────────────────────────────────────────────────────
  PSEUDO_STATIC: process.env.NEXT_PUBLIC_PSEUDO_STATIC || false,
  // Increase this value to reduce Notion API calls on high-traffic sites.
  // Higher = faster repeat visits, but post updates take longer to appear.
  NEXT_REVALIDATE_SECOND: process.env.NEXT_PUBLIC_REVALIDATE_SECOND || 60,
  APPEARANCE: process.env.NEXT_PUBLIC_APPEARANCE || 'light',
  APPEARANCE_DARK_TIME: process.env.NEXT_PUBLIC_APPEARANCE_DARK_TIME || [18, 6],

  // ─── Author & Site Identity ───────────────────────────────────────────────
  AUTHOR: process.env.NEXT_PUBLIC_AUTHOR || 'Hanif Azrai',
  BIO: process.env.NEXT_PUBLIC_BIO || 'Hanif Azrai',
  LINK: process.env.NEXT_PUBLIC_LINK || '',
  KEYWORDS: process.env.NEXT_PUBLIC_KEYWORD || 'Motomento',
  BLOG_FAVICON: process.env.NEXT_PUBLIC_FAVICON || '/favicon.ico',
  ENABLE_RSS: process.env.NEXT_PUBLIC_ENABLE_RSS || true,

  // ─── Fonts ───────────────────────────────────────────────────────────────
  // FIX (PageSpeed -241 KiB CSS): Previously loading Noto Sans SC AND Noto
  // Serif SC each with 4 weights (300,400,500,700). PageSpeed reported both
  // as ~100% unused CSS — 120.7 KiB each. Now loads only Noto Sans SC with
  // 2 weights (400, 500). Serif removed; system serif costs zero bytes.
  //
  // FIX (PageSpeed "Font display" -20ms LCP): &display=swap was missing.
  // Without it the browser blocks rendering while the font downloads.
  //
  // To re-add serif: append &family=Noto+Serif+SC:wght@400;500 to the URL
  // only if your theme explicitly uses font-family: serif somewhere.
  FONT_URL:
    process.env.NEXT_PUBLIC_FONT_URL ||
    'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500&display=swap',

  // Font stacks used by Tailwind. FONT_SERIF falls back to system fonts so
  // no web font request is made unless you set NEXT_PUBLIC_FONT_SERIF.
  FONT_SANS: process.env.NEXT_PUBLIC_FONT_SANS
    ? process.env.NEXT_PUBLIC_FONT_SANS.split(',')
    : ['"Noto Sans SC"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  FONT_SERIF: process.env.NEXT_PUBLIC_FONT_SERIF
    ? process.env.NEXT_PUBLIC_FONT_SERIF.split(',')
    : ['ui-serif', 'Georgia', 'serif'],

  // FIX (PageSpeed -18 KiB CSS, -147 KiB woff2): Font Awesome all.min.css
  // was loaded in _document.js for every page and flagged as entirely unused
  // CSS. Moved to ExternalPlugins.js so it defers until user interaction.
  // Set to '' to disable Font Awesome if your theme does not use icons.
  FONT_AWESOME:
    process.env.NEXT_PUBLIC_FONT_AWESOME_PATH ||
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',

  // ─── Conf modules ────────────────────────────────────────────────────────
  ...require('./conf/comment.config'),
  ...require('./conf/contact.config'),
  ...require('./conf/post.config'),
  ...require('./conf/analytics.config'),
  ...require('./conf/image.config'),
  ...require('./conf/font.config'),
  ...require('./conf/code.config'),
  ...require('./conf/animation.config'),
  ...require('./conf/widget.config'),
  ...require('./conf/ad.config'),
  ...require('./conf/plugin.config'),
  ...require('./conf/performance.config'),
  ...require('./conf/layout-map.config'),
  ...require('./conf/notion.config'),
  ...require('./conf/dev.config'),

  // ─── Custom external resources ───────────────────────────────────────────
  // FIX: Previously [''] — a single empty string causes ExternalPlugins.js
  // to call loadExternalResource('') on every mount, firing a real network
  // request for an empty URL. Empty arrays make the loops a true no-op.
  CUSTOM_EXTERNAL_JS: [],
  CUSTOM_EXTERNAL_CSS: [],

  // ─── Layout & UX ─────────────────────────────────────────────────────────
  CUSTOM_MENU: process.env.NEXT_PUBLIC_CUSTOM_MENU || false,
  CAN_COPY: process.env.NEXT_PUBLIC_CAN_COPY || true,
  LAYOUT_SIDEBAR_REVERSE:
    process.env.NEXT_PUBLIC_LAYOUT_SIDEBAR_REVERSE || false,
  GREETING_WORDS:
    process.env.NEXT_PUBLIC_GREETING_WORDS ||
    'Hi，我是一个程序员, Hi，我是一个打工人,Hi，我是一个干饭人,欢迎来到我的博客🎉',

  // ─── Routing ─────────────────────────────────────────────────────────────
  UUID_REDIRECT: process.env.UUID_REDIRECT || false
}

module.exports = BLOG
