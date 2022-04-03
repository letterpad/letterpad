import { useSavingIndicator } from "@/hooks/useSavingIndicator";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Row } from "antd";
import FeedbackForm from "../feedback-form";
import ThemeSwitcher from "../theme-switcher";

export const TopBar = ({ showNavBtn, onMobileNavBtnClick }) => {
  const SavingIndicator = useSavingIndicator();
  return (
    <>
      <div>
        {showNavBtn && (
          <>
            <Button
              className="menu"
              type="text"
              icon={<MenuOutlined />}
              onClick={() => onMobileNavBtnClick(true)}
            />
          </>
        )}
      </div>
      {SavingIndicator}
      <Row>
        <Button type="link" href="https://docs.letterpad.app/" target="_blank">
          Help
        </Button>
        <FeedbackForm />
        <ThemeSwitcher />
      </Row>
    </>
  );
};
