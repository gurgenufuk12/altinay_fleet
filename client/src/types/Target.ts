export interface Target {
  Position: {
    x: string;
    y: string;
    z: string;
  };
  Orientation: {
    x: string;
    y: string;
    z: string;
    w: string;
  };
  targetExecuted: boolean;
  locationId: string;
  locationName: string;
  locationDescription: string | undefined;
}
