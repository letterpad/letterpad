const config = require("../config");
const { THEME_SETTINGS } = require("../shared/queries/Queries");
const {
    INSERT_THEME_SETTINGS,
    UPDATE_THEME_SETTINGS
} = require("../shared/queries/Mutations");
const { syncArrays } = require("../shared/util");

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
            authorization: localStorage.token
        }
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
    return client()
        .query({
            query: THEME_SETTINGS
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
                compareFields
            );

            // new themes to be inserted in db
            const promises = result.added.map(({ name, value, settings }) => {
                return client().mutate({
                    mutation: INSERT_THEME_SETTINGS,
                    variables: {
                        name,
                        value,
                        settings
                    },
                    context: {
                        headers: {
                            authorization
                        }
                    }
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
                        let promise = client().mutate({
                            mutation: UPDATE_THEME_SETTINGS,
                            variables: {
                                name: newItem.name,
                                value: JSON.stringify(fieldsToBeAdded),
                                settings: newItem.settings
                            },
                            context: {
                                headers: {
                                    authorization
                                }
                            }
                        });

                        updatePromises.push(promise);
                    }
                });
            });
            return Promise.all([promises, updatePromises]);
        });
};

// A utility function to convert all jpeg images in uploads folder to progressive jpeg images
// const optimizeImage = function() {
//     const sharp = require("sharp");
//     const fs = require("fs");
//     const path = require("path");
//     const imageFolder = path.join(__dirname, "../public/uploads");
//     const files = fs.readdirSync(imageFolder);
//     for (var i in files) {
//         let file = files[i];
//         if (file.indexOf("loading.jpg") >= 0) {
//             let image = imageFolder + "/" + file;
//             let saveImage = imageFolder + "/pjpeg/" + file;
//             sharp(image)
//                 .jpeg({ progressive: true })
//                 .toFile(saveImage, (err, info) => {
//                     console.log("err: ", err);
//                     console.log("info: ", info);
//                 });
//         }
//     }
// };
// optimizeImage();
