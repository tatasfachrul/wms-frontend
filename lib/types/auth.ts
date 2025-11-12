export interface Login {
  token: string;
  user: Profile;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  role: string;
}