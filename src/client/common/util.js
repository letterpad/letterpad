const path = require("path");
const fs = require("fs");

module.exports.util = {
  /**
   * Get the contents of a file inside a theme.
   *
   * @param {String } theme - Name of the theme
   * @param {String} filename - Name of the file for which you need the path
   * @returns {string || null }
   */
  getThemeFileContents: function(theme, filename) {
    const filePath = path.resolve(__dirname, "../themes", theme, filename);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    }
    return null;
  },
  /**
   * Get the contents of a file inside the client folder.
   *
   * @param {String} filename - Name of the file for which you need the path
   * @returns {string || null }
   */
  getClientFileContents: function(filename) {
    const filePath = path.resolve(__dirname, filename);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    }
    return null;
  },
};
