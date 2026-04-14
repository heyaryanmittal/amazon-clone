import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LanguageSettingsPage = () => {
  const [selectedLang, setSelectedLang] = useState('English - EN');
  const navigate = useNavigate();

  const languages = [
    { code: 'hi', label: 'हिन्दी - HI - अनुवाद' },
    { code: 'ta', label: 'தமிழ் - TA - மொழிபெயர்ப்பு' },
    { code: 'te', label: 'తెలుగు - TE - అనువాదం' },
    { code: 'kn', label: 'ಕನ್ನಡ - KN - ಭಾಷಾಂತರ' },
    { code: 'ml', label: 'മലയാളം - ML - വിവർത്തനം' },
    { code: 'bn', label: 'বাংলা - BN - অনুবাদ' },
    { code: 'mr', label: 'मराठी - MR - भाषांतर' }
  ];

  return (
    <div className="bg-white min-h-screen pb-16 font-[Arial,sans-serif]">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <h1 className="text-[24px] font-medium text-[#0f1111] mb-2 leading-tight">Language Settings</h1>
        <p className="text-[14px] text-[#0f1111] mb-6">Select the language you prefer for browsing, shopping and communications.</p>

        <div className="flex flex-col mb-8">
          <label className="flex items-center gap-[10px] cursor-pointer mb-[14px]">
            <div className={`w-[19px] h-[19px] rounded-full border ${selectedLang === 'English - EN' ? 'border-[#007185]' : 'border-[#888c8c]'} flex items-center justify-center -ml-[2px]`}>
              {selectedLang === 'English - EN' && <div className="w-[9px] h-[9px] bg-[#007185] rounded-full"></div>}
            </div>
            <input 
              type="radio" 
              name="language" 
              checked={selectedLang === 'English - EN'}
              onChange={() => setSelectedLang('English - EN')}
              className="hidden" 
            />
            <span className="text-[14px] text-[#0f1111] font-medium" style={{ transform: 'translateY(-1px)' }}>English - EN</span>
          </label>

          <hr className="border-t border-[#e7e7e7] mb-[15px] ml-7 max-w-[280px]" />

          <div className="flex flex-col gap-3">
            {languages.map(lang => (
              <label key={lang.code} className="flex items-center gap-[10px] cursor-pointer h-[24px]">
                <div className={`w-[19px] h-[19px] rounded-full border ${selectedLang === lang.label ? 'border-[#007185]' : 'border-[#888c8c]'} flex items-center justify-center -ml-[2px] transition-colors hover:border-[#db4002]`}>
                  {selectedLang === lang.label && <div className="w-[9px] h-[9px] bg-[#007185] rounded-full"></div>}
                </div>
                <input 
                  type="radio" 
                  name="language" 
                  checked={selectedLang === lang.label}
                  onChange={() => setSelectedLang(lang.label)}
                  className="hidden" 
                />
                <span className="text-[14px] text-[#0f1111] leading-5" style={{ transform: 'translateY(-1px)' }}>{lang.label}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-t border-[#e7e7e7] my-6" />

        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-5 py-1.5 rounded-full border border-[#d5d9d9] bg-white text-[#0f1111] text-[13px] hover:bg-[#f7fafa] shadow-[0_2px_5px_0_rgba(213,217,217,.5)] leading-tight h-[30px]"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="px-4 py-1.5 rounded-full border border-[#fcd200] bg-[#ffd814] text-[#0f1111] text-[13px] hover:bg-[#f7ca00] shadow-[0_2px_5px_0_rgba(213,217,217,.5)] leading-tight h-[30px]"
          >
            Save Changes
          </button>
        </div>
      </div>

      <hr className="border-t border-[#e7e7e7] mt-8 mb-5" />

      {/* Footer Recommendations Block */}
      <div className="flex flex-col items-center py-6 px-4">
        <div className="text-[13px] text-black font-bold mb-1">
          See personalized recommendations
        </div>
        <Link to="/login" className="bg-[#ffd814] border border-[#fcd200] rounded-lg px-20 py-1.5 font-bold text-[#111] text-[13px] my-2 shadow-[0_2px_5px_rgba(213,217,217,0.5)] no-underline hover:bg-[#f7ca00]">
          Sign in
        </Link>
        <div className="text-[11px] text-[#111]">
          New customer? <Link to="/register" className="text-[#007185] hover:text-[#c45500] hover:underline">Start here.</Link>
        </div>
      </div>
    </div>
  );
};

export default LanguageSettingsPage;
