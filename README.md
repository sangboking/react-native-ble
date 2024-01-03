
프로젝트 스택 및 주요 라이브러리 구성
=============

- expo (version 49) 참고문서 https://docs.expo.dev/
- react-native-ble-plx (version 3.1.2) 참고문서 https://github.com/dotintent/react-native-ble-plx
- react-native-webview (version 13.2.2) 참고문서 https://github.com/react-native-webview/react-native-webview



사용방법
-------------
useBLE.js 파일에 ble 기기의 스캔, 연결, 연결해제 로직들을 구현했습니다.


- ble 라이브러리 호출 및 선언
<pre>
  // useBLE.js
  import { BleManager } from "react-native-ble-plx";

  function useBLE() {
    const bleManager = useMemo(() => new BleManager(), []);
    ...
  }
  export default useBLE;
</pre>
  

- 디바이스 스캔 시작
<pre>
  // useBLE.js
 const scanForPeripherals = () =>
  bleManager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.log(error);
    }
    if (device.name) {
      setAllDevices((prevState) => {
        if (!isDuplicteDevice(prevState, device)) {
          return [...prevState, device];
        }
        return prevState;
      });
    }
  });  
</pre>


- 디바이스 스캔 중지
<pre>
  // useBLE.js
 const stopScanForPeripherals = () => {
    bleManager.stopDeviceScan();
  };  
</pre>


- 디바이스 스캔 중지
<pre>
  // useBLE.js
 const stopScanForPeripherals = () => {
    bleManager.stopDeviceScan();
  };  
</pre>


- 스캔된 디바이스 연결 (디바이스 id 값 지정후 연결)
<pre>
  // useBLE.js
  const connectToDevice = async (deviceId) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(deviceId);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      stopScanForPeripherals();
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };
</pre>


- 디바이스 연결 해제 (디바이스 id 값 지정후 해제)
<pre>
  // useBLE.js
 const disconnectFromDevice = (deviceId) => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(deviceId);
      setConnectedDevice(null);
    }
  };
</pre>


- 앱 접근권한 허용 후 스캔 시작
<pre>
  // useBLE.js
   const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();

    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };
</pre>
