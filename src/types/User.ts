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
  };
  hasLoan: boolean;
  hasSavings: boolean;
}
