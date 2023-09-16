import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { RadioButton, TextInput, Checkbox, Button } from 'react-native-paper';

const SurveyForm = ({ surveyData }) => {
    const [responses, setResponses] = useState({});
    const [visibleQuestions, setVisibleQuestions] = useState([]);

    const handleRadioChange = (questionId, value) => {
        setResponses({ ...responses, [questionId]: value });
    };

    const handleTextChange = (questionId, text) => {
        setResponses({ ...responses, [questionId]: text });
    };

    useEffect(() => {
        // Initialize visibleQuestions array without questions having empty skipLogic rules
        const initialVisibleQuestions = surveyData.surveyQuestionFields.filter(
            (question) => !question.skipLogic || question.skipLogic.rules.length === 0
        );
        setVisibleQuestions(initialVisibleQuestions);
    }, []);

    const renderQuestions = () => {
        return visibleQuestions.map((question) => {
            switch (question.type) {
                case 'radio':
                    return (
                        <View key={question.id} style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 18 }}>{question.question_text}</Text>
                            {question.options.map((option) => (
                                <RadioButton.Item
                                    key={option.id}
                                    label={option.value}
                                    value={option.value}
                                    status={
                                        responses[question.id] === option.value
                                            ? 'checked'
                                            : 'unchecked'
                                    }
                                    onPress={() => handleRadioChange(question.id, option.value)}
                                />
                            ))}
                        </View>
                    );

                case 'shortAnswer':
                    return (
                        <View key={question.id} style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 18 }}>{question.question_text}</Text>
                            <TextInput
                                value={responses[question.id] || ''}
                                onChangeText={(text) => handleTextChange(question.id, text)}
                                style={{
                                    height: 40,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    paddingHorizontal: 10,
                                }}
                            />
                        </View>
                    );

                case 'selectField':
                    return (
                        <View key={question.id} style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 18 }}>{question.question_text}</Text>
                            {question.options.map((option) => (
                                <View
                                    key={option.id}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 8,
                                    }}
                                >
                                    <Checkbox.Item
                                        label={option.value}
                                        status={
                                            responses[question.id] === option.value
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => handleRadioChange(question.id, option.value)}
                                    />
                                </View>
                            ))}
                        </View>
                    );

                default:
                    return null;
            }
        });
    };

    return (
        <ScrollView
            style={{ padding: 16 }}
            contentContainerStyle={{ paddingBottom: 32 }}
        >
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
                {surveyData.surveyName}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 16 }}>
                {surveyData.surveyDescription}
            </Text>
            {renderQuestions()}
            <Button
                mode="contained"
                onPress={() => console.log(responses)}
                style={{ marginTop: 16 }}
            >
                Submit
            </Button>
        </ScrollView>
    );
};

export default SurveyForm;
