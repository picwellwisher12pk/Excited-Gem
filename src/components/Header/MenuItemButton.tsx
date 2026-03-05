import { Button } from 'antd'

const MenuItemButton = ({ label, callback }) => {
  return (
    <Button type={'link'} onClick={callback}>
      {label.toUpperCase()}
    </Button>
  )
}
export default MenuItemButton
