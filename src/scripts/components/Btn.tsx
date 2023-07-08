import { Button } from 'antd'
import { memo } from 'react'

import { btnBorder, btnGradient } from '~/scripts/constants'




function Btn({ children, size = 'small', gradient = true, border = false, ...props }: any) {
  console.log('getting border', border)
  return (
    <Button
      size={size}
      {...props}
      className={`px-5 align-items-center min-w-[30px] shadow-md hover:shadow-sm active:shadow-none ${!border ? btnBorder : '!border !border-zinc-200'} ${gradient ? btnGradient : ''} ${props.className}`}>

      {children.length > 1 ? <div className='flex items-center gap-1'>{children}</div> : children}
    </Button>
  )
}

export default memo(Btn)
