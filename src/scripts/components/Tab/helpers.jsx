import { Button } from 'antd'
import TimesIcon from 'react:/src/icons/times.svg'
import VolumeOffIcon from 'react:/src/icons/volume-off.svg'
import VolumeSlashIcon from 'react:/src/icons/volume-slash.svg'
import VolumeIcon from 'react:/src/icons/volume.svg'

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
    console.trace('Bad Regular Expressions:', e, searchTerm)
  }
}

export function renderAudioIcon(audible, { mutedInfo }) {
  if (mutedInfo.muted) return <VolumeSlashIcon style={grayIconStyle} />
  if (!audible) return <VolumeOffIcon style={grayIconStyle} />
  if (audible) return <VolumeIcon style={blueIconStyle} />
}

export function renderActionButtons(props, pinned, iconPinned, audible) {
  const { id, url } = props
  if (props.activeTab) {
    return [
      <Button
        key={1}
        title="Un/Pin Tab"
        size="small"
        onClick={() => props.togglePinTab(id)}
        style={btnStyle}
        aria-label="pinned">
        {iconPinned}
      </Button>,
      <Button
        onClick={() => props.toggleMuteTab(id, audible)}
        key={2}
        title="Un/Mute Tab"
        size="small"
        style={btnStyle}>
        {renderAudioIcon(audible, props)}
      </Button>,
      <Button
        size={'small'}
        key={3}
        title="Close Tab"
        data-id={id}
        style={btnStyle}
        onClick={() => props.closeTab(id)}
        data-command="remove">
        <TimesIcon style={{ height: 14, fill: 'red' }} />
      </Button>
    ]
  }
  //Non-Active Tabs only get a remove button on action bar for now.
  return (
    <Button
      title="Remove"
      data-id={id}
      onClick={() => props.removeTab(url)}
      data-command="remove">
      <TimesIcon style={{ height: 14, fill: 'red' }} />
    </Button>
  )
}
