import { Checkbox } from 'antd'
import React from 'react'
// @ts-ignore
import Loading from 'react:/src/icons/spinner-third.svg'





export function TabIcon({ onChange, checked, loading, src, title }: {
  onChange: () => void;
  checked: boolean;
  loading: boolean;
  src: string;
  title: string;
}) {
  return (
    <div
      className="tab-favicon align-self-center flex px-2 items-center min-w-[56px]"
      aria-label="favicon">
      <Checkbox
        onChange={onChange}
        className="!mr-2"
        checked={checked}
      />
      {loading ? (
        <Loading className={'spinner'} style={{ fill: 'blue' }} />
      ) : (
        <img
          src={src || 'default-src-value'}
          alt={title}
          title={src && title}
          style={{ width: 16, height: 16 }}
        />
      )}
    </div>
  )
}
