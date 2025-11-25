
import React, { useState, useEffect } from 'react';
import { PhonePeReceipt } from './components/PhonePeReceipt';
import { GPayReceipt } from './components/GPayReceipt';
import { ReceiptData, TemplateType, Bank } from './types';

// Bank Data with Logos
const BANKS: Bank[] = [
  { name: 'Bank of India', logo: 'src/Bank of India.png' },
  { name: 'State Bank of India', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg' },
  { name: 'Axis Bank', logo: 'src/Axis Bank.png' },
  { name: 'Bank of Baroda', logo: 'https://drive.google.com/file/d/1zag7zF3jLUxZQfDvtbSWHNIcyWCVD5fe/view?usp=sharing' },
  { name: 'HDFC Bank', logo: 'src/HDFC Bank.png' },
  { name: 'ICICI Bank', logo: 'src/ICICI Bank.png' },
  { name: 'Union Bank of India', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Union_Bank_of_India_Logo.svg' },
  // { name: 'Kotak Mahindra Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Kotak_Mahindra_Bank_logo.svg' },
  { name: 'Paytm Payments Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg' },
];


const INITIAL_DATA: ReceiptData = {
  amount: '8,000',
  date: '25 Nov 2025',
  time: '07:48 pm',
  receiverName: 'RAHUL JADHAV',
  receiverId: 'rahuljadhav90@okaxis',
  receiverBankName: 'Axis Bank',
  receiverLast4: '1845',
  bankLogo: BANKS[2].logo,
  senderName: 'Neelam Sharma',
  senderMobile: '+91 90872 66341',
  senderId: 'neelam.sharma05@okicici',
  senderBankName: 'ICICI Bank',
  senderLast4: '9372',
  transactionId: '987451203872',
  utr: '259873640112',
  darkMode: true,
  status: 'Success',
};


function App() {
  const [data, setData] = useState<ReceiptData>(INITIAL_DATA);
  const [template, setTemplate] = useState<TemplateType>(TemplateType.GPAY);
  const [showPreview, setShowPreview] = useState(true);

  const handleChange = (field: keyof ReceiptData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBank = BANKS.find(b => b.name === e.target.value);
    if (selectedBank) {
      setData(prev => ({
        ...prev,
        receiverBankName: selectedBank.name,
        bankLogo: selectedBank.logo
      }));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateIds = () => {
    const randomNum = Math.floor(Math.random() * 1000000000000);
    setData(prev => ({
        ...prev,
        transactionId: `${Math.floor(Math.random() * 1000000000000)}`,
        utr: `${randomNum}`
    }));
  };

  const TemplateComponent = template === TemplateType.PHONE_PE ? PhonePeReceipt : GPayReceipt;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 font-sans">
      
      {/* Sidebar / Editor */}
      <div className={`no-print w-full lg:w-1/3 bg-white border-r border-gray-200 h-auto lg:h-screen overflow-y-auto p-6 ${showPreview ? 'hidden lg:block' : 'block'}`}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="material-icons text-blue-600">receipt</span>
            ReceiptForge
          </h1>
          <p className="text-sm text-gray-500 mt-1">Edit details to generate your receipt.</p>
        </div>

        <div className="space-y-6">
          {/* Template Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Style</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTemplate(TemplateType.PHONE_PE)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  template === TemplateType.PHONE_PE
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                PhonePe
              </button>
              <button
                onClick={() => setTemplate(TemplateType.GPAY)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  template === TemplateType.GPAY
                    ? 'bg-green-50 border-green-600 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                GPay
              </button>
            </div>
          </div>

          {/* Main Fields */}
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount (₹)</label>
              <input
                type="text"
                value={data.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Theme</label>
                <button
                    onClick={() => handleChange('darkMode', !data.darkMode)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    {data.darkMode ? 'Switch to Light' : 'Switch to Dark'}
                </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</label>
              <input
                type="text"
                value={data.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Time</label>
              <input
                type="text"
                value={data.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Sender Info */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Sender (From)</h3>
            <div className="space-y-3">
                <input
                    placeholder="Sender Name"
                    value={data.senderName}
                    onChange={(e) => handleChange('senderName', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                    placeholder="Mobile Number (GPay Top)"
                    value={data.senderMobile}
                    onChange={(e) => handleChange('senderMobile', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                 <input
                    placeholder="Sender UPI ID"
                    value={data.senderId}
                    onChange={(e) => handleChange('senderId', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                    placeholder="Sender Bank Name"
                    value={data.senderBankName}
                    onChange={(e) => handleChange('senderBankName', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
          </div>

          {/* Receiver Info */}
           <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Receiver (To)</h3>
            <div className="space-y-3">
                <input
                    placeholder="Receiver Name"
                    value={data.receiverName}
                    onChange={(e) => handleChange('receiverName', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                 <input
                    placeholder="Receiver UPI ID"
                    value={data.receiverId}
                    onChange={(e) => handleChange('receiverId', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                 
                 {/* Bank Selection */}
                 <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Bank</label>
                    <select
                        value={data.receiverBankName}
                        onChange={handleBankChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        {BANKS.map(bank => (
                            <option key={bank.name} value={bank.name}>{bank.name}</option>
                        ))}
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-2">
                    <input
                        placeholder="Bank Name (Custom)"
                        value={data.receiverBankName}
                        onChange={(e) => handleChange('receiverBankName', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                     <input
                      placeholder="Last 4 Digits"
                      maxLength={4}
                      value={data.receiverLast4}
                      onChange={(e) => handleChange('receiverLast4', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                 </div>
            </div>
          </div>

          {/* Transaction IDs */}
           <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-900">Transaction Details</h3>
                <button onClick={generateIds} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Generate Random</button>
            </div>
            <div className="space-y-3">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Transaction ID / UPI ID</label>
                    <input
                        value={data.transactionId}
                        onChange={(e) => handleChange('transactionId', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                    />
                </div>
                {template === TemplateType.PHONE_PE && (
                  <div>
                      <label className="block text-xs text-gray-500 mb-1">UTR Number</label>
                      <input
                          value={data.utr}
                          onChange={(e) => handleChange('utr', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
                      />
                  </div>
                )}
            </div>
          </div>

        </div>
        
        <div className="mt-8 pt-6 border-t">
            <button
                onClick={handlePrint}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
                <span className="material-icons mr-2">print</span>
                Print Receipt
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">Select "Save as PDF" in print dialog.</p>
        </div>
      </div>

      {/* Preview Area - Visible on Desktop, Toggleable on Mobile */}
      <div className={`w-full lg:w-2/3 bg-gray-200 lg:h-screen overflow-auto flex flex-col items-center lg:items-start justify-center lg:justify-start p-4 lg:p-8 relative ${!showPreview ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* Mobile Toggle: Edit */}
        <div className="lg:hidden absolute top-4 right-4 z-50 no-print">
            <button 
                onClick={() => setShowPreview(false)}
                className="bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center"
            >
                <span className="material-icons text-sm mr-1">edit</span> Edit
            </button>
        </div>

        <div>
            {/* Print CSS injected here to control print layout without editing global CSS */}
            <style>{`\
              @page { size: A4; margin: 8mm; }\
              @media print {\
                .no-print { display: none !important; }\
                /* reset body and html so content isn't clipped */\
                html, body { height: auto !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; }\
                /* Printable container: constrain to page width, center, remove shadows/radius that can affect clipping */\
                .printable {\
                  visibility: visible !important;\
                  position: static !important;\
                  left: 0 !important;\
                  top: 0 !important;\
                  width: auto !important;\
                  max-width: 180mm !important;\
                  margin: 6mm auto !important;\
                  box-shadow: none !important;\
                  border-radius: 0 !important;\
                  -webkit-transform: none !important;\
                  transform: none !important;\
                  overflow: visible !important;\
                  -webkit-print-color-adjust: exact;\
                  print-color-adjust: exact;\
                }\
                /* Ensure inner elements don't introduce scrollbars */\
                .printable * { overflow: visible !important; }\
                /* Hide any scrollbars in printed output */\
                ::-webkit-scrollbar { display: none !important; }\
              }\
              /* Keep color adjustment for screen as well when printing */\
              .printable { -webkit-print-color-adjust: exact; print-color-adjust: exact; }\
            `}</style>

            <div className="print-only printable w-full max-w-md transition-all duration-300">
            {/* Container for the Receipt */}
            <div className="shadow-2xl rounded-xl bg-white">
                 <TemplateComponent data={data} />
            </div>
        </div>
        
        {/* Mobile Toggle: Bottom Back */}
        <div className="lg:hidden fixed bottom-6 w-full px-6 z-50 no-print">
             <button 
                onClick={() => setShowPreview(false)}
                className="w-full bg-white text-gray-800 py-3 rounded-xl shadow-lg font-bold border border-gray-200"
            >
                Back to Editor
            </button>
        </div>
      </div>

      {/* Mobile Toggle: Floating View Preview Button (Only when editing) */}
      {!showPreview && (
          <div className="lg:hidden fixed bottom-6 w-full px-6 z-50 no-print">
            <button 
                onClick={() => setShowPreview(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-lg font-bold flex justify-center items-center"
            >
                <span className="material-icons mr-2">visibility</span>
                View Preview
            </button>
          </div>
      )}
    </div>
    </div>
  );
}

export default App;
