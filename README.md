
프로젝트 스택 및 주요 라이브러리 구성
=============

- expo (version 49) 참고문서 https://docs.expo.dev/
- react-native-ble-plx (version 3.1.2) 참고문서 https://github.com/dotintent/react-native-ble-plx
- react-native-webview (version 13.2.2) 참고문서 https://github.com/react-native-webview/react-native-webview



사용방법
-------------
useBLE.js 파일에 ble 기기의 스캔, 연결, 연결해제 로직들을 구현했습니다.

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


