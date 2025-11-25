import { Badge } from 'antd'
import React, { memo } from 'react'

const Navigation = ({ tabCount }) => {
  console.log('navigation')
  return (
    <div className="flex flex-grow" id="navbarNav">
      <div className="flex justify-start w-fdivl mb-0">
        <div className="px-4 py-3">
          <Badge
            overflowCount={999}
            offset={[5, -3]}
            count={tabCount}
            color={tabCount > 50 ? 'orange' : 'green '}
            size="small"
            className="!border-0">
            <a
              className=" text-white font-weight-bold"
              href="/tabs/home.html"
              id="go-to-tabs">
              Tabs
              <span className="sr-only">(current)</span>
            </a>
          </Badge>
        </div>
        <div className="px-4 py-3">
          <a className=" text-white" href="/tabs/sessions.html">
            Sessions
          </a>
        </div>
      </div>
    </div>
  )
}

export default memo(Navigation)
