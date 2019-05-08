import React, { Component } from "react";
import AndroidOpenSettings from 'react-native-android-open-settings'
import AsyncImageAnimated from 'react-native-async-image-animated'
import {
  Button,
  Linking,
  Platform,
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Alert,
  PermissionsAndroid
} from "react-native";
import { Constants, Location, Permissions, MapView, ScreenOrientation } from "expo";
import { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import Geocoder from 'react-native-geocoding';
import { APIConst } from '../screens/Constants';
import RequestManager from '../screens/RequestManager';
import { createStackNavigator, createDrawerNavigator,createAppContainer,DrawerNavigator } from "react-navigation";

const {width, height} = Dimensions.get('window')

import ParallaxScrollView from 'react-native-parallax-scroll-view';

export default class NearByHotel extends Component {
  static navigationOptions = {
    drawerLabel: 'Near By Me',
    drawerIcon:({tintColor}) => (
      <Image 
        style={{ width: 32, height: 32 }}
        source={{uri: 'https://img.icons8.com/ios/50/000000/3-star-hotel.png'}}
      />
    )
  };

  state = {
    mapRegion: { latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 },
    text: null,
    location: null,
    errorMessage: null,
    loading: true,
    latLng: {
      latitude: null,
      longitude: null
    },
    hotelsList: [],
    latlongArr: [],
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
 
  callNearByPlacesAPI(location) {
   
    const fullURL = APIConst.baseURL+JSON.stringify(location.coords.latitude)+','+JSON.stringify(location.coords.longitude)+APIConst.URNConst.nearByURN+APIConst.apiKey
    console.log("FInal URL- "+fullURL);
    RequestManager.requestGET(fullURL).then(res => res.json()).then(data => {
       
        console.log("API Response :: "+JSON.stringify(data.results));
        this.setState({ 
          location: location,
          hotelsList: data.results,
         });
         //console.log(APIConst.basePhotoURL+data.results[0].photos.photo_reference+APIConst.photoURN+APIConst.apiKey);
      })
      .catch(function(error) {
        console.log(
          "There has been a problem with your fetch operation: " + error
        );
        throw error;
      });
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

    calculateDistanceBetLatAndLong(lat1, lon1, lat2, lon2, unit) {
      if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
      }
      else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist;
      }
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
    console.log("First Location"+JSON.stringify(location));
    this.callNearByPlacesAPI(location);
    this.setState({ location: location });
  };
  _handleMapRegionChange = mapRegion => {
    console.log("Map chnage lat"+this.state.latLng.latitude);
   // this.setState({ mapRegion });
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
        <ParallaxScrollView
          backgroundColor="lightgray"
          contentBackgroundColor="white"
          parallaxHeaderHeight={300}  
          renderForeground={() => (
              <View style={{ height: height - 100, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <MapView
                    style={{ alignSelf: 'stretch', height: height - 100 }}
                    customMapStyle={this.mapStyle}
                     provider={PROVIDER_GOOGLE}
                   // region={this.state.mapRegion}
                    initialRegion={{
                      latitude: this.state.location.coords.latitude,
                      longitude: this.state.location.coords.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421
                    }}
                    onRegionChange={this._handleMapRegionChange}
                  >
                   <Marker
                      coordinate={{
                          latitude: this.state.location.coords.latitude,
                          longitude: this.state.location.coords.longitude
                        }}
                    />
                  </MapView>
              </View>
          )}>
          <View style={{height: 2650 }}>
              {this.state.hotelsList.map(hotelItem => {
                const imgeURL = 'https://maps.googleapis.com/maps/api/place/photo?photoreference='+encodeURIComponent(hotelItem.photos[0].photo_reference)+'&sensor=false&maxheight=100&maxwidth=100&key='+APIConst.apiKey
                console.log("--ImageURL--   "+imgeURL);
                return (
                  <View key={hotelItem.id} style= {{ flex:1,flexDirection: 'row',height: 120, marginBottom: 5,borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,margin: 8}}>
                    <AsyncImageAnimated
                      style={{
                        
                        alignSelf: 'stretch',
                        height: 100,
                        width: 100,
                        resizeMethod: 'contain',
                        resizeMode: 'cover',
                     }}
                      source={{
                        uri: imgeURL
                      }}
                      placeholderSource= {{
                        uri: 'https://img.icons8.com/color/100/000000/4-star-hotel.png'
                      }}
                     
                    />

                    <View key={hotelItem.name} style = {{ flex:1, justifyContent: 'center', marginLeft: 5,backgroundColor: 'white' }}>
                        <Text style={{fontSize: 20}}>{hotelItem.name}</Text>
                        <Text style={{fontSize: 15}}>{hotelItem.vicinity}</Text>
                    </View>
                  </View>
                ) 
              })}
          </View>
       </ParallaxScrollView>
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




/*

TO set photos

https://maps.googleapis.com/maps/api/place/photo?photoreference=CmRaAAAAwGHBaKceaw1AmVgGUJC_FI82VSvn8vVLzSqAxXHfd02_dD6B6PGP1MeC1kP6-qkuTLLRyfZei5yT9SzLXarwzG4dEoe4xJCrEzHCPwbmNPnjL1GLGsMR5aXyGqfqk4EfEhDCeUyQG65TVPloxb35ogQCGhQCVWjyv1jzBO9c3FyJkIRRRlJDuQ&sensor=false&maxheight=100&maxwidth=100&key=AIzaSyD7JZmztK5wE-80P8t-_IOHZQinVtx4Dio

*/