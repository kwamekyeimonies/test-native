import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const DynamicForm = ({ questions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const validationSchema = Yup.object().shape({
        answer: Yup.string().required('This field is required'),
    });

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    return (
        <View>
            {currentQuestionIndex < questions.length ? (
                <Formik
                    initialValues={{ answer: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        // Handle form submission here
                        console.log('Submitted:', values);
                        handleNextQuestion();
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <View>
                            <Text>{questions[currentQuestionIndex].question}</Text>
                            <TextInput
                                onChangeText={handleChange('answer')}
                                onBlur={handleBlur('answer')}
                                value={values.answer}
                            />
                            <Text style={{ color: 'red' }}>{errors.answer}</Text>
                            <Button title="Next" onPress={handleSubmit} />
                        </View>
                    )}
                </Formik>
            ) : (
                <Text>Form completed!</Text>
            )}
        </View>
    );
};

export default DynamicForm;
