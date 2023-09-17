import React from 'react';
import { View, StyleSheet } from 'react-native';
import surveyData from "./surveyData.json"
import SurveyComponent from './demo_dynamic';



const App = () => {
  return (
    <View style={styles.container}>
      <SurveyComponent payload={surveyData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
