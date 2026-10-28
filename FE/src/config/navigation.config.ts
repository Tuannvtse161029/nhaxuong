export interface NavItemConfig {
  title: string
  path: string
  iconName: 'LayoutDashboard' | 'Boxes' | 'Users' | 'Settings' | 'BarChart3' | 'ShieldAlert'
  badge?: string
}

export const NAVIGATION_ITEMS: NavItemConfig[] = [
  {
    title: 'Tổng quan',
    path: '/dashboard',
    iconName: 'LayoutDashboard',
  },
  {
    title: 'Quản lý thiết bị & kho',
    path: '/items',
    iconName: 'Boxes',
    badge: '12',
  },
  {
    title: 'Báo cáo & Thống kê',
    path: '/reports',
    iconName: 'BarChart3',
  },
  {
    title: 'Hồ sơ người dùng',
    path: '/profile',
    iconName: 'Users',
  },
  {
    title: 'Cài đặt hệ thống',
    path: '/settings',
    iconName: 'Settings',
  },
]
