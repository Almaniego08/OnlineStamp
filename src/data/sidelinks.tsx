import {
  IconChecklist,
  IconLayoutDashboard,
  IconMessages,
  IconUsersGroup,
  IconCheckupList,
  IconAutomaticGearbox,
  IconTools,
  IconRubberStamp,
  IconPdf,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [

  {
    title: 'Stamping',
    label: '',
    href: '/',
    icon: <IconRubberStamp size={18} />,
  },
]
