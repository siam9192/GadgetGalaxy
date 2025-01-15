import {
  Author,
  Reader,
  SocialLink,
  SocialPlatform,
  Staff,
} from "@prisma/client";

interface ISocialLinkUpdate {
  author_id: number;
  platform: `${SocialPlatform}`;
  url: string;
  is_deleted?: boolean;
}

export interface IUpdateAuthorProfileData extends Author {
  social_links: ISocialLinkUpdate[];
}

export interface IUpdateReaderProfileData extends Reader {}

export interface IUpdateStaffProfileData extends Staff {}
