import type { Context } from '../connection/ConnectionContext';

export interface DetectorProps {
  receivingFunction?: (context: Context) => void;
  sendingFunction?: (context: Context) => void;
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
