import Btn from './Btn'

interface ItemBtnProps {
  onClick: () => void;
  title?: string;
  'aria-label'?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function ItemBtn({ onClick, ...props }: ItemBtnProps) {
  return (
    <Btn onClick={onClick} gradient={false} border={true} {...props}>
      {props.children}
    </Btn>
  )
}
