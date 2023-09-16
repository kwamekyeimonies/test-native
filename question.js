import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const Questionnaire = ({ questions }) => {
    const [answers, setAnswers] = useState({});

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSubmit = () => {
        // Handle submission of answers (e.g., send them to a server)
        console.log('Submitted Answers:', answers);
    };

    return (
        <View>
            {questions.map((question) => (
                <View key={question.id}>
                    <Text>{question.text}</Text>
                    <TextInput
                        placeholder="Your Answer"
                        value={answers[question.id] || ''}
                        onChangeText={(text) => handleAnswerChange(question.id, text)}
                    />
                </View>
            ))}
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};

export default Questionnaire;
