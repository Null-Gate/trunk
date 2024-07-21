import {
  View,
  Text,
  Pressable,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import CustomText from "./CustomText";
import { Ionicons } from "@expo/vector-icons";

// expo image picker
import * as ImagePicker from "expo-image-picker";
import { Control, useController } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

type CustomImagePickerProps = {
  control: Control<any>;
  name: string;
  title: string;
  resetImage: boolean;
};

const CustomImagePicker: React.FC<CustomImagePickerProps> = ({
  control,
  name,
  title,
  resetImage,
}) => {
  const {
    field: { onChange },
    fieldState: { error },
  } = useController({
    control,
    name,
    rules: { required: "Image is required" },
  });

  const [photos, setPhotos] = useState<{ uri: string }[]>([]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setPhotos((prevPhotos) => [...prevPhotos, result.assets[0]]);
    }
  };

  // To detect the photos array change
  useFocusEffect(
    useCallback(() => {
      if (!resetImage) {
        onChange(photos);
      }
    }, [photos])
  );

  // if resetImage is true reset the data
  useEffect(() => {
    if (resetImage) {
      onChange([]);
      setPhotos([]);
    }
  }, [resetImage]);

  return (
    <View style={{ marginBottom: 15 }}>
      <CustomText
        text={title}
        textStyle={{
          color: "grey",
          marginBottom: 3,
        }}
      />
      <Pressable onPress={pickImage}>
        <View
          style={{
            height: windowWidth - 80,
            borderWidth: 1.8,
            borderRadius: 15,
            borderColor: error ? "red" : "#a6a6a6",
            borderStyle: "dashed",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Ionicons name="add" size={70} color="#a6a6a6" />
        </View>
      </Pressable>
      {/* For show images */}
      {photos?.length > 0 && (
        <ScrollView horizontal contentContainerStyle={{ height: 200, gap: 5 }}>
          {photos.map((photo, index) => {
            return (
              <View
                key={index}
                style={{ overflow: "hidden", borderRadius: 10 }}
              >
                <Image
                  source={{ uri: photo?.uri }}
                  width={200}
                  height={200}
                  resizeMode="cover"
                />
              </View>
            );
          })}
        </ScrollView>
      )}
      {error && <Text style={{ color: "red" }}>{error.message}</Text>}
    </View>
  );
};

export default CustomImagePicker;
