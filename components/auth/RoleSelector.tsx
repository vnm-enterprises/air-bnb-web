// components/auth/RoleSelector.tsx
import { useState } from 'react'

export default function RoleSelector() {
  const [role, setRole] = useState<'traveler' | 'host'>('traveler')

  return (
    <div className="flex h-12 w-full items-center justify-center rounded-lg bg-[#2C5F5D]/10 p-1">
      <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-4 ${
        role === 'traveler'
          ? 'bg-white  shadow-sm text-[#2C5F5D]'
          : 'text-[#628483]'
      } text-sm font-semibold transition-all`}>
        <span className="truncate">I&apos;m a Traveler</span>
        <input
          checked={role === 'traveler'}
          className="invisible w-0"
          name="user-role"
          type="radio"
          value="traveler"
          onChange={() => setRole('traveler')}
        />
      </label>
      <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-4 ${
        role === 'host'
          ? 'bg-white  shadow-sm text-[#2C5F5D] '
          : 'text-[#628483]'
      } text-sm font-semibold transition-all`}>
        <span className="truncate">I&apos;m a Host</span>
        <input
          checked={role === 'host'}
          className="invisible w-0"
          name="user-role"
          type="radio"
          value="host"
          onChange={() => setRole('host')}
        />
      </label>
    </div>
  )
}