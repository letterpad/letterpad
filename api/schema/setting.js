export default `
  type Setting {
    id: Int
    option: String
    value: String
  }
  
  input OptionInputType {
    id: Int
    option: String
    value: String
  }
  
  type Query {
    settings(option: String):[Setting]
  }

  type Mutation {
    updateOptions(options:[OptionInputType]): [Setting]
  }
`;
