import { Segmented } from 'antd'
import { Button, Modal, Radio } from 'antd'
import React, { useState } from 'react'

export const MoveModal = (props) => {
  const options = ['Current Windows', 'New Window', 'To End', 'To Start']
  const [type, setType] = useState(options[0])
  const [windowId, setWindowId] = useState(props.currentWindow.id)
  const [position, setPosition] = useState(0)

  function resetComponent() {
    setType(options[0])
    setWindowId(props.currentWindow.id)
    setPosition(0)
  }

  function makeMoveTypeUI(type) {
    switch (type) {
      case 'Current Windows':
        return (
          <Radio.Group onChange={({ target }) => setWindowId(target.value)} value={windowId}>
            <div className="flex flex-col max-h-[200px] overflow-auto">
              {props.windows.map((window, i) => (
                <Radio
                  key={window.id}
                  value={window.id}
                  disabled={window.id === props.currentWindow.id && true}>
                  {window.id === props.currentWindow.id && 'Current'} Window
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
          <>
            <p>This will move your selected tabs to new window.</p>
            <strong className="text-cyan-500">Hit OK to continue!</strong>
          </>
        )
      case 'To End':
        return (
          <>
            <p>This will move your selected tabs to end of current window.</p>
            <strong className="text-cyan-500">Hit OK to continue!</strong>
          </>
        )
      case 'To Start':
        return (
          <>
            <p>This will move your selected tabs to start of current window.</p>
            <strong className="text-cyan-500">Hit OK to continue!</strong>
          </>
        )
    }
  }

  const handleOk = async () => {
    const tabIds = props.selectedTabs.map(Number);

    try {
        switch (type) {
          case 'Current Windows':
            if (windowId === props.currentWindow.id) {
              alert('Select some window to move to')
              return
            }
            await chrome.tabs.move(tabIds, {
                windowId: Number(windowId),
                index: Number(position) || -1
            })
            break

          case 'New Window':
            // Create window with first tab
            const firstTab = tabIds[0];
            const otherTabs = tabIds.slice(1);

            const newWin = await chrome.windows.create({ tabId: firstTab, focused: true });

            if (otherTabs.length > 0) {
                await chrome.tabs.move(otherTabs, { windowId: newWin.id, index: -1 });
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
        console.error("Move failed:", error);
        alert("Failed to move tabs. See console for details.");
    }
  }

  return (
    <Modal
      title={`Move (${props.selectedTabs.length}) Tabs to`}
      open={true}
      onOk={handleOk}
      onCancel={() => {
        props.setMoveModalVisible(false)
      }}>
      <Segmented options={options} onChange={setType} value={type} />
      <div className="py-3">{makeMoveTypeUI(type)}</div>
    </Modal>
  )
}
