// components/auth/PasswordStrength.tsx
interface PasswordStrengthProps {
  strength: 'weak' | 'medium' | 'strong'
}

export default function PasswordStrength({ strength }: PasswordStrengthProps) {
  const getStrengthColor = () => {
    switch(strength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-[#2C5F5D]'
    }
  }

  const getStrengthWidth = () => {
    switch(strength) {
      case 'weak': return 'w-1/3'
      case 'medium': return 'w-2/3'
      case 'strong': return 'w-full'
    }
  }

  return (
    <div className="mt-1 flex items-center gap-2">
      <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${getStrengthColor()} ${getStrengthWidth()}`}></div>
      </div>
      <span className="text-[10px] font-bold text-[#2C5F5D] uppercase">{strength}</span>
    </div>
  )
}