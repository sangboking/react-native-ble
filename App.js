import { WebView } from "react-native-webview";
import useBLE from "./useBLE";
import { Button, FlatList, SafeAreaView, Text, View } from "react-native";

const ScanDevice = ({ deviceId, name, connectToDevice }) => (
  <View style={{ backgroundColor: "lightblue", marginTop: 12 }}>
    <Text style={{ fontSize: 16 }}>{`deviceId : ${deviceId}`}</Text>
    <Text>{`deviceName : ${name}`}1</Text>
    <Button
      color="gray"
      title="해당기기 연결하기"
      onPress={() => connectToDevice(deviceId)}
    />
  </View>
);

const ConnectedDevice = ({ deviceId, name, disconnectFromDevice }) => (
  <View style={{ backgroundColor: "lightblue", marginTop: 12 }}>
    <Text style={{ fontSize: 16 }}>{`deviceId : ${deviceId}`}</Text>
    <Text>{`deviceName : ${name}`}1</Text>
    <Button
      color="red"
      title="해당기기 연결 해제하기"
      onPress={() => disconnectFromDevice(deviceId)}
    />
  </View>
);

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
    // <WebView
    //   source={{ uri: "https://expo.dev/" }}
    //   allowsBackForwardNavigationGestures={true}
    // />
    <View style={{ paddingBottom: 30 }}>
      <Button
        color="#f194ff"
        title="디바이스 스캔 시작"
        onPress={() => scanForDevices()}
      />

      <Button
        title="디바이스 스캔 중지"
        onPress={() => stopScanForPeripherals()}
      />

      {allDevices.length > 1 && (
        <>
          <Text style={{ fontSize: 18, marginTop: 20 }}>
            스캔된 디바이스 리스트
          </Text>
          <SafeAreaView>
            <FlatList
              data={allDevices}
              renderItem={(item) => (
                <ScanDevice
                  deviceId={item.item.id}
                  name={item.item.name}
                  connectToDevice={connectToDevice}
                />
              )}
            />
          </SafeAreaView>
        </>
      )}

      <View
        style={{
          marginVertical: 8,
          borderBottomColor: "#737373",
          borderBottomWidth: 2,
        }}
      />

      {connectedDevice && (
        <>
          <Text style={{ fontSize: 18, marginTop: 25 }}>연결된 디바이스</Text>
          <ConnectedDevice
            deviceId={connectedDevice.id}
            name={connectedDevice.name}
            disconnectFromDevice={disconnectFromDevice}
          />
        </>
      )}
    </View>
  );
}
