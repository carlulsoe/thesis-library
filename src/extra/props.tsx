export interface DetectorProps {
  receivingFunction?: () => void;
  sendingFunction?: () => void;
  initialMap?: object;
}

export interface FocusProps {
  dp: DetectorProps;
  uuid: any;
  focus: any;
  multiUserSharing?: MultiUserSharingProps;
}

export interface MultiUserSharingProps {
  receivingFunction?: () => void;
  sendingFunction?: () => void;
}

export const ATTENTION_KEY = 'attention';
