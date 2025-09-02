import React, { useState } from 'react'
import { app } from '../firebase/firebaseConfig';
import { getDatabase, ref, set, push } from 'firebase/database';

function Write() {

    let [inputValue1, setInputValue1] = useState("");
    let [inputValue2, setInputValu2] = useState("");

    const saveData = async () => {
        const db = getDatabase(app);
        const newDocref = push(ref(db, "Nature/fruits"));
        set(newDocref, {
            fruitName: inputValue1,
            fruitDefinition: inputValue2
        }).then(() => {
            alert("Data save successfully.")
        }).catch((error) => {
            alert("Error: ", error.message)
        })
    }

    return (
        <div>
            <input type="text" name='' placeholder='Fruit name' value={inputValue1} onChange={(e) => setInputValue1(e.target.value)} />
            <input type="text" placeholder='Fruit Definnition' value={inputValue2} onChange={(e) => setInputValu2(e.target.value)} />
            <button onClick={saveData}>Save data</button>
        </div>
    )
}

export default Write
