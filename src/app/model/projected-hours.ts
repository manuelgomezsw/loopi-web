export interface ProjectedHours {
  period: {
    year: number;
    month: number;
  };
  ordinary: {
    diurnal_extra: number;
    nocturnal_extra: number;
  };
  sunday: {
    diurnal_extra: number;
    nocturnal_extra: number;
  };
  holiday: {
    diurnal_extra: number;
    nocturnal_extra: number;
  };
}
