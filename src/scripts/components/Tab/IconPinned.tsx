import React from "react"
import ThumbtackActiveIcon from "react:*.svg"
import ThumbtackIcon from "react:*.svg"

import { blueIconStyle, grayIconStyle } from "~/scripts/components/Tab/helpers"





export function IconPinned(pinned: boolean) {
  return pinned ? (
    <ThumbtackActiveIcon style={blueIconStyle} />
  ) : (
    <ThumbtackIcon style={grayIconStyle} />
  )
}
