import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import CONFIG from '../config'
import BlogItem from './BlogItem'

/**
 * 使用分页插件的博客列表
 * @param {*} props
 * @returns
 */
export const BlogListPage = props => {
  const { page = 1, posts = [], postCount } = props
  const { locale, NOTION_CONFIG } = useGlobal()
  const router = useRouter()
  const totalPage = Math.ceil(
    postCount / siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  )
  const currentPage = +page

  const showPrev = currentPage > 1
  const showNext = page < totalPage
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')

  const showPageCover = siteConfig('EXAMPLE_POST_LIST_COVER', null, CONFIG)

 // --- Sort posts newest first using available date fields ---
const sortedPosts = posts
  .slice()
  .sort(
    (a, b) =>
      new Date(b.publishDate || b.createdTime || b.date) -
      new Date(a.publishDate || a.createdTime || a.date)
  )

      <div className='flex justify-between text-xs'>
        <SmartLink
          href={{
            pathname:
              currentPage - 1 === 1
                ? `${pagePrefix}/`
                : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`${showPrev ? 'bg-black dark:bg-hexo-black-gray' : 'bg-gray pointer-events-none invisible'} text-white no-underline py-2 px-3 rounded`}>
          {locale.PAGINATION.PREV}
        </SmartLink>
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          className={`${showNext ? 'bg-black dark:bg-hexo-black-gray ' : 'bg-gray pointer-events-none invisible'} text-white no-underline py-2 px-3 rounded`}>
          {locale.PAGINATION.NEXT}
        </SmartLink>
      </div>
    </div>
  )
}
