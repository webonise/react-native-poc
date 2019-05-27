
import React, { Component } from "react";
import AsyncImageAnimated from 'react-native-async-image-animated';
import AndroidOpenSettings from 'react-native-android-open-settings'
//import GPSState from 'react-native-gps-state'

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
import { Constants, Location,  MapView, ScreenOrientation,IntentLauncherAndroid,IntentLauncher,Permissions } from "expo";
import { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import Geocoder from 'react-native-geocoding';
import { APIConst } from '../screens/Constants';
import RequestManager from '../screens/RequestManager';
import { createStackNavigator, createDrawerNavigator,createAppContainer,DrawerNavigator } from "react-navigation";
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import LinksScreen from "../screens/LinksScreen";
import Notifications from "../screens/Notifications";
//import Permissions from 'react-native-permissions'

//import GPSState from 'react-native-gps-state'
//import NearByHotel from "../screens/NearByHotel"
const {width, height} = Dimensions.get('window');


class HomeScreen extends Component {
    static navigationOptions = {
      drawerLabel: 'Near by me',
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
      permisionsStatus: false
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
     // this.gpsONOffCheck();
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

    callPermissionsFunc = async () =>  {
      console.log("1");
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.log('LOCATION Not Granted');
        this.setState({
          errorMessage: 'Permission to access location was denied',
          permisionsStatus:false
        });
        return
      }
        console.log('LOCATION called');
        let isLocationEnabled =  Location.hasServicesEnabledAsync()
       console.log("isLocationEnabled"+JSON.stringify(isLocationEnabled));
       if (!isLocationEnabled) {
          this.setState({
            errorMessage: 'Permission to access location was denied',
            permisionsStatus:false
          });
          alert('Location is disbled');  

         return 
       }
       let locations = await Location.getCurrentPositionAsync({});

      console.log('LOCATION Data'+JSON.stringify(locations));
      this.setState({
        location: locations,
        permisionsStatus:true
      });
    }
    
    callUserPermission  = async () => {
      const { Permissions } = Expo;
      const { status } = await Permissions.getAsync(Permissions.LOCATION);
      console.log('Permissions 12123'+status);

      if (status !== 'granted') {
        const { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
                 console.log("Status: "+status);
        console.log('expo permission'+status);

       if (status === 'granted') {
          let gps = await Location.getProviderStatusAsync();
          console.log('Accepted');
          if (Platform.OS == 'ios') {
            this._callLocatioWithAPI()
          }else {
            if (gps.gpsAvailable ===  true) {
              console.log('GPS _callLocatioWithAPI'); 
              this._callLocatioWithAPI()
            
            }else {
              this.setState({
                errorMessage: 'Permission to access location was denied',
                permisionsStatus:false 
              });
                console.log('Not accepted');
            }
          }
          
       }else {
          console.log('NOt granted');
          this.setState({
            permisionsStatus:false
          });

          Permissions.request(permission, options)
          .then(res => {
            this.setState({
              status: { ...this.state.status, [permission]: res },
            })
            if (res != 'authorized') {
              var buttons = [{ text: 'Cancel', style: 'cancel' }]
              if (this.state.canOpenSettings)
                buttons.push({
                  text: 'Open Settings',
                  onPress: this._openSettings,
                })
    
              Alert.alert(
                'Whoops!',
                'There was a problem getting your permission. Please enable it from settings.',
                buttons,
              )
            }
          })
          .catch(e => console.warn(e))
 
       }

      }else {
            
        let gps = await Location.getProviderStatusAsync();
        if (Platform.OS === 'ios') {
          this._callLocatioWithAPI()
        }else {
          if (gps.gpsAvailable ===  true) {
            console.log('gpsAvauabe');
            this._callLocatioWithAPI()
          }else {
             alert('Hey! Enable locations from setting.');
          }
        }
      
           
      }
    }
  
  componentWillMount() {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
    if (Platform.OS === "android" && !Constants.isDevice) {
      console.log("componentWillMount Permission denied");
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync()
     // this.callUserPermission();
    // this.androidIOSPermssions();
    } 
    
  }
   
    _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      console.log("Permission Status"+status);
  
       if (status !== "granted") {
  
         Alert.alert(
       'Grant Permission',
       'App needs location access.',
       [
         {text: 'Cancel', onPress: () => this.props.navigation.goBack(null) , style: 'cancel'},
         {text: 'OK', onPress: async () => {
           const { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
           console.log("STATUS ALERT"+status);
           if (status === "granted") {
            //  const locatio = await Expo.Location.watchPositionAsync(
            //    { enableHighAccuracy: true },
            //    callback
            //  );
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            console.log("Permission Status expo1"+status);
            if (status === "granted") {
              this._callLocatioWithAPI();
              console.log("Granted location- "+JSON.stringify(locatio));
              this.setState({ permisionsStatus: true });
            }else {
              this.setState({ permisionsStatus: false });
            }
           
           //  return locatio;
           } else {
            let { status } = await Permissions.askAsync(Permissions.LOCATION);
            console.log("Permission Status expo1"+status);
            if (status === "granted") {
              this._callLocatioWithAPI();
              console.log("Granted location- "+JSON.stringify(locatio));
              this.setState({ permisionsStatus: true });
            }else {
             // this.setState({ permisionsStatus: false });
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
         // permisionsStatus:false
        });
      }
      console.log("locatiobn ");
      let location = await Location.getCurrentPositionAsync({});
      console.log("First Location"+JSON.stringify(location));
      this.callNearByPlacesAPI(location);
      this.setState({ location: location });
    };
 
  calllNotGrantedAlert() {
    Alert.alert('Enable location','Please enable location from settings',[{text: 'Cancel', onPress: () => {
      this.setState({ 
        permisionsStatus:false
      });
    } , style: 'cancel'},
          {text: 'OK', onPress: async () => {
              if (Platform.OS === 'ios') {
                  const url = 'app-settings:'
                  Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                      console.log('Can\'t handle url: ' + url);
                    } else {
                      return  Linking.openURL(url)
                    }
                  }).catch(err => console.error('An error occurred', err));

                }else {
                  AndroidOpenSettings.locationSourceSettings()
                 // IntentLauncher.startActivityAsync(IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS);
                }
          }},
        ],{ cancelable: false })

        _callLocatioWithAPI()
  }
  


  _callLocatioWithAPI = async () => {
    console.log("_callLocatioWithAPI called");
   let location=   await Location.getCurrentPositionAsync({});
    //await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    console.log("MyLocation: "+JSON.stringify(location));
    this.callNearByPlacesAPI(location);
    this.setState({ location: location, permisionsStatus:true });
  }

  callGPSLocationSettings() {
    Alert.alert(
      'Enable Location',
      'Please enable location.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => {
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
                 /*IntentLauncherAndroid.startActivityAsync(
                  IntentLauncherAndroid.ACTION_LOCATION_SOURCE_SETTINGS,
                  {},
                  'package:' + Constants.manifest.android.package
                 )*/
                Permissions.canOpenSettings().then(() => alert('back to app!!'))
               }
        }},
      ],
      {cancelable: false},
    );

      
  }


  // _getLocationAsync = async () => {
  //     let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //     console.log("Permission Status"+status);
  //     if (status === "granted") {
  //         let location = await Location.getCurrentPositionAsync({});
  //         console.log("First Location"+JSON.stringify(location));
        
  //         this.callNearByPlacesAPI(location);
  //         this.setState({ 
  //           location: location,
  //           permisionsStatus:true
  //         });
       
  //     }else {
        
  //       this.setState({ 
  //         permisionsStatus: false,
  //         location: null,
  //       });
  //       console.log("permission false"+this.state.location);
  //     }

  //  if (status !== "granted") {
  //     console.log("12 Permission to access location was denied");
  //     Alert.alert(
  //             'Grant Permission',
  //             'App needs location access.',
  //     [
  //       {text: 'Cancel', onPress: () => {
  //         this.setState({
  //           permisionsStatus : false
  //       });
  //       } , style: 'cancel'},
  //       {text: 'OK', onPress: async () => {
  //         const { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
  //         console.log("Status: "+status);
  //         if (status === "granted") {
  //           console.log("_getLocationAsync granted");
  //           this.setState({
  //               permisionsStatus : true
  //           });
          
  //           const locatio = await Expo.Location.watchPositionAsync(
  //             { enableHighAccuracy: true },
  //             callback
  //           );

  //           this.callNearByPlacesAPI(locatio);
  //           this.setState({ 
  //             location: locatio,
  //             permisionsStatus:true
  //           });
  //           return locatio;
  //         } else {
  //           console.log("_getLocationAsync granted else");
  //           if (Platform.OS === 'ios') {
  //               console.log("ios platfrom");
  //               const url = 'app-settings:'
  //               Linking.canOpenURL(url).then(supported => {
  //                 if (!supported) {
  //                   console.log('Can\'t handle url: ' + url);
  //                 } else {
  //                   return  Linking.openURL(url)
  //                 }
  //               }).catch(err => console.error('An error occurred', err));

  //           }else {
  //             console.log("Android Permission called");
  //              // AndroidOpenSettings.locationSourceSettings()
  //               IntentLauncherAndroid.startActivityAsync(
  //                 IntentLauncherAndroid.ACTION_APPLICATION_DETAILS_SETTINGS,
  //                 {},
  //                 'package:' + Constants.manifest.android.package
  //               )
  //           }

  //         }
  //       }},
  //     ],
  //    { cancelable: false }
  //  )

  //   }
   
  // };

  _handleMapRegionChange = mapRegion => {
    console.log("Map chnage lat"+this.state.latLng.latitude);
   // this.setState({ mapRegion });
  };
 
  callSettingsUI() {

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
          
            IntentLauncherAndroid.startActivityAsync(
            IntentLauncherAndroid.ACTION_APPLICATION_DETAILS_SETTINGS,
            {},
            'package:' + Constants.manifest.android.package
          )
        // AndroidOpenSettings.locationSourceSettings()

            
        }
  }

  callPermissionAlert() {
    Alert.alert('Grant Permission',
      'App needs location access.',
      [
        {text: 'Cancel', onPress: () => {
          console.log("Cancel tapped");
          this.setState({ 
            permisionsStatus: false
          });

        } , style: 'cancel'},
        {text: 'OK', onPress: async () => {
          console.log("OK pressed");
          const { status } = await Expo.Permissions.askAsync(Expo.Permissions.LOCATION);
            console.log("OK allowed"+status);
            if (status === "granted") {
              console.log("12vbOK allowed"+status);

              const locatio = await Expo.Location.watchPositionAsync(
                { enableHighAccuracy: true },
                callback
              );
              return locatio;
            } else {
              console.log("callPermissionAlert else");
                this.callPermissionAlert();

            }  
        }},
      ],
      { cancelable: false }
    )
  }

  render() {
    let text = "Waiting..";

    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    console.log("Render: "+this.state.permisionsStatus);
    if (this.state.location ) {
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
          <View style={{height: 2900 }}>
              {this.state.hotelsList.map(hotelItem => {
                const distanceValue = this.calculateDistanceBetLatAndLong(this.state.location.coords.latitude,this.state.location.coords.longitude,hotelItem.geometry.location.lat,hotelItem.geometry.location.lng,'KM')
                const distanceMtr = parseFloat(distanceValue.toPrecision(2));
                const imgeURL = 'https://maps.googleapis.com/maps/api/place/photo?photoreference='+encodeURIComponent(hotelItem.photos[0].photo_reference)+'&sensor=false&maxheight=100&maxwidth=100&key='+APIConst.apiKey
                return (
                  <View key={hotelItem.id} style= {{ flex:1,flexDirection: 'row',height: 120, marginBottom: 5,borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,margin: 8}}>
                    <AsyncImageAnimated
                      style={{
                        
                        alignSelf: 'stretch',
                        height: 80,
                        width: 80,
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
                        <Text style={{fontSize: 16}}>{hotelItem.name}</Text>
                        <Text style={{fontSize: 13}}>{hotelItem.vicinity}</Text>
                    </View>
                    <View style={{ flexDirection: 'column',justifyContent: 'flex-start',  marginRight: 5,backgroundColor: 'white'}}>
                        <Text style={{textAlign: 'right',fontSize: 11}} >Distance: {distanceMtr}km </Text>
                   </View>
                  </View>
                ) 
              })}
          </View>
        
       </ParallaxScrollView>
       
      );
    }else if (this.state.permisionsStatus === false) {
      return (
        <Button
          onPress={() => {
            this.callSettingsUI();
          }}
          title="Allow location permission."
        />
      );
    } else  {
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


 class HeaderNavigationBar extends React.Component {
  render() {
      return (<View style={{
          height: 70,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
      }}>
          <TouchableHighlight style={{ marginLeft: 10, marginTop: 15 }}
              onPress={() => { this.props.navigation.openDrawer() }}>
              <Image
                  style={{ width: 32, height: 32 }}
                  source={{uri: 'https://png.icons8.com/ios/2x/menu-filled.png'}}
              />
          </TouchableHighlight>
      </View>);
  }
}

export default createAppContainer(createDrawerNavigator({
  Home: {
    screen: HomeScreen,
  },
  Notificatin: {
    screen: Notifications,
  }/*,
  Links: {
    screen: LinksScreen,
  } ,NearByHotel: {
    screen: NearByHotel,
  }*/
},{
  initialRouteName:'Home'
}));



