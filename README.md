
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
디바이스 스캔을 시작하면 allDevices state의 배열 안에 데이터가 순차적으로 들어가게 됩니다.
allDevices state 배열 안에 아래와 같은 객체 형태로 들어가게 됩니다.
<pre>
  {
    id: "C7:58:3D:91:79:7B" //deviceId
    isConnectable: null
    localName: null
    manufacturerData: null
    mtu: 23
    name: "SPD-BLE0890487"
    overflowServiceUUIDs: null
    rssi: null
    serviceData: null
    serviceUUIDs: null
    solicitedServiceUUIDs: null
    txPowerLevel: null
  }
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
allDevices state의 값 중 연결을 원하는 기기의 id 값을 파라미터로 넘기면 해당 ble 기기와 연결이 되며, connectedDevice state 값에 데이터가 들어가게 됩니다.


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
현재 연결된 기기의 id 값을 파라미터로 넘기면 해당 ble 기기의 연결이 해제 됩니다.


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
스캔 시작전 안드로이드 기기 기준 접근 권한 동의 후 스캔 시작됩니다. 유저가 동의를 거절하면 스캔할수 없습니다.
