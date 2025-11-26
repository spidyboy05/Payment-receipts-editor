import React, { useState, useEffect } from 'react';
import { PhonePeReceipt } from './components/PhonePeReceipt';
import { GPayReceipt } from './components/GPayReceipt';
import { ReceiptData, TemplateType, Bank } from './types';
import BulkGenerator from './components/BulkGenerator';
import { time } from 'console';




const TRANSFORM_PATTERNS = [
  // 45-50% range (very small)
  { scale: 0.45, tx: 0, ty: 0 },        // 45% CENTER
  { scale: 0.45, tx: 25, ty: -20 },     // 45% TOP-RIGHT
  { scale: 0.45, tx: -25, ty: 20 },     // 45% BOTTOM-LEFT
  { scale: 0.48, tx: 0, ty: 15 },       // 48% BOTTOM-CENTER
  { scale: 0.50, tx: 0, ty: 0 },        // 50% CENTER
  { scale: 0.50, tx: 30, ty: 0 },       // 50% CENTER-RIGHT
  
  // 51-60% range (small)
  { scale: 0.52, tx: -30, ty: 0 },      // 52% CENTER-LEFT
  { scale: 0.55, tx: 20, ty: 0 },       // 55% CENTER-RIGHT
  { scale: 0.55, tx: -20, ty: 0 },      // 55% CENTER-LEFT
  { scale: 0.58, tx: 0, ty: -18 },      // 58% TOP-CENTER
  { scale: 0.60, tx: 0, ty: -15 },      // 60% TOP-CENTER
  { scale: 0.60, tx: 25, ty: -22 },     // 60% TOP-RIGHT
  
  // 61-70% range (small-medium)
  { scale: 0.62, tx: -25, ty: -22 },    // 62% TOP-LEFT
  { scale: 0.65, tx: 25, ty: -20 },     // 65% TOP-RIGHT
  { scale: 0.65, tx: -25, ty: -20 },    // 65% TOP-LEFT
  { scale: 0.67, tx: 0, ty: 12 },       // 67% BOTTOM-CENTER
  { scale: 0.70, tx: 0, ty: 0 },        // 70% CENTER
  { scale: 0.70, tx: 30, ty: -25 },     // 70% TOP-RIGHT
  
  // 71-80% range (medium)
  { scale: 0.70, tx: -30, ty: -25 },    // 70% TOP-LEFT
  { scale: 0.72, tx: 28, ty: 18 },      // 72% BOTTOM-RIGHT
  { scale: 0.75, tx: 0, ty: 20 },       // 75% BOTTOM-CENTER
  { scale: 0.78, tx: -28, ty: 18 },     // 78% BOTTOM-LEFT
  { scale: 0.80, tx: 25, ty: 25 },      // 80% BOTTOM-RIGHT
  { scale: 0.80, tx: -25, ty: 25 },     // 80% BOTTOM-LEFT
  
  // 81-90% range (medium-large)
  { scale: 0.82, tx: 0, ty: 0 },        // 82% CENTER
  { scale: 0.85, tx: 0, ty: 0 },        // 85% CENTER
  { scale: 0.87, tx: 22, ty: -18 },     // 87% TOP-CENTER-RIGHT
  { scale: 0.90, tx: -22, ty: -18 },    // 90% TOP-CENTER-LEFT
  { scale: 0.90, tx: 32, ty: 22 },      // 90% BOTTOM-RIGHT
  
  // 91-100% range (near normal)
  { scale: 0.93, tx: -32, ty: 22 },     // 93% BOTTOM-LEFT
  { scale: 0.95, tx: 30, ty: 20 },      // 95% BOTTOM-RIGHT
  { scale: 0.95, tx: -30, ty: 20 },     // 95% BOTTOM-LEFT
  { scale: 0.98, tx: 0, ty: -10 },      // 98% TOP-CENTER
  { scale: 1.00, tx: 0, ty: 0 },        // 100% CENTER - PERFECT MIDDLE
  
  // 101-110% range (slightly large)
  { scale: 1.02, tx: 0, ty: 0 },        // 102% CENTER
  { scale: 1.05, tx: 0, ty: 0 },        // 105% CENTER
  { scale: 1.07, tx: 24, ty: -22 },     // 107% TOP-RIGHT
  { scale: 1.10, tx: -24, ty: -22 },    // 110% TOP-LEFT
  { scale: 1.10, tx: 0, ty: 18 },       // 110% BOTTOM-CENTER
  
  // 111-120% range (large)
  { scale: 1.12, tx: 28, ty: 24 },      // 112% BOTTOM-RIGHT
  { scale: 1.15, tx: -28, ty: 24 },     // 115% BOTTOM-LEFT
  { scale: 1.15, tx: 0, ty: 25 },       // 115% BOTTOM-CENTER
  { scale: 1.18, tx: 26, ty: -24 },     // 118% TOP-RIGHT
  { scale: 1.20, tx: 0, ty: 0 },        // 120% CENTER
  
];

const getFixedTransform = (idx: number) => {
  const pattern = TRANSFORM_PATTERNS[idx % TRANSFORM_PATTERNS.length];
  return pattern;
};

const generateDramaticTransform = () => {
  // HUGE Scale difference: 50% to 140% (massive size variation)
  const scale = 0.5 + Math.random() * 0.9; // 0.5 to 1.4
  
  // HUGE Position difference: -250 to 250px horizontal, -200 to 200px vertical
  const tx = Math.floor((Math.random() * 500) - 250); // -250 to 250px
  const ty = Math.floor((Math.random() * 400) - 200);  // -200 to 200px
  
  return { scale, tx, ty };
};
// Bank Data with Logos
const BANKS: Bank[] = [
  { name: 'Bank of India', logo: '/Bank of India.png' },
  { name: 'State Bank of India', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-logo.svg' },
  { name: 'Axis Bank', logo: '/Axis Bank.png' },
  { name: 'Bank of Baroda', logo: '/1Bank of Baroda.png' },
  { name: 'HDFC Bank', logo: '/HDFC Bank.png' },
  { name: 'ICICI Bank', logo: '/ICICI Bank.png' },
  { name: 'Union Bank of India', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Union_Bank_of_India_Logo.svg' },
  // { name: 'Kotak Mahindra Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Kotak_Mahindra_Bank_logo.svg' },
  { name: 'Paytm Payments Bank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg' },
];


// Generate random phone number with +91 and 8-9 digit pattern
const generatePhone = () => {
  const firstDigit = Math.random() > 0.5 ? 8 : 9;
  const remaining = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
  return `+91 ${firstDigit}${remaining}`;
};

// Generate random transaction ID
const generateTransactionId = () => {
  return Math.floor(Math.random() * 1000000000000).toString();
};

// Generate random Google transaction ID
const generateGoogleTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'CIC';
  for (let i = 0; i < 13; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate random sender name
const generateSenderName = () => {
 const firstNames = [
  "Aadil","Aamir","Aaqil","Abbas","Abdul","Adeel","Adnan","Ahmed","Ahsan",
  "Akbar","Ali","Amaan","Ameer","Amir","Anas","Aqeel","Arbaz","Arham","Arif",
  "Arman","Arsalan","Arshad","Arslan","Asad","Asif","Ashraf","Ayan","Ayaan",
  "Ayaz","Azhar","Bashir","Bilal","Danish","Dawood","Ejaz","Faiz","Faizan",
  "Farhan","Firoz","Ghulam","Habib","Hafeez","Haider","Hamid","Hamza",
  "Haroon","Hasan","Hassan","Huzaifa","Ibrahim","Idrees","Irfan","Ishaq",
  "Ismail","Jabbar","Jaffar","Jalal","Jameel","Junaid","Kabir","Kaleem",
  "Kamil","Karim","Khalid","Luqman","Maaz","Mahboob","Mahmud","Majid",
  "Mansoor","Maruf","Mehran","Mirza","Moin","Mubarak","Mukhtar","Munir",
  "Naeem","Naseer","Nawaz","Nizam","Noor","Nouman","Owais","Parvez","Qadir",
  "Qasim","Rafi","Rahim","Rahman","Rashid","Saad","Sadiq","Saif","Salman",
  "Sameer","Sarfaraz","Shabbir","Shoaib"
];
const lastNames = [
  "Abbasi","Abidi","Afzal","Ahmad","Ahsan","Akhter","Alam","Ali","Amiri",
  "Ansari","Arif","Aslam","Azmi","Badr","Baghdadi","Baig","Barakati","Barkati",
  "Burhan","Chishti","Dahlawi","Dar","Darwish","Dehlavi","Durani","Fakhri",
  "Farooqi","Faruqi","Fatehi","Ghauri","Ghori","Habibi","Hanafi","Hashmi",
  "Hussaini","Hussain","Hyderi","Iqbal","Islam","Islahi","Jafri","Jahani",
  "Jalali","Jameeli","Kamal","Kamali","Khan","Khilji","Khot","Lari","Lodi",
  "Malik","Manzoor","Marufi","Mir","Mirza","Mughal","Mukhtar","Nadvi","Najafi",
  "Naqvi","Naseemi","Nizami","Nomani","Noori","Parvez","Qadri","Qasmi","Qureshi",
  "Rahmani","Rasheedi","Raza","Razvi","Sadiqi","Saeedi","Sahibi","Salafi",
  "Samnani","Saqib","Siddiqi","Siraji","Subhani","Tabrizi","Tahir","Talib",
  "Tanvi","Usmani","Wahid","Warsi","Yamani","Yaqoobi","Yousufi","Zaidi",
  "Zaman","Zargar","Zubairi","Zuberi"
];

  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName.toUpperCase()} ${lastName.toUpperCase()}`;
};


// Generate random sender bank and its UPI domain
const generateSenderBank = () => {
  const senderBanks = [
    { name: 'HDFC Bank', domain: 'okhdfcbank' },
    { name: 'ICICI Bank', domain: 'okicici' },
    { name: 'Axis Bank', domain: 'okaxis' },
    { name: 'State Bank of India', domain: 'oksbi' },
    { name: 'Union Bank of India', domain: 'okunion' },
    { name: 'Punjab National Bank', domain: 'okpnb' },
  ];
  return senderBanks[Math.floor(Math.random() * senderBanks.length)];
};

// Generate random UPI ID using sender name and bank domain
const generateSenderUPI = (fullName?: string, domain?: string) => {
  // fallback to small random string if name not provided
  const rand = Math.random().toString(36).substring(2, 6);
  if (!fullName) {
    return `${rand}@${domain || 'okaxis'}`;
  }
  const parts = fullName.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0].toLowerCase().replace(/[^a-z]/g, '') : '';
  const last = parts[1] ? parts[1].toLowerCase().replace(/[^a-z]/g, '') : '';
  const namePart = (first + last).substring(0, 12) || rand;
  return `${namePart}${rand}@${domain || 'okaxis'}`;
};


const randomTimeBetween9And21 = () => {
  const hour = 9 + Math.floor(Math.random() * 12);
  const minute = Math.floor(Math.random() * 60);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const hr12 = hour % 12 === 0 ? 12 : hour % 12;
  const mm = String(minute).padStart(2, '0');
  return `${hr12}:${mm} ${ampm}`;
};

// generate initial sender and bank so INITIAL_DATA types match
const initialSenderName = generateSenderName();
const initialBank = generateSenderBank();

const RECEIVER_OPTIONS = [
  {
    id: 'vivan',
    name: 'VIVAN INTERNATIONAL',
    receiverName: 'VIVAN INTERNATIONAL',
    receiverId: 'vivaninternational@okaxis',
    receiverBankName: 'Axis Bank',
    receiverLast4: '1845',
    bankLogo: '/Axis Bank.png',
  },
  {
    id: 'sk',
    name: 'S K INTERNATIONAL',
    receiverName: 'S K INTERNATIONAL',
    receiverId: 'skinternational@okhdfcbank',
    receiverBankName: 'HDFC Bank',
    receiverLast4: '2281',
    bankLogo: '/HDFC Bank.png',
  },
];

const INITIAL_DATA: ReceiptData = {
  amount: '8,000',
  date: '25 Nov 2025',
  time: randomTimeBetween9And21(),
  receiverName: RECEIVER_OPTIONS[0].receiverName,
  receiverId: RECEIVER_OPTIONS[0].receiverId,
  receiverBankName: RECEIVER_OPTIONS[0].receiverBankName,
  receiverLast4: RECEIVER_OPTIONS[0].receiverLast4,
  bankLogo: RECEIVER_OPTIONS[0].bankLogo,
  senderName: initialSenderName,
  senderMobile: generatePhone(),
  senderId: generateSenderUPI(initialSenderName, initialBank.domain),
  senderBankName: initialBank.name,
  senderLast4: '9372',
  transactionId: generateTransactionId(),
  utr: generateGoogleTransactionId(),
  darkMode: true,
  status: 'Success',
};


function App() {
  const [data, setData] = useState<ReceiptData>(INITIAL_DATA);
  const [template, setTemplate] = useState<TemplateType>(TemplateType.GPAY);
  const [showPreview, setShowPreview] = useState(true);
  const [showBulk, setShowBulk] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<string>('vivan');

  const handleChange = (field: keyof ReceiptData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReceiverChange = (receiverId: string) => {
    setSelectedReceiver(receiverId);
    const receiver = RECEIVER_OPTIONS.find(r => r.id === receiverId);
    if (receiver) {
      setData(prev => ({
        ...prev,
        receiverName: receiver.receiverName,
        receiverId: receiver.receiverId,
        receiverBankName: receiver.receiverBankName,
        receiverLast4: receiver.receiverLast4,
        bankLogo: receiver.bankLogo,
      }));
    }
  };
  const generateIds = () => {
    const newName = generateSenderName();
    const newBank = generateSenderBank();
    setData(prev => ({
      ...prev,
      senderName: newName,
      senderMobile: generatePhone(),
      senderId: generateSenderUPI(newName, newBank.domain),
      senderBankName: newBank.name,
      transactionId: generateTransactionId(),
      utr: generateGoogleTransactionId(),
      time: randomTimeBetween9And21()
    }));
  };

  const TemplateComponent = template === TemplateType.PHONE_PE ? PhonePeReceipt : GPayReceipt;

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
  const el = document.querySelector('.printable .shadow-2xl') as HTMLElement | null;
  if (el) {
    // For single print, always use first pattern
    const { scale, tx, ty } = getFixedTransform(0);
    
    console.log(`Single Print - Scale: ${scale.toFixed(2)}, TX: ${tx}px, TY: ${ty}px`);
    
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    el.style.transformOrigin = 'center top';
    el.style.transition = 'none';
    el.style.willChange = 'transform';

    const cleanup = () => {
      el.style.transform = '';
      el.style.transformOrigin = '';
      el.style.transition = '';
      el.style.willChange = 'auto';
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
  }
  window.print();
};

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">

      {/* Sidebar / Editor */}
      <div className={`sidebar-panel no-print w-full lg:w-1/3 bg-white border-r border-gray-200 h-auto lg:h-screen overflow-y-auto p-6 ${showPreview ? 'hidden lg:block' : 'block'}`}>
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
                <button
                    onClick={() => handleChange('darkMode', !data.darkMode)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    {data.darkMode ? 'Switch to Light' : 'Switch to Dark'}
                </button>
            </div>
              <div className="mt-3">
                <button onClick={() => setShowBulk(true)} className="w-full mt-2 px-4 py-2 bg-yellow-50 border border-yellow-400 text-yellow-800 rounded-md text-sm">Bulk Generate</button>
              </div>
          </div>

          
          {/* Display-only Receiver & Bank Details */}
          <div className="border-t pt-4 bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Receiver Company</h3>
            <div className="space-y-2">
              {RECEIVER_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`receiver-${option.id}`}
                    name="receiver"
                    value={option.id}
                    checked={selectedReceiver === option.id}
                    onChange={(e) => handleReceiverChange(e.target.value)}
                    className="w-4 h-4 text-blue-600 cursor-pointer"
                  />
                  <label htmlFor={`receiver-${option.id}`} className="ml-2 text-sm text-gray-700 cursor-pointer">
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* User Input Section - Only Time, Date, Sender Name */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Edit Receipt Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sender Name</label>
                <input
                  type="text"
                  value={data.senderName}
                  onChange={(e) => handleChange('senderName', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Sender EmailID</label>
                 <input
                    placeholder="Sender UPI ID"
                    value={data.senderId}
                    onChange={(e) => handleChange('senderId', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Bank Name</label>
                 <input
                    placeholder="Sender Bank Name"
                    value={data.senderBankName}
                    onChange={(e) => handleChange('senderBankName', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                <input
                  type="text"
                  value={data.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2"
                  placeholder="e.g., 25 Nov 2025"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Time</label>
                <input
                  type="text"
                  value={data.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm px-3 py-2"
                  placeholder="e.g., 07:48 pm"
                />
              </div>
              <button
                onClick={generateIds}
                className="w-full flex justify-center items-center px-4 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
              >
                <span className="material-icons text-sm mr-2">cached</span>
                Randomize Details
              </button>
            </div>
          </div>

          {/* Display-only Receiver & Bank Details */}
          <div className="border-t pt-4 bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Receiver Details (Fixed)</h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">To</p>
                <p className="text-gray-900 font-medium">{data.receiverName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">UPI ID</p>
                <p className="text-gray-900">Google Pay • {data.receiverId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Bank</p>
                <p className="text-gray-900">{data.receiverBankName} {data.receiverLast4}</p>
              </div>
            </div>
          </div>

          {/* Auto-generated Details Display */}
          <div className="border-t pt-4 bg-blue-50 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Auto-Generated Details</h3>
            <div className="space-y-2 text-sm font-mono text-xs">
              <div>
                <p className="text-gray-600">Mobile: <span className="text-gray-900 font-semibold">{data.senderMobile}</span></p>
              </div>
              <div>
                <p className="text-gray-600">Transaction ID: <span className="text-gray-900 font-semibold">{data.transactionId}</span></p>
              </div>
              <div>
                <p className="text-gray-600">Google Transaction ID: <span className="text-gray-900 font-semibold">{data.utr}</span></p>
              </div>
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
      <div className={`preview-area w-full lg:w-2/3 bg-white lg:h-screen overflow-auto flex flex-col items-center lg:items-start justify-center lg:justify-start p-4 lg:p-8 relative ${!showPreview ? 'hidden lg:flex' : 'flex'}`}>
        
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
            <style>{`
              @page { size: A4; margin: 0; }
              @media print {
                .no-print,
                .sidebar-panel {
                  display: none !important;
                }
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                .preview-area {
                  height: auto !important;
                  max-height: none !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
                .printable {
                  visibility: visible !important;
                  position: static !important;
                  width: 100% !important;
                  height: auto !important;
                  page-break-inside: avoid !important;
                  padding: 10mm 0 0 0 !important;
                  margin: 0 !important;
                }
                .receipt-wrapper {
                  page-break-inside: avoid !important;
                  padding: 0 !important;
                  margin: 0 auto !important;
                }
                .printable-receipt {
                  page-break-inside: avoid !important;
                  padding: 10mm 0 0 0 !important;
                  margin: 0 auto !important;
                }
                .printable-receipt > * {
                  margin-left: auto !important;
                  margin-right: auto !important;
                }
              }
            `}</style>

            <div className="print-only printable w-full transition-all duration-300">
              {showBulk ? (
                <BulkGenerator baseData={data} onClose={() => setShowBulk(false)} />
              ) : (
                <div className="receipt-wrapper">
                  <TemplateComponent data={data} />
                </div>
              )}
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
