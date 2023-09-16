import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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

        switch (question.type) {
            case 'radio':
                return (
                    <View key={question.id} style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question.question_text}</Text>
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
                );
            case 'shortAnswer':
                return (
                    <View key={question.id} style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question.question_text}</Text>
                        <TextInput
                            placeholder="Your Answer"
                            value={answers[question.id] || ''}
                            onChangeText={(text) => handleAnswerChange(question.id, text)}
                            style={styles.inputField}
                        />
                    </View>
                );
            case 'selectField':
                return (
                    <View key={question.id} style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question.question_text}</Text>
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
                );
            default:
                return null;
        }
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
        padding: 20,
    },
    // ... (other styles remain the same)
});

export default DynamicQuestionnaire;
