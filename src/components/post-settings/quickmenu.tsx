import { EventAction, track } from "@/track";
import { PostStatusOptions } from "@/__generated__/__types__";
import { Menu } from "antd";
import { socket } from "@/components/post/components/tinymce/socket";
import { useUpdatePost } from "@/hooks/useUpdatePost";

const QuickMenu = ({
  siteUrl,
  postHash,
  showDrawer,
  rePublishBtnDisabled,
  postId,
}) => {
  const { updatePost } = useUpdatePost();
  return (
    <Menu>
      <Menu.Item key="0" onClick={showDrawer} data-testid="postSettingsLink">
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="1"
        disabled={rePublishBtnDisabled}
        onClick={() => {
          updatePost({
            id: postId,
            status: PostStatusOptions.Published,
          });
        }}
      >
        Republish
      </Menu.Item>
      <Menu.Divider />
      {siteUrl && (
        <Menu.Item
          key="2"
          onClick={() => {
            track({
              eventAction: EventAction.Change,
              eventCategory: "setting",
              eventLabel: "preview",
            });
            window.open(siteUrl + "/preview/" + postHash);
          }}
        >
          Preview
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item
        key="3"
        onClick={() => {
          track({
            eventAction: EventAction.Click,
            eventCategory: "post",
            eventLabel: "grammar",
          });
          socket.checkGrammar();
        }}
      >
        Check Grammar
      </Menu.Item>
    </Menu>
  );
};
export default QuickMenu;
