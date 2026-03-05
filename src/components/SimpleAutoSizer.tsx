import React, { useEffect, useRef, useState } from 'react'

export type Size = {
  height: number
  width: number
}

export type SimpleAutoSizerProps = {
  children: (size: Size) => React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const SimpleAutoSizer: React.FC<SimpleAutoSizerProps> = ({
  children,
  className,
  style
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size>({ height: 0, width: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      {size.height > 0 && size.width > 0 ? children(size) : null}
    </div>
  )
}
