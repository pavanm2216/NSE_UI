import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी",    flag: "🇮🇳" },
  { code: "kn", label: "ಕನ್ನಡ",     flag: "🇮🇳" },
  { code: "es", label: "Español",  flag: "🇪🇸" },
  { code: "or", label: "Odia",     flag: "🇮🇳" },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

  const change = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm shadow-md hover:shadow-lg transition-shadow"
        >
          <span className="text-base leading-none">{current.flag}</span>
          <span className="font-medium text-gray-700">{current.label}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <ul className="absolute bottom-full mb-1 left-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
            {LANGUAGES.map(lang => (
              <li key={lang.code}>
                <button
                  onClick={() => change(lang.code)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${lang.code === current.code ? "font-semibold text-primary" : "text-gray-700"}`}
                >
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
