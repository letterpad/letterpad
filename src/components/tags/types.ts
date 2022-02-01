export interface TagRow {
  key: React.Key;
  name: string;
  slug: string;
  posts: number;
}

export interface TagsContextType<T, K> {
  tags: TagRow[];
  loading: boolean;
  updateTagsMutation: T;
  deleteTag: K;
  addTag: any;
  saveTag: any;
  headers: any;
}
