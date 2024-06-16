import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Item = {
    label: string,
    value: string,
}

type PickerEntry = {
  selectedValue: any;
  item: Item[];
  onChange: any;
  isDisabled: boolean;
  placeholder?: object;
};

const SelectBox = ({
  selectedValue,
  item,
  onChange,
  isDisabled = true,
  placeholder = {}
}: PickerEntry) => {
  const CustomPickerIcon : any = () =>  (
    <Ionicons 
      name="chevron-down-outline" 
      size={15} 
      color="#fff" 
      style={{ zIndex : 0 }}
    />
  );
  
  return (
    <RNPickerSelect
      onValueChange={onChange}
      items={item}
      value={selectedValue}
      style={{
        ...pickerSelectStyles,
        iconContainer: {
          top: 7,
          right: 10,
        },
      }}
      useNativeAndroidPickerStyle={false}
      Icon={CustomPickerIcon}
      disabled={isDisabled}
      placeholder={placeholder}
    />
  );
};

export default SelectBox;

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 12,
    paddingHorizontal: 15,
    backgroundColor: '#991602',
    borderRadius: 10,
    color: '#fff',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});