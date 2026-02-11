import { Grid } from "lucide-react";

// components/property/PropertyImages.tsx
export default function PropertyImages() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-[500px] mb-12 overflow-hidden rounded-xl">
      <div className="md:col-span-2 md:row-span-2 bg-slate-200 overflow-hidden group cursor-pointer">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEcw-0eeqUZthwjD5xZaocqf7I7CclwuMX1XqK5OF7nqTVN60nOncv7Ep4hIedfvne5iUDUfYF4XNGixUCU6Zef_o9TYyJaLD_yRhQAHF7fBysG12Unp10m9W2DmbdcgGXvT_nB_DebuwGILb8b5dWP6ep14NFScEeG8wSDDo8aNLk-l30wQQHRn_Mg_Cni71nwbk0L7HsFc8EWNa5dpgVRXMTrsJeemdKt8iirjVVbVAI84PzDRlT5adLHoPpEHxDUzReBG664Y6c"
        />
      </div>
      <div className="bg-slate-200 overflow-hidden group cursor-pointer">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdTRuzPw8YO3mWYLU-NIGSJFECjh3bTEs8szG9ZJLXodaRckRtuI7cqj9h-CDR4dF-BGZNkPSn6Y5sEDTVrxSE7mQR-k-lI65hiLf4m3JWidWxGmMe3uGR2YINUhknpy1CiNVBlZTwwE2NMOSWUNf7FfLNS7j1bhIe4cqpRTlrGTFFFcQzdNGc-PdMExEVX8rnyWi4dINquBL_YtRxSfYsJcIK39w9PrxPk9DRj1IXIBc0PKLnPHqvt9Fcs65JRWk8YI_Fql_6w7PQ"
        />
      </div>
      <div className="bg-slate-200 overflow-hidden group cursor-pointer rounded-tr-xl">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_Bmy-OOAQaYwckollPM013Ci6J6YUZNKCxzGC7P_wVntKGtIsYgnPzLFiFzpWTRPhBMc4NZ2Cp-b2N55B4jfiUCrAEnnSMrhIOs3RYKBFEfEdZJCvyWsnT1ElkhkJmhNBK8YY4YO_bJ-z58GgEzwC3oFprb4DIQv5dxwQKqzO5TZNsKQQuFD7xSZ1a-MQcSFxdu2abEhqSyQApKh_PwErhQ86S0u0D-keK_phBymDbnFYH6SV24N0iLU_sL-GEj8rTv5VbY9pCPhI"
        />
      </div>
      <div className="bg-slate-200 overflow-hidden group cursor-pointer">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKAzF80aJAjx7yAO-rf00jBLr_apkIwgC0XC_bc4jgNMSjxvy91dEmokTy0HvFkYgoclLxj6hrik58DAjhC9uPfWP4fSxpvHYDaFkNhyicLsie45eS8D05bg1c3GTYmJRBD1sk_B-oSM7Hiz3nq58AGT0qdPHNZp7Y9mW1f5JRaaoHfzKfY4LuEx62zq01_s1dk0fKe-Gi7GbBvXuTXezVLlasW67h6GgmYpfGcbNxwK84jMeInZpO5RHOvOhNNQ1X_r_sy_w0rRzc"
        />
      </div>
      <div className="bg-slate-200 overflow-hidden group cursor-pointer rounded-br-xl relative">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAp7VJ3ocHxlNZCBVnwJFvVBJJTBGhNmaRbkZhdR3LP92m6qIDs5uLS_mnHaEsVI2SZv2OU-CUDKPic14iynbrbJUDlS0PBegyq92haaPf6hrt60lJeBGNKN4Z3ecNY5zMMVr8f6AKcAwPpqtsZfG6Fbm_Ljgyyo3b-79miRYnGepHDoslO8_t1laWVQuzpHFvck4FR1jkqyJ5LBFARpjBjPkKyyfg9Ufpz2WfcmSOilJHBafIdYsQw7d8wwOT6EXWRJksjrCBKbvne"
        />
        <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg text-slate-900 text-sm font-bold shadow-lg border border-slate-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-lg"><Grid /></span> Show all photos
        </button>
      </div>
    </div>
  )
}