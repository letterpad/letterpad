import config from "../../../config";
import documentRenderer from "../document-renderer";
import { fetchSettings } from "../../../api/fetchSettings";

export const getAdminContent = async (_req, res) => {
  let theme: string;

  const settings = await fetchSettings();
  if (config.NODE_ENV === "production") {
    theme = settings.theme;
  } else {
    theme = config.THEME;
  }

  const content = documentRenderer({
    settings,
  });

  content.pipe(res);
};
