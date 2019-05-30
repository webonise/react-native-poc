
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View,TouchableHighlight,
  Picker,AsyncStorage
} from "react-native";

import {Camera, Permissions,ImagePicker } from 'expo';
import { storeDataInAsynch, fetchDataFromAsynch, storeDataInSecureStore, fetchDataFromSecureStore} from '../screens/Constants';

export default class Notifications extends React.Component {
    static navigationOptions = {
      drawerLabel: 'Notifications',
      drawerIcon:({tintColor}) => (
        <Image 
          style={{ width: 32, height: 32 }}
          source={{uri: 'https://img.icons8.com/ios/50/000000/bell.png'}}
        />
      ),
      headerTitle: 'Dismiss',
      headerRight: (
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Cancel"
          color="#fff"
        />
      ), headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };

    state = {
      isImageSet: false,
      cameraImage: this.getImageFromDBOrPlaceHolder() ? this.getImageFromDBOrPlaceHolder() :'https://img.icons8.com/ios/150/000000/user-male-circle.png',
      image: this.getImageFormSecureStorage() ? this.getImageFormSecureStorage() :'https://img.icons8.com/ios/150/000000/user-male-circle.png', //gallary
      isCameraAllowed: false,
      isGallaryAllows: false,
      isCameraOrGallary: false,    
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      isShowPicker: false,
      user:'',

    };
   /* render() {
      const { hasCameraPermission } = this.state;
      if (hasCameraPermission === null) {
        return <View />;
      } else if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
      } else {
        return (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={this.state.type}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({
                      type: this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                    });
                  }}>
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                    {' '}Flip{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            </Camera>
          </View>
        );
      }
    } */
  
    render() {
      let { image } = this.state;
      let { cameraImage } = this.state;

      if (this.state.isCameraAllowed === true ) {
        return (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} ref={ref => { this.camera = ref; }} type={this.state.type}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({
                      type: this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                    });
                  }}>
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                    {' '}Flip{' '}
                  </Text>
                </TouchableOpacity>
              </View>
            </Camera>
            <View style = {{  flexDirection: 'row', height: 100, padding: 20,  justifyContent: 'space-between'}}> 
                <TouchableOpacity
                    onPress={this.takePicture.bind(this)} >
                    <Text style = {styles.baseText} >Take photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.didSelectCancel.bind(this)} >
                    <Text style = {styles.baseText} >Cancel</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    onPress={this.didSelectRetake.bind(this)} >
                    <Text>Retake</Text>
                </TouchableOpacity> */}
            </View>

          </View>
        );
      }else if (this.state.isShowPicker == true) {
        return (
          <View>
             <Picker selectedValue = {this.state.user} onValueChange = {this.callCameraOrGallary}>
                <Picker.Item label = "Click here to set picture." value = "NoPic" />
                <Picker.Item label = "click from Camera" value = "cameraSelected" />
                <Picker.Item label = "select from  Gallary or Photos" value = "gallarySelected" />
             </Picker>
             <Text style = {styles.text}>{this.state.user}</Text>
          </View>
       )
      }else {
      
        return (
            <View style = {styles.container} >
                        <Button 
                          onPress={() => this.props.navigation.goBack()}
                          title="Go back home"
                        />
                        <Image source={{ uri: this.state.cameraImage }} style={{top:30, width: 90, height: 90,borderRadius: 90/2, }} />
                            <Text numberOfLines={1} style = {styles.text}>
                                {'fetched from AsyncStorage '}
                            </Text>
                        <Image source={{ uri: this.state.image }} style={{left:5 ,top:30, width: 90, height: 90,borderRadius: 90/2, }} />
                           <Text numberOfLines={1} style = {styles.text}>
                                {'fetched from Secure store'}
                            </Text>
                        <TouchableHighlight 
                            style ={{
                                height: 40,
                                width:220,
                                borderRadius:10,
                             //   backgroundColor : "yellow",
                                marginLeft :20,
                                marginRight:20,
                                marginTop :75
                        }}>
                          <Button 
                          title="Click here to  set Image."
                          onPress = { this.callGallarOrCameraFUnc.bind(this)}
                          />
                       </TouchableHighlight>        
                      
             </View>
                 
         );
      }
      
     // }
      
    }  
      callGallarOrCameraFUnc() {
        this.setState({
            isCameraAllowed:false,
            isShowPicker : true
        }) 
          
      }

      /********* Asynch DB Fetch ************/

      setImageFromAsynch() {

          fetchDataFromAsynch('profileImage').then( (profile) => {

            console.log('Fetched URL'+profile);
            this.setState({ image: profile,cameraImage: profile,isCameraAllowed: false,isShowPicker:false  });

          }).catch((error) => {
            console.log('EXception URL'+error); 
          })
      }

      getImageFromDBOrPlaceHolder() {

        var isAvilable = false
        fetchDataFromAsynch('profileImage').then( (profile) => {
         
          if (profile !== null) {
            isAvilable = true
            console.log('Fetched URL'+profile);
            this.setState({ cameraImage: profile,isCameraAllowed: false,isShowPicker:false  });
          }
        }).catch((error) => {
          console.log('EXception URL'+error); 
        })

        return isAvilable
        
      }

      getImageFormSecureStorage() {
        var isGallaryAvilable = false

         fetchDataFromSecureStore('ProfilePic').then( (profileImage) => {

          if (profileImage !== null) {
          
            console.log('Seure URL- '+profileImage);
            this.setState({ image: profileImage, isCameraAllowed: false,isShowPicker:false  });
            isGallaryAvilable = true
          }
    
        }).catch((error) => {
          console.log('EXception SeureStore'+error); 
        })  
        return isGallaryAvilable
        
      }
       

     /********* SecureStore DB Fetch ************/

      setImageFromSecureStore() {

        fetchDataFromSecureStore('ProfilePic').then( (profileImage) => {
          this.setState({ image: profileImage,cameraImage: profileImage,isCameraAllowed: false,isShowPicker:false  });
        }).catch((error) => {
          console.log('EXception SeureStore'+error); 
        })
      }

    callCameraOrGallary = (selectedOption) => {
        console.log('SelectedOPtion'+selectedOption);
        this.setState({
          isCameraAllowed:false,
          isShowPicker : false
        })
        if (selectedOption === 'cameraSelected') {
            this._pickCamera();
        }else if (selectedOption === 'gallarySelected') {
            this._pickImage();
        }else {
            this.setState({isCameraAllowed: false,isShowPicker : false });
        }
   }

    _pickImage = async () => {
      
      const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (permission.status !== 'granted') {
          const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (newPermission.status === 'granted') {
            this.callPickerView();
          }
      } else {
          this.callPickerView();
      }

    };

    callPickerView = async () =>  {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      console.log(result);
      if (!result.cancelled) {
       // storeDataInAsynch('profileImage',result.uri);
        storeDataInSecureStore('ProfilePic',result.uri);
      //  this.setState({ image: result.uri,cameraImage: result.uri });
        this.setState({ image: result.uri, isCameraAllowed: false,isShowPicker:false  });

      }
    }

    _pickCamera = async () => {

      const permission = await Permissions.getAsync(Permissions.CAMERA);
      if (permission.status !== 'granted') {
          const newPermission = await Permissions.askAsync(Permissions.CAMERA);
          if (newPermission.status === 'granted') {
            this.setState({ isCameraAllowed: true });
          }
      } else {
          this.setState({  isCameraAllowed: true });
      } 
    }

    takePicture = () => {
      if (this.camera) {
        this.camera.takePictureAsync({ skipProcessing: true }).then((data) => {
          this.onPictureSaved(data);
        });
      }
    }
    didSelectCancel = () => {
     // this.setState({ image: null,cameraImage: null,isCameraAllowed: false  });
     this.setState({ isCameraAllowed: false,isShowPicker:false  });

    }

    didSelectRetake = () => {
      this.setState({ image: null,cameraImage: null,isCameraAllowed: true,isShowPicker:false  });
    }
  
    onPictureSaved = async photo => {
        console.log('Photo click called'+JSON.stringify(photo))
        storeDataInAsynch('profileImage',photo.uri);
       // storeDataInSecureStore('ProfilePic',photo.uri);
       // this.setState({ image: photo.uri,cameraImage: photo.uri,isCameraAllowed: false,isShowPicker:false  });
        this.setState({ cameraImage: photo.uri,isCameraAllowed: false,isShowPicker:false  });

    }
  
  }


  const styles = StyleSheet.create({
    baseText: {
     // justifyContent:'center',
      fontSize: 16,
      width: 120, 
      height: 35,
      backgroundColor: 'white',
      borderRadius:30/2,
    //  alignItems: 'center',
      fontWeight: 'bold',
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
    },text: {
      fontSize: 16,
      alignSelf: 'center',
      fontWeight: 'bold',
     // color: 'red'
   },buttonStyle: {
     width:100,
     height:45,
     paddingTop:30
     //backgroundColor: '#F1C167',
    //  marginTop: 30,
    //  marginBottom: 30
   },container: {
        flex:1,
      flexDirection: 'column',
     justifyContent: 'space-around',
     // alignSelf: 'center',
     alignItems: 'center',
     // marginTop: 30,

   }

  });