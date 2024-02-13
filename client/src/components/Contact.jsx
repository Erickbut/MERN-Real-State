import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
    const [consigner, setConsigner] = useState(null);
    const [message, setMessage] = useState('');
    const onChange = (e) => {
        setMessage(e.target.value);
    }

    useEffect(() => {
        const fetchConsigner = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setConsigner(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchConsigner();
    }, [listing.userRef])

    return (
        <>
            {consigner && (
                <div className='flex flex-col gap-2'>
                    <p>Contacto: <span className='font-semibold'>{consigner.username}</span> - <span className='font-semibold'>{listing.title.toLowerCase()}</span></p>
                    <textarea
                        name="message"
                        id="message"
                        rows="2"
                        value={message}
                        onChange={onChange}
                        placeholder='Ingrese su mensaje para el correo electrónico...'
                        className='w-full border p-3 rounded-lg'
                    ></textarea>

                    <Link
                        to={`mailto:${consigner.email}?subject=Sobre ${listing.title}&body=${message}`}
                        className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 '
                    >
                        Enviar Mensaje al correo electrónico
                    </Link>
                    <div className='flex flex-col gap-1 items-center'>
                        Enviar mensaje por WhatsApp:
                        <a href="https://wa.link/xepa7n" target="_blank"><img className=' w-10 h-10' src="/wplogo.png" alt="wplogo" /></a>
                    </div>
                </div>

            )}
        </>

    )
}
