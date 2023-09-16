import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DynamicQuestionnaire = ({ payload }) => {
    const [answers, setAnswers] = useState({});
    const [questionVisibility, setQuestionVisibility] = useState({});

    useEffect(() => {
        // Initialize question visibility based on skip logic when the page mounts
        const initialVisibility = {};

        payload.surveyQuestionFields.forEach((question) => {
            if (question.skipLogic && question.skipLogic.rules.length > 0) {
                // Check skip logic rules
                const isVisible = evaluateSkipLogic(question.skipLogic.rules, answers);
                initialVisibility[question.id] = isVisible;
            } else {
                // No skip logic, so question is visible by default
                initialVisibility[question.id] = true;
            }
        });

        setQuestionVisibility(initialVisibility);
    }, [payload, answers]);

    const evaluateSkipLogic = (rules, answers) => {
        for (const rule of rules) {
            const antecedentValue = answers[rule.antecedent];

            switch (rule.comparison_type) {
                case 'equals':
                    if (antecedentValue === rule.consequent) {
                        return false; // Hide the question
                    }
                    break;
                // Add more comparison types as needed
                default:
                    break;
            }
        }
        return true; // Show the question
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleSelectFieldAnswer = (questionId, selectedValue) => {
        // Check if the questionId is already in the answers state
        const existingAnswers = answers[questionId] || [];

        // If the selectedValue is already in the answers, remove it; otherwise, add it
        const updatedAnswers = existingAnswers.includes(selectedValue)
            ? existingAnswers.filter((value) => value !== selectedValue)
            : [...existingAnswers, selectedValue];

        // Update the answers state with the updated answers
        setAnswers({
            ...answers,
            [questionId]: updatedAnswers,
        });
    };

    const renderQuestion = (question) => {
        // Check if the question should be visible based on skip logic
        const isVisible = questionVisibility[question.id];

        if (!isVisible) {
            return null; // Skip rendering
        }

        return (
            <View key={question.id} style={styles.questionContainer}>
                <Text style={styles.questionText}>{question.question_text}</Text>
                {question.type === 'radio' && (
                    <View>
                        {question.options.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => handleAnswerChange(question.id, option.value)}
                                style={styles.radioButton}
                            >
                                <View style={styles.radioCircle}>
                                    {answers[question.id] === option.value && (
                                        <Icon name="checkmark-circle" size={20} color="blue" />
                                    )}
                                </View>
                                <Text style={styles.optionText}>{option.value}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {question.type === 'shortAnswer' && (
                    <TextInput
                        placeholder="Your Answer"
                        value={answers[question.id] || ''}
                        onChangeText={(text) => handleAnswerChange(question.id, text)}
                        style={styles.inputField}
                    />
                )}
                {question.type === 'selectField' && (
                    <View>
                        {question.options.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => handleSelectFieldAnswer(question.id, option.value)}
                                style={styles.checkboxContainer}
                            >
                                <View style={styles.checkbox}>
                                    {answers[question.id] && answers[question.id].includes(option.value) && (
                                        <Icon name="checkmark-circle" size={20} color="blue" />
                                    )}
                                </View>
                                <Text style={styles.optionText}>{option.value}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    const handleSubmit = () => {
        console.log('Submitted Answers:', answers);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {payload.surveyQuestionFields.map((question) => renderQuestion(question))}
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    questionContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    questionText: {
        fontSize: 18,
        marginBottom: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'blue',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        fontSize: 16,
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'blue',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default DynamicQuestionnaire;
