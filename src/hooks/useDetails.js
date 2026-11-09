import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/** Open the "More info" modal by adding ?info=<type>-<id> to the current URL. */
export default function useDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  return useCallback(
    (type, id) => {
      const params = new URLSearchParams(location.search)
      params.set('info', `${type}-${id}`)
      navigate({ pathname: location.pathname, search: params.toString() })
    },
    [navigate, location.pathname, location.search],
  )
}
