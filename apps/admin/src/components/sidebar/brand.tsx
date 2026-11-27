import Link from "next/link";

interface Props {
  siteName?: string;
  onNavigate?: () => void;
}

export const Brand = ({ siteName, onNavigate }: Props) => (
  <Link
    href="/posts"
    prefetch={false}
    className="workspace-brand"
    onClick={onNavigate}
  >
    <span className="workspace-brand-name">Letterpad</span>
    {siteName && <span className="workspace-site-name">{siteName}</span>}
  </Link>
);
