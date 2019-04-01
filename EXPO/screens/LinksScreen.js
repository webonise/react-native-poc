import React from 'react';
import { FlatList, StyleSheet,Text,View,Button } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

 export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

   render() {
    return (
      <FlatList
        data={[{key: 'API Paginated Grid' },{key:'Carousel example'}]}
        renderItem={this._renderItem}
      />
    );
  }

  _renderItem = ({item}) => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <Text>{item.key}</Text>
       <Button
         title="Go to Sample usage"
         onPress={() => this.props.navigation.navigate('Grid')}
       />
     </View>
  );
}

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
