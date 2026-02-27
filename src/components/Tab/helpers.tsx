import { useCallback } from 'react'
import TimesIcon from 'react:/src/icons/times.svg'
import VolumeOffIcon from 'react:/src/icons/volume-off.svg'
import VolumeSlashIcon from 'react:/src/icons/volume-slash.svg'
import VolumeIcon from 'react:/src/icons/volume.svg'

import ItemBtn from '../ItemBtn'

export const iconHeight: number = 16

export const grayIconStyle: object = { height: iconHeight, fill: 'gray' }
export const blueIconStyle: object = { height: iconHeight, fill: '#0487cf' }

export function markSearchedTerm(value: string, searchTerm: string) {
  if (!searchTerm) return value
  try {
    const regex: RegExp = new RegExp(searchTerm, 'gi')
    return value.replace(regex, '<mark>$&</mark>')
  } catch (e) {
    console.error('Bad Regular Expressions:', e, searchTerm)
    return value
  }
}

export function renderAudioIcon(audible, mutedInfo) {
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
  iconPinned,
  audible
}) => {
  const handlePinTab = useCallback(() => togglePinTab(id), [id])
  const handleMuteTab = useCallback(() => toggleMuteTab(id, audible), [id])
  const handleCloseTab = useCallback(() => closeTab(id), [id])
  const handleRemove = useCallback(() => removeTab(id), [id])

  return activeTab ? (
    <>
      <ItemBtn title="Un/Pin Tab" onClick={handlePinTab}>
        {iconPinned}
      </ItemBtn>
      <ItemBtn title="Un/Mute Tab" onClick={handleMuteTab}>
        {renderAudioIcon(audible, { id, url })}
      </ItemBtn>
      <ItemBtn onClick={handleCloseTab} title="Close Tab">
        <TimesIcon style={{ height: 14, fill: 'red' }} />
      </ItemBtn>
    </>
  ) : (
    //Non-Active Tabs only get a remove button on action bar for now.
    <ItemBtn onClick={handleRemove} />
  )
}
export default renderActionButtons
