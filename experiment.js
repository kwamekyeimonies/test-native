import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import CheckBoxGroup from 'react-native-checkbox-group';

const ExperimentQuestions = ({ formData }) => {
    const [answers, setAnswers] = useState({});

    const handleInputChange = (questionId, value) => {
        setAnswers({
            ...answers,
            [questionId]: value,
        });
    };

    return (
        <View>
            <Text>{formData?.surveyName}</Text>
            <Text>{formData?.surveyDescription}</Text>

            {formData?.surveyQuestionFields?.map((question) => (
                <View key={question?.id}>
                    <Text>{question?.question_text}</Text>

                    {question?.type === 'radio' && (
                        <View>
                            {question?.options?.map((option) => (
                                <TouchableOpacity
                                    key={option?.id}
                                    onPress={() => handleInputChange(question?.id, option?.value)}
                                >
                                    <Text>{option?.value}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {question?.type === 'shortAnswer' && (
                        <TextInput
                            placeholder="Enter your answer"
                            value={answers[question.id] || ''}
                            onChangeText={(text) => handleInputChange(question?.id, text)}
                        />
                    )}

                    {question?.type === 'selectField' && (
                        <CheckBoxGroup
                            callback={(selected) => handleInputChange(question?.id, selected)}
                            iconColor="#00f"
                            iconSize={30}
                            checkedIcon="ios-checkbox-outline"
                            uncheckedIcon="ios-square-outline"
                            items={question?.options?.map((option) => ({
                                label: option?.value,
                                value: option?.value,
                            })) || []} // Provide an empty array as a fallback
                        />
                    )}
                </View>
            ))}

            <TouchableOpacity onPress={() => console.log(answers)}>
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ExperimentQuestions;
