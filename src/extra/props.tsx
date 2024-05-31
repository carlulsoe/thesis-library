import type { ConnectionContext } from './OptionalConnectionContext';

export interface DetectorProps {
  receivingFunction: Function;
  sendingFunction: Function;
  fileTransferringMethod?: string;
  useFaceDetection?: boolean;
}

export interface FocusProps {
  receivingFunction: Function;
  sendingFunction: Function;
  uuid: any;
  focus: any;
  multiUserSharing?: MultiUserSharingProps;
}

export interface MultiUserSharingProps {
  receivingFunction: Function;
  sendingFunction: Function;
}

export const ATTENTION_KEY = 'attention';

export interface ConnectProps {
  containerId?: { containerId: ''; setContainerId: Function };
  toOtherUsers: boolean;
  focusProp?: FocusProps;
}

export interface FullyConnectedProps {
  ownSharedContext: ConnectionContext;
  sending?: Function;
  receiving?: Function;
}
