export type UserInput = {
  name: string;
  email: string;
  phone: string;
  role: "artist" | "agent" | "admin" | "buyer";
  location: string;
};
