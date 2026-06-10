"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    tag: "Deposit Sampah",
    title: "Tukar Sampah\nJadi Poin",
    body: "Setor sampah anorganik seperti plastik, kertas, kaca, dan logam. Setiap gram dihargai — poin langsung masuk ke akun Anda.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7N2_rC5J8hePiGgb_W8lw-e77qvb227znroXWLR1q5g&s=10",
  },
  {
    tag: "Tukar Voucher",
    title: "Poin Jadi\nHadiah Nyata",
    body: "Kumpulkan poin dari setiap setoran dan tukarkan dengan voucher menarik. Semakin banyak sampah, semakin besar reward Anda.",
    image:
      "https://rricoid-assets.obs.ap-southeast-4.myhuaweicloud.com/berita/Bandung/o/1730269359729-IMG-20241030-WA0114/q9pjsmlj0v6wni6.jpeg",
  },
  {
    tag: "Edukasi Lingkungan",
    title: "Belajar Demi\nBumi Lebih Baik",
    body: "Akses konten edukasi pilihan tentang pengelolaan sampah dan lingkungan. Pengetahuan kecil bisa mengubah kebiasaan besar.",
    image: "https://lp2m.uingusdur.ac.id/wp-content/uploads/hh.jpg",
  },
];

export default function AuthCarousel() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    if (fading || idx === active) return;
    setFading(true);
    setTimeout(() => {
      setActive(idx);
      setFading(false);
    }, 300);
  };

  useEffect(() => {
    timerRef.current = setInterval(
      () => goTo((active + 1) % slides.length),
      4500,
    );
    return () => clearInterval(timerRef.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const slide = slides[active];

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border">
      {/* Background Image */}

      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          backgroundImage: `url(${slide.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/60 to-black/80" />

      <div className="absolute top-4 z-10 flex items-center gap-2.5 px-8 pt-7">
        <div className="flex size-10 items-center justify-center rounded-lg border border-white/25 bg-white">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
        </div>
        <span className="font-sans text-lg font-medium tracking-tight text-white">
          Bank Sampah
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        <div
          className="flex flex-1 flex-col justify-end px-8 transition-all duration-300"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? "translateY(10px)" : "translateY(0)",
          }}
        >
          <span className="mb-3 inline-block w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm">
            {slide.tag}
          </span>

          <h2 className="mb-3 text-3xl leading-tight font-bold whitespace-pre-line text-white">
            {slide.title}
          </h2>

          <p className="max-w-sm text-sm leading-relaxed text-white/90">
            {slide.body}
          </p>
        </div>

        <nav
          aria-label="Slide navigation"
          className="relative z-10 mt-6 flex items-center gap-2 px-8 pb-8"
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === active ? "32px" : "8px",
                background: i === active ? "white" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}
