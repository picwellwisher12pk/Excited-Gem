
import Area from '@/components/svgs/Area.svg?react'
import Computer from '@/components/svgs/Computer.svg?react'
import Visible from '@/components/svgs/Visible.svg?react'
import Desktop from '@/components/svgs/Desktop.svg?react'
import Webcam from '@/components/svgs/Webcam.svg?react'
import Tab from '@/components/svgs/Tab.svg?react'


export const smallCard = [
  {
    id: 1,
    icon: <Visible />,
    name: "Visible Part",
    key: "Ctrl + Shift + D",
  },
  {
    id: 2,
    icon: <Computer />,
    name: "Entire Page",
    key: "Ctrl + Shift + P",
  },
  {
    id: 3,
    icon: <Area />,
    name: "Selected Area",
    key: "Ctrl + Shift + S",
  },
  {
    id: 4,
    icon: <Desktop />,
    name: "Desktop",
    key: "Ctrl + Shift + L",
  },
  {
    id: 5,
    icon: <Tab />,
    name: "This Tab",
    key: "Ctrl + Shift + T",
  },
  {
    id: 6,
    icon: <Webcam />,
    name: "Webcam",
    key: "Ctrl + Shift + W",
  },
];
