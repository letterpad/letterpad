const config = require("../../config");
const { THEME_SETTINGS } = require("../../shared/queries/Queries");
const {
  INSERT_THEME_SETTINGS,
  UPDATE_THEME_SETTINGS,
} = require("../../shared/queries/Mutations");
const { syncArrays } = require("../../shared/util");

module.exports.uploadFile = ({ files, type }) => {
  var data = new FormData();
  data.append("type", type);
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
module.exports.syncThemeSettings = (client, newSettings, authorization) => {
  // Get the existing theme settings
  return client(true, authorization)
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
        return client(true, authorization).mutate({
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
      const updatePromises = [];
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

// /-src
//   |- admin
//   |- client
//   |- api
//   |- config
//   |- data
//   |- public
//   |- shared
