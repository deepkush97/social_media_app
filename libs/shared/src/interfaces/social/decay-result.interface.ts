export interface IWeightSnapshot {
  min: number;
  max: number;
  mean: number;
}

export interface IDecayResult {
  edgesDecayed: number;
  before: IWeightSnapshot;
  after: IWeightSnapshot;
}
