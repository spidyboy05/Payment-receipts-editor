import React, { useState } from 'react';
import { ReceiptData } from '../types';
import { GPayReceipt } from './GPayReceipt';

interface Props {
  baseData: ReceiptData;
  onClose: () => void;
}

// 52 UNIQUE TRANSFORM PATTERNS - Each receipt gets its own random size & position
const TRANSFORM_PATTERNS = [
  // 71-80% range (medium) - MORE LEFT/RIGHT VARIATION
  { scale: 0.70, tx: -45, ty: -25 },    // FAR-LEFT-TOP
  { scale: 0.72, tx: 40, ty: 18 },      // RIGHT-BOTTOM
  { scale: 0.75, tx: -40, ty: 20 },     // LEFT-BOTTOM
  { scale: 0.78, tx: 42, ty: 18 },      // RIGHT-BOTTOM-FAR
  { scale: 0.80, tx: 35, ty: 25 },      // RIGHT-BOTTOM-FAR
  { scale: 0.80, tx: -35, ty: 25 },     // LEFT-BOTTOM-FAR
  
  // 81-90% range (medium-large) - MORE LEFT/RIGHT VARIATION
  { scale: 0.82, tx: 38, ty: 0 },       // RIGHT-CENTER-MID
  { scale: 0.85, tx: -38, ty: 0 },      // LEFT-CENTER-MID
  { scale: 0.87, tx: 40, ty: -18 },     // RIGHT-TOP-MID
  { scale: 0.90, tx: -40, ty: -18 },    // LEFT-TOP-MID
  { scale: 0.90, tx: 45, ty: 22 },      // FAR-RIGHT-BOTTOM
  
  // 91-100% range (near normal) - MORE LEFT/RIGHT VARIATION
  { scale: 0.93, tx: -45, ty: 22 },     // FAR-LEFT-BOTTOM
  { scale: 0.95, tx: 42, ty: 20 },      // RIGHT-BOTTOM-MID
  { scale: 0.95, tx: -42, ty: 20 },     // LEFT-BOTTOM-MID
  { scale: 0.98, tx: 38, ty: -10 },     // RIGHT-TOP-SLIGHT
  { scale: 1.00, tx: 0, ty: 0 },        // CENTER - PERFECT MIDDLE
 
];

// Fisher-Yates shuffle to randomize pattern indices
const shufflePatterns = (count: number) => {
  const indices = Array.from({ length: TRANSFORM_PATTERNS.length }, (_, i) => i);
  
  // Shuffle the indices
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  // Return requested count of patterns (cycling if needed)
  return Array.from({ length: count }, (_, i) => TRANSFORM_PATTERNS[indices[i % indices.length]]);
};

const generatePhone = () => {
  const firstDigit = Math.random() > 0.5 ? 8 : 9;
  const remaining = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
  return `+91 ${firstDigit}${remaining}`;
};

const generateTransactionId = () => Math.floor(Math.random() * 1000000000000).toString();

const generateGoogleTransactionId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'CIC';
  for (let i = 0; i < 13; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

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

const senderBanks = [
  { name: 'HDFC Bank', domain: 'okhdfcbank' },
  { name: 'ICICI Bank', domain: 'okicici' },
  { name: 'Axis Bank', domain: 'okaxis' },
  { name: 'State Bank of India', domain: 'oksbi' },
];

const generateSenderBank = () => senderBanks[Math.floor(Math.random() * senderBanks.length)];

const generateSenderUPI = (fullName?: string, domain?: string) => {
  const r = Math.random().toString(36).substring(2, 6);
  if (!fullName) return `${r}@${domain || 'okaxis'}`;
  const parts = fullName.split(' ').filter(Boolean);
  const namePart = ((parts[0]||'').toLowerCase() + (parts[1]||'').toLowerCase()).replace(/[^a-z]/g,'').substring(0,12) || r;
  return `${namePart}${r}@${domain || 'okaxis'}`;
};

const randomAmount = () => '8,000';

const randomTimeBetween9And21 = () => {
  const hour = 9 + Math.floor(Math.random() * 12);
  const minute = Math.floor(Math.random() * 60);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const hr12 = hour % 12 === 0 ? 12 : hour % 12;
  const mm = String(minute).padStart(2, '0');
  return `${hr12}:${mm} ${ampm}`;
};

export const BulkGenerator: React.FC<Props> = ({ baseData, onClose }) => {
  const [date, setDate] = useState<string>(baseData.date || '');
  const [count, setCount] = useState<number>(3);
  const [receipts, setReceipts] = useState<ReceiptData[] | null>(null);
  // Store the random transforms for each receipt so they stay consistent
  const [transforms, setTransforms] = useState<Array<{scale: number; tx: number; ty: number}>>([]);

  const generateBatch = () => {
    const arr: ReceiptData[] = [];
    // Get shuffled transforms - each receipt gets unique random pattern
    const shuffledTransforms = shufflePatterns(count);
    const newTransforms: Array<{scale: number; tx: number; ty: number}> = [];
    
    for (let i = 0; i < count; i++) {
      const sName = generateSenderName();
      const sBank = generateSenderBank();
      // Use shuffled transform for this receipt
      const transform = shuffledTransforms[i];
      newTransforms.push(transform);
      
      const item: ReceiptData = {
        amount: randomAmount(),
        date: date || baseData.date,
        time: randomTimeBetween9And21(),
        receiverName: baseData.receiverName,
        receiverId: baseData.receiverId,
        receiverBankName: baseData.receiverBankName,
        receiverLast4: baseData.receiverLast4,
        bankLogo: baseData.bankLogo,
        senderName: sName,
        senderMobile: generatePhone(),
        senderId: generateSenderUPI(sName, sBank.domain),
        senderBankName: sBank.name,
        senderLast4: String(1000 + Math.floor(Math.random() * 9000)).slice(-4),
        transactionId: generateTransactionId(),
        utr: generateGoogleTransactionId(),
        darkMode: baseData.darkMode,
        status: 'Success',
      };
      arr.push(item);
    }
    setReceipts(arr);
    setTransforms(newTransforms);
  };

  const handlePrintAll = () => {
    const nodes = document.querySelectorAll('.printable .printable-receipt');
    console.log(`Printing ${nodes.length} receipts with RANDOM transforms`);
    
    nodes.forEach((n, index) => {
      const el = n as HTMLElement;
      // Use the stored transform for this receipt
      const transform = transforms[index] || TRANSFORM_PATTERNS[0];
      const { scale, tx, ty } = transform;
      
      console.log(`Receipt ${index} - Scale: ${scale.toFixed(2)}, TX: ${tx}px, TY: ${ty}px`);
      
      el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      el.style.transformOrigin = 'center top';
      el.style.transition = 'none';
      el.style.willChange = 'transform';
      el.style.pageBreakInside = 'avoid';
      el.style.pageBreakAfter = 'always';
    });

    const cleanup = () => {
      nodes.forEach(n => {
        const el = n as HTMLElement;
        el.style.transform = '';
        el.style.transformOrigin = '';
        el.style.transition = '';
        el.style.willChange = 'auto';
        el.style.pageBreakInside = '';
        el.style.pageBreakAfter = '';
      });
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
  };

  const handlePrintSingle = (idx: number) => {
    const el = document.querySelector(`.printable-receipt-${idx}`) as HTMLElement | null;
    if (el) {
      // Use the stored transform for this receipt
      const transform = transforms[idx] || TRANSFORM_PATTERNS[0];
      const { scale, tx, ty } = transform;
      
      console.log(`Single Receipt ${idx} - Scale: ${scale.toFixed(2)}, TX: ${tx}px, TY: ${ty}px`);
      
      el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      el.style.transformOrigin = 'center top';
      el.style.transition = 'none';
      el.style.willChange = 'transform';
      el.style.pageBreakInside = 'avoid';
      el.style.pageBreakAfter = 'always';

      const cleanup = () => {
        el.style.transform = '';
        el.style.transformOrigin = '';
        el.style.transition = '';
        el.style.willChange = 'auto';
        el.style.pageBreakInside = '';
        el.style.pageBreakAfter = '';
        window.removeEventListener('afterprint', cleanup);
      };
      window.addEventListener('afterprint', cleanup);
    }
    window.print();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4 no-print">
        <div>
          <h2 className="text-lg font-semibold">Bulk Receipt Generator</h2>
          <p className="text-sm text-gray-500">Choose a date and number of receipts to generate. Receiver details remain unchanged.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="px-3 py-1.5 bg-white border rounded shadow-sm">Close</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm space-y-3 mb-4 no-print">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
            <input value={date} onChange={e => setDate(e.target.value)} placeholder={baseData.date}
              className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Number of Receipts</label>
            <input type="number" min={1} max={100} value={count} onChange={e => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              className="w-full rounded border px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="flex gap-2 mt-2 no-print">
          <button onClick={generateBatch} className="px-4 py-2 bg-green-600 text-white rounded">Generate</button>
          <button onClick={() => { setReceipts(null); setTransforms([]); }} className="px-4 py-2 bg-gray-100 rounded">Clear</button>
        </div>
      </div>

      {receipts && (
          <div>
          <div className="mb-3 flex gap-2 no-print">
            <button onClick={handlePrintAll} className="px-4 py-2 bg-blue-600 text-white rounded">Print All</button>
            <button onClick={() => { setReceipts(null); setTransforms([]); }} className="px-4 py-2 bg-gray-100 rounded">Close Batch</button>
          </div>

          <div className="printable">
            {receipts.map((r, idx) => (
              <div key={idx} className={`mb-6 shadow-2xl rounded-xl bg-white p-4 page-break printable-receipt printable-receipt-${idx}`}>
                <div className="flex items-center justify-between mb-2 no-print">
                  <span className="text-xs font-semibold text-gray-500">Receipt #{idx + 1}</span>
                  <button 
                    onClick={() => handlePrintSingle(idx)}
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    Print
                  </button>
                </div>
                <GPayReceipt data={r} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkGenerator;





