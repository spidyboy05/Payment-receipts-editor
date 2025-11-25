
export enum TemplateType {
  PHONE_PE = 'PHONE_PE',
  GPAY = 'GPAY',
}

export interface ReceiptData {
  // Common Fields
  amount: string;
  date: string;
  time: string;
  
  // P2P / Bank Info
  receiverName: string;
  receiverId: string; // UPI ID or Masked Account
  receiverBankName: string;
  receiverLast4: string;
  bankLogo?: string; // URL for the bank logo

  senderName: string;
  senderId: string;
  senderMobile?: string; // For GPay top section
  senderBankName: string;
  senderLast4: string;

  // Transaction Meta
  transactionId: string; // Bank Ref / Transaction ID
  utr?: string; // Specific to PhonePe style usually
  
  // Visual Settings
  darkMode: boolean;
  status: 'Success' | 'Pending' | 'Failed';
}

export interface Bank {
  name: string;
  logo: string;
}
