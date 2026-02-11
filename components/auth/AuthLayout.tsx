// components/auth/AuthLayout.tsx
import HeroSection from './HeroSection'
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <HeroSection />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background-light ">
        <div className="max-w-[480px] w-full flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="text-[#111717]  text-4xl font-black leading-tight tracking-[-0.033em]">
              {title}
            </p>
            <p className="text-[#628483]  text-base font-normal leading-normal">
              {subtitle}
            </p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}