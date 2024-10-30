export interface Location {
  locationId: string;
  locationName: string;
  locationDescription: string | undefined;
  Target: {
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
  };
}
