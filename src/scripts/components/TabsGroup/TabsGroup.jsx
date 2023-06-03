const TabsGroup = (props) => {
  return (
    <ul className="tab tabs-list sortable selectable" id={"droppableUL"}>
      {props.children}
    </ul>
  )
}
export default TabsGroup
