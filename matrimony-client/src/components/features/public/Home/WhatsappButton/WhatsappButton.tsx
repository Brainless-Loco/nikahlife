"use client";

import Image from "next/image";
import whatsapp from "../../../../../../public/whatsapp.png";

export default function WhatsappButton() {
  return (
    <a
      href="https://wa.me/8801721972807"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-white rounded-full shadow-lg p-3 hover:scale-110 transition-transform">
        <Image
          src={whatsapp}
          alt="WhatsApp"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
    </a>
  );
}
