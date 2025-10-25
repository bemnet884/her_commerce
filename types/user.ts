export type UserInput = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  image: string;
  role: "artist" | "agent" | "admin" | "buyer";
  bio: string;
  emailVerified: boolean;
  is_approved: boolean;
  location: string;
};
