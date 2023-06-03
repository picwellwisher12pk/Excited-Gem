import { Button } from 'antd';

const MenuItemButton = (label: string, callback: () => any) => {
  return (
    <Button type={'link'} onClick={callback}>
      {label.toUpperCase()}
    </Button>
  );
};
export default MenuItemButton;
