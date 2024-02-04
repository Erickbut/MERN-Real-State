import { useEffect, useState } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

import BubblesBackground from '../styles/BubblesBackground';
import '../styles/DefaultBubbles.css';

import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
export default function CreateListing() {

    const { currentUser } = useSelector(state => state.user);

    const navigate = useNavigate();
    const params = useParams();

    const [files, setFiles] = useState([]);

    const [formData, setFormData] = useState({
        imageUrls: [],
        title: '',
        description: '',
        address: '',
        type: ' ',
        rooms: 0,
        bathrooms: 0,
        garage: 'si',
        offer: false,
        regularPrice: 0,
        discountPrice: 0,
    });

    const [imageUploadError, setImageUploadError] = useState(false)

    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        };

        fetchListing();
    }, []);

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
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        });
    };

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent' || e.target.id === 'anticretic') {
            setFormData({
                ...formData,
                type: e.target.id,
                subtype: e.target.value,
            });
        }
        if (e.target.id === 'garage') {
            setFormData({
                ...formData,
                garage: e.target.value,
            });
        }
        if (
            e.target.type === 'number' ||
            e.target.type === 'text' ||
            e.target.type === 'textarea'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
        if (
            e.target.id === 'offer'
        ) {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        };
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1)
                return setError('Carga al menos una imagen.');
            if (+formData.regularPrice < +formData.discountPrice)
                return setError('El precio de descuento debe ser menor al precio regular.');
            if (formData.type === ' ')
                return setError('Seleccione el valor del tipo de inmueble.')
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message);
            setLoading(false);

        }
    }


    return (

        <div className=' bubbles-background-container '>
            <BubblesBackground />
            <div className='absolute top-0 left-0 w-full h-full scrollable-content-container '>

                <main className=' p-3 max-w-4xl mx-auto my-auto'>
                    <h1 className='text-3xl font-semibold text-center my-7 text-white'>
                        Actualizar Inmueble
                    </h1>
                    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                        <div className='flex flex-col gap-4 flex-1'>

                            <input
                                type="text"
                                placeholder='Título'
                                className='border p-3 rounded-lg'
                                id='title'
                                maxLength='62'
                                minLength='10'
                                onChange={handleChange}
                                value={formData.title}
                            />

                            <textarea
                                type="text"
                                placeholder='Descripción'
                                className='border p-3 rounded-lg'
                                id='description'
                                onChange={handleChange}
                                value={formData.description}
                            />

                            <input
                                type="text"
                                placeholder='Dirección'
                                className='border p-3 rounded-lg'
                                id='address'
                                onChange={handleChange}
                                value={formData.address}
                            />

                            <div className='flex flex-wrap justify-center gap-x-12 bg-slate-700 text-white rounded-lg'>

                                <div className='flex gap-2 mx-4 my-3'>

                                    <select
                                        id='sale'
                                        name='sale'
                                        className='w-5 text-black'
                                        onChange={handleChange}
                                        value={formData.type === 'sale' ? formData.type : ''}

                                    >
                                        <option value='default'>Venta de:</option>
                                        <option value='casa'>Casa</option>
                                        <option value='departamento'>Departamento</option>
                                        <option value='propiedadComercial'>Propiedad Comercial</option>
                                        <option value='lote'>Lote / Terreno</option>
                                        <option value='proyectoEdificio'>Proyecto Edificio</option>
                                        <option value='remate'>Remate / En Oferta</option>
                                        <option value='oficina'>Oficina</option>
                                        <option value='propiedadCompartida'>Propiedad Compartida</option>
                                    </select>
                                    <span>Venta</span>
                                </div>

                                <div className='flex gap-2 my-3'>
                                    <select
                                        id='rent'
                                        className='w-5 text-black'
                                        onChange={handleChange}
                                        value={formData.type === 'rent' ? formData.type : ''}
                                    >
                                        <option value='default'>Alquiler de:</option>
                                        <option value='casa'>Casa</option>
                                        <option value='departamento'>Departamento</option>
                                        <option value='propiedadComercial'>Propiedad Comercial</option>
                                        <option value='oficina'>Oficina</option>
                                    </select>
                                    <span>Alquiler</span>
                                </div>

                                <div className='flex gap-2 my-3'>
                                    <select
                                        id='anticretic'
                                        className='w-5 text-black'
                                        onChange={handleChange}
                                        value={formData.type === 'anticretic' ? formData.type : ''}
                                    >
                                        <option value='default'>Anticrético de:</option>
                                        <option value='casa'>Casa</option>
                                        <option value='departamento'>Departamento</option>
                                        <option value='propiedadComercial'>Propiedad Comercial</option>
                                        <option value='oferta'>En Oferta</option>
                                        <option value='oficina'>Oficina</option>
                                    </select>
                                    <span>Anticrético</span>
                                </div>

                                <p>Valor seleccionado: {formData.type}</p>
                                <p>Valor seleccionado: {formData.subtype}</p>

                            </div>

                            <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-2">
                                    <p>Cuartos:</p>
                                    <input
                                        className="p-3 border-gray-300 rounded-lg"
                                        type="number"
                                        id="rooms"
                                        min="0" max="20"
                                        onChange={handleChange}
                                        value={formData.rooms}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <p>Baños:</p>
                                    <input
                                        className="p-3 ml-3 border-gray-300 rounded-lg"
                                        type="number"
                                        id="bathrooms"
                                        min="0" max="10"
                                        onChange={handleChange}
                                        value={formData.bathrooms}
                                    />
                                </div>
                                <div className="flex items-center gap-5">
                                    <span>Garaje:</span>
                                    <select
                                        id="garage"
                                        className="w-5 text-black"
                                        onChange={handleChange}
                                        value={formData.garage}
                                    >
                                        <option value="si">Si</option>
                                        <option value="no">No</option>
                                    </select>
                                    <p>Valor seleccionado (Garaje): {formData.garage}</p>
                                </div>
                                <div className='flex gap-2'>
                                    <span>Oferta:</span>
                                    <input
                                        type='checkbox'
                                        id='offer'
                                        className='w-5'
                                        onChange={handleChange}
                                        checked={formData.offer}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col">
                                        <p>Precio Regular:</p>
                                        <span className="text-xs">(Bob / Mes)</span>
                                    </div>
                                    <input
                                        className="p-3 w-40 border-gray-300 rounded-lg"
                                        type="number"
                                        id="regularPrice"
                                        min="1" max="1000000"
                                        onChange={handleChange}
                                        value={formData.regularPrice}
                                    />
                                </div>

                                {formData.offer && (

                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col">
                                            <p>Precio Oferta:</p>
                                            <span className="text-xs">(Bob / Mes)</span>
                                        </div>
                                        <input
                                            className="p-3 w-40 border-black rounded-lg ml-2"
                                            type="number"
                                            id="discountPrice"
                                            min="1" max="1000000"
                                            onChange={handleChange}
                                            value={formData.discountPrice}
                                        />
                                    </div>

                                )}

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
                                    <div key={url} className=' flex justify-between p-3 border items-center rounded-lg border-black'>
                                        <img src={url} alt="listing image" className=' w-24 h-24 object-contain rounded-lg' />
                                        <button
                                            type='button'
                                            onClick={() => handleRemoveImage(index)}
                                            className='p-3 text-black rounded-lg uppercase hover:opacity-75'>Eliminar</button>
                                    </div>
                                ))
                            }

                            <button
                                disabled={loading || uploading}
                                className=' p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                            >
                                {loading ? 'Creando...' : 'Actualizar Publicación'}
                            </button>
                            {error && <p className='text-red-700 text-sm'>{error}</p>}
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}