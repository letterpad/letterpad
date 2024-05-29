export enum EventAction {
    Load = "load",
    View = "view",
    Click = "click",
    Change = "change",
}

export interface EventInfo {
    eventCategory: EventCategory;
    eventAction: EventAction;
    eventLabel: EventLabel | string;
}

export enum EventCategory {
    Social = "social",
    Footer = "footer",
    Author = "author",
    Profile = "profile",
    PostMeta = "post_meta",
    Announcement = "announcement",
    OmniSearch = "omni_search",
    Notification = "notification",
    Cookie = "cookie",
    Settings = "settings",
    Registration = "registration",
    ProModal = "pro_modal_popup",
    PostStatus = "post_status",
    Onboarding = "onboarding",
    Navigation = "navigation",
    Membership = "membership",
    MediaProvider = "media_provider",
    Media = "media",
    Auth = "auth",
    Filters = "filters",
    CreativesDemo = "creatives_demo",
    AiAdBanner = "ai_ad_banner",
    Post = "post",
    NotSet = "not_set",
    Unspecified = "unspecified",
    AI = "ai",
    Topic = "topic",
    HeaderMenu = "header_menu",
    HeroBanner = "hero_banner",
    Subscribe = "subscribe",
    TrendingPosts = "trending_posts",
    TrendingPostsControl = "trending_posts_control",
    TrendingPostsVariation = "trending_posts_variation",
}

export enum EventLabel {
    Follow = "follow",
    GoogleRegistration = "google_registration",
    GitHubRegistration = "github_registration",
    CredentialsRegistration = "credentials_registration",
    GoogleLogin = "google_login",
    GitHubLogin = "github_login",
    MagicLink = "magiclink",
    Preview = "preview",
    ForgotPassword = "forgot_password",
    ResetPassword = "reset_password",
    Registered = "registered",
    SiteInfo = "site_info",
    Successful = "successful",
    Excerpt = "excerpt",
    Tags = "tags",
    Editor = "editor",
    Published = "published",
    Draft = "draft",
    Completed = "completed",
    RemoveItem = "remove_item",
    TrialActivated = "trial_activated",
    Letterpad = "letterpad",
    Upload = "upload",
    Unsplash = "unsplash",
    CropImage = "crop_image",
    UserLoggedIn = "user_logged_in",
    BeforeRequest = "before_request",
    SortBy = "sort_by",
    Introduction = "introduction",
    Dismiss = "dismiss",
    Default = "default",
    StoryBuilder = "story_builder",
    NotSet = "not_set",
    Unspecified = "unspecified",
    Create = "create",
    AIRequest = "ai_request",
    AIRequestSuccess = "ai_request_success",
    AIRequestFailed = "ai_request_failed",
    Checkout = "checkout",
    Cancel = "cancel",
    ViewList = "view_list",
    ViewItem = "view_item",
    Register = "register",
    Login = "login",
    UsernameChange = "username_change",
    Like = "like",
    LikedAvatars = "liked_avatars",
    ReadMore = 'read_more'
}




export const track = (info: EventInfo) => {
    if (typeof gtag === "undefined") return;
    gtag("event", info.eventAction, {
        event_category: info.eventCategory,
        event_label: info.eventLabel,
    });
};