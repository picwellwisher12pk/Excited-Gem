
import Capture from "@/components/svgs/Capture.svg?react"
import Clock from "@/components/svgs/Clock.svg?react"
import Desktop from "@/components/svgs/Desktop.svg?react"
import EditPage from "@/components/svgs/EditPage.svg?react"
import Select from "@/components/svgs/Select.svg?react"
import Video from "@/components/svgs/Video.svg?react"


export const options = [
  {
    icon: <Select />,
    name: "Select & Scroll", key: "Alt + S", time: false
  },
  {
    icon: <Clock />,
    name: "Delayed screen", key: "Ctrl + D", time: true
  },
  {
    icon: <Capture />,
    name: "Capture Fragment",
    key: "Alt + Shift + 3",
    time: false,
  },
  {
    icon: <EditPage />,
    name: "Edit Webpage", key: "Ctrl + E", time: false
  },
  {
    icon: <Desktop />,
    name: "Desktop screenshot",
    key: "Ctrl + Shift + D",
    time: false,
  },
  {
    icon: <Video />,
    name: "Record Video", key: "Ctrl + R", time: false
  },
];
