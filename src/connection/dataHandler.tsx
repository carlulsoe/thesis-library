import Peer from 'peerjs';
import {
  ATTENTION_KEY,
  type ConnectionContext,
  type FocusProps,
} from '../extra';

export function DataHandler(
  FocusProps: FocusProps,
  transferMethod: any = 'not s3'
) {
  if (transferMethod === 'S3') {
    return FocusProps;
  } else {
    const peer = new Peer(FocusProps.uuid);
    const newSending = (context: ConnectionContext) => {
      let conn = peer.connect(context.get(ATTENTION_KEY));
      conn.send(FocusProps.sendingFunction());
    };

    peer.on('connection', (conn) => {
      conn.on('data', (data) => {
        FocusProps.receivingFunction(data);
      });
    });
    let fp: FocusProps = {
      focus: FocusProps.focus,
      uuid: FocusProps.uuid,
      receivingFunction: FocusProps.receivingFunction,
      sendingFunction: newSending,
      multiUserSharing: FocusProps.multiUserSharing,
    };
    return fp;
  }
}
