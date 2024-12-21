import React from 'react'
// @ts-ignore
import ThumbtackActiveIcon from 'react:/src/icons/thumbtack-active.svg'
// @ts-ignore
import ThumbtackIcon from 'react:/src/icons/thumbtack.svg'

import {blueIconStyle, grayIconStyle} from '~/components/Tab/helpers'


export function IconPinned(pinned: boolean) {
  return pinned ? (
    <ThumbtackActiveIcon style={blueIconStyle}/>
  ) : (
    <ThumbtackIcon style={grayIconStyle}/>
  )
}
