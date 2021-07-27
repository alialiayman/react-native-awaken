import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { START_HOUR, END_HOUR } from "../../constants";
import { Button } from "react-native-paper";

const Settings = ({ navigation }) => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const settingsString = await AsyncStorage.getItem("@settings");
        if (settingsString !== null) {
          setSettings(JSON.parse(settingsString));
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const handleDeleteAllSettings = async () => {
    try {
      const defaultSettings = `{"startHour": ${START_HOUR}, "endHour" : ${END_HOUR}, "excludedContacts" : {} }`;
      await AsyncStorage.setItem("@settings", defaultSettings);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text>{JSON.stringify(settings)}</Text>
      <Button variant="contained" onPress={() => handleDeleteAllSettings()}>
        Delete all settings
      </Button>
    </SafeAreaView>
  );
};

export default Settings;
