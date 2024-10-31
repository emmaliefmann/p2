import { ArcElement } from "chart.js";

export interface ChartClickEvent {
    dataset: any[]; 
  originalEvent: PointerEvent;
  element: {
    element: ArcElement;
    index: number;
    datasetIndex: number;
  };
}
