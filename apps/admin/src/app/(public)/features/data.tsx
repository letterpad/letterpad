import { BsMagic } from "react-icons/bs";
import { IoAnalytics } from "react-icons/io5";
import { RiAdvertisementLine } from "react-icons/ri";
import { TbFileTextAi, TbSeo, TbTools } from "react-icons/tb";

export const data = [
  {
    tag: "Effortless Outlining",
    imgAlt: "Generate post outlines effortlessly",
    title: "Streamline Your Writing Process",
    caption:
      "Say goodbye to writer's block. Instantly generate structured outlines for your posts and jumpstart your creativity.",
    imgSrc:
      "https://res.cloudinary.com/abhisheksaha/image/upload/c_crop,h_1050,q_94,w_2195/v1713004594/lp_assets/generate_title_pzrf3p.avif",
  },
  {
    tag: "AI Writing Partner",
    imgAlt: "AI Writing Partner",
    reverse: true,
    title: "Your Personal Writing Companion",
    caption:
      "Experience the power of AI at your fingertips. From idea generation to content optimization, Letterpad AI assistant is your ultimate writing ally.",
    imgSrc:
      "https://res.cloudinary.com/abhisheksaha/image/upload/c_scale,q_100,w_1461/v1712978459/lp_assets/assistant_thva0g.avif",
  },
  {
    tag: "Tailored Expression",
    imgAlt: "Customize post tone",
    title: "Perfect Your Voice",
    caption:
      "Ensure your message resonates. Fine-tune the tone of your posts effortlessly and captivate your audience every time.",
    imgSrc:
      "https://res.cloudinary.com/abhisheksaha/image/upload/q_100/v1712974765/lp_assets/tone_xakkap.avif",
    imgClass: "object-scale-down max-h-96 p-6 bg-slate-900",
  },
  {
    tag: "Auto Tags",
    reverse: true,
    imgAlt: "Streamline tagging and excerpts",
    title: "Tags Made Simple",
    caption:
      "Say hello to effortless organization. Automatically assign relevant tags to your posts and boost discoverability.",
    imgSrc:
      "https://res.cloudinary.com/abhisheksaha/image/upload/q_100,o_88/v1712976392/lp_assets/tags_ti7ahh.avif",
    imgClass: "max-h-96 bg-slate-900 p-6",
  },
];

export const blocks = [
  {
    title: "Inline AI Text editing",
    description:
      "Turn a selected paragraph into one sentence or bullets, rephrase it for clarity, or modify its tone.",
    icon: <BsMagic size={24} className="text-blue-500" />,
  },
  {
    title: "Context-aware AI chatbot",
    description:
      "Improve your opening paragraph, use better adjectives, and simplify complex topics - all in one place.",
    icon: <TbFileTextAi size={24} className="text-blue-500" />,
  },
  {
    title: "Creative Tools",
    description:
      "Generate Table of Contents, Summarize your article, and more.",
    icon: <TbTools size={24} className="text-blue-500" />,
  },
  {
    title: "One-click SEO assistant",
    description:
      "Generate post titles and meta tags automatically to rank higher in search results.",
    icon: <TbSeo size={24} className="text-blue-500" />,
  },
  {
    title: "Advanced Analytics",
    description: "Get insights to your posts with the advanced analytics.",
    icon: <IoAnalytics size={24} className="text-blue-500" />,
  },
  {
    title: "No Ads",
    description:
      "We do not show ads on your blog. We rely on your subscription in exchange for creative tools.",
    icon: <RiAdvertisementLine size={24} className="text-blue-500" />,
  },
];
