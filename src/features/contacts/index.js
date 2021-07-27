import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { Avatar, Card, Caption, Button } from "react-native-paper";
import { Linking } from "react-native";
import moment from "moment-timezone";
import { START_HOUR, END_HOUR } from "../../constants";
import * as Contacts from "expo-contacts";

function ContactsScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [startHour, setStartHour] = useState(START_HOUR);
  const [endHour, setEndHour] = useState(END_HOUR);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          const awakenContacts = data
            .filter(
              (contact) =>
                contact.phoneNumbers && contact.phoneNumbers.length > 0
            )
            .map((contact) => {
              const defaultCountryCode = contact.phoneNumbers[0].countryCode;
              const defaultPhoneNumber = contact.phoneNumbers[0];
              const zones =
                defaultCountryCode &&
                moment.tz.zonesForCountry(defaultCountryCode);
              const zone = zones[Math.floor(zones.length / 2)];
              const localMoment = moment().tz(zones?.[0]);

              if (
                localMoment.isAfter(
                  moment(localMoment).set("hour", START_HOUR).set("minute", 0)
                ) &&
                moment(localMoment).isBefore(
                  moment(localMoment).set("hour", END_HOUR).set("minute", 0)
                )
              ) {
                const localTime = moment().tz(zones?.[0]).format("hh:mm a");
                return {
                  name: contact.name,
                  id: contact.id,
                  phoneNumbers: contact.phoneNumbers,
                  defaultPhoneNumber,
                  zone,
                  localTime: localTime,
                };
              }
            })
            .filter((contact) => contact);
          setContacts(awakenContacts);
        }
      }
    })();
  }, []);

  return (
    <SafeAreaView>
      <Caption style={{ textAlign: "center", padding: 5 }}>{`${
        contacts.length
      } contacts between ${moment(startHour, "HH").format("hh a")}-${moment(
        endHour,
        "HH"
      ).format("hh a")}`}</Caption>
      <ScrollView style={{ padding: 10 }}>
        {contacts?.length > 0 &&
          contacts?.map((contact) => {
            return (
              <Card key={contact.id}>
                <Card.Title
                  title={contact.name}
                  subtitle={`${contact.localTime} ${contact.zone}`}
                />
                <Card.Content>
                  {contact?.phoneNumbers?.map((phoneNumber) => {
                    return (
                      <View
                        key={phoneNumber.id}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingLeft: 30,
                        }}
                      >
                        <Text>{phoneNumber.number}</Text>
                        <Text>{phoneNumber.countryCode}</Text>
                      </View>
                    );
                  })}
                </Card.Content>
                <Card.Actions>
                  <Button
                    color="#665CAC"
                    onPress={() => {
                      try {
                        Linking.openURL(
                          `viber://contact?number=${contact.defaultPhoneNumber.digits}`
                        );
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                  >
                    Viber
                  </Button>
                  <Button
                    color="#25D366"
                    onPress={() => {
                      try {
                        Linking.openURL(
                          `whatsapp://send?phone=${contact.defaultPhoneNumber.digits}`
                        );
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                  >
                    Whatsapp
                  </Button>
                  <Button
                    onPress={() => {
                      try {
                        Linking.openURL(
                          `tel://${contact.defaultPhoneNumber.digits}`
                        );
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                  >
                    Phone
                  </Button>
                  <Button
                    color="#f44336"
                    onPress={() => alert(JSON.stringify(contact))}
                  >
                    Exclude
                  </Button>
                </Card.Actions>
              </Card>
            );
          })}
        {/* <Text>{JSON.stringify(contacts,null,2)}</Text> */}
        <Button
          onPress={() => navigation.navigate("Notifications")}
          title="Notification Screen"
        />
        <Button
          onPress={() => navigation.navigate("Profile")}
          title="Profile Screen"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default ContactsScreen;
