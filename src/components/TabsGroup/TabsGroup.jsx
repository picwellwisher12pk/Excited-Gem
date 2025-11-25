import { List } from 'antd'

const TabsGroup = (props) => {
  return (
    <List className="tab tabs-list sortable selectable" id={'droppableDIV'}>
      {props.children}
    </List>
  )
}
export default TabsGroup
