export default function Busuanzi() {
  const { theme } = useGlobal()
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url !== path) {
        path = url
        busuanzi.fetch()
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  useEffect(() => {
    if (theme) busuanzi.fetch()
  }, [theme])

  return null
}
