import React, { useState, useEffect } from 'react'
import { app } from '../firebase/firebaseConfig';
import { getDatabase, ref, set, get } from 'firebase/database';
import { useParams } from 'react-router-dom';

function UpdateWrite() {

    const { firebaseId } = useParams();


    let [inputValue1, setInputValue1] = useState("");
    let [inputValue2, setInputValu2] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase(app);
            const dbRef = ref(db, "Nature/fruits/" + firebaseId); // picking specific firebase ID
            const snapshot = await get(dbRef);  // step 1  all data before val() method is like a JSON FORMAT
            if (snapshot.exists()) {
                const targetObject = snapshot.val(); //  step 2: after val() it will became javasript object 
                setInputValue1(targetObject.fruitName);
                setInputValu2(targetObject.fruitDefinition);

            } else {
                alert("Error");
            }
        }
        fetchData();
    }, [firebaseId])

    const overWriteData = async () => {
        const db = getDatabase(app);
        const newDocref = (ref(db, "Nature/fruits/" + firebaseId));
        set(newDocref, {
            fruitName: inputValue1,
            fruitDefinition: inputValue2
        }).then(() => {
            alert("Updated data successfully.")
        }).catch((error) => {
            alert("Error: ", error.message)
        })
    }

    return (
        <div>
            <h1>Update</h1><br />
            <input type="text" name='' placeholder='Fruit name' value={inputValue1} onChange={(e) => setInputValue1(e.target.value)} />br
            <input type="text" placeholder='Fruit Definnition' value={inputValue2} onChange={(e) => setInputValu2(e.target.value)} />br
            <button onClick={overWriteData}>Update</button>
        </div>
    )
}

export default UpdateWrite
