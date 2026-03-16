'use client';
import { useLanguage } from '@/lib/useLanguage';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LangSwitcher = ({lang,setLang}) => {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as 'en' | 'ta';
    setLang(newLang);
    router.refresh(); // This triggers a re-fetch of server components
  };

  return (
<div
  style={{
    position: 'fixed',
    bottom: 20,
    right: 2, // 🔁 Changed from right: 20
    backgroundColor: 'rgb(255 209 108)',
    backdropFilter: 'blur(8px)',
    padding: '5px 8px',
    borderRadius: '6px',
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 12px',
    zIndex: 9999,
    color: 'rgb(153 34 34)',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  }}
>
      <select
        value={lang}
        onChange={handleChange}
        style={{
          width: '70px', // 👈 Ensures fixed width
          backgroundColor: '#ffd16c',
          color: 'rgb(153 34 34)',
          border: 'none',
          fontSize: '12px',
          outline: 'none',
          cursor: 'pointer',
          paddingRight: '1.5rem',
          appearance: 'none',
          textAlign: 'center', // Optional: center the text
        }}
      >
        <option value="en">English</option>
        <option value="ta">தமிழ் </option>
      </select>
      <ChevronDown size={16} style={{ marginLeft: '-24px', pointerEvents: 'none' }} />
    </div>
  );
};

export default LangSwitcher;
