import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const CurrentPatient=()=>{
    const [token, setToken] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        const result = await axios.get('http://localhost:5000/api/token');
        setToken(result.data[0].token);
    };
    fetchData();

    // Set up a polling interval to fetch new data every 10 seconds
    const intervalId = setInterval(fetchData, 10000);

    // Clear the interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div >
      <h1 className='display'>Current Token: {token}</h1>
      ...
    </div>
  );
}

export default CurrentPatient;