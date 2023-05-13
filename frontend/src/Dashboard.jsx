import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [patients, setPatients] = useState([]);
    const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
  
    // Fetch the list of patients
    useEffect(() => {
      const fetchPatients = async () => {
        const result = await axios.get('http://localhost:5000/api/patients');
        const results = await axios.get('http://localhost:5000/api/token');
        //convert string to number last 3 digits
        const string=await results.data[0].token;
        const lastThreeLetters = await parseInt(string.slice(-3));
        setCurrentPatientIndex(lastThreeLetters);
        console.log(currentPatientIndex);
        setPatients(result.data);
      };
      fetchPatients();
    }, []);
  
    // Set the current token
    const setNextPatient = async () => {
      console.log(currentPatientIndex);
      const nextPatientIndex = (currentPatientIndex + 1) % patients.length;
      const nextPatient = patients[nextPatientIndex];
      setCurrentPatientIndex(nextPatientIndex);
      try{
        await axios.post('http://localhost:5000/api/token', {token: nextPatient.token});
      }catch(err){
        console.log(err);
      }
    };
  
    // Add a new patient to the list
    const addPatient = async (name, phoneNumber) => {
      const result = await axios.post('http://localhost:5000/api/patients', { name, phone: phoneNumber });
      const newPatient = result.data;
      setPatients([...patients, newPatient]);
    };
  
    return (
      <div>
        <h1 style={{ backgroundColor: 'blue', color: 'white'}}
        >Token DashBoard for doctor's clinic</h1>
        <h2>Patient List</h2>
        <table style={{ width: '75%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Token Number</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={patient.id} style={{ backgroundColor: currentPatientIndex === index ? '#39FF14' : 'white' }}>
                <td>{patient.name}</td>
                <td>{patient.phone}</td>
                <td>{patient.token}</td>
              </tr>
            ))}
          </tbody>
        <button className="btn" onClick={setNextPatient}>Next Patient</button>
        </table>
        
        <h2>Add a New Patient</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const name = event.target.elements.name.value;
            const phoneNumber = event.target.elements.phoneNumber.value;
            addPatient(name, phoneNumber);
            event.target.reset();
          }}
        >
            <input type="text" name="name" placeholder='Name'/>
            <input type="text" name="phoneNumber" placeholder='phone number' />
          <button type="submit">Add Patient</button>
        </form>
      </div>
    );
  };
  
  export default App;