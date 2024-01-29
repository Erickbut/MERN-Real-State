import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable
} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CreateListing from './CreateListing';


import BubblesBackground from '../styles/BubblesBackground';
import '../styles/DefaultBubbles.css';


export default function Profile() {
    const fileRef = useRef(null);
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);

    const [userListings, setUserListings] = useState([]);

    const dispatch = useDispatch();
    //console.log(filePerc)
    //console.log(fileRef)
    //firebase storage
    //allow read;
    //allow write: if
    //request.resource.size < 2*2024*1024 &&
    //request.resource.contentType.matches('image/.*')
    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilePerc(Math.round(progress));
        },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                );
            }
        );
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(data.message));
        }
    }

    const handleShowListings = async () => {
        try {
            setShowListingsError(false);
            const res = await fetch(`/api/user/listing/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingsError(true);
                return;
            }

            setUserListings(data);
        } catch (error) {
            setShowListingsError(true);
        }
    }

    return (

        <div className='bubbles-background-container'>
            <BubblesBackground />
            <div className='absolute top-0 left-0 w-full h-full scrollable-content-container'>

                <div className='p-3 max-w-lg mx-auto'>
                    <h1 className=' text-white text-3xl font-semibold text-center my-7'>Perfil</h1>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <input onChange={(e) => setFile(e.target.files[0])}
                            type="file"
                            ref={fileRef}
                            hidden
                            accept='image/*'
                        />
                        <img onClick={() => fileRef.current.click()}
                            src={formData.avatar || currentUser.avatar}
                            alt="profile"
                            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
                        />
                        <p className='text-sm self-center'>
                            {fileUploadError ? (
                                <span className='text-red-600'>
                                    Error al cargar imagen (la imagen debe ser menor a 2 mb)
                                </span>
                            ) : filePerc > 0 && filePerc < 100 ? (
                                <span className='text-slate-700'>{`Subiendo ${filePerc}%`}</span>
                            ) : filePerc === 100 ? (
                                <span className='text-green-700'>Imagen cargada con éxito!</span>
                            ) : (
                                ''
                            )}
                        </p>
                        <input type="text"
                            placeholder='username'
                            defaultValue={currentUser.username}
                            id='username'
                            className='border p-3 rounded-lg'
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            placeholder='email'
                            defaultValue={currentUser.email}
                            id='email'
                            className='border p-3 rounded-lg'
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder='password'
                            id='password'
                            className='border p-3 rounded-lg'
                            onChange={handleChange}
                        />
                        <button
                            disabled={loading}
                            className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
                        >
                            {loading ? 'Cargando...' : 'Actualizar'}
                        </button>
                        <Link className='bg-green-700 text-white rounded-lg p-3  uppercase text-center hover:opacity-95'
                            to={"/create-listing"}
                        >
                            Publicaciones
                        </Link>
                    </form>

                    <div className='flex justify-between mt-5'>
                        <span
                            onClick={handleDeleteUser}
                            className='text-red-600 cursor-pointer'
                        >
                            Eliminar mi cuenta
                        </span>
                        <span onClick={handleSignOut} className='text-red-600 cursor-pointer'
                        >
                            Salir de mi cuenta
                        </span>
                    </div>

                    <p className='text-red-600 mt-5'>{error ? error : ''}</p>
                    <p className='text-green-600 mt-5'>
                        {updateSuccess ? 'Actualización Exitosa!' : ''}
                    </p>

                    <button onClick={handleShowListings} className=' text-green-700 w-full'>
                        Mostrar Publicaciones
                    </button>
                    <p className='text-red-700 mt-5'>
                        {showListingsError ? 'Error al mostrar las publicaciones' : ''}
                    </p>

                    {userListings && userListings.length > 0 &&
                        <div className='flex flex-col gap-4'>
                            <h1 className='text-center my-7 text-2xl font-semibold text-white'>Tus Publicaciones</h1>
                            {userListings.map((listing) => (
                                <div
                                    key={listing._id}
                                    className='border rounded-lg p-3 flex justify-between items-center gap-4'
                                >
                                    <Link to={`/listing/${listing._id}`}>
                                        <img
                                            src={listing.imageUrls[0]}
                                            alt="listing-cover"
                                            className='h-16 w-16 object-contain '
                                        />
                                    </Link>
                                    <Link
                                        className='text-slate-700 font-semibold hover:underline truncate flex-1'
                                        to={`/listing/${listing._id}`}
                                    >
                                        <p >
                                            {listing.title}
                                        </p>
                                    </Link>

                                    <div className=' flex flex-col items-center'>
                                        <button
                                            className=' text-red-600 uppercase'
                                        >Eliminar
                                        </button>
                                        <button
                                            className=' text-green-600 uppercase'
                                        >Editar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }

                </div>
            </div>
        </div>

    )
}
