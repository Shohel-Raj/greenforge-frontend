export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
    role: string;
    image: string;
    status: string;
    emailVerified: boolean;
  };
}
export interface IRegisterResponse {

    token: string | null;
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image: string | null;
      role: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    member: {
      id: string;
      name: string;
      email: string;
      profilePhoto: string | null;
      contactNumber: string | null;
      address: string | null;
      gender: string | null;
      userId: string;
      createdAt: string;
      updatedAt: string;
    };

}

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: "MEMBER" | "ADMIN" | "USER" | string;
  status: "ACTIVE" | "INACTIVE" | string;
}

export interface IMember {
  id: string;
  name: string;
  email: string;
  profilePhoto: string | null;
  contactNumber: string | null;
  address: string | null;
  gender: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
