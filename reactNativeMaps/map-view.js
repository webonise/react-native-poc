import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';

import Mapbox, { MapView } from 'react-native-mapbox-gl';
import _ from 'lodash';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon } from 'native-base';

var deviceData = require('./device-data.json');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  map: {
    flex: 1
  },
  scrollView: {
    flex: 1
  }
});


const accessToken = 'pk.eyJ1IjoidmpuYXRoZSIsImEiOiJjajB3OWo2NDEwMDdrMzNrNzdzM2dsaXBrIn0.Pp1uZif_Dtaa-cXo6UDffg';
Mapbox.setAccessToken(accessToken);

export default class reactNativeMaps extends Component {
  state = {
    center: {
      latitude: 28.4595,
      longitude: 77.0266
    },
    zoom: 10,
    userTrackingMode: Mapbox.userTrackingMode.follow,
    annotations: []
  };

  onRegionDidChange = (location) => {
    this.setState({ currentZoom: location.zoomLevel });
    console.log('onRegionDidChange', location);
  };
  onRegionWillChange = (location) => {
    console.log('onRegionWillChange', location);
  };
  onUpdateUserLocation = (location) => {
    console.log('onUpdateUserLocation', location);
  };
  onOpenAnnotation = (annotation) => {
    console.log('onOpenAnnotation', annotation);
  };
  onRightAnnotationTapped = (e) => {
    console.log('onRightAnnotationTapped', e);
  };
  onLongPress = (location) => {
    console.log('onLongPress', location);
  };
  onTap = (location) => {
    console.log('onTap', location);
  };

  onChangeUserTrackingMode = (userTrackingMode) => {
    this.setState({ userTrackingMode });
  };

  componentDidMount() {
    var allDevices = _.chain(deviceData.result.Location).map((device, key) => {
      device.latitude = Number(this.convertDMSToDD(device.LAT))
      device.longitude = Number(this.convertDMSToDD(device.LONGI))
      if(device.latitude && device.longitude) {
        return this.getPointAnnotation(device)
      }
    }).compact().value();
    this.setState({
      annotations: [ ...this.state.annotations, ...allDevices]
    });
  }
  
  convertDMSToDD(dms) {
    var parts = dms.split(/[°'"]+/).join(' ').split(/[^\w\S]+/);
    var degrees = parts[0], 
        minutes= parts[1], 
        seconds = parts[2], 
        direction = parts[3];
    var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  }
  
  trimNodeOrPort(input) {
    input = input.replace('portID:', '')
    input = input.replace('nodeID:', '')
    return input
  }

  getPointAnnotation(device={}) {
    var deviceNode = _.find(deviceData.result.node, {id: device.nodeID}) || {}
    var nodePorts = _.filter(deviceData.result.port, {nodeID: deviceNode.id})
    return {
      coordinates: [device.latitude, device.longitude],
      type: 'point',
      title: `Name: ${device.NAME} , \n\nNode: ${deviceNode.fieldName} (${this.trimNodeOrPort(deviceNode.id)}) , \n\n Ports: \n ${_.map(nodePorts, (port) => {
        var connectedToPorts = _.filter(deviceData.result.edge, {sourceport: port.id, object: 'Link'})
        return `${port.fieldName} (${this.trimNodeOrPort(port.id)}) --> ${_.map(connectedToPorts, (edge) => {
          var targetPortNode = '';
          let portNode = _.find(deviceData.result.port, {id: edge.targetport})
          if(edge.targetport && portNode) {
            targetPortNode = ` on Node ${portNode.fieldName} (${this.trimNodeOrPort(portNode.nodeID)})`
          }
          return `${portNode.fieldName} (${this.trimNodeOrPort(edge.targetport)})` + targetPortNode
        })}\n`
      }).join('')}` ,
      id: 'foo'+Math.random()
    };
  }

  getPolylineAnnotation(linePoints) {
    var polyline = _.chain(linePoints).map((point) => {
      if(point.latitude && point.longitude) {
        return [point.latitude, point.longitude]
      }
    }).compact().value();
    return {
      coordinates: polyline,
      type: 'polyline',
      strokeColor: '#00FB00',
      strokeWidth: 4,
      strokeAlpha: .5,
      id: `foobar${Math.random()}`
    };
  }

  addNewMarkers = (device) => {
    // Treat annotations as immutable and create a new one instead of using .push()
    this.setState({
      annotations: [ ...this.state.annotations, this.getPointAnnotation(device)]
    });
  };

  resetPath() {
    this.state.annotations = this.state.annotations.filter(a => a.type !== 'polyline');
      this.setState(this.state);
  }

  calculatePath = (type) => {
      this.state.annotations = this.state.annotations.filter(a => a.type !== 'polyline');
      this.setState(this.state);
      var edges = _.filter(deviceData.result.edge, (edgeData) => {
        return edgeData.object === type
      });
      var polylineAnnotation = _.chain(edges).map((edge) => {
        var sourcePortId = edge.sourceport;
        var targetPortId = edge.targetport;
        var sourcePort = _.find(deviceData.result.port, {id: sourcePortId})
        var targetPort = _.find(deviceData.result.port, {id: targetPortId})
        if(!(_.isEmpty(sourcePort) || _.isEmpty(targetPort))) {
          var sourceNode = _.find(deviceData.result.node, {id: sourcePort.nodeID})
          var targetNode = _.find(deviceData.result.node, {id: targetPort.nodeID})
          if(!(_.isEmpty(sourceNode) || _.isEmpty(targetNode))) {
            var sourceLocation = _.find(deviceData.result.Location, {nodeID: sourceNode.id})
            var targetLocation = _.find(deviceData.result.Location, {nodeID: targetNode.id})
            if(!(_.isEmpty(sourceLocation) || _.isEmpty(targetLocation))) {
              sourceLocation.latitude = Number(this.convertDMSToDD(sourceLocation.LAT))
              sourceLocation.longitude = Number(this.convertDMSToDD(sourceLocation.LONGI))
              targetLocation.latitude = Number(this.convertDMSToDD(targetLocation.LAT))
              targetLocation.longitude = Number(this.convertDMSToDD(targetLocation.LONGI))
              return this.getPolylineAnnotation([sourceLocation, targetLocation])
            }
          }
        }
      }).compact().value();
      
      this.setState({
        annotations: [ ...this.state.annotations, ...polylineAnnotation]
      });
  };

  removeMarker = (id) => {
    this.setState({
      annotations: this.state.annotations.filter(a => a.id !== id)
    });
  };

  render() {
    StatusBar.setHidden(true);
    return (
      <Container>
        <View style={styles.container}>
          <MapView
            ref={map => { this._map = map; }}
            style={styles.map}
            initialCenterCoordinate={this.state.center}
            initialZoomLevel={this.state.zoom}
            initialDirection={0}
            rotateEnabled={false}
            scrollEnabled={true}
            zoomEnabled={true}
            styleURL={Mapbox.mapStyles.street}
            annotations={this.state.annotations}
            onChangeUserTrackingMode={this.onChangeUserTrackingMode}
            onRegionDidChange={this.onRegionDidChange}
            onRegionWillChange={this.onRegionWillChange}
            onOpenAnnotation={this.onOpenAnnotation}
            onRightAnnotationTapped={this.onRightAnnotationTapped}
            onUpdateUserLocation={this.onUpdateUserLocation}
            onLongPress={this.onLongPress}
            onTap={this.onTap}
          />
          {this._renderButtons()}
        </View>
      </Container>
    );
  }

  _renderButtons() {
    return (
      <View>
        <Button full large onPress={() => this.calculatePath('Link')}>
          <Text>Plot Path</Text>
        </Button>
        <Button full large onPress={() => this.resetPath()}>
          <Text>Reset</Text>
        </Button>
      </View>
    );
  }
}

