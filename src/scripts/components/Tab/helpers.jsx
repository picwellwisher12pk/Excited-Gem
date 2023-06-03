import TimesIcon from "react:/src/icons/times.svg"
import VolumeOffIcon from "react:/src/icons/volume-off.svg"
import VolumeSlashIcon from "react:/src/icons/volume-slash.svg"
import VolumeIcon from "react:/src/icons/volume.svg"





export const iconHeight = 16
export const grayIconStyle = { height: iconHeight, fill: "gray" }
export const blueIconStyle = { height: iconHeight, fill: "#0487cf" }

export function markSearchedTerm(value, searchTerm) {
  if (!searchTerm) return value
  try {
    const regex = new RegExp(searchTerm, "gi")
    return value.replace(regex, "<mark>$&</mark>")
  } catch (e) {
    console.trace("Bad Regular Expressions:", e, searchTerm)
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
      <li
        key={1}
        title="Un/Pin Tab"
        className={`clickable flex pin-tab ${pinned ? " active" : " disabled"}`}
        onClick={() => props.togglePinTab(id)}
        aria-label="pinned">
        <button className="px-2">{iconPinned}</button>
      </li>,
      <li
        key={2}
        title="Un/Mute Tab"
        className={`clickable sound-tab` + (audible ? ` active` : ` disabled`)}
        onClick={() => props.toggleMuteTab(id, audible)}>
        <button className="w-6 flex justify-center">
          {renderAudioIcon(audible, props)}
        </button>
      </li>,
      <li
        key={3}
        title="Close Tab"
        className="cursor-pointer px-2 remove-tab"
        data-id={id}
        onClick={() => props.closeTab(id)}
        data-command="remove">
        <button className="mr-1">
          <TimesIcon style={{ height: 16, fill: "red" }} />
        </button>
      </li>
    ]
  }
  //Non-Active Tabs only get a remove button on action bar for now.
  return (
    <li
      title="Remove"
      className="clickable remove-tab mr-1"
      data-id={id}
      onClick={() => props.removeTab(url)}
      data-command="remove">
      <TimesIcon style={{ height: 16, fill: "red" }} />
    </li>
  )
}
