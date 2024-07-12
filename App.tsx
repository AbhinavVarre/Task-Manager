import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { auth } from './api/firebaseConfig';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';


const handleSignUp = async () => {
  try{

    const res = await createUserWithEmailAndPassword(auth, "varre.abhinav@gmail.com","testing")
    console.log(res);
  }catch(err){
    console.log(err);
  } 
}

const handlePostToDB = async () => {
  try{
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "task"), {
      taskName: "Complete Homework",
      taskDescription: "Physics, bio, chem",
    });
    console.log("Document written with ID: ", docRef.id);
  }catch(err){
    console.log(err);
  }

}

export default function App() {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSignUp}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePostToDB}>
        <Text>post something to database</Text>  
      </TouchableOpacity>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
