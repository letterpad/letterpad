const path = require("path");

const MODELS_DIR =
  path.resolve(__dirname, "./src/graphql/db/models") + path.sep;

function babelPluginModels() {
  return {
    visitor: {
      ClassDeclaration(path) {
        let sourceFilePath = null;
        if (
          path.hub.file != null &&
          path.hub.file.opts != null &&
          path.hub.file.opts.filename != null
        ) {
          sourceFilePath = path.hub.file.opts.filename;
        }
        if (sourceFilePath != null && !sourceFilePath.startsWith(MODELS_DIR)) {
          // Ignore files outside models directory
          return;
        }

        const { superClass, superTypeParameters, implements } = path.node;

        // Assert class is extended, and parent class name is  "Model"
        if (superClass == null || superClass.name !== "Model") {
          return;
        }

        // Assert class has two type parameters
        if (
          superTypeParameters == null ||
          superTypeParameters.type !== "TSTypeParameterInstantiation" ||
          superTypeParameters.params.length !== 2
        ) {
          return;
        }

        // Assert class implements an interface
        if (implements == null || implements.length !== 1) {
          return;
        }

        // Remove all relevant attributes from definition
        if (path.node.body != null) {
          path.node.body.body = path.node.body.body.filter((bodyItem) => {
            // Remove public class properties with no values
            if (
              bodyItem.type === "ClassProperty" &&
              !bodyItem.computed &&
              bodyItem.value == null
            ) {
              return false;
            }
            console.log("removing public values");
            return true;
          });
        }
      },
    },
  };
}

module.exports = babelPluginModels;
