import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const SurveyComponent = ({ payload }) => {
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        // Initialize answers object with default values
        const initialAnswers = payload.surveyQuestionFields.reduce((acc, question) => {
            acc[question.name] = ''; // Set default answer as empty string
            return acc;
        }, {});

        setAnswers(initialAnswers);

        // Initially, only show questions without skip_logic rules
        const initialQuestions = payload.surveyQuestionFields.filter(
            question => !question.skip_logic || question.skip_logic.rules.length === 0
        );
        setQuestions(initialQuestions);
    }, [payload]);

    const handleAnswerChange = (questionName, answer) => {
        setAnswers({
            ...answers,
            [questionName]: answer,
        });

        // Trigger the function to display child questions
        displayChildQuestions(questionName, answer);
    };

    const displayChildQuestions = (parentQuestionName, parentAnswer) => {
        const updatedQuestions = payload.surveyQuestionFields.map(question => {
            if (!question.skip_logic || question.skip_logic.rules.length === 0) {
                // Show questions without skip logic or with empty rules
                return {
                    ...question,
                    isHidden: false,
                };
            } else {
                const skipRule = question.skip_logic.rules[0]; // Assuming a single rule for simplicity

                if (skipRule.antecedent === parentQuestionName) {
                    const comparisonType = skipRule.comparison_type.toLowerCase(); // Convert to lowercase
                    const consequentValue = skipRule.consequent.toLowerCase(); // Convert to lowercase

                    switch (comparisonType) {
                        case 'equals':
                            return parentAnswer.toLowerCase() === consequentValue
                                ? {
                                    ...question,
                                    isHidden: true,
                                }
                                : {
                                    ...question,
                                    isHidden: false,
                                };
                        // Add more comparison types as needed
                        default:
                            return {
                                ...question,
                                isHidden: true,
                            };
                    }
                } else {
                    return question;
                }
            }
        });

        setQuestions(updatedQuestions);
    };

    return (
        <View>
            <Text>{payload.surveyName}</Text>
            {questions.map(question => (
                !question.isHidden && (
                    <View key={question.id}>
                        <Text>{question.question_text}</Text>
                        {question.type === 'radio' && (
                            <View>
                                {question.options.map(option => (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => handleAnswerChange(question.name, option.value)}
                                    >
                                        <Text>{option.value}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {question.type === 'shortAnswer' && (
                            <TextInput
                                placeholder="Your answer"
                                onChangeText={text => handleAnswerChange(question.name, text)}
                            />
                        )}
                        {question.type === 'selectField' && (
                            <View>
                                {question.options.map(option => (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => handleAnswerChange(question.name, option.value)}
                                    >
                                        <Text>{option.value}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )
            ))}
        </View>
    );
};

export default SurveyComponent;
