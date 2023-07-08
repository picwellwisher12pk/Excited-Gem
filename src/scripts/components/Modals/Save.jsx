import { Button, Input } from 'antd'
import { Modal, Radio, Select } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { clearSelectedTabs } from '../../tabSlice'

const { Option } = Select

const children = []
export const SaveModal = (props) => {
  const { tabs, filteredTabs } = useSelector((state) => state.tabs)
  console.log(props.selectedTabs)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [list, setList] = useState([])
  const handleCancel = () => {
    props.setSaveModalVisible(false)
  }
  const handleChange = (value) => {
    children.push(value)
    console.log(`selected ${value}`)
  }

  return (
    <Modal
      title={'Save Tabs as list'}
      open={true}
      width={800}
      onOk={handleCancel}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button type="primary" loading={loading} onClick={handleCancel}>
          Save
        </Button>
      ]}>
      <Input
        className="mb-3"
        defaultValue={''}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <div className="mt-3">
        {/* <span>Tags</span> */}
        <Select
          className="border"
          mode="tags"
          style={{
            width: '100%'
          }}
          placeholder="Tags"
          onChange={setTags}>
          {children}
        </Select>
      </div>
      <div className="mt-5">
        <span>Tabs ({props.selectedTabs.length})</span>

        <div className="max-h-[300px] overflow-auto">
          {props.selectedTabs.map((tabId) => {
            const tab = tabs.find((tab) => tab.id === tabId)
            return (
              <div
                className="overflow-hidden tab-item flex p-2 bg-slate-100 hover:bg-slate-100 transition-colors duration-300 border-b-stone-100 border text-xs"
                title={tab.url}>
                <strong>{tab.title}</strong>
              </div>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
