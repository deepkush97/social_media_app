export interface IBaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBaseWithUserIdEntity extends IBaseEntity {
  userId: number;
}
