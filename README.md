# Thesis library

This React library adds multidevice and multiuser capabilities to an existing app with limited extra code.
This will add a small connection setup-box to your app, where every user has an internal connection, and the creator of the internal network is deemed the main device and is granted the ability to create or connect to an external network.

## Usage
It works with [tinylicious](https://fluidframework.com/docs/testing/tinylicious/).
Install and run `npx tinylicious` before start. This does not need to be restarted

```tsx
const [data, setData] = useState('');
const Location = 'data_location';

const sender = (context: ConnectionContext) => {
  context.set(Location, data);
};

const receiver = (context: ConnectionContext) => {
  setData(context.get(Location));
};

return (
  <MultiDeviceAttention receivingFunction={receiver} sendingFunction={sender} useFaceDetection={true}>
    <YourComponent onChange={setData} value={data} />
  </MultiDeviceAttention>
);
```

## Code structure
* `__tests__` A limited battery of tests
* `attention` All things related to when to send or receive
  * `browserDetection` Detection based on whether your browser thinks you use it
  * `detectionListener` Detection helper function
  * `faceDetection` (Not fully developed and tested) Detection based on whether you look at your device or not
  * `fullyConnected` The component which constantly synchronizes the shared network with the personal network
* `connection` All components that are directly related to Fluid Framework
  * `fluid` An adapter to Fluid Framework. This also contains the only visible components in the library, the connection setup.
  * `multiDeviceAttention` The main function in the library. This contains two instances of the component in `fluid`, one for the internal network and one for the external.
* `extra` A folder for tools, props
  * `imageControllerS3` The setup for transferring anything above 768KB with the library
  * `connectionContext` The context in which the connection map, setter and getter is stored
  * `props` All the props used by the library
  * `tools` Generic tools

## Installation

This library can currently only be installed from this repository.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
