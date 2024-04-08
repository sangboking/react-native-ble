import { WebView } from "react-native-webview";
import useBLE from "./useBLE";
import {
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef, useState } from "react";

const ScanDevice = ({ deviceId, name, connectToDevice }) => (
  <View style={{ backgroundColor: "lightblue", marginTop: 12 }}>
    <Text style={{ fontSize: 16 }}>{`deviceId : ${deviceId}`}</Text>
    <Text>{`deviceName : ${name}`}</Text>
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
    <Text>{`deviceName : ${name}`}</Text>
    <Button
      color="red"
      title="해당기기 연결 해제하기"
      onPress={() => disconnectFromDevice(deviceId)}
    />
  </View>
);

export default function App() {
  const [toggle, setToggle] = useState(true);
  const {
    scanForPeripherals,
    stopScanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    scanForDevices,
    allDevices,
    connectedDevice,
  } = useBLE();
  const uri = "https://playful-treacle-e405aa.netlify.app/";
  const webViewRef = useRef();

  /* native -> web */
  const native_to_web = () => {
    webViewRef.current.postMessage("test");
  };

  const sendMessage = () => {
    const sendData = JSON.stringify({
      type: "cend",
      id: 1,
      name: "testName",
      content: "test content",
      file: null,
    });

    webViewRef.current.postMessage(sendData);
  };

  return (
    <View>
      <WebView ref={webViewRef} source={{ uri: uri }} />

      <TouchableOpacity onPress={sendMessage}>
        <Text style={{ marginTop: 20 }}>웹뷰로 데이터 전송</Text>
      </TouchableOpacity>
    </View>

    // <WebView ref={webViewRef} source={{ uri: uri }} />

    // <ScrollView style={{ paddingBottom: 30 }}>
    //   <View
    //     style={{
    //       flexDirection: "row",
    //       alignItems: "center",
    //       justifyContent: "center",

    //       marginTop: 40,
    //     }}
    //   >
    //     <Text
    //       style={{
    //         width: 100,
    //         height: 30,
    //         backgroundColor: "skyblue",
    //         textAlign: "center",
    //         verticalAlign: "middle",
    //       }}
    //       onPress={() => setToggle(true)}
    //     >
    //       디바이스 스캔
    //     </Text>
    //     <Text
    //       style={{
    //         width: 100,
    //         height: 30,
    //         backgroundColor: "pink",
    //         textAlign: "center",
    //         verticalAlign: "middle",
    //         marginLeft: 20,
    //       }}
    //       onPress={() => setToggle(false)}
    //     >
    //       연결된 디바이스
    //     </Text>
    //   </View>

    //   {toggle ? (
    //     <>
    //       <Button
    //         color="#f194ff"
    //         title="디바이스 스캔 시작"
    //         onPress={() => scanForDevices()}
    //       />

    //       <Button
    //         title="디바이스 스캔 중지"
    //         onPress={() => stopScanForPeripherals()}
    //       />

    //       {allDevices.length >= 1 && (
    //         <>
    //           <Text style={{ fontSize: 18, marginTop: 20 }}>
    //             스캔된 디바이스 리스트
    //           </Text>
    //           <SafeAreaView>
    //             <FlatList
    //               data={allDevices}
    //               renderItem={(item) => (
    //                 <ScanDevice
    //                   deviceId={item.item.id}
    //                   name={item.item.name}
    //                   connectToDevice={connectToDevice}
    //                 />
    //               )}
    //             />
    //           </SafeAreaView>
    //         </>
    //       )}
    //     </>
    //   ) : (
    //     <>
    //       <Text style={{ fontSize: 18, marginTop: 25 }}>연결된 디바이스</Text>
    //       <ConnectedDevice
    //         deviceId={
    //           connectedDevice?.id ? connectedDevice?.id : "연결된 기기 없음"
    //         }
    //         name={
    //           connectedDevice?.name ? connectedDevice?.name : "연결된 기기 없음"
    //         }
    //         disconnectFromDevice={disconnectFromDevice}
    //       />
    //     </>
    //   )}
    // </ScrollView>
  );
}
