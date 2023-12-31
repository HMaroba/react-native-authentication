import React, { useState , useEffect} from "react";
import { Text, TextInput, View, Alert } from "react-native";
import { globalStyles } from "../styles/global";
import CustomButton from "../shared/button";
import { useForm, Controller } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
const auth = getAuth();


export default function LoginScreen({ navigation }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in, redirect to dashboard
        navigation.replace("Dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const onSubmit = async (data) => {
    try {
    
     await signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        // User registration successful
        navigation.push('Dashboard');
      })
    } catch (error) {
      Alert.alert("Error", "Login failed password or username is incorrect");
      console.log(error);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: null,
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <Controller
        control={control}
        rules={{
          required: { value: true, message: "Please enter your email" },
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Please enter a valid email",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <TextInput
              placeholder="Enter your email"
              style={globalStyles.input}
              onBlur={onBlur}
              onChangeText={(value) => {
                setEmail(value);
                onChange(value);
              }}
              value={email}
            />
            {errors.email && (
              <Text style={globalStyles.errorText}>{errors.email.message}</Text>
            )}
          </View>
        )}
        name="email"
        defaultValue=""
      />

      <Controller
        control={control}
        rules={{
          required: { value: true, message: "Please enter your password" },
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters long",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View>
            <TextInput
              placeholder="Enter your password"
              style={globalStyles.input}
              onBlur={onBlur}
              onChangeText={(value) => {
                setPassword(value);
                onChange(value);
              }}
              value={password}
              secureTextEntry
            />
            {errors.password && (
              <Text style={globalStyles.errorText}>
                {errors.password.message}
              </Text>
            )}
          </View>
        )}
        name="password"
        defaultValue=""
      />

      <CustomButton text="Login" onPress={handleSubmit(onSubmit)} />
      <CustomButton
        text="Register"
        onPress={() => navigation.push("Register")}
      />
    </View>
  );
}
