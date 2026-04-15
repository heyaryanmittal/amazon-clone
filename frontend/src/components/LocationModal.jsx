import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const LocationModal = ({ isOpen, onClose, onApplyPincode }) => {
  const [pincode, setPincode] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 animate-[opacity_0.2s_ease-out]" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-[375px] rounded-[8px] shadow-2xl overflow-hidden animate-[scale_0.2s_ease-out]">
        {/* Header */}
        <div className="bg-[#f0f2f2] px-6 py-3 flex items-center justify-between border-b border-[#ddd]">
          <h2 className="text-[16px] font-bold text-[#111]">Choose your location</h2>
          <button onClick={onClose} className="text-[#565959] hover:text-black">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-[13px] text-[#565959] leading-[18px] mb-4">
            Select a delivery location to see product availability and delivery options
          </p>

          <Link 
            to="/login"
            className="amazon-button-yellow block w-full py-1.5 rounded-[8px] text-[13px] font-medium text-center border border-[#a88734] shadow-sm mb-4 no-underline text-black"
          >
            Sign in to see your addresses
          </Link>

          <div className="flex items-center gap-2 mb-4">
             <div className="h-[1px] bg-[#eee] flex-1"></div>
             <span className="text-[12px] text-[#888] whitespace-nowrap">or enter an Indian pincode</span>
             <div className="h-[1px] bg-[#eee] flex-1"></div>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="flex-1 border border-[#bbb] rounded-[4px] py-1 px-3 text-[14px] outline-none focus:border-[#e77600] focus:shadow-[0_0_3px_#e77600]"
            />
            <button 
              onClick={() => { onApplyPincode(pincode); onClose(); }}
              className="px-6 py-1 border border-[#d5d9d9] bg-white hover:bg-[#f7fafb] rounded-[8px] text-[13px] shadow-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
