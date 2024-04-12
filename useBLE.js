/* eslint-disable no-bitwise */
import { useMemo, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";
import base64 from "react-native-base64";

import * as ExpoDevice from "expo-device";

function useBLE() {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState({
    type: "allDevices",
    data: [],
  });
  const [connectedDevice, setConnectedDevice] = useState({
    type: "connectedDevice",
    data: [],
  });

  const [heartRate, setHeartRate] = useState({
    type: "heartRate",
    data: 0,
  });

  const UUID = "0000180d-0000-1000-8000-00805f9b34fb";
  const CHARACTER = "00002a37-0000-1000-8000-00805f9b34fb";

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

  /**
   * 디바이스 스캔 시작
   * 스캔된 디바이스중 device.name값이 존재하는 device를 allDevices 상태에 값 저장
   */
  const scanForPeripherals = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device.name) {
        setAllDevices((prevState) => ({
          ...prevState,
          data: [...prevState.data, device],
        }));
      }
    });
  };

  // 앱 접근권한 허용 후 스캔 시작
  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();

    if (isPermissionsEnabled) {
      scanForPeripherals();
      console.log("start");
    }
  };

  //디바이스 스캔 중지
  const stopScanForPeripherals = () => {
    bleManager.stopDeviceScan();
    console.log("stop");
  };

  /**
   * 원하는 device와 연결
   * allDevices 의 값 중 연결 하려는 device의 deviceId 값 을 파라미터로 전달
   * @param {string} deviceId
   */
  const connectToDevice = async (data) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(data.data.id);
      stopScanForPeripherals();
      await deviceConnection.discoverAllServicesAndCharacteristics();
      setConnectedDevice((prevState) => ({
        ...prevState,
        data: [...prevState.data, deviceConnection],
      }));

      deviceConnection.monitorCharacteristicForService(
        "0000180d-0000-1000-8000-00805f9b34fb",
        "00002a37-0000-1000-8000-00805f9b34fb",
        (error, character) => {
          if (error) console.log(error);

          if (character) {
            const rawData = base64.decode(character.value);
            const firstBitValue = Number(rawData) & 0x01;
            let HEART_RATE = -1;

            if (firstBitValue === 0) {
              HEART_RATE = rawData.charCodeAt(1);
            }
            // 16비트 데이터 형식인 경우
            else {
              HEART_RATE = (rawData.charCodeAt(1) << 8) + rawData.charCodeAt(2);
            }

            setHeartRate((prevState) => ({
              ...prevState,
              data: HEART_RATE,
            }));
          }
        }
      );

      // const findServiceUUID = await deviceConnection.services();

      // findServiceUUID.forEach((el) => {
      //   deviceConnection.characteristicsForService(el.uuid).then((x) => {
      //     x.forEach((y) => {

      //     });
      //   });
      // });

      // const findCharacteristicUUID =
      //   await deviceConnection.characteristicsForService(UUID);

      // findCharacteristicUUID.forEach((el) => {
      //   deviceConnection
      //     .readCharacteristicForService(el.serviceUUID, el.uuid)
      //     .then((x) => {
      //       console.log(x);
      //       // deviceConnection.monitorCharacteristicForService(
      //       //   x.serviceUUID,
      //       //   x.uuid,
      //       //   (error, cha) => {
      //       //     if (error) console.log(error);

      //       //     console.log(cha);
      //       //   }
      //       // );
      //     });
      // });
      // streaming(deviceConnection);
    } catch (e) {
      console.log("FAILED TO CONNECT", e);
    }
  };

  const streaming = (deviceConnection) => {
    deviceConnection.monitorCharacteristicForService(
      UUID,
      CHARACTER,
      (error, cha) => {
        if (error) {
          console.log(error);
        }

        console.log(cha);
      }
    );
  };

  /**
   * 현재 연결된 device 연결 해제
   * 현재 연결된 device의 deviceId 값 을 파라미터로 전달
   * 연결된 기기는 connectedDevice state에 데이터 들어가 있음
   * 연결 해제 후 connectedDevice state는 초기화
   * @param {string} deviceId
   */
  const disconnectFromDevice = async (deviceId) => {
    if (connectedDevice) {
      await bleManager.cancelDeviceConnection(deviceId);

      const index = connectedDevice.data.findIndex((el) => el.id === deviceId);
      const tempArr = [...connectedDevice.data];
      tempArr.splice(index, 1);
      setConnectedDevice((prevState) => ({
        ...prevState,
        data: tempArr,
      }));
      setHeartRate((prevState) => ({
        ...prevState,
        data: 0,
      }));
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
    heartRate,
  };
}

export default useBLE;

