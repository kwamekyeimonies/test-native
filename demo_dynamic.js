import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const SurveyComponent = ({ payload }) => {
    const [answers, setAnswers] = useState({});
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        // Initialize answers object with default values
        const initialAnswers = payload.surveyQuestionFields.reduce((acc, question) => {
            acc[question.name] = question.type === 'checkbox' ? [] : ''; // Initialize as an empty array for checkboxes
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
    };

    const [parentOptionSelected, setParentOptionSelected] = useState(false);


    // const handleParentQuestionChange = (parentQuestionName, answer) => {
    //     setAnswers({
    //         ...answers,
    //         [parentQuestionName]: answer,
    //     });

    //     // Set the flag to true immediately when an option is selected
    //     setParentOptionSelected(true);

    //     // Trigger the function to display child questions with a delay (if needed)
    //     displayChildQuestions(parentQuestionName, answer);
    // };

    const handleParentQuestionChange = (parentQuestionName, answer) => {
        setAnswers({
            ...answers,
            [parentQuestionName]: answer,
        });

        // Always trigger the function to display child questions immediately
        displayChildQuestions(parentQuestionName, answer);
    };

    const displayChildQuestions = (parentQuestionName, parentAnswer) => {
        const updatedQuestions = payload.surveyQuestionFields.map(question => {
            if (!question.skip_logic || question.skip_logic.rules.length === 0) {
                // This is a parent question (no skip logic rules)
                return {
                    ...question,
                    isHidden: false,
                };
            } else {
                // This is a child question (has skip logic rules)
                const skipRule = question.skip_logic.rules[0]; // Assuming a single rule for simplicity

                if (skipRule.antecedent === parentQuestionName) {
                    const comparisonType = skipRule.comparison_type.toLowerCase(); // Convert to lowercase
                    const consequentValue = skipRule.consequent.toLowerCase(); // Convert to lowercase

                    // Check if the answer matches the consequent value
                    const answerMatches = comparisonType === 'equals'
                        ? parentAnswer.toLowerCase() === consequentValue
                        : false; // Add more comparison types as needed

                    // For radio and checkbox child questions, check if any option is selected
                    if (['radio', 'checkbox'].includes(question.type)) {
                        // Check if any option matches the consequent value
                        const optionMatches = question.options.some(option => {
                            return option.value.toLowerCase() === consequentValue && parentAnswer === 'true'; // Use parentAnswer here
                        });

                        // Show or hide based on the rule and optionMatches
                        return {
                            ...question,
                            isHidden: answerMatches || optionMatches,
                        };
                    } else if (question.type === 'selectField') {
                        // Check if this is a child question with a list of options
                        const isChildWithOptions = question.options && question.options.length > 0;

                        // Show or hide based on the rule and whether the parent option is selected,
                        // but do not hide if it's a child with options and the parent option is selected
                        return {
                            ...question,
                            isHidden: isChildWithOptions && !answerMatches,
                        };
                    } else {
                        // For other question types, show/hide based on the rule
                        return {
                            ...question,
                            isHidden: answerMatches,
                        };
                    }
                } else {
                    // Check if the parent question's answer still matches the skip logic conditions
                    const parentQuestion = payload.surveyQuestionFields.find(q => q.name === skipRule.antecedent);
                    if (parentQuestion) {
                        const comparisonType = skipRule.comparison_type.toLowerCase();
                        const consequentValue = skipRule.consequent.toLowerCase();
                        const answerMatches = comparisonType === 'equals'
                            ? answers[parentQuestion.name].toLowerCase() === consequentValue
                            : false; // Add more comparison types as needed

                        // If the parent question's answer doesn't match, hide this child question
                        if (!answerMatches) {
                            return {
                                ...question,
                                isHidden: true,
                            };
                        }
                    }

                    return question;
                }
            }
        });

        setQuestions(updatedQuestions);
    };




    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{payload.surveyName}</Text>
            {questions.map(question => (
                !question.isHidden && (
                    <View key={question.id} style={styles.questionContainer}>
                        <Text style={styles.questionText}>{question.question_text}</Text>
                        {question.type === 'radio' && (
                            <View style={styles.optionsContainer}>
                                {question.options.map(option => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={styles.optionButton}
                                        onPress={() => handleParentQuestionChange(question.name, option.value)}
                                    >
                                        <Text style={styles.optionText}>{option.value}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {question.type === 'shortAnswer' && (
                            <TextInput
                                style={styles.input}
                                placeholder="Your answer"
                                onPress={() => handleParentQuestionChange(question.name, option.value)}
                            />
                        )}
                        {question.type === 'checkbox' && (
                            <View style={styles.optionsContainer}>
                                {question.options.map(option => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={styles.optionButton}
                                        onPress={() => {
                                            // Toggle checkbox value
                                            const newAnswers = { ...answers };
                                            if (!newAnswers[question.name]) {
                                                newAnswers[question.name] = [];
                                            }

                                            const index = newAnswers[question.name].indexOf(option.value);
                                            if (index === -1) {
                                                newAnswers[question.name].push(option.value);
                                            } else {
                                                newAnswers[question.name].splice(index, 1);
                                            }

                                            handleAnswerChange(question.name, newAnswers[question.name]);
                                        }}
                                    >
                                        <Text style={styles.optionText}>{option.value}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                        {question.type === 'selectField' && (
                            <View style={styles.optionsContainer}>
                                {question.options.map(option => (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={styles.optionButton}
                                        onPress={() => handleParentQuestionChange(question.name, option.value)}
                                    >
                                        <Text style={styles.optionText}>{option.value}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    questionContainer: {
        marginBottom: 20,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    optionButton: {
        flex: 1,
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 5,
        marginHorizontal: 8,
        alignItems: 'center',
    },
    optionText: {
        color: '#FFF',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginTop: 8,
    },
});

export default SurveyComponent;
