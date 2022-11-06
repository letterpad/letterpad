export interface Columns {
  title: string | JSX.Element;
  dataIndex: string;
  key: string;
  // responsive: Breakpoint[];
  width?: string;
  render?: (data: any, item: any) => any;
}
