import { PageHeader } from "ui/dist/isomorphic.mjs";

import { Content } from "@/components/client-wrapper";
import { UpgradeBanner } from "@/components/upgrade-plan-banner/upgrade-banner";

import { Feature } from "@/app/(protected)/domain-mapping/_feature";

interface Props {
  readOnly: boolean;
}

const DomainMapping: React.FC<Props> = () => {
  return (
    <>
      <PageHeader className="site-page-header" title="Domain Mapping">
        <span className="help-text">
          Here you can connect a domain to your Letterpad blog. This will allow
          you to use your own domain instead of the default subdomain provided
          by Letterpad.
        </span>
      </PageHeader>

      <Content>
        <div className="flex max-w-4xl flex-auto flex-col gap-1">
          <UpgradeBanner />
          <Feature />
        </div>
      </Content>
    </>
  );
};

export default DomainMapping;
