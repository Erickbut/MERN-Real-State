import React from 'react'

export default function CreateListing() {
    return (
        <main className=' p-3 max-w-4xl mx-auto my-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Crear Tarjeta
            </h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>

                    <input type="text" placeholder='Nombre' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />

                    <textarea type="text" placeholder='Descripción' className='border p-3 rounded-lg' id='description' required />

                    <input type="text" placeholder='Dirección' className='border p-3 rounded-lg' id='address' required />

                    <div className='flex flex-wrap justify-center gap-x-12   bg-slate-800 text-white rounded-lg'>

                        <div className='flex gap-2 mx-4 my-3'>
                            <select id='sale' className='w-5 text-black'>
                                <option value='0'>Casa</option>
                                <option value='1'>Departamento</option>
                                <option value='2'>Propiedad Comercial</option>
                                <option value='3'>Lote / Terreno</option>
                                <option value='4'>Proyecto Edificio</option>
                                <option value='5'>Remate / En Oferta</option>
                                <option value='6'>Oficina</option>
                                <option value='7'>Propiedad Compartida</option>
                            </select>
                            <span>Venta</span>
                        </div>

                        <div className='flex gap-2 my-3'>
                            <select id='rent' className='w-5 text-black'>
                                <option value='0'>Casa</option>
                                <option value='1'>Departamento</option>
                                <option value='2'>Propiedad Comercial</option>
                                <option value='6'>Oficina</option>
                            </select>
                            <span>Alquiler</span>
                        </div>

                        <div className='flex gap-2 my-3'>
                            <select id='anticretic' className='w-5 text-black'>
                                <option value='0'>Casa</option>
                                <option value='1'>Departamento</option>
                                <option value='2'>Propiedad Comercial</option>
                                <option value='5'>En Oferta</option>
                                <option value='6'>Oficina</option>
                            </select>
                            <span>Anticrético</span>
                        </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-5'>
                        <div className='flex items-center gap-2'>
                            <p>Cuartos:</p>
                            <input className='p-3 ml-12 border-gray-300 rounded-lg ' type="number" id='rooms' min="0" max='20' required />
                        </div>
                        <div className='flex items-center gap-2'>
                            <p>Baños:</p>
                            <input className='p-3 ml-12 border-gray-300 rounded-lg ' type="number" id='bathrooms' min='1' max='10' required />
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='flex flex-col items-center'>
                                <p>Precio Regular:</p>
                                <span className='text-xs'>
                                    (Bob / Mes)
                                </span>
                            </div>
                            <input className='p-3 border-gray-300 rounded-lg ' type="number" id='regularPrice' min='1' max='10' required />
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='flex flex-col items-center'>
                                <p>Precio Oferta:</p>
                                <span className='text-xs'>
                                    (Bob / Mes)
                                </span>
                            </div>
                            <input className=' p-3 border-gray-300 rounded-lg' type="number" id='discountPrice' min='1' max='10' required />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>
                        Imágenes:
                        <span className='font-normal text-gray-600 ml-2'>
                            La primera imagen será la portada (max. 6)
                        </span>
                    </p>
                    <div className='flex gap-4'>
                        <input className='p-3 border border-gray-600 rounded w-full' type="file" id='images' accept='image/*' multiple />
                        <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Subir</button>
                    </div>
                    <button className=' p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        Crear Publicación
                    </button>
                </div>


            </form>
        </main>
    );
}
