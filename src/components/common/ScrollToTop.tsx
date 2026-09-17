import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Resets scroll to the top on every forward navigation (clicking a link,
 * calling navigate(), changing a category/tab) so a new page never opens
 * mid-scroll at whatever offset the previous page was left at.
 *
 * Browser back/forward (POP) is deliberately left alone — the browser's
 * native scroll restoration already returns the user to where they were on
 * that page, which is the expected behavior for back/forward, not a reset.
 *
 * Scoped to pathname (not the full location, so query-string-only changes —
 * e.g. filters, ?age=, ?filter= — don't reset scroll) and skips the very
 * first render so the initial page load isn't forced to the top if the
 * browser already restored a scroll position (e.g. a hard refresh).
 */
export function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'auto'
    }
  }, [])

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (navigationType === 'POP') {
      // Back/forward: let the browser's own scroll restoration handle it.
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, navigationType])

  return null
}
