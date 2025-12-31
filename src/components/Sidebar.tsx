'use client'

import Link from 'next/link'
import Image from 'next/image'
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
    <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-700 min-h-screen">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-slate-700">
        <Image
          src="/logo.svg"
          alt="Quare"
          width={156}
          height={42}
          priority
        />
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
                  ? 'bg-primary/20 text-primary'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.Icon size={20} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-4 py-4 border-t border-slate-700">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
