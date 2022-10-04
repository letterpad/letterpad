import { EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { FC } from "react";

import { socket } from "@/components/post/components/tinymce/socket";

import { PostTypes } from "@/__generated__/__types__";
import { PageType } from "@/graphql/types";
import { EventAction, track } from "@/track";

interface Props {
  siteUrl: string;
  postHash: string;
  showDrawer: () => void;
  pageType: PageType;
  setPageType: (type: PageType) => void;
}
const QuickMenu: FC<Props> = ({
  siteUrl,
  postHash,
  showDrawer,
  pageType,
  setPageType,
}) => {
  return (
    <>
      <Button
        type="text"
        onClick={() => {
          track({
            eventAction: EventAction.Click,
            eventCategory: "post",
            eventLabel: "grammar",
          });
          socket.checkGrammar();
        }}
      >
        Grammar
      </Button>
      <Button
        disabled={pageType === PageType.Default}
        type="text"
        onClick={() => {
          track({
            eventAction: EventAction.Click,
            eventCategory: "pageType",
            eventLabel: PageType.Default,
          });
          setPageType(PageType.Default);
        }}
      >
        Page
      </Button>
      <Button
        disabled={pageType === PageType.PortfolioMasonry}
        type="text"
        onClick={() => {
          track({
            eventAction: EventAction.Click,
            eventCategory: "pageType",
            eventLabel: PageType.PortfolioMasonry,
          });
          setPageType(PageType.PortfolioMasonry);
        }}
      >
        PortfolioMasonry
      </Button>
      <Button
        disabled={pageType === PageType.PortfolioZigZag}
        type="text"
        onClick={() => {
          track({
            eventAction: EventAction.Click,
            eventCategory: "pageType",
            eventLabel: PageType.PortfolioZigZag,
          });
          setPageType(PageType.PortfolioZigZag);
        }}
      >
        PortfolioZigZag
      </Button>
      <Button
        type="text"
        onClick={() => {
          track({
            eventAction: EventAction.Change,
            eventCategory: "setting",
            eventLabel: "preview",
          });
          window.open(siteUrl + "/preview/" + postHash);
        }}
        icon={<EyeOutlined />}
      ></Button>

      <Button
        type="text"
        onClick={showDrawer}
        data-testid="postSettingsLink"
        icon={<SettingOutlined />}
      ></Button>
    </>
  );
};
export default QuickMenu;
