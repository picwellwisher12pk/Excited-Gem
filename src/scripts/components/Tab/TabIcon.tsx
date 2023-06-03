import { Checkbox } from "antd"
import React from "react"
import Loading from "react:*.svg"





export function TabIcon(props: {
  onChange: () => any
  checked: any
  loading: boolean
  src: any
  title: any
}) {
  return (
    <div
      className="tab-favicon align-self-center flex px-2 items-center min-w-[56px]"
      aria-label="favicon">
      <Checkbox
        onChange={props.onChange}
        className="!mr-2"
        checked={props.checked}
      />
      {props.loading ? (
        <Loading className={"spinner"} />
      ) : (
        <LazyLoadImage
          src={props.src}
          title={props.src && props.title}
          style={{ width: 16, height: 16 }}
        />
      )}
    </div>
  )
}
