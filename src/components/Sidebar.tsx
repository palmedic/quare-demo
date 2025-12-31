'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DashboardIcon, ChatIcon, BrainIcon, BoltIcon, SettingsIcon } from './Icons'

const navigation = [
  { name: 'Dashboard', href: '/', Icon: DashboardIcon },
  { name: 'Ask', href: '/ask', Icon: ChatIcon },
  { name: 'Customer Twin', href: '/twin', Icon: BrainIcon },
  { name: 'Automations', href: '/automations', Icon: BoltIcon },
]

const bottomNavigation = [
  { name: 'Settings', href: '/settings', Icon: SettingsIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Quare</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.Icon size={20} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-gray-200">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.Icon size={20} />
              {item.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
