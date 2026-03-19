import { siteConfig } from '@/lib/config'
import { compressImage, mapImgUrl } from '@/lib/db/notion/mapImage'
import { isBrowser, loadExternalResource } from '@/lib/utils'
import mediumZoom from '@fisch0920/medium-zoom'
import 'katex/dist/katex.min.css'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef } from 'react'
import { NotionRenderer } from 'react-notion-x'
 
/**
 * 整个站点的核心组件
 * 将Notion数据渲染成网页
 * @param {*} param0
 * @returns
 */
const NotionPage = ({ post, className }) => {
  const POST_DISABLE_GALLERY_CLICK = siteConfig('POST_DISABLE_GALLERY_CLICK')
  const POST_DISABLE_DATABASE_CLICK = siteConfig('POST_DISABLE_DATABASE_CLICK')
  const SPOILER_TEXT_TAG = siteConfig('SPOILER_TEXT_TAG')
  const IMAGE_ZOOM_IN_WIDTH = siteConfig('IMAGE_ZOOM_IN_WIDTH', 1200)
 
  // FIX: mediumZoom was being recreated on every render because it was called
  // in the component body. useMemo ensures it is only created once, and the
  // isBrowser guard prevents a crash during SSR.
  const zoom = useMemo(() => {
    if (!isBrowser) return null
    return mediumZoom({
      background: 'rgba(0, 0, 0, 0.2)',
      margin: getMediumZoomMargin()
    })
  }, [])
 
  const zoomRef = useRef(zoom ? zoom.clone() : null)
 
  // FIX: mhchem is a ~2000-line plugin that was previously loaded eagerly for
  // every page via the Equation dynamic import. Now it only loads when the
  // current post actually contains equation blocks, saving ~80kb of JS on
  // every non-math page.
  useEffect(() => {
    if (!post?.blockMap?.block) return
    const hasMath = Object.values(post.blockMap.block).some(
      b => b?.value?.type === 'equation'
    )
    if (hasMath) {
      import('@/lib/plugins/mhchem').catch(() => {})
    }
  }, [post?.id])
 
  // Scroll to hash anchor on first load
  useEffect(() => {
    autoScrollToHash()
  }, [])
 
  // Re-run when post changes: gallery click handling, database link stripping,
  // and the MutationObserver that swaps in high-res images on zoom open.
  useEffect(() => {
    if (POST_DISABLE_GALLERY_CLICK) {
      processGalleryImg(zoomRef?.current)
    }
    if (POST_DISABLE_DATABASE_CLICK) {
      processDisableDatabaseUrl()
    }
 
    const observer = new MutationObserver(mutationsList => {
      mutationsList.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          if (mutation.target.classList.contains('medium-zoom-image--opened')) {
            setTimeout(() => {
              const src = mutation?.target?.getAttribute('src')
              mutation?.target?.setAttribute(
                'src',
                compressImage(src, IMAGE_ZOOM_IN_WIDTH)
              )
            }, 800)
          }
        }
      })
    })
 
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class']
    })
 
    return () => {
      observer.disconnect()
    }
  }, [post])
 
  useEffect(() => {
    if (SPOILER_TEXT_TAG) {
      import('lodash/escapeRegExp').then(escapeRegExp => {
        Promise.all([
          loadExternalResource('/js/spoilerText.js', 'js'),
          loadExternalResource('/css/spoiler-text.css', 'css')
        ]).then(() => {
          window.textToSpoiler &&
            window.textToSpoiler(escapeRegExp.default(SPOILER_TEXT_TAG))
        })
      })
    }
 
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(
        '.notion-collection-page-properties'
      )
      elements?.forEach(element => {
        element?.remove()
      })
    }, 1000)
 
    return () => clearTimeout(timer)
  }, [post])
 
  return (
    <div
      id='notion-article'
      className={`mx-auto overflow-hidden ${className || ''}`}>
      <NotionRenderer
        recordMap={post?.blockMap}
        mapPageUrl={mapPageUrl}
        mapImageUrl={mapImgUrl}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          Tweet
        }}
      />
 
      <AdEmbed />
      <PrismMac />
    </div>
  )
}
 
/**
 * 页面的数据库链接禁止跳转，只能查看
 */
const processDisableDatabaseUrl = () => {
  if (isBrowser) {
    const links = document.querySelectorAll('.notion-table a')
    for (const e of links) {
      e.removeAttribute('href')
    }
  }
}
 
/**
 * gallery视图，点击后是放大图片还是跳转到gallery的内部页面
 */
const processGalleryImg = zoom => {
  setTimeout(() => {
    if (isBrowser) {
      const imgList = document?.querySelectorAll(
        '.notion-collection-card-cover img'
      )
      if (imgList && zoom) {
        for (let i = 0; i < imgList.length; i++) {
          zoom.attach(imgList[i])
        }
      }
 
      const cards = document.getElementsByClassName('notion-collection-card')
      for (const e of cards) {
        e.removeAttribute('href')
      }
    }
  }, 800)
}
 
/**
 * 根据url参数自动滚动到锚位置
 */
const autoScrollToHash = () => {
  setTimeout(() => {
    const hash = window?.location?.hash
    const needToJumpToTitle = hash && hash.length > 0
    if (needToJumpToTitle) {
      const tocNode = document.getElementById(hash.substring(1))
      if (tocNode && tocNode?.className?.indexOf('notion') > -1) {
        tocNode.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    }
  }, 180)
}
 
/**
 * 将id映射成博文内部链接。
 */
const mapPageUrl = id => {
  return '/' + id.replace(/-/g, '')
}
 
/**
 * 根据屏幕宽度返回 mediumZoom 的边距
 */
function getMediumZoomMargin() {
  const width = window.innerWidth
  if (width < 500) return 8
  if (width < 800) return 20
  if (width < 1280) return 30
  if (width < 1600) return 40
  if (width < 1920) return 48
  return 72
}
 
// 代码高亮
const Code = dynamic(
  () =>
    import('react-notion-x/build/third-party/code').then(m => m.Code),
  { ssr: false }
)
 
// FIX: mhchem is no longer imported here. It is loaded on-demand inside the
// component via the useEffect above, only when the post contains equation
// blocks. The Equation component itself still loads dynamically as before.
const Equation = dynamic(
  () => import('@/components/Equation').then(m => m.Equation),
  { ssr: false }
)
 
const Pdf = dynamic(() => import('@/components/Pdf').then(m => m.Pdf), {
  ssr: false
})
 
// 美化代码
const PrismMac = dynamic(() => import('@/components/PrismMac'), {
  ssr: false
})
 
const TweetEmbed = dynamic(() => import('react-tweet-embed'), {
  ssr: false
})
 
const AdEmbed = dynamic(
  () => import('@/components/GoogleAdsense').then(m => m.AdEmbed),
  { ssr: true }
)
 
const Collection = dynamic(
  () =>
    import('react-notion-x/build/third-party/collection').then(
      m => m.Collection
    ),
  { ssr: true }
)
 
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then(m => m.Modal),
  { ssr: false }
)
 
const Tweet = ({ id }) => {
  return <TweetEmbed tweetId={id} />
}
 
export default NotionPage
