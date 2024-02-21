import React from 'react';
import BubblesBackground from '../styles/BubblesBackground';
import '../styles/DefaultBubbles.css';

const Search = () => {
    return (
        <div className="bubbles-background-container ">
            <BubblesBackground />
            <div className='absolute top-0 left-0 w-full h-full scrollable-content-container'>

                <div className='flex flex-col md:flex-row'>
                    <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                        <form className='flex flex-col gap-8'>
                            <div className='flex items-center gap-2'>
                                <label className=' whitespace-nowrap font-semibold'>Buscar Término:</label>
                                <input type="text"
                                    id='searchTerm'
                                    placeholder='Buscar...'
                                    className='border rounded-lg p-3 w-full'
                                />
                            </div>
                            <div className='flex gap-2 flex-wrap items-center'>
                                <label className='font-semibold'> Tipo:</label>
                                <div className='flex gap-2 '>
                                    <input type="checkbox" id='all' className='w-5' />
                                    <span>
                                        Venta, Alquiler y Anticrético
                                    </span>
                                </div>
                                <div className='flex gap-2 '>
                                    <input type="checkbox" id='sale' className='w-5' />
                                    <span>
                                        Venta
                                    </span>
                                </div>
                                <div className='flex gap-2 '>
                                    <input type="checkbox" id='rent' className='w-5' />
                                    <span>
                                        Alquiler
                                    </span>
                                </div>
                                <div className='flex gap-2 '>
                                    <input type="checkbox" id='anticretic' className='w-5' />
                                    <span>
                                        Anticrético
                                    </span>
                                </div>
                                <div className='flex gap-2 '>
                                    <input type="checkbox" id='offer' className='w-5' />
                                    <span>
                                        En Oferta
                                    </span>
                                </div>
                            </div>
                            <div className='flex gap-2 flex-wrap items-center'>
                                <label className='font-semibold'> Comodidades:</label>
                                <div className='flex gap-2 '>
                                    <input type="checkbox" id='garage' className='w-5' />
                                    <span>
                                        Parqueo
                                    </span>
                                </div>

                            </div>
                            <div className='flex items-center gap-2'>
                                <label className='font-semibold'>Ordenar:</label>
                                <select id="sort_order"
                                    className='border rounded-lg p-3 text-black'
                                >
                                    <option>Precio de mayor a menor</option>
                                    <option>Precio de menor a mayor</option>
                                    <option>Recientes</option>
                                    <option>Más antiguos</option>
                                </select>
                            </div>
                            <button className=' bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                                Buscar
                            </button>
                        </form>
                    </div>
                    <div className=''>
                        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
                            Resultados de Publicaciones:
                        </h1>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Search;
