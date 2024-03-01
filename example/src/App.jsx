import 'react-native-get-random-values';
import React from 'react';
import { TinyliciousClient } from '@fluidframework/tinylicious-client';
import { SharedMap } from 'fluid-framework';
import { View } from 'react-native';

function App() {
  const [fluidSharedObjects, setFluidSharedObjects] = React.useState();

  React.useEffect(() => {
    GetFluidData().then((data) => setFluidSharedObjects(data));
  }, []);

  const [localTimestamp, setLocalTimestamp] = React.useState();
  React.useEffect(() => {
    if (fluidSharedObjects) {
      // 4: Set the value of the localTimestamp state object that will appear in the UI.
      const { sharedTimestamp } = fluidSharedObjects;
      const updateLocalTimestamp = () =>
        setLocalTimestamp({ time: sharedTimestamp.get('time') });

      updateLocalTimestamp();

      // 5: Register handlers.
      sharedTimestamp.on('valueChanged', updateLocalTimestamp);

      // 6: Delete handler registration when the React App component is dismounted.
      return () => {
        sharedTimestamp.off('valueChanged', updateLocalTimestamp);
      };
    } else {
      return; // Do nothing because there is no Fluid SharedMap object yet.
    }
  }, [fluidSharedObjects]);

  if (localTimestamp) {
    return (
      <div className="App">
        <button
          onClick={() =>
            fluidSharedObjects.sharedTimestamp.set(
              'time',
              Date.now().toString()
            )
          }
          title={'hi'}
        >
          Get Time
        </button>
        <span>{localTimestamp.time}</span>
      </div>
    );
  } else {
    return <View />;
  }
}

const GetFluidData = async () => {
  // 1: Configure the container.
  const client = new TinyliciousClient();
  const containerSchema = {
    initialObjects: { sharedTimestamp: SharedMap },
  };

  // 2: Get the container from the Fluid service.
  let container;
  const containerId = window.location.hash.substring(1);
  if (!containerId) {
    ({ container } = await client.createContainer(containerSchema));
    const id = await container.attach();
    window.location.hash = id;
  } else {
    ({ container } = await client.getContainer(containerId, containerSchema));
  }

  // 3: Return the Fluid timestamp object.
  return container.initialObjects;
};

export default App;
