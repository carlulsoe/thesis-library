export interface DetectorProps {
  receivingFunction?: Function;
  sendingFunction?: Function;
  initialMap?: object;
}

export interface FocusProps {
  dp: DetectorProps;
  uuid: any;
  focus: any;
  captureImage: () => Promise<number> | undefined;
}

export const ATTENTION_KEY = 'attention';
