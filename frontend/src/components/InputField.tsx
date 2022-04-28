// Componente InputField generico

import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
};
// Con esto ^^^ le decimos que el tipo de props es cualquier tipo de props que pueda tener un input

export const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    size: _,
    ...props // Como Input no acepta como props size label, ni placeholder, los sacamos de props
}) => {
    const [field, { error }] = useField(props); // Hook de Formik (???)
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <Input {...field} {...props} id={field.name} placeholder={placeholder} />
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>);
}

// !!string -> hace cast a boolean
// !!'' => false
// !!'mensaje de error' => true