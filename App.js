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
    // 앱에서 랜딩하고 싶은 웹 uri 에 기입하면 웹뷰 랜딩
    <WebView
      source={{ uri: "https://expo.dev/" }}
      allowsBackForwardNavigationGestures={true}
    />
  );
}
