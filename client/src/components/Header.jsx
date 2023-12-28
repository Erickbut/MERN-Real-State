import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
    const { currentUser } = useSelector(state => state.user)
    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <img className=' w-5 h-8 sm:w-8 sm:h-8 mr-2 hidden sm:block' src="/logoGIGA.png" alt="" />
                        <span className='text-red-500 mr-1'>GIGA</span>
                        <span className='text-black'>Business Group</span>
                    </h1>
                </Link>
                <form className='bg-slate-50 p-3 rounded-lg flex items-center'>
                    <input
                        type="text"
                        placeholder='Buscar...'
                        className='bg-transparent focus:outline-none w-24 sm:w-64' />
                    <FaSearch className='text-slate-700'></FaSearch>
                </form>
                <ul className='flex gap-4'>
                    <Link to={'/'}>
                        <li className='hidden sm:inline text-slate-700 hover:underline'>
                            Inicio
                        </li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-slate-700 hover:underline'>
                            Sobre Nosotros
                        </li>
                    </Link>

                    <Link to='/profile'>
                        {currentUser ? (
                            <img className='rounded-full h-7 w-7 
                            object-cover' src={currentUser.avatar}
                                alt='profile' />
                        ) : (
                            <li className='text-slate-700 
                            hover:underline'>Ingresar</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header >
    );
}
