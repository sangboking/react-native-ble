import { WebView } from "react-native-webview";
import useBLE from "./useBLE";

export default function App() {
  const {
    requestPermissions,
    requestAndroid31Permissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
  } = useBLE();

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();

    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };
  scanForDevices();

  // console.log(allDevices);
  // connectToDevice("C7:58:3D:91:79:7B");
  // console.log(connectedDevice);
  // disconnectFromDevice("C7:58:3D:91:79:7B");
  return (
    <WebView
      source={{ uri: "https://expo.dev/" }}
      allowsBackForwardNavigationGestures={true}
    />
  );
}
