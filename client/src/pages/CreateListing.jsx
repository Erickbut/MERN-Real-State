import { useState } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

import BubblesBackground from '../styles/BubblesBackground';
import '../styles/DefaultBubbles.css';

export default function CreateListing() {

    const [files, setFiles] = useState([])

    const [formData, setFormData] = useState({
        imageUrls: [],
    });

    const [imageUploadError, setImageUploadError] = useState(false)

    const [uploading, setUploading] = useState(false);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData, imageUrls: formData.imageUrls.concat(urls)
                });
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) => {
                setImageUploadError('Error al subir archivos (max. 2mb por imagen).');
                setUploading(false);
            });
        } else {
            if (files.length == 0) {
                setImageUploadError("Ningun archivo seleccionado.")
                setUploading(false);
            }
            else {
                setImageUploadError("Solo puedes subir 6 imagenes por publicación.")
                setUploading(false);
            }
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done.`)
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    return (

        <div className=' bubbles-background-container '>
            <BubblesBackground />
            <div className='absolute top-0 left-0 w-full h-full scrollable-content-container '>

        <main className=' p-3 max-w-4xl mx-auto my-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Crear Inmueble
            </h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>

                    <input type="text" placeholder='Nombre' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' />

                    <textarea type="text" placeholder='Descripción' className='border p-3 rounded-lg' id='description' />

                    <input type="text" placeholder='Dirección' className='border p-3 rounded-lg' id='address' />

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
                            <input className='p-3 ml-12 border-gray-300 rounded-lg ' type="number" id='rooms' min="0" max='20' />
                        </div>
                        <div className='flex items-center gap-2'>
                            <p>Baños:</p>
                            <input className='p-3 ml-12 border-gray-300 rounded-lg ' type="number" id='bathrooms' min='1' max='10' />
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='flex flex-col items-center'>
                                <p>Precio Regular:</p>
                                <span className='text-xs'>
                                    (Bob / Mes)
                                </span>
                            </div>
                            <input className='p-3 border-gray-300 rounded-lg ' type="number" id='regularPrice' min='1' max='10' />
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='flex flex-col items-center'>
                                <p>Precio Oferta:</p>
                                <span className='text-xs'>
                                    (Bob / Mes)
                                </span>
                            </div>
                            <input className=' p-3 border-gray-300 rounded-lg' type="number" id='discountPrice' min='1' max='10' />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold text-black'>
                        Imágenes:
                        <span className='font-normal text-black ml-2'>
                            La primera imágen será la portada (máximo 6).
                        </span>
                    </p>
                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-black rounded w-full' type="file" id='images' accept='image/*' multiple />
                        <button
                            type='button'
                            disabled={uploading}
                            onClick={handleImageSubmit}
                            className='p-3 text-black border border-black rounded uppercase hover:shadow-lg disabled:opacity-80'
                        >
                            {uploading ? 'Subiendo...' : 'Subir'}
                        </button>
                    </div>
                    <p className='text-white text-sm'>{imageUploadError && imageUploadError}</p>

                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className=' flex justify-between p-3 border items-center rounded-lg'>
                                <img src={url} alt="listing image" className=' w-24 h-24 object-contain rounded-lg' />
                                <button
                                    type='button'
                                    onClick={() => handleRemoveImage(index)}
                                    className='p-3 text-red-600 rounded-lg uppercase hover:opacity-75'>Borrar</button>
                            </div>
                        ))
                    }

                    <button className=' p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        Crear Publicación
                    </button>
                </div>
            </form>
        </main>
        </div>
        </div>
    );
}