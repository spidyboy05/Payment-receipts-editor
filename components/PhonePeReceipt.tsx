
import React from 'react';
import { ReceiptData } from '../types';

interface Props {
  data: ReceiptData;
}

export const PhonePeReceipt: React.FC<Props> = ({ data }) => {
  // Mapping styles based on provided template
  const isDark = data.darkMode;
  
  // Colors from user template
  const containerBg = isDark ? 'bg-background-dark' : 'bg-background-light';
  const cardBg = isDark ? 'bg-zinc-800' : 'bg-white';
  const textMain = isDark ? 'text-gray-200' : 'text-gray-800';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const headerBg = isDark ? 'bg-green-700' : 'bg-green-600';

  return (
    <div className={`max-w-md w-full mx-auto min-h-[800px] font-display ${isDark ? 'bg-[#121212]' : 'bg-[#f5f5f5]'}`}>
      {/* Header */}
      <div className={`${headerBg} p-4 text-white`}>
        <div className="flex items-center">
          <span className="material-icons-outlined cursor-pointer">arrow_back</span>
          <div className="ml-4">
            <h1 className="font-bold text-lg">Transaction Successful</h1>
            <p className="text-xs opacity-80">{data.time} on {data.date}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Receiver Card */}
        <div className={`${cardBg} p-4 rounded-lg shadow`}>
          <p className={`text-sm ${textMuted} mb-2`}>Received from</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-pp-primary flex items-center justify-center text-white">
                <span className="material-icons-outlined">keyboard_double_arrow_left</span>
              </div>
              <div className="ml-3">
                 {/* PhonePe usually shows Name and ID/Number */}
                 <p className={`font-medium ${textMain}`}>{data.senderName || 'Unknown'}</p>
                 {/* Using senderMobile here if available, else senderId */}
                 {data.senderMobile && <p className={`text-xs ${textMain} opacity-80`}>{data.senderMobile}</p>}
              </div>
            </div>
            <p className={`font-bold text-lg ${textMain}`}>₹{data.amount}</p>
          </div>
        </div>

        {/* Transfer Details */}
        <div className={`${cardBg} p-4 rounded-lg shadow`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className={`material-icons-outlined ${textMuted}`}>receipt_long</span>
              <h2 className={`ml-3 font-medium ${textMain}`}>Transfer Details</h2>
            </div>
            <span className={`material-icons-outlined ${textMuted}`}>expand_less</span>
          </div>
          
          <div className={`border-t border-dashed ${isDark ? 'border-zinc-700' : 'border-gray-200'} my-4`}></div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-xs ${textMuted}`}>Transaction ID</p>
                  <p className={`text-sm font-medium ${textMain}`}>{data.transactionId}</p>
                </div>
                <button className="text-pp-primary">
                  <span className="material-icons-outlined text-lg">content_copy</span>
                </button>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-xs ${textMuted}`}>Credited to</p>
                  <div className="flex items-center mt-1">
                    <img 
                        alt="Bank logo" 
                        className="w-5 h-5 mr-2 object-contain" 
                        src={data.bankLogo || "https://lh3.googleusercontent.com/aida-public/AB6AXuAIsWduQJix6e-l1ki75sRfxx0AjD-wNwRJhZybKajSR8aXUDApnrmO9eNiPSgr-khiEF-c1CnRljlEBrdCb8EBLF802higi0qnsRcr1TkO7M1QL10Ht6c85zXcfg-kqosy9hSBKIg_OnkF9kd9B8-WJCDI83gxXf00J1zKNc1n-Nv3aFPVHblrhAdU0HYim8xtqj8Avzb3z3QCFyLx0xrWGFNsliQ2lXw2gJjbQaGniIO8D7-bwGHWpVbBfoSq-x_qHsFdy32dRZP3"}
                    />
                    <p className={`text-sm font-medium ${textMain}`}>
                        {data.receiverBankName} {data.receiverLast4 ? `XXXX${data.receiverLast4}` : ''}
                    </p>
                  </div>
                </div>
                <p className={`font-bold text-lg ${textMain}`}>₹{data.amount}</p>
              </div>
            </div>

            {data.utr && (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs ${textMuted}`}>UTR: <span className={`font-medium ${textMain}`}>{data.utr}</span></p>
                  </div>
                  <button className="text-pp-primary">
                    <span className="material-icons-outlined text-lg">content_copy</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Grid */}
        <div className={`grid grid-cols-4 gap-4 text-center text-sm ${textMain} py-4`}>
          {[
            { icon: 'north_east', label: 'Send Money' },
            { icon: 'account_balance', label: 'Check Balance' },
            { icon: 'history', label: 'View History' },
            { icon: 'share', label: 'Share Receipt' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-12 h-12 ${isDark ? 'bg-pp-primary/20' : 'bg-pp-primary/10'} rounded-full flex items-center justify-center text-pp-primary`}>
                <span className="material-icons-outlined">{item.icon}</span>
              </div>
              <p className="mt-2 text-xs">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className={`${cardBg} p-4 rounded-lg shadow`}>
          <div className={`flex items-center justify-between ${textMain}`}>
            <div className="flex items-center">
              <span className="material-icons-outlined text-pp-primary">help_outline</span>
              <p className="ml-3 font-medium">Contact Support</p>
            </div>
            <span className={`material-icons-outlined ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>chevron_right</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 pb-4">
          <p className={`text-xs ${textMuted}`}>Powered by</p>
          <div className="flex items-center justify-center space-x-2 mt-1">
            <img alt="UPI logo" className="h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkSKFhSMiEWgTtUX2u3M2Hc07tIFkwH7HTICZK91xv3vDpbfuzyDI0AamBBT3wOrIHuCWn3TLykLviETyMV6lp49WqSo_-MnDzNwotZMyKo2xEEIql5pRmj25leBSLJGiitjdGr6u1mmBjBY6yCHTc_1dH9Xp9rsaoXCSnrMHEJ6GMeT1jKVHXSn1-G-tFSWNMYoR0dGJR_vJBlHw1Rju0dbXwmB71uOeDZsYL9C3yGJm1JQcwI28wig_GKaNxXVkug58pvccmBmzm"/>
            <div className={`h-4 w-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <img alt="Yes Bank logo" className="h-3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG7VGDpLdD67ITfwx0iistUKGG8SPRWkPGVuBtCck1_zBQmuRxQiAECFoyp7AsCAqds33roND3RhNemImSTyxmt3uOjgoldA3hekLsPVQoWdQL4RirYuXGfxeccYV3u_kvv_-fhI6nJjx2HpkZsogy8qsr0ytQcRJ6ORx-bmmU-POW6YDQdgp2KJ0BspeV_re6XOpPUUgJMXF8Tu3EF2QEozSNp2S5G5xRdUUlXNVgMN02y9Os1a4tcJcbU-wZkcWVEcJDEEUj06Ew"/>
          </div>
        </div>
      </div>
    </div>
  );
};
