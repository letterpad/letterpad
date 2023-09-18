import Image from "next/image";

interface Props {
  name: string;
  avatar?: string;
  site_url?: string;
}
const ProfileInfo: React.FC<Props> = ({ name, avatar, site_url }) => {
  return (
    <>
      <div className="fixed bottom-0 flex h-16 w-full items-center gap-2 border-t border-t-blue-900 bg-zinc-800 p-4 text-gray-400">
        {avatar && (
          <div className="flex overflow-hidden rounded-full border-2 border-blue-500">
            <Image
              src={avatar}
              width={36}
              height={36}
              objectFit="cover"
              alt={name}
              className="rounded-full"
              style={{ width: 36, height: 36 }}
            />
          </div>
        )}
        <div className="flex flex-col">
          <span>{name}</span>
          <span>
            {site_url && (
              <a
                href={site_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-blue-500"
              >
                View Site
              </a>
            )}
          </span>
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
