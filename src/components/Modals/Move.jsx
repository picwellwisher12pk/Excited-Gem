import { Segmented } from 'antd'
import { Button, Modal, Radio, Alert } from 'antd'
import { useState, useEffect } from 'react'

export const MoveModal = (props) => {
  const options = ['Current Windows', 'New Window', 'To End', 'To Start']
  const [type, setType] = useState(options[0])
  const [windowId, setWindowId] = useState(props.currentWindow?.id)
  const [position, setPosition] = useState(0)

  useEffect(() => {
    if (props.currentWindow?.id) {
      setWindowId(props.currentWindow.id)
    }
  }, [props.currentWindow])

  function resetComponent() {
    setType(options[0])
    setWindowId(props.currentWindow?.id)
    setPosition(0)
  }

  function makeMoveTypeUI(type) {
    switch (type) {
      case 'Current Windows':
        return (
          <Radio.Group
            onChange={({ target }) => setWindowId(target.value)}
            value={windowId}
          >
            <div className="flex flex-col max-h-[200px] overflow-auto">
              {props.windows.map((window, i) => (
                <Radio
                  key={window.id}
                  value={window.id}
                  disabled={window.id === props.currentWindow?.id}
                >
                  {window.id === props.currentWindow?.id && 'Current'} Window
                  {i + 1}{' '}
                  <small className="text-orange-500">
                    ({window.tabs.length} tabs)
                  </small>
                  <small className="text-gray-300 ml-3">ID:{window.id}</small>
                </Radio>
              ))}
            </div>
          </Radio.Group>
        )
      case 'New Window':
        return (
          <Alert
            message="New Window"
            description="This will move your selected tabs to a new window."
            type="info"
            showIcon
          />
        )
      case 'To End':
        return (
          <Alert
            message="To End"
            description="This will move your selected tabs to the end of the current window."
            type="info"
            showIcon
          />
        )
      case 'To Start':
        return (
          <Alert
            message="To Start"
            description="This will move your selected tabs to the start of the current window."
            type="info"
            showIcon
          />
        )
    }
  }

  const handleOk = async () => {
    const tabIds = props.selectedTabs.map(Number)

    try {
      switch (type) {
        case 'Current Windows':
          if (!windowId || windowId === props.currentWindow?.id) {
            // If user selected "Current Windows" but didn't pick a DIFFERENT window, warn them
            // UNLESS they really meant to move within the same window?
            // But the UI disables the current window radio button.
            // So if windowId is still currentWindow.id, they haven't picked a valid target.
            alert('Select a different window to move to')
            return
          }
          await chrome.tabs.move(tabIds, {
            windowId: Number(windowId),
            index: -1 // Append to end of target window
          })
          break

        case 'New Window':
          // Create window with first tab
          const firstTab = tabIds[0]
          const otherTabs = tabIds.slice(1)

          const newWin = await chrome.windows.create({
            tabId: firstTab,
            focused: true
          })

          if (otherTabs.length > 0) {
            await chrome.tabs.move(otherTabs, {
              windowId: newWin.id,
              index: -1
            })
          }
          break

        case 'To End':
          await chrome.tabs.move(tabIds, {
            windowId: props.currentWindow.id,
            index: -1
          })
          break

        case 'To Start':
          await chrome.tabs.move(tabIds, {
            windowId: props.currentWindow.id,
            index: 0
          })
          break
      }

      resetComponent()
      props.setMoveModalVisible(false)
    } catch (error) {
      console.error('Move failed:', error)
      alert('Failed to move tabs. See console for details.')
    }
  }

  return (
    <Modal
      title={`Move (${props.selectedTabs.length}) Tabs`}
      open={true}
      onOk={handleOk}
      onCancel={() => {
        props.setMoveModalVisible(false)
      }}
      footer={
        <div className="flex justify-end gap-2">
          <Button key="back" onClick={() => props.setMoveModalVisible(false)}>
            Cancel
          </Button>
          <Button key="submit" type="primary" onClick={handleOk}>
            OK
          </Button>
        </div>
      }
    >
      <Segmented
        options={options}
        onChange={setType}
        value={type}
        className="mb-4"
      />
      <div className="py-3">{makeMoveTypeUI(type)}</div>
    </Modal>
  )
}
