export interface ProfileData {
  fullname: string;
  username: string;
  email: string;
  profile_picture_url: string;
  bio?: string;
  posts?: number;
  followers?: number;
  following?: number;
}