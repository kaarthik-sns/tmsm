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
    left: 20, // 🔁 Changed from right: 20
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    backdropFilter: 'blur(8px)',
    padding: '5px 8px',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: 9999,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  }}
>
      <select
        value={lang}
        onChange={handleChange}
        style={{
          backgroundColor: 'transparent',
          color: '#fff',
          border: 'none',
          fontSize: '1rem',
          outline: 'none',
          cursor: 'pointer',
          paddingRight: '1.5rem',
          appearance: 'none',
        }}
      >
        <option value="en">En</option>
        <option value="ta">த</option>
      </select>
      <ChevronDown size={16} style={{ marginLeft: '-24px', pointerEvents: 'none' }} />
    </div>
  );
};

export default LangSwitcher;
