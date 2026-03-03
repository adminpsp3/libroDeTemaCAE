import { Routes, Route, Navigate } from "react-router-dom";
import React from 'react'

// Importamos los componentes de las páginas
import Login from '../components/login/Login'
import Selector from '../components/selector/Selector';
import Libros_disponibles from '../components/disponibles/Libros_disponibles';
import Registros from '../components/registros/Registros';  
import Nuevo_registro from '../components/registros/Nuevo_registro';

//import Selector from '../components/selector/Selector'
//import Registros from '../components/registros/Registros'
//import Home from '../components/home/Home';
//import Libros_disponibles from '../components/disponibles/Libros_disponibles';


export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
             <Route path="/selector" element={<Selector />} />
             <Route path="/libros" element={<Libros_disponibles />} />
             <Route path="/registros" element={<Registros />} />
             <Route path="/registros/nuevo" element={<Nuevo_registro />} />
             <Route path="*" element={<Navigate to="/registros" replace />} />

             
             
        </Routes>
    )
}
