import { WebView } from "react-native-webview";
import useBLE from "./useBLE";

export default function App() {
  const {
    scanForPeripherals,
    stopScanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    scanForDevices,
    allDevices,
    connectedDevice,
  } = useBLE();

  return (
    <WebView
      source={{ uri: "https://expo.dev/" }}
      allowsBackForwardNavigationGestures={true}
    />
  );
}
