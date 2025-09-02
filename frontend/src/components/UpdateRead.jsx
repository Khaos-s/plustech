import React, { useState } from 'react'
import { app } from '../firebase/firebaseConfig';
import { getDatabase, ref, get, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';


function UpdateRead() {

    const navigate = useNavigate();

    const [fruitArray, setFruitArray] = useState([]);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "Nature/fruits"); // database location
        const snapshot = await get(dbRef);  // step 1  all data before val() method is like a JSON FORMAT
        if (snapshot.exists()) {

            const myData = snapshot.val();
            const temporaryArray = Object.keys(myData).map(myFireId => {
                return {
                    ...myData[myFireId],
                    fruitId: myFireId
                }
            })
            setFruitArray(temporaryArray); //  step 2: after val() it will became javasript object 
        } else {
            alert("Error");
        }
    }

    const deleteFruit = async (fruitIdParam) => {
        const db = getDatabase(app);
        const dbRef = ref(db, "Nature/fruits/" + fruitIdParam); // database location
        await remove(dbRef);
        window.location.reload();

    }


    return (
        <div>
            <button onClick={fetchData}>Display Data</button>
            <ul>
                {fruitArray.map((item, index) => (
                    <li key={index}>
                        {item.fruitName}: {item.fruitDefinition} : {item.fruitId}
                        <button className='button' onClick={() => navigate(`/updateWrite/${item.fruitId}`)} >UPDATE</button>
                        <button className='button' onClick={() => deleteFruit(item.fruitId)} >DELETE</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UpdateRead
