import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
    const [formData, setFormData] = useState({})
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]:e.target.value,
        });
    };
    const handleSubmit=(e)=>{
        e.preventDefault();
        
    }
    console.log(formData);
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Registrarse</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
                <input onChange={handleChange} className='border p-3 rounded-lg' id='username' placeholder='usuario' type="text" />
                <input onChange={handleChange} className='border p-3 rounded-lg' id='email' placeholder='correo' type="email" />
                <input onChange={handleChange} className='border p-3 rounded-lg' id='password' placeholder='contraseña' type="password" />
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Registrar</button>
            </form>
            <div className='flex gap-2 mt-5'>
                <p>Ya tienes cuenta?</p>
                <Link to={"/sign-in"}>
                    <span className='text-red-500'>Ingresar</span>
                </Link>
            </div>
        </div>
    )
}

