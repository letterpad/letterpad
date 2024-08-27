import { Author, Post, Setting } from "@prisma/client";
import { Author as GraphqlAuthor } from "letterpad-graphql";
import { NextApiRequest } from "next";

export enum ROLES {
  ADMIN = "ADMIN",
  REVIEWER = "REVIEWER",
  READER = "READER",
  AUTHOR = "AUTHOR",
}

export enum PERMISSIOMS {
  MANAGE_ALL_POSTS = "MANAGE_ALL_POSTS",
  MANAGE_OWN_POSTS = "MANAGE_OWN_POSTS",
  READ_ONLY_POSTS = "READ_ONLY_POSTS",
}

export type updatePostOptionalArgs = {
  cover_image: string;
  cover_image_width: number;
  cover_image_height: number;
} & Omit<Post, "cover_image" | "cover_image_width" | "cover_image_height">;

export type Session = Pick<
  GraphqlAuthor,
  | "id"
  | "email"
  | "role"
  | "permissions"
  | "avatar"
  | "username"
  | "name"
  | "register_step"
>;

export interface SessionData extends Session {
  expires: any;
  __typename: "SessionData";
}

export interface IMediaUploadResult {
  src: string;
  error: string | null;
  name: string;
  size: {
    width: number;
    height: number;
    type: string;
  };
}

export type NextApiRequestWithFormData = NextApiRequest & {
  files: BlobCorrected[];
};

export type BlobCorrected = Blob & {
  buffer: Buffer;
  originalname: string;
  hash: string;
};

interface IImageAttrs {
  src: string;
  sizes: string;
  "data-srcset": string;
  srcSet: string;
  width: string;
  loading: "lazy";
}
export type IImageAttrsResult = IImageAttrs | Record<string, string>;

export enum EmailTemplates {
  VerifyNewUser = "verifyNewUser",
  EmailChangeSuccess = "emailChangeSuccess",
  DomainMapSuccess = "domainMapSuccess",
  VerifyChangedEmail = "verifyChangedEmail",
  VerifySubscriber = "verifySubscriber",
  SubscriberVerified = "subscriberVerified",
  WelcomeUser = "welcomeUser",
  NewFollower = "newFollower",
  NewPost = "newPost",
  PaymentFailed = "paymentFailed",
}
export interface Template {
  body: string;
  subject: string;
}

export interface EmailVerifyNewUserProps {
  author_id: string;
  template_id: EmailTemplates.VerifyNewUser;
}

export interface DomainMapSuccessProps {
  author_id: string;
  template_id: EmailTemplates.DomainMapSuccess;
}

export interface EmailVerifyNewEmailProps {
  author_id: string;
  template_id: EmailTemplates.VerifyChangedEmail;
}

export interface EmailChangeSuccessProps {
  author_id: string;
  template_id: EmailTemplates.EmailChangeSuccess;
}

export interface EmailVerifySubscriberProps {
  author_id: string;
  subscriber_id: number;
  template_id: EmailTemplates.VerifySubscriber;
}
export interface EmailSubscriberVerifiedProps {
  author_id: string;
  subscriber_id: number;
  template_id: EmailTemplates.SubscriberVerified;
}

export interface NewFollowerProps {
  follower_id: string;
  following_id: string;
  template_id: EmailTemplates.NewFollower;
}

export interface EmailWelcomeUserProps {
  author_id: string;
  template_id: EmailTemplates.WelcomeUser;
}

export interface NewPostProps {
  post_id: string;
  template_id: EmailTemplates.NewPost;
}

export interface PaymentFailedProps {
  author_id: string;
  template_id: EmailTemplates.PaymentFailed;
  invoice_url: string;
}

export type EmailProps =
  | EmailVerifyNewUserProps
  | EmailVerifyNewEmailProps
  | EmailVerifySubscriberProps
  | EmailSubscriberVerifiedProps
  | EmailWelcomeUserProps
  | EmailChangeSuccessProps
  | DomainMapSuccessProps
  | NewFollowerProps
  | NewPostProps
  | PaymentFailedProps;

export interface Mail {
  to: string | { email: string; id: number }[];
  subject: string;
  html: string;
}

export interface EmailTemplateMeta {
  author: Author & { setting: Setting | null };
}

export interface EmailTemplateSuccess {
  ok: true;
  content: Mail;
  meta: EmailTemplateMeta;
}
interface EmailTemplateError {
  ok: false;
  message: string;
}

export type EmailTemplateResponse = EmailTemplateSuccess | EmailTemplateError;

export type ValueOf<T> = T[keyof T];

export enum PageType {
  Default = "default",
  "Story Builder" = "story-builder",
  // Grid = "grid",
}
