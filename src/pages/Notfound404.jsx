import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const Notfound404 = () => {
    return (
        <div className='w-screen h-screen bg-white flex flex-col'>
            <Header />
            <div className='flex-1 flex flex-col items-center justify-center text-center px-6'>
                <h1 className='text-8xl font-bold text-purple animate-bounce'>404!</h1>
                <p className='text-3xl font-fredokaOne text-gray-700 mt-4'>გვერდი ვერ მოიძებნა</p>
                <Link 
                    className='mt-6 px-6 py-3 bg-purple text-white text-lg font-semibold rounded-lg shadow-md hover:bg-purple-light transition-all duration-300' 
                    to='/'>
                    მთავარ გვერდზე დაბრუნება
                </Link>
            </div>
        </div>
    );
};

export default Notfound404;