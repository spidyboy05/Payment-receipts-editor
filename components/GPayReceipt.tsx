
import React from 'react';
import { ReceiptData } from '../types';

interface Props {
  data: ReceiptData;
}

export const GPayReceipt: React.FC<Props> = ({ data }) => {
  const isDark = data.darkMode;
  
  // 200% Accurate Color Palette from Screenshots
  const bgClass = isDark ? 'bg-[#121212]' : 'bg-white';
  // Screenshot shows card is slightly lighter than bg in dark mode
  const surfaceClass = isDark ? 'bg-[#1f1f1f]' : 'bg-white'; 
  
  // Exact text colors
  const textPrimary = isDark ? 'text-[#e8eaed]' : 'text-[#202124]';
  const textSecondary = isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]';
  // Labels (make white in dark mode, keep secondary in light mode)
  const labelClass = isDark ? 'text-white' : textSecondary;
  
  // Border colors - very subtle in dark mode
  const borderClass = isDark ? 'border-[#3c4043]' : 'border-[#e0e0e0]';

  return (
    <div className={`max-w-md w-full mx-auto min-h-[850px] font-display ${bgClass} relative`}>
      {/* Header */}
      <header className={`flex items-center justify-between p-4 pt-5 ${textPrimary}`}>
        <span className="material-icons cursor-pointer text-2xl">arrow_back</span>
        <div className="flex items-center space-x-5">
          <span className="material-icons-outlined cursor-pointer text-2xl">flag</span>
          <span className="material-icons cursor-pointer text-2xl">more_vert</span>
        </div>
      </header>

      <main className="flex flex-col items-center px-6 pt-4 pb-4">
        {/* Avatar */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#0F9D58] mb-4 shadow-sm">
          <span className="text-4xl font-normal text-white">
            {data.senderName ? data.senderName.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>

        {/* Sender Name (slightly smaller) */}
        <p className={`text-[1.1rem] font-normal tracking-wide ${textPrimary} mt-1`}>
          {data.status === 'Success' ? `From ${data.senderName}` : `To ${data.receiverName}`}
        </p>
        
        {/* Mobile Number */}
        <p className={`text-[0.9rem] ${textSecondary} mt-1 font-normal tracking-wide`}>
            {data.senderMobile || data.senderId}
        </p>

        {/* Amount - Specific Font Weight and Size */}
        <div className="mt-8 mb-8 flex items-baseline space-x-1">
          <p className={`text-[2.7rem] leading-none font-normal ${textPrimary}`}>₹</p>
          <p className={`text-[3.4rem] leading-none font-normal ${textPrimary}`}>{data.amount}</p>
        </div>

        {/* Completed Badge (smaller tick, unbold text) */}
        <div className="flex items-center space-x-2 bg-transparent">
          <div className="h-3.5 w-3.5 flex items-center justify-center rounded-full bg-[#0F9D58]">
             <span className="material-icons text-white text-[12px] leading-none">check</span>
          </div>
          <p className={`text-[1rem] font-normal ${textPrimary}`}>
            {data.status === 'Success' ? 'Completed' : data.status}
          </p>
        </div>
        {/* Divider - In GPay the card floats, no full width divider usually, but screenshots might show one if expanded. 
            The screenshot shows the card starts after some space. There is a subtle divider sometimes. */}
        <div className={`w-6/12 mx-auto h-px ${isDark ? 'bg-zinc-700' : 'bg-gray-200'} opacity-60 my-2`} />

        {/* Date Time */}
        <p className={`text-[0.9rem] ${textSecondary} mt-3 font-normal`}>
          {data.date}, {data.time}
        </p>

        {/* Divider - In GPay the card floats, no full width divider usually, but screenshots might show one if expanded. 
            The screenshot shows the card starts after some space. There is a subtle divider sometimes. */}
        
        <div className="w-full mt-8">
            {/* Details Card */}
            <div className={`w-full rounded-[1.5rem] border ${borderClass} pt-0 pb-4 px-4 ${surfaceClass} shadow-sm`}>
            
            {/* Card Header with Logo (subtle underline) */}
            <div className={`flex items-center py-4 px-4 border-b -mx-4 ${isDark ? 'border-[#3c4043]' : 'border-gray-200'}`}>
              <div className={`flex h-10 w-14 items-center justify-center rounded border ${isDark ? 'border-[#3c4043]' : 'border-gray-200'} mr-4 bg-white p-1`}>
                {data.bankLogo ? (
                    <img 
                        alt="Bank" 
                        className="h-full w-full object-contain" 
                        src={data.bankLogo}
                    />
                ) : (
                     <span className="material-icons text-gray-400">account_balance</span>
                )}
                </div>
                <p className={`text-[1rem] font-medium ${textPrimary}`}>
                    {data.receiverBankName} {data.receiverLast4}
                </p>
            </div>

      
            {/* Edge-to-edge hairline divider that touches the card borders
            <div className={`w-full -mx-4 h-px ${isDark ? 'bg-[#3c4043]' : 'bg-gray-200'} opacity-60`} /> */}

            <div className="space-y-6 mt-2 text-[0.95rem]">
                <div>
                  <p className={`${labelClass} text-sm  mb-1`}>UPI transaction ID</p>
                  <p className={`${textPrimary} text-[0.85rem] font-normal`}>{data.transactionId}</p>
                </div>
                
                <div>
                  <p className={`${labelClass} text-sm mb-1`}>To: {data.receiverName}</p>
                  <p className={`${textPrimary} text-[0.85rem] font-normal`}>Google Pay • {data.receiverId}</p>
                </div>
                
                <div>
                  <p className={`${labelClass} text-sm  mb-1`}>From: {data.senderName} ({data.senderBankName})</p>
                  <p className={`${textPrimary} text-[0.85rem] font-normal`}>Google Pay • {data.senderId}</p>
                </div>
                
                <div>
                  <p className={`${labelClass} text-sm  mb-1`}>Google transaction ID</p>
                  <p className={`${textPrimary} text-[0.85rem] font-normal`}>CICAgLD{data.transactionId.substring(0, 5)}-vYw</p>
                </div>
            </div>
            </div>
        </div>
            <p className={`mt-8 text-center text-xs ${textSecondary} px-8 leading-relaxed`}>
              Payments may take up to 3 working days to be reflected in your account
            </p>
      </main>
    </div>
  );
};
