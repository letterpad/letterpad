interface ColumnItem {
  title: string | JSX.Element;
  dataIndex: string;
  key: string;
  // responsive: Breakpoint[];
  width?: string;
  render?: (data: any, item: any) => any;
}

export type Columns = ColumnItem | null;
