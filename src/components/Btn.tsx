import { Button } from 'antd'
import type { ButtonProps } from 'antd'
import type { ReactNode } from 'react'

import { btnBorder, btnGradient } from '~/scripts/constants'

interface BtnProps extends ButtonProps {
  gradient?: boolean
  border?: boolean
  children?: ReactNode
}

export default function Btn({
  children,
  size = 'small',
  gradient = false,
  border = false,
  ...props
}: Readonly<BtnProps>) {
  return (
    <Button
      size={size}
      {...props}
      className={`align-items-center min-w-[40px] shadow-md hover:shadow-sm active:shadow-none
      ${!border ? btnBorder : '!border !border-zinc-200'}
      ${gradient ? btnGradient : ''} ${props.className}`}>
      {Array.isArray(children) && children.length > 1 ? (
        <div className="flex items-center gap-1">{children}</div>
      ) : (
        children
      )}
    </Button>
  )
}
