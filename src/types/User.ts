export interface User {
  id: string;
  organization: string;
  username: string;
  email: string;
  phone: string;
  date_joined: string;
  status: string;

  profile: {
    avatar: string;
    full_name: string;
    bvn: string;
    gender: string;
    marital_status: string;
    children: string;
    residence: string;
    tier: number;
    account_balance: string;
    account_number: number;
    bank_name: string;
  };

  education: {
    level: string;
    status: string;
    sector: string;
    duration: string;
    office_email: string;
    monthly_income: [number, number];
    loan_repayment: number;
  };

  socials: {
    twitter: string;
    facebook: string;
    instagram: string;
  };

  guarantor: {
    name: string;
    phone: string;
    email: string;
    relationship: string;
  }[];

  hasLoan: boolean;
  hasSavings: boolean;
}

export interface LayoutChildProps {
  search?: string;
}
