import { useDrag, useDrop } from "react-dnd"





export function getUseDrop(refTab: React.MutableRefObject<any>, props) {
  return useDrop({
    accept: "tab",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item, monitor) {
      if (!refTab.current) {
        return
      }
      // @ts-ignore
      const dragIndex = item.index
      const hoverIndex = props.index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return

      // Determine rectangle on screen
      const hoverBoundingRect = refTab.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
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
      // @ts-ignore
      props.moveTab(item.id, dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // @ts-ignore
      item.index = hoverIndex
    }
  })
}

export function getUseDrag(props) {
  return useDrag({
    type: "tab",
    item: { id: props.id, index: props.index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })
}
