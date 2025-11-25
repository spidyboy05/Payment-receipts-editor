import React, { useState } from 'react';
import { ReceiptData } from '../types';
import { GPayReceipt } from './GPayReceipt';

interface Props {
  baseData: ReceiptData; // uses receiver fields from this
  onClose: () => void;
}

// Random helpers (kept local to this component)
const rand = (n: number) => Math.floor(Math.random() * n);

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
  const first = ['Rajesh','Priya','Amit','Sneha','Vikram','Neha','Arjun','Pooja','Rohan','Ananya'];
  const last = ['Sharma','Patel','Kumar','Singh','Gupta','Reddy','Verma','Joshi'];
  return `${first[rand(first.length)]} ${last[rand(last.length)]}`;
};

const senderBanks = [
  { name: 'HDFC Bank', domain: 'okhdfcbank' },
  { name: 'ICICI Bank', domain: 'okicici' },
  { name: 'Axis Bank', domain: 'okaxis' },
  { name: 'State Bank of India', domain: 'oksbi' },
];

const generateSenderBank = () => senderBanks[rand(senderBanks.length)];

const generateSenderUPI = (fullName?: string, domain?: string) => {
  const r = Math.random().toString(36).substring(2, 6);
  if (!fullName) return `${r}@${domain || 'okaxis'}`;
  const parts = fullName.split(' ').filter(Boolean);
  const namePart = ((parts[0]||'').toLowerCase() + (parts[1]||'').toLowerCase()).replace(/[^a-z]/g,'').substring(0,12) || r;
  return `${namePart}${r}@${domain || 'okaxis'}`;
};

const randomAmount = () => {
  // keep amount constant for bulk generation per user request
  return '8,000';
};

const randomTimeBetween9And21 = () => {
  // pick hour between 9 and 20 inclusive, minutes 0-59
  const hour = 9 + rand(12); // 9..20
  const minute = rand(60);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const hr12 = hour % 12 === 0 ? 12 : hour % 12;
  const mm = String(minute).padStart(2, '0');
  return `${hr12}:${mm} ${ampm}`;
};

export const BulkGenerator: React.FC<Props> = ({ baseData, onClose }) => {
  const [date, setDate] = useState<string>(baseData.date || '');
  const [count, setCount] = useState<number>(3);
  const [receipts, setReceipts] = useState<ReceiptData[] | null>(null);

  const generateBatch = () => {
    const arr: ReceiptData[] = [];
    for (let i = 0; i < count; i++) {
      const sName = generateSenderName();
      const sBank = generateSenderBank();
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
        senderLast4: String(1000 + rand(9000)).slice(-4),
        transactionId: generateTransactionId(),
        utr: generateGoogleTransactionId(),
        darkMode: baseData.darkMode,
        status: 'Success',
      };
      arr.push(item);
    }
    setReceipts(arr);
  };

  const handlePrintAll = () => {
    // Apply a small randomized transform per receipt so each prints slightly different
    const nodes = document.querySelectorAll('.printable .printable-receipt');
    nodes.forEach((n) => {
      const el = n as HTMLElement;
      const scale = 0.95 + Math.random() * 0.12; // ~0.95 - 1.07
      const tx = Math.floor((Math.random() * 40) - 20); // -20px .. 20px
      const ty = Math.floor((Math.random() * 40) - 20);
      el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      el.style.transformOrigin = 'top left';
    });

    // cleanup after print
    const cleanup = () => {
      nodes.forEach(n => {
        const el = n as HTMLElement;
        el.style.transform = '';
        el.style.transformOrigin = '';
      });
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    // open print dialog
    window.print();
  };

  const handlePrintSingle = (idx: number) => {
    // Apply a randomized transform to the single receipt before printing
    const el = document.querySelector(`.printable-receipt-${idx}`) as HTMLElement | null;
    if (el) {
      const scale = 0.94 + Math.random() * 0.12; // ~0.94 - 1.06
      const tx = Math.floor((Math.random() * 40) - 20); // -20px .. 20px
      const ty = Math.floor((Math.random() * 40) - 20);
      el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      el.style.transformOrigin = 'top left';

      const cleanup = () => {
        el.style.transform = '';
        el.style.transformOrigin = '';
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
          <button onClick={() => { setReceipts(null); }} className="px-4 py-2 bg-gray-100 rounded">Clear</button>
        </div>
      </div>

      {receipts && (
          <div>
          <div className="mb-3 flex gap-2 no-print">
            <button onClick={handlePrintAll} className="px-4 py-2 bg-blue-600 text-white rounded">Print All</button>
            <button onClick={() => setReceipts(null)} className="px-4 py-2 bg-gray-100 rounded">Close Batch</button>
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
