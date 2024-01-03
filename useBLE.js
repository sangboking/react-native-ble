/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";

import * as ExpoDevice from "expo-device";

function useBLE() {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  // 디바이스 스캔시 중복 제거
  const isDuplicteDevice = (devices, nextDevice) => {
    devices.findIndex((device) => nextDevice.id === device.id) > -1;
  };

  /**
   * 디바이스 스캔 시작
   * 스캔된 디바이스중 device.name값이 존재하는 device를 allDevices 상태에 값 저장
   */
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

  // 앱 접근권한 허용 후 스캔 시작
  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();

    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  //디바이스 스캔 중지
  const stopScanForPeripherals = () => {
    bleManager.stopDeviceScan();
  };

  /**
   * 원하는 device와 연결
   * allDevices 의 값 중 연결 하려는 device의 deviceId 값 을 파라미터로 전달
   * @param {string} deviceId
   */
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

  /**
   * 현재 연결된 device 연결 해제
   * 현재 연결된 device의 deviceId 값 을 파라미터로 전달
   * connectedDevice state에 데이터 들어가 있음
   * @param {string} deviceId
   */
  const disconnectFromDevice = (deviceId) => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(deviceId);
      setConnectedDevice(null);
    }
  };

  return {
    scanForPeripherals,
    stopScanForPeripherals,
    connectToDevice,
    disconnectFromDevice,
    scanForDevices,
    allDevices,
    connectedDevice,
  };
}

export default useBLE;
