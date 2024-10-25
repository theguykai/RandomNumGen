import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import Video from './Video';
import axios from 'axios';

const Display = () => {
  const [number, setNumber] = useState('Waiting...');
  const [flashing, setFlashing] = useState(false);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(100);
  const [isWaiting, setIsWaiting] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('newNumber', () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        setIsWaiting(false);
        setFlashing(true);
        let totalFlashTime = 0;
        let flashInterval = 3;

        // Request start and end values
        axios.get('http://localhost:5000/display')
          .then((res) => {
            const newStart = res.data.start;
            const newEnd = res.data.end;

            setStart(newStart);
            setEnd(newEnd);

            // Start flashing with the updated start and end values
            flashRandomNumbers(newStart, newEnd, totalFlashTime, flashInterval);
          })
          .catch(err => {
            console.error(err);
          });
      }
    );

    const flashRandomNumbers = (currentStart, currentEnd, totalFlashTime, flashInterval) => {
      if (totalFlashTime < 5000) {  // Keep flashing for 3 seconds
        const randomNum = Math.floor(Math.random() * (currentEnd - currentStart + 1)) + currentStart;
        setNumber(randomNum);

        // Gradually increase the interval to slow down the flashing
        flashInterval += 4;
        totalFlashTime += flashInterval;

        setTimeout(() => flashRandomNumbers(currentStart, currentEnd, totalFlashTime, flashInterval), flashInterval);
      } else {
        // After 3 seconds, stop flashing and get the actual number from the backend
        axios.get('http://localhost:5000/display')
          .then(res => {
            setFlashing(false);
            setNumber(res.data.number);

            // Start 15-second timeout after displaying the final number
            timeoutRef.current = setTimeout(() => {
              setIsWaiting(true);
            }, 15000);
          })
          .catch(err => {
            console.error(err);
          });
      }
    };

    return () => {
      socket.off('newNumber');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen bg-black text-white">
      {isWaiting ? (
        <Video />
      ) : (
        flashing ? (
          <div className="flex items-center justify-center flex-col gap-2">
            <h2 className={`absolute z-10 text-20xl font-bold transition-all duration-1000 bg-gradient-to-l from-red-600 ${number % 2 === 0 ? 'to-white' : 'to-red-900'} bg-clip-text text-transparent`}>
            {number}
            </h2>
          </div>
        ) : (
          <div className="mb-3 text-7xl font-extrabold transition-all duration-500">
            <h2>The number is:</h2>
            <h2 className='text-center text-20xl'>{number}</h2>
          </div>
        )
      )}
    </div>
  );
};

export default Display;
