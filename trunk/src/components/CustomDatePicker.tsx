import { View, Text } from 'react-native'
import React from 'react'

// components
import CustomInput from './CustomInput'

interface CustomDatePickerProps {
    title: string,
    date: any,
    onChangeDate: any,
    placeholder: string,
    showDatePicker: boolean
}

const CustomDatePicker = ({
    title,
    date,
    onChangeDate,
    placeholder
}: CustomDatePickerProps) => {
    return (
        <>
            <CustomInput 
                title={title}
                value={date}
                onChangeText={onChangeDate}
                placeholder={placeholder}
            />
            
        </>
    )
}

export default CustomDatePicker