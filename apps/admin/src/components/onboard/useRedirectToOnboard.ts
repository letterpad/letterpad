import { RegisterStep } from "letterpad-graphql";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { registrationPaths } from "../../constants";

const { ProfileInfo, SiteInfo } = RegisterStep;

export const useRedirectToOnboard = () => {
  const { data } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (data?.user?.register_step === RegisterStep.Registered) {
    return null;
  }

  switch (data?.user?.register_step) {
    case ProfileInfo:
      if (pathname !== registrationPaths[ProfileInfo]) {
        return router.push(registrationPaths[ProfileInfo]);
      }
      break;

    case SiteInfo:
      if (pathname !== registrationPaths[SiteInfo]) {
        return router.push(registrationPaths[SiteInfo]);
      }
      break;
    default:
      break;
  }
};
