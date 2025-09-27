'use client'
import { Fugaz_One } from 'next/font/google'
import React, {useState} from 'react'
import Button from './Button'
import { useAuth } from '@/context/AuthContext'

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] })

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegistered, setIsRegister] = useState(true)
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const {signup, login} = useAuth()

    async function handleSubmit(){
        console.log('submit clicked');  // should appear on click
        if (isSubmitting) { return; }
        setError(null);

        // Basic validation with user-friendly messages
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            setIsSubmitting(true);

            if (isRegistered) {
                console.log('Logging in user…');
                // await login(email, password)
                await login(email, password)
            } else {
                console.log('Signing up new user…');
                // await signup(email, password)
                await signup(email, password)
            }

            // Optionally clear the form on success:
            // setEmail(''); setPassword('');
        } catch (err) {
            console.log(err.message)
            setError(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
    <div className='flex flex-col flex-1 justify-center items-center gap-4'>
        <h3 className={'text-4xl sm:text-5xl md:text-6xl ' + fugaz.className}>{!isRegistered ? 'Register' : 'Log in'} </h3>
        <p>You're one step away!</p>
        <input
            value={email}
            onChange={(e)=>{ setEmail(e.target.value) }}
            placeholder='Email'
            type='email'
            autoComplete='email'
            className='w-full max-w-[500px] mx-auto px-4 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none hover:border-indigo-600 focus:border-indigo-800 '
        />
        <input
            value={password}
            onChange={(e)=>{ setPassword(e.target.value) }}
            placeholder='Password'
            type='password'
            autoComplete='current-password'
            className='w-full max-w-[500px] mx-auto px-4 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none hover:border-indigo-600 focus:border-indigo-800 '
        />
        {error && (
        <div
            role="alert"
            aria-live="polite"
            className="w-full max-w-[500px] mx-auto px-4 py-3 rounded-md bg-red-50 text-red-700 border border-red-200"
        >
            {error}
        </div>
)}
        <div className="max-w-[500px] w-full mx-auto">
            <Button text={isSubmitting ? "Submitting…" : "Submit"} full clickHandler={handleSubmit} />
        </div>
        <p className='text-center' >{ isRegistered ? 'Already have an account? ' : 'Don\'t have an account? '}<button onClick={() => setIsRegister(!isRegistered)} className='text-indigo-600 '>{!isRegistered ? 'Sign in' : 'Sign up'}</button></p>
    </div>
    )
}
