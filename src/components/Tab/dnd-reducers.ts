import type { Identifier } from 'dnd-core'
import { useDrag, useDrop } from "react-dnd"
import type { DragSourceMonitor, DropTargetMonitor } from 'react-dnd'

interface DragItem {
  id: number
  index: number
  type: string
}

interface DragCollectedProps {
  isDragging: boolean
}

interface DropCollectedProps {
  handlerId: Identifier | null
}

interface TabProps {
  id: number
  index: number
  moveTab: (id: number, dragIndex: number, hoverIndex: number) => void
}

export function getUseDrop(
  ref: React.RefObject<HTMLElement>,
  props: TabProps
) {
  return useDrop<DragItem, void, DropCollectedProps>({
    accept: "tab",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = props.index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      if (!clientOffset) {
        return
      }

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      props.moveTab(item.id, dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })
}

export function getUseDrag(props: TabProps) {
  return useDrag<DragItem, void, DragCollectedProps>({
    type: "tab",
    item: { id: props.id, index: props.index, type: "tab" },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging()
    })
  })
}
