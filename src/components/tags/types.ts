export interface TagRow {
  key: React.Key;
  name: string;
  id: number;
  desc: string;
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
