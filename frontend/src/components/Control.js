import { useState, useEffect } from 'react';
import axios from 'axios';

const Control = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [newNumber, setNewNumber] = useState(false);
  const [generatedNumber, setGeneratedNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [numArray, setNumArray] = useState([]);

  const getNumArray = () => {
    axios.get('http://localhost:5000/numbers')
      .then(res => {
        setNumArray(res.data.generatedNumbers);
      }
      )
      .catch(err => {
        console.error('Error fetching the numbers', err);
      });
  };
  
  useEffect(() => {
    getNumArray();
  }, []);

  // Function to trigger text-to-speech
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('SpeechSynthesis API is not supported in this browser.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedStart = parseInt(start);
    const parsedEnd = parseInt(end);

    // Check if both parsedStart and parsedEnd are valid numbers
    if (!isNaN(parsedStart) && !isNaN(parsedEnd)) {
      setNewNumber(true);
      setIsLoading(true);
      setIsGenerating(true);

      speakText('The number, is');

      axios.post('http://localhost:5000/generate', { start: parsedStart, end: parsedEnd })
        .then(() => {
          setTimeout(() => {
            axios.get('http://localhost:5000/display')
              .then(res => {
                console.log(res.data);
                setGeneratedNumber(res.data.number);
                speakText(res.data.number);
                getNumArray();
              })
              .catch(err => {
                console.error('Error fetching the number:', err);
              })
              .finally(() => {
                setIsLoading(false);
                setNewNumber(false);
                setIsGenerating(false);
              });
          }, 5000);
        })
        .catch(err => {
          console.error('Error generating the number:', err);
          setIsLoading(false);
          setNewNumber(false);
        });
    } else {
      alert('Please enter valid numbers');
    }
  };

  const handleReset = () => {
    axios.post('http://localhost:5000/reset')
      .then(() => {
        getNumArray();
        setGeneratedNumber(null);
        alert('Array reset successfully!');
      })
      .catch(err => {
        console.error('Error resetting the number array:', err);
      });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <button
        onClick={handleReset}
        className="absolute top-4 left-4 py-2 px-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition duration-300"
      >
        Reset
      </button>
      
      {generatedNumber !== null && !isLoading && (
        <h1 className="text-4xl font-bold mb-8">
          The number is: {generatedNumber}
        </h1>
      )}

      {isLoading && (
        <h1 className="text-4xl font-bold mb-8 animate-dots">
          The number is
          <span className="dot-1">.</span>
          <span className="dot-2">.</span>
          <span className="dot-3">.</span>
        </h1>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center bg-gray-900 p-10 rounded-lg shadow-lg w-full max-w-4xl"
      >
        <div className="flex gap-8 w-full justify-center mb-12">
          <div className="flex flex-col items-center w-1/2">
            <div className="text-center text-3xl font-bold mb-4 text-white">
              START
            </div>
            <input
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full h-40 text-6xl text-center bg-black text-white border border-red-600 rounded focus:outline-none focus:border-white transition duration-300"
            />
          </div>

          <div className="flex flex-col items-center w-1/2">
            <div className="text-center text-3xl font-bold mb-4 text-white">
              END
            </div>
            <input
              type="text"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full h-40 text-6xl text-center bg-black text-white border border-red-600 rounded focus:outline-none focus:border-white transition duration-300"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating ? 'disabled' : ''}
          className={`py-6 w-full text-4xl text-white font-bold rounded-lg ${isGenerating ? 'bg-gray-400' : 'hover:bg-red-700 bg-red-600'} transition duration-300`}
        >
          GENERATE
        </button>
      </form>

      {newNumber && (
        <p className="mt-8 text-3xl font-semibold text-white animate-pulse">
          Generating new number...
        </p>
      )}
      <h3 className='mt-4 text-xl'>{`Numbers so far: ${numArray}`}</h3>
    </div>
  );
};

export default Control;
