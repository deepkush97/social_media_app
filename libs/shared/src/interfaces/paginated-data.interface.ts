export interface IPaginatedData<T> {
  items: T[];
  meta: IPaginatedMetadata;
}

export interface IPaginatedMetadata {
  total: number;
  page: number;
  lastPage: number;
  take: number;
}
