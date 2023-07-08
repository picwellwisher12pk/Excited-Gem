import { Button } from 'antd'
import React from 'react'
import TimesIcon from 'react:/src/icons/times.svg'
import VolumeOffIcon from 'react:/src/icons/volume-off.svg'
import VolumeSlashIcon from 'react:/src/icons/volume-slash.svg'
import VolumeIcon from 'react:/src/icons/volume.svg'

import Btn from '../Btn'

const btnStyle = {
  width: 30,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}
export const iconHeight = 16

export const grayIconStyle = { height: iconHeight, fill: 'gray' }
export const blueIconStyle = { height: iconHeight, fill: '#0487cf' }

export function markSearchedTerm(value, searchTerm) {
  if (!searchTerm) return value
  try {
    const regex = new RegExp(searchTerm, 'gi')
    return value.replace(regex, '<mark>$&</mark>')
  } catch (e) {
    console.error('Bad Regular Expressions:', e, searchTerm)
    return value
  }
}

export function renderAudioIcon(audible, { mutedInfo }) {
  if (mutedInfo?.muted) return <VolumeSlashIcon style={grayIconStyle} />
  if (!audible) return <VolumeOffIcon style={grayIconStyle} />
  if (audible) return <VolumeIcon style={blueIconStyle} />
}

const renderActionButtons = ({
  id,
  url,
  activeTab,
  togglePinTab,
  toggleMuteTab,
  closeTab,
  removeTab,
  pinned,
  iconPinned,
  audible
}) => {
  if (activeTab) {
    return [
      <Btn
        key={'pinButton'}
        title="Un/Pin Tab"
        gradient={false}
        border={true}
        // onClick={() => togglePinTab(id)}
      >
        {iconPinned}
      </Btn>,
      <Btn
        key={'muteButton'}
        title="Un/Mute Tab"
        gradient={false}
        border={true}
        // onClick={() => toggleMuteTab(id, audible)}
      >
        {renderAudioIcon(audible, { id, url })}
      </Btn>,
      <Btn
        key={'removeButton'}
        title="Remove Tab"
        data-id={id}
        gradient={false}
        border={true}
        // onClick={() => closeTab(id)}
      >
        <TimesIcon style={{ height: 14, fill: 'red' }} />
      </Btn>
    ]
  }
  //Non-Active Tabs only get a remove button on action bar for now.
  return (
    <Btn
      title="Remove"
      data-id={id}
      onClick={() => removeTab(url)}
      border={true}>
      <TimesIcon style={{ height: 14, fill: 'red' }} />
    </Btn>
  )
}
export default renderActionButtons
