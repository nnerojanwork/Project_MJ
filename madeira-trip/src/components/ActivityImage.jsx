import { useState, useEffect } from 'react'

export default function ActivityImage({ wikipediaTitle, name, imageCache }) {
  const [src, setSrc] = useState(imageCache.current.get(wikipediaTitle) ?? null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (imageCache.current.has(wikipediaTitle)) {
      setSrc(imageCache.current.get(wikipediaTitle))
      return
    }
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        wikipediaTitle
      )}`
    )
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return
        const url = data?.thumbnail?.source ?? null
        imageCache.current.set(wikipediaTitle, url)
        setSrc(url)
        if (!url) setFailed(true)
      })
      .catch(() => {
        if (cancelled) return
        imageCache.current.set(wikipediaTitle, null)
        setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [wikipediaTitle, imageCache])

  if (!src || failed) {
    return (
      <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-volcanic-700 to-brick-700 text-volcanic-50">
        <span className="text-sm font-medium">{name}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      className="h-40 w-full object-cover"
      loading="lazy"
    />
  )
}
