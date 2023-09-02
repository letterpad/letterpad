export interface TagRow {
  key: React.Key;
  name: string;
  slug: string;
  posts: number;
  raw_name?: string;
}

export interface TagsContextType<T, K> {
  tags: TagRow[];
  loading: boolean;
  updateTags: T;
  deleteTag: K;
  addTag: any;
  saveTag: any;
  headers: any;
}
