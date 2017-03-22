import Node from "./node";
const Edges = `
  type Edges {
    node: Node,
    cursor: String
  }
`;

export default () => [Edges];
