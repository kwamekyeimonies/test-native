import React from 'react';
import { View, StyleSheet } from 'react-native';
import DynamicForm from './DynamicForm';

const questions = [
  {
    question: 'Question 1',
  },
  {
    question: 'Question 2',
  },
  {
    question: 'Question 3',
  },
  // Add more questions here
];

const App = () => {
  return (
    <View style={styles.container}>
      <DynamicForm questions={questions} />
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
