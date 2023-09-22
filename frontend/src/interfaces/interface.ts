
export interface Charger {
  direction: string;
}

export interface Chute {
  direction: string;
}

export interface NodeProps {
  x: number;
  y: number;
  code: number;
  directions?: string[];
  name?: string;
  charger?: { direction: string };
  chute?: { direction: string };
}

export interface MapProps {
  maxNeighborDistance: number;
  nodes: NodeProps[];
}



export interface MapResponse {
  map: MapProps;
}

export interface SliderComponentProps {
  scaleRate: number;
  setScaleRate: React.Dispatch<React.SetStateAction<number>>;
}



export interface AxesProps {
  svgWidth: number;
  svgHeight: number;
  scaleRate: number;
}