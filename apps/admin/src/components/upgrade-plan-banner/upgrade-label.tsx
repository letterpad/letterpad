import Link from "next/link";

export const UpgradeLabel = () => {
  return (
    <Link
      className="text-green-600 dark:text-green-500"
      href="/membership"
      prefetch={false}
    >
      Upgrade to Pro
    </Link>
  );
};
