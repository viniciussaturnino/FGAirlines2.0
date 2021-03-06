import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import './styles.css';

import api from '../../services/api';

import logo from '../../assets/logo.svg';

export default function Profile() {
    const [flights, setFlights] = useState([]);
    const airlineId = localStorage.getItem('airlineId');

    const history = useHistory();

    function handleLogout(){
        localStorage.clear();
        history.push('/');
    }

    async function handleDelete(id){
        try {
            await api.delete(`flights/${id}`, {
                headers: {
                    Authorization: airlineId,
                }
            })
            setFlights(flights.filter(flight => flight.id !== id));
        } catch (err) {
            alert('Não foi possível deletar este voo');
        }
    }

    useEffect(() => {
        api.get('profile', {
            headers: {
                Authorization: airlineId,
            }
        }).then(response => {
            setFlights(response.data);
        })
    }, [airlineId]);

    return(
        <div className="flights-container">
            <header>
                <img src={logo} alt="FGAirlines" />
                
                <Link className="button" to="/flights/new">Cadastrar novo voo</Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={24} color="#ffffff" />
                </button>
            </header>

            <h1>Voos Disponíveis</h1>

            <ul>
                {flights.map (flight => (
                    <li key={flight.id}>
                        <strong>DESTINO:</strong>
                        <p>{flight.destiny}</p>

                        <strong>DATA/HORA:</strong>
                        <p>{flight.date} - {flight.hour}</p>
                        
                        <strong>PREÇO:</strong>
                        <p>{Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(flight.value)}</p>

                        <button type="button" onClick={() => handleDelete(flight.id)}>
                            <FiTrash2 size={20} color="#17333C" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}