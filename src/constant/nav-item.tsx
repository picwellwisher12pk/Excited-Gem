// import {
//   ActionMenu,
//   AdvSetting,
//   CaptureTool,
//   Recording,
//   SaveTool,
//   ShortKey,
// } from "@/components/svgs";

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  {
    icon: <CaptureTool />,
    label: "Capture Tools",
    href: "/options/capture",
  },
  { icon: <Recording />, label: "Recording", href: "/options/recording" },
  { icon: <SaveTool />, label: "Save Preferences", href: "/options/save" },
  { icon: <ActionMenu />, label: "Action Menu", href: "/options/action" },
  { icon: <ShortKey />, label: "ShortKey", href: "/options/short-key" },
  {
    icon: <AdvSetting />,
    label: "Advance Settings",
    href: "/options/adv",
  },
];
