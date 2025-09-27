'use client'

import { Fugaz_One } from 'next/font/google'
import React, {useEffect, useState} from 'react'
import Calendar from './Calendar'
import { useAuth } from '@/context/AuthContext'
import { average, doc, setDoc, sum } from 'firebase/firestore'
import { db } from '@/firebase'
import Login from './Login'
import Loading from './Loading'

const fugaz = Fugaz_One({substes: ["latin"], weight: ['400']})


export default function Dashboard() {
    const {currentUser, userDataObj, setUserDataObj, loading} = useAuth()
    const now = new Date()
    const [data, setData] = useState({})

function countValues(){
    let total_number_of_days = 0
    let sum_moods = 0
    for (let year in data){
        for (let month in data[year]){
            for (let day in data[year][month]){
                let days_mood = data[year][month][day]
                total_number_of_days++
                sum_moods += days_mood
            }
        }
    }
    return {num_days: total_number_of_days, average_mood: total_number_of_days > 0 ? Math.round(sum_moods / total_number_of_days) : null}
}

async function handleSetMood(mood){
    const day = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()


    try {
        const newData = { ...userDataObj }
        if (!newData?.[year]){
            newData[year] = {}
        }
        if (!newData?.[year]?.[month]){
            newData[year][month] = {}
        }
        newData[year][month][day] = mood
        //update the current state
        setData(newData)
        //update the global state
        setUserDataObj(newData)
        //update firebase
        const docRef = doc(db, 'users', currentUser.uid)
        const res = await setDoc(docRef, {
            [year]: {
                [month]: {
                    [day]: mood
                }
            }
        }, {merge: true})

    } catch(err) {
        console.log('Failed to set data ', err.message)
    }
}

    const statuses = {
        ...countValues(),
        time_remaining: `${23 - now.getHours()}H ${60 - now.getMinutes()}M`
    }

    const moods = {
        '&#*@#&@': '😭',
        'Sad': '😔',
        'Mid': '🤔',
        'Good': '😄',
        'Elated': '🥰',
    }

    useEffect(() => {
        if (!currentUser || !userDataObj){
            return
        }

        setData(userDataObj)

    }, [currentUser, userDataObj])



    if (loading) {
        return <Loading />
    }
    
    if (!currentUser){
        return <Login/>
    }   

    return (
    
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
        <div className="grid grid-cols-3 bg-indigo-50 text-indigo-500 rounded-lg gap-4 p-4 ">
            {Object.keys(statuses).map((status, statusIndex) => {
                return (
                    <div className=' flex flex-col gap-1 sm:gap-2' key={statusIndex}>
                        <p className='font-medium capitalize text-xs sm:text-sm truncate '>{status.replaceAll('_', ' ')}</p>
                        <p className={' text-base sm:text-lg truncate ' + fugaz.className}>{statuses[status]}{status === 'num_days' ? " 🔥 ":""}{status === 'average_mood' ? (statuses[status] !== null ? ` (${Object.keys(moods)[statuses[status] - 1]})` : " No info") : ""}</p>
                    </div>
                )
            })}
        </div>
        <h4 className={'text-5xl sm:text-6xl md:text-7xl text-center ' + fugaz.className}>How do you <span className='textGradient'>feel</span> today?</h4>
        <div className='grid grid-cols-2 sm:grid-cols-5 gap-4 '>
            {Object.keys(moods).map((mood, moodIndex) => {
                return (
                    <button onClick={() => {
                        const currentMoodValue = moodIndex + 1
                        handleSetMood(currentMoodValue)
                    }} key={moodIndex} className={'p-4 rounded-2xl purpleShadow duration-200 hover:bg-[lavender] items-center text-center flex flex-col gap-2 ' + (moodIndex === 4 ? ' col-span-2 sm:col-span-1' : ' ')}>
                        <p className='text-4xl sm:text-5xl md:text-6xl'>{moods[mood]}</p>
                        <p className={'text-indigo-500 ' + fugaz.className}>{mood}</p>
                    </button>
                )
            })}
        </div>
        <Calendar completeData={data} handleSetMood={handleSetMood} /> 
    </div>
    )
}
