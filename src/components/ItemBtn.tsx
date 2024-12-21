import Btn from './Btn'

export default function ItemBtn({ onClick, ...props }: any) {
  return (
    <Btn onClick={onClick} gradient={false} border={true} {...props}>
      {props.children}
    </Btn>
  )
}
