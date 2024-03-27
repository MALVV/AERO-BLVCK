import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';


function PassengerForm() {
  const [fullname, setFullname] = useState('');
  const [place, setPlace] = useState('');
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [flights, setFlights] = useState([]);
  const [seatsByFights, setSeatsByFlights] = useState([]);

  const handleSubmitPassenger = async (event) => {
    event.preventDefault();
    const pasengerUrl = 'http://localhost:8000/passenger/';
    const passengerPayload = {fullname};
    try {
      const passengerResponse = await axios.post(pasengerUrl, passengerPayload);
      console.log('Passenger created successfuly:',passengerResponse.data);
    }catch (error) {
      console.error('Error creating passenger:',error);
    }

  };
    const handlePlaceChange = (event) => {
    const selectedCity = event.target.value.split(',')[0].trim();
    console.log('Selected city:', selectedCity);
    setPlace(event.target.value);

  };
  const handleFlightChange = (event) => {
    const selectedFlight = event.target.value;
    console.log('Selected flight:', selectedFlight);
    handleSubmitSeats(selectedFlight);
  }
  /*
  
  const handleSeatsSelect = (event) => {
    const selectedIndex = event.target.value;
    const selectedFlight = flights[selectedIndex];
    handleSubmitSeats(selectedIndex);
    // Realizar alguna acción con el vuelo seleccionado, como actualizar el estado, enviar una solicitud al servidor, etc.
  }
  */
  const handleSeatSelection = (event) => {
    const selectedIndex = event.target.value;
    const selectedSeat = seatsByFights[selectedIndex];
    const passengerName = selectedSeat.passenger_name || ''; // Si no hay nombre de pasajero, establece una cadena vacía
    setFullname(passengerName);
  };
  const handleSubmitSeats = async (flight_id) => {
    
  
    const seatsIdUrl = `http://localhost:8000/flight/${flight_id}/seats`;

    
    try {
      const seatsByFlightIDResponse = await axios.get(seatsIdUrl);
      console.log('Seats by Flight ID Response:', seatsByFlightIDResponse.data);
      setSeatsByFlights(seatsByFlightIDResponse.data);
      console.log('Lista de Asientos:', seatsByFlightIDResponse.data);
    } catch (error) {
      console.error('Error al obtener la lista de asientos:', error);
    }
  };
  useEffect(() => {
    // Función para obtener las sugerencias de autocompletado
    async function fetchSuggestions(input) {
      const placeUrl = 'http://localhost:8000/place/';
      try {
        // Realiza una llamada a tu API para obtener las sugerencias basadas en el input
        const response = await axios.get(placeUrl);
        setSuggestedPlaces(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }
       // Si el nombre cambia, obtén nuevas sugerencias
       if (fullname.trim() !== '') {
        fetchSuggestions(fullname);
      } else {
        setSuggestedPlaces([]); // Limpia las sugerencias si el campo está vacío
      }
  
    async function fetchFlights() {
      const flightsUrl = 'http://localhost:8000/flight/full_info/';
      try {
        const response = await axios.get(flightsUrl);
        setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    }
    fetchFlights();


 

  }, [fullname]);


  return (
    <div>
      <nav className='navbar navbar-dark bg-primary'>
        <div className='container-fluid'>
          <a className="navbar-brand">
            AERO APP

          </a>
        </div>
      </nav>
      <div className='container'>
        <form onSubmit={handleSubmitPassenger} >
          <div className='mb-3'>
            <label htmlFor='passenger_name' className='form-label'>Passenger Name</label>
            <input type='text' value={fullname}/>
          </div>
          
          <div className='mb-3'>
            <label htmlFor='places' className='form-label'>Places</label>
            <input type='text' value={place}  list='suggestions-list' onChange={handlePlaceChange}/>
            <datalist id="suggestions-list">
              {suggestedPlaces.map((suggestion, index) => (
                <option key={index} value={`${suggestion.city}, ${suggestion.country}`} />
              ))}
            </datalist>
          </div>

          <div className='mb-3'>
            <label htmlFor='flights' className='form-label'>Flights</label>
            <select id="flights" className="form-select" onChange={handleFlightChange}>
            {flights.map((flight, index) => (
                <option key={index} value={flight.id}>
                  Vuelo {index + 1}: {flight.origin_city} - {flight.destination_city} | 
                  Salida: {flight.departure_date} - {flight.departure_time}
                </option>
              ))}
            </select>
          </div>
          <div className='mb-3'>
            <label htmlFor='seats' className='form-label'>Seats</label>
            <select id="seats" className="form-select" onChange={handleSeatSelection} >
            {seatsByFights.map((seat, index) => (
                <option key={index} value={index}>
                  Numbero de asiento: {seat.seat_number}|
                  Estado: {seat.status_seat}
                  Passenger: {seat.passenger_name}
                  
                </option>
                
                
              ))}
            </select>
          </div>
          <button type="submit" className='btn btn-primary'>
            Enviar
          </button> 
          
        </form>
      </div>

     
    </div>
  );
}

export default PassengerForm;