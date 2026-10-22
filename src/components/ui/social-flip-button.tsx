import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaPhone, FaEnvelope } from "react-icons/fa";

export interface SocialItem {
  letter: string;
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface SocialFlipButtonProps {
  items?: SocialItem[];
  className?: string;
  darkMode?: boolean;
}

const defaultItems: SocialItem[] = [
  { letter: "C", icon: <FaTwitter />,   label: "Twitter",   href: "https://x.com/lendrixven?s=21" },
  { letter: "O", icon: <FaFacebook />,  label: "Facebook",  href: "https://www.facebook.com/share/v/18CWxiKTQo/?mibextid=wwXIfr" },
  { letter: "N", icon: <FaLinkedin />,  label: "LinkedIn",  href: "https://www.linkedin.com/company/lendrix-ventech-private-limited/" },
  { letter: "N", icon: <FaInstagram />, label: "Instagram", href: "https://www.instagram.com/lendrixventech?igsh=Ym95dGczajRld3J3&utm_source=qr" },
  { letter: "E", icon: <FaYoutube />,   label: "YouTube",   href: "https://youtube.com/@lendrixventechprivatelimited?si=zrvkv0DOYyOv2dzZ" },
  { letter: "C", icon: <FaPhone />,     label: "Call Us",   href: "tel:+919652019666" },
  { letter: "T", icon: <FaEnvelope />,  label: "Email Us",  href: "mailto:contactus@lendrixventech.com" },
];

function SocialFlipNode({
  item, index, isHovered, tooltipIndex, setTooltipIndex, darkMode,
}: {
  item: SocialItem; index: number; isHovered: boolean;
  tooltipIndex: number | null; setTooltipIndex: (v: number | null) => void;
  darkMode?: boolean;
}) {
  return (
    <a
      href={item.href}
      target={item.href.startsWith('tel:') || item.href.startsWith('mailto:') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      className="relative h-7 w-7 cursor-pointer"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setTooltipIndex(index)}
      onMouseLeave={() => setTooltipIndex(null)}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {tooltipIndex === index && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.85, x: "-50%" }}
            animate={{ opacity: 1, y: 36, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: -6, scale: 0.85, x: "-50%" }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-50 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-semibold text-white shadow-lg pointer-events-none mt-1"
          >
            {item.label}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rotate-45 bg-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flip card */}
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{ rotateY: isHovered ? 180 : 0 }}
        transition={{
          duration: 0.7,
          type: "spring",
          stiffness: 130,
          damping: 16,
          delay: index * 0.07,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front — letter */}
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-md text-xs font-bold ${darkMode ? 'text-white' : 'bg-primary/10 text-primary'}`}
          style={{ backfaceVisibility: 'hidden', background: darkMode ? 'rgba(255,255,255,0.2)' : undefined }}
        >
          {item.letter}
        </div>

        {/* Back — icon */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-md bg-primary text-white text-sm"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {item.icon}
        </div>
      </motion.div>
    </a>
  );
}

export default function SocialFlipButton({ items = defaultItems, className, darkMode = false }: SocialFlipButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  return (
    <div
      className={cn("relative flex items-center gap-1.5 rounded-xl px-2 py-1", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTooltipIndex(null); }}
    >
      {/* Animated border lines */}
      <div className="absolute -inset-[1px] overflow-hidden rounded-xl pointer-events-none">
        <motion.div
          className={`absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent ${darkMode ? 'via-white/40' : 'via-primary/60'} to-transparent`}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={`absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent ${darkMode ? 'via-white/40' : 'via-primary/60'} to-transparent`}
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {items.map((item, i) => (
        <SocialFlipNode
          key={i} item={item} index={i}
          isHovered={isHovered}
          tooltipIndex={tooltipIndex}
          setTooltipIndex={setTooltipIndex}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
}
