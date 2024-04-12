import { WebView } from "react-native-webview";
import { Pressable, Text, View } from "react-native";
import { useEffect, useRef } from "react";
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
    heartRate,
  } = useBLE();

  //랜더링할 webview 주소 기입해 주세요. 로컬테스트시 아래와 같이 ip주소로 열어야 합니다.
  const uri = "http://192.168.0.125:5173/";

  const webViewRef = useRef();

  // WebView -> RN : 넘겨받는 type 값에 따라 기기 연결, 해제 로직 수행
  const receiveMessageToWebView = async (e) => {
    const data = JSON.parse(e.nativeEvent.data);

    if (data.type === "connect") {
      connectToDevice(data);
    }

    if (data.type === "disconnect") {
      disconnectFromDevice(data.id);
    }
  };

  // 디바이스 스캔시 allDevices에 값이 들어올때마다 RN -> WebView로 데이터 전달
  useEffect(() => {
    webViewRef.current.postMessage(JSON.stringify(allDevices));
  }, [allDevices]);

  // 디바이스 연결, 해제 될때마다 connectedDevice값이 바뀌며 RN -> WebView로 데이터 전달
  useEffect(() => {
    webViewRef.current.postMessage(JSON.stringify(connectedDevice));
  }, [connectedDevice]);

  // wahoo 심박기계 연결후 심박수 데이터 RN -> WebView 전달
  useEffect(() => {
    webViewRef.current.postMessage(JSON.stringify(heartRate));
  }, [heartRate]);

  return (
    <>
      <View style={{ flex: 0 }}>
        <Pressable
          style={{ marginTop: 30, backgroundColor: "skyblue", padding: 5 }}
          onPress={() => scanForDevices()}
        >
          <Text>BLE 기기 스캔 버튼</Text>
        </Pressable>

        <Pressable
          style={{ marginTop: 10, backgroundColor: "red", padding: 5 }}
          onPress={() => stopScanForPeripherals()}
        >
          <Text>BLE 기기 스캔 중지 버튼</Text>
        </Pressable>
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: uri }}
        onMessage={receiveMessageToWebView}
      />
    </>
  );
}

