import { DecimalsArrowLeft } from "lucide-react";

// components/auth/HeroSection.tsx
export default function HeroSection() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#2C5F5D]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC24Idoaop4Y-RiUSGrA_meadhWL4qc1A6gy9E2wvFp7Ggzv5QhqlTTOOsdfgcB-QYKhuAajU-pY8FO-lBLdVvYOJyjGxGdVUVoPHTiPAk9FCY9i0BUIxPZ_eQhDdugSQcWt5HuASAYnVJojzUtUCfr7Mm43r7sC6mm8Lz9BrPHA6_dNg8KKVSn7vLtXmDhz7_fmV2e0Acs-MVNL7sM9H6mmuCZe9rGeaa_-cq9PWaW8QFouD9tOWixaCFoxJBDKDI4XVj65x7tXjN8')"
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#2C5F5D]/80 to-transparent"></div>

      <div className="relative z-10 flex flex-col justify-between p-16 w-full text-white">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <span className="material-symbols-outlined text-white text-3xl"><DecimalsArrowLeft /></span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">StayTeal</h2>
        </div>

        <div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Experience the art of <br/>hospitality.
          </h1>
          <p className="text-xl text-white/80 max-w-md">
            Whether you&apos;re exploring the world or opening your doors, StayTeal makes every stay feel like home.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#2C5F5D] bg-gray-200 overflow-hidden">
              <img
                alt="avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbuBL0rVe6J7uaDnYFg6URCMGjolC4EnGuv3TdqYXJVoH76Vk1evAD8K35l0XnRlDfGqJSBER59k76I3XcGcFpPaRExSC3WkZpXZSApaIs1svhpCsnv5BMU-zAvZ154kAC-bJcT7W5MPWdNYsMyJQY60NmxTBilyKxNCbz8E1XWwDGKPPSfany8lBqgBPZidSSa8XAie0oFRub2eJkIdYHtR4h2KDGrq-0VI06GQtXffIs9dUmAW2ylCC2PP0gB1TJW7mDWA3EdU4y"
              />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#2C5F5D] bg-gray-200 overflow-hidden">
              <img
                alt="avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALMCYQOpQe3kBYgdTF25WrecfQtER9n2_R6PMtBW3-9fR7-jyAbzSk4f3LBaUYIQBCx5xjaTIG2cm18bDvFFpwABqiTtXQR_J3AILdf6YBYq3zoWh1_QE33VSLZ2mCAtSXsr7lGtGex1US0lbfcpjGPmKL8bfD5UYkixiZ8hJ1tTIT481YNgMeI5WNoFBjLoKx2IQUuwizeaA1KnxUHKX7GmgidnVTituAER5IV2zUTykvR699si6Pr709DQFAv3HDGzvsCgz1bjz3"
              />
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-[#2C5F5D] bg-gray-200 overflow-hidden">
              <img
                alt="avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCagiDWA1o-yTq21hHZ80i1vISyoJmRMtlV2fIN-iJoTrOXCAoqshAShdAHaabS0MlgXU8FT_kQIMnTs7VlRDbI1VpQeLQImwwD9j9Tkah0MOpwiL4WHrJvnDxXGNVtu3G-N694r72NWqmTIalYIwXoVvK7VGsvQmisOnocwX_277-a1kRYAh5GgSi6yflSYQB9DY2SeWtf0kJJ79RFr153LEga7bn0lICocavfjkP5SHiJ_D8OQwsWP8W5CX4r1fZIjuUkWnQsqZtG"
              />
            </div>
          </div>
          <p className="text-sm font-medium">Joined by 10k+ travelers this month</p>
        </div>
      </div>
    </div>
  )
}