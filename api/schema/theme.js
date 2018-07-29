export default `
    type ThemeSettings {
        name: String,
        value: String,
        settings: String
    }

    type Query {
        themeSettings(name: String): [ThemeSettings]
    }

    type Mutation {
        updateThemeSettings(name: String, value: String, settings: String): Boolean
        insertThemeSettings(name: String, value: String, settings: String): Boolean
    }
`;
