import React, { Component } from "react";
import AndroidOpenSettings from 'react-native-android-open-settings'
//import Orientation from 'react-native-orientation';

import {
  Linking,
  Platform,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,Button,
  TextInput
} from "react-native";
import { Constants, Location, Permissions, MapView, ScreenOrientation } from "expo";
import { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { Alert, PermissionsAndroid } from 'react-native';
import Geocoder from 'react-native-geocoding';

export default class MapScreen extends Component {

  state = {
    text: null,
    location: null,
    errorMessage: null,
    loading: true,
    latLng: {
      latitude: null,
      longitude: null
    }
  };

  mapStyle = [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#ebe3cd"
        }
      ]
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#523735"
        }
      ]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#f5f1e6"
        }
      ]
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#c9b2a6"
        }
      ]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#dcd2be"
        }
      ]
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#ae9e90"
        }
      ]
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          color: "#dfd2ae"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#dfd2ae"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#93817c"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#a5b076"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#447530"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#f5f1e6"
        }
      ]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          color: "#fdfcf8"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#f8c967"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#e9bc62"
        }
      ]
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [
        {
          color: "#e98d58"
        }
      ]
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#db8555"
        }
      ]
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#806b63"
        }
      ]
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [
        {
          color: "#dfd2ae"
        }
      ]
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#8f7d77"
        }
      ]
    },
    {
      featureType: "transit.line",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#ebe3cd"
        }
      ]
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          color: "#dfd2ae"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#b9d3c2"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#92998d"
        }
      ]
    }
  ];
  componentDidMount() {
    Geocoder.init("AIzaSyD7JZmztK5wE-80P8t-_IOHZQinVtx4Dio");
  }

  _getLattLong(locationName) {
    console.log("getLatsstLongs called "+locationName);
    Geocoder.from(locationName)
          .then(json => {
              var location = json.results[0].geometry.location;
              console.log("Location :::"+location);
              this.pinPointSearchedLocation(location);
          })
          .catch(error => console.warn(error));
  }

  pinPointSearchedLocation(location) {
    console.log("Pinporint location"+location);
   this.setState({
    latLng: {
      latitude: location.latitude,
      longitude: location.longitude
    }
    });
  }

  componentWillMount() {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);

    if (Platform.OS === "android" && !Constants.isDevice) {
      console.log("Permission denied");

      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }
  }


  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    console.log("Permission Status"+status);

    if (status !== "granted") {
      console.log("12 Permission to access location was denied");

      Alert.alert(
     'Grant Permission',
     'App needs location access.',
     [
       {text: 'Cancel', onPress: () => this.props.navigation.goBack(null) , style: 'cancel'},
       {text: 'OK', onPress: async () => {
         const { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
         if (status === "granted") {
           const locatio = await Expo.Location.watchPositionAsync(
             { enableHighAccuracy: true },
             callback
           );
           return locatio;
         } else {

           if (Platform.OS === 'ios') {
               console.log("ios platfrom");
               const url = 'app-settings:'
               Linking.canOpenURL(url).then(supported => {
                 if (!supported) {
                   console.log('Can\'t handle url: ' + url);
                 } else {
                   return  Linking.openURL(url)
                 }
               }).catch(err => console.error('An error occurred', err));

           }else {
             console.log("Android Permission called");
              AndroidOpenSettings.locationSourceSettings()
           }

         }
       }},
     ],
     { cancelable: false }
   )

      this.setState({
        errorMessage: "Permission to access location was not granted"
      });
    }else if (status === "denied") {
      console.log("Permission to access location was denied");

      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: location });
  };

  render() {
    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    if (this.state.location) {
      return (
        <>
        <View style={{ flex: 1,}}>
              <TextInput
                style={styles.textContainer}
                placeholder = "Enter text here..!"
                onChangeText={(text) => this.setState({text})}
              //  value={this.state.text}

              />
              <View style={styles.buttonContainer}>

                  <Button
                    onPress= { this._getLattLong.bind(this, this.state.text) }
                    title="Search.."
                    color="#841584"
              />
         </View>
          <MapView
            style={{ flex: 1 }}
            customMapStyle={this.mapStyle}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          >
            <Marker
              coordinate={{
                latitude: this.state.location.coords.latitude,
                longitude: this.state.location.coords.longitude
              }}
            />
          </MapView>
          <View
       style={{
           position: 'absolute',//use absolute position to show button on top of the map
           top: '50%', //for center align
           alignSelf: 'flex-end' //for align to right
       }}
   >

   </View>
   </View>

        </>
      );
    } else {
      return <ActivityIndicator size="small" color="#00ff00" />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center"
  },
  buttonContainer: {
      width: 100,
      height: 60,
      marginLeft: 180,
      marginBottom:15,
      alignItems: 'flex-end',
    //   justifyContent: 'center',
       marginRight: 50,
       paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
  },
  textContainer: {
      borderBottomWidth:1.5,
      borderBottomColor: "black",
      width: 200,
      height: 60,
      marginLeft: 15,
      marginBottom:15,
      alignItems: 'flex-start',
      marginRight: 20,
      paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
  },
});