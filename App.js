import React from 'react';
import { View } from 'react-native';
import SurveyForm from './survey';
import surveyDat from "./surveyData.json"

const App = () => {
  // Replace this with your actual survey data
  const surveyData = {
    // ... (use the provided payload here)
  };

  return (
    <View>
      <SurveyForm surveyData={surveyDat} />
    </View>
  );
};

export default App;
