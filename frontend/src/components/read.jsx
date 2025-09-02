
import React, { useState } from 'react'
import { app } from '../firebase/firebaseConfig';
import { getDatabase, ref, get } from 'firebase/database';

function Read() {

    const [fruitArray, setFruitArray] = useState([]);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "Nature/fruits"); // database location
        const snapshot = await get(dbRef);  // step 1  all data before val() method is like a JSON FORMAT
        if (snapshot.exists()) {
            setFruitArray(Object.values(snapshot.val())); //  step 2: after val() it will became javasript object 

        } else {
            alert("Error");
        }
    }


    return (
        <div>
            <button onClick={fetchData}>Display Data</button>
            <ul>
                {fruitArray.map((item, index) => (
                    <li key={index}>
                        {item.fruitName}: {item.fruitDefinition}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Read
