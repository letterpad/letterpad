import config from "../../config";
import { THEME_SETTINGS } from "../../shared/queries/Queries";
import {
  INSERT_THEME_SETTINGS,
  UPDATE_THEME_SETTINGS,
} from "../../shared/queries/Mutations";

const { syncArrays } = require("../../shared/util");

interface IUploadFileProps {
  files: FileList;
  type?: string;
}

export const uploadFile = ({ files, type }: IUploadFileProps) => {
  const data: FormData = new FormData();
  if (type) {
    data.append("type", type);
  }
  for (let i = 0; i < files.length; i++) {
    data.append("file", files[i]);
  }

  return fetch(config.uploadUrl, {
    method: "post",
    body: data,
    headers: {
      authorization: localStorage.token,
    },
  })
    .then(data => {
      return data.json();
    })
    .then(async image => {
      return image;
    });
};

/**
 * When new version of theme settings are available,
 * it needs to be synced with the values saved in the database.
 *
 */
export const syncThemeSettings = (client, newSettings, authorization) => {
  // Get the existing theme settings
  return client(true, {}, authorization)
    .query({
      query: THEME_SETTINGS,
    })
    .then(({ data: { themeSettings } }) => {
      // we will call the existing settings as oldSettings.
      const oldSettings = themeSettings;

      // Check if the theme settings exist in the db.
      // Remove the unused ones.
      // We will compare with the field "name"

      const keyField = "name";
      const compareFields = ["name"];
      const result = syncArrays(
        oldSettings,
        newSettings,
        keyField,
        compareFields,
      );

      // new themes to be inserted in db
      const promises = result.added.map(({ name, value, settings }) => {
        return client(true, {}, authorization).mutate({
          mutation: INSERT_THEME_SETTINGS,
          variables: {
            name,
            value,
            settings,
          },
          context: {
            headers: {
              authorization,
            },
          },
        });
      });

      // existing theme settings to be updated
      const updatePromises = [] as any;
      newSettings.forEach(newItem => {
        oldSettings.forEach(oldItem => {
          if (
            newItem.name == oldItem.name &&
            newItem.settings != oldItem.settings
          ) {
            // settings have changed

            // check if the field Names have changed.
            const oldFields = JSON.parse(oldItem.value);
            const newFieldNames = JSON.parse(newItem.settings);
            const fieldsToBeAdded = {};
            newFieldNames.forEach(ele => {
              fieldsToBeAdded[ele.name] = oldFields[ele.name]
                ? oldFields[ele.name]
                : ele.defaultValue;
            });

            // update the old value in database
            let promise = client(true, authorization).mutate({
              mutation: UPDATE_THEME_SETTINGS,
              variables: {
                name: newItem.name,
                value: JSON.stringify(fieldsToBeAdded),
                settings: newItem.settings,
              },
              context: {
                headers: {
                  authorization,
                },
              },
            });

            updatePromises.push(promise);
          }
        });
      });
      return Promise.all([promises, updatePromises]);
    });
};
