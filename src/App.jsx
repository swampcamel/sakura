import { useState, useEffect } from 'react';
import  ReactPlayer from 'react-player';
import ReactHowler from 'react-howler';
import BG from  './assets/video/bg.mp4';
import Play from './assets/img/play.svg';
import Pause from './assets/img/pause.svg';
import FluteImg from './assets/img/flute.svg';
import ShamisenImg from './assets/img/shamisen.svg';
import BiwaImg from './assets/img/biwa.svg';
import HichirikiImg from './assets/img/hichiriki.svg';
import TaikoImg from './assets/img/taiko.svg';
import HoragaiImg from './assets/img/horagai.svg';
import FluteSrc from './assets/audio/flute.mp3';
import ShamisenSrc from './assets/audio/shamisen.mp3';
import BiwaSrc from './assets/audio/biwa.mp3';
import HichirikiSrc from './assets/audio/hichiriki.mp3';
import TaikoSrc from './assets/audio/taiko.mp3';
import HoragaiSrc from './assets/audio/horagai.mp3';
import FluteShamisen from './assets/audio/flute-shamisen.mp3';
import FluteShamisenBiwa from'./assets/audio/flute-shamisen-biwa.mp3';
import FluteShamisenBiwaHichiriki from './assets/audio/flute-shamisen-biwa-hichiriki.mp3';
import FluteShamisenBiwaHichirikiTaiko from './assets/audio/flute-shamisen-biwa-hichiriki-taiko.mp3';
import PlayAll from './assets/audio/play-all.mp3';

import './App.scss';

// Mock data for instruments and their sounds
const INSTRUMENTS = [
  { 
    id: 1, 
    name: 'Flute', 
    keyword: 'heart', 
    imgSrc: FluteImg,
    audioSrc: [FluteSrc]
  },
  { 
    id: 2, 
    name: 'Shamisen', 
    keyword: 'yearning', 
    imgSrc: ShamisenImg,
    audioSrc: [ShamisenSrc]
  },
  { 
    id: 3, 
    name: 'Biwa', 
    keyword: 'threads', 
    imgSrc: BiwaImg,
    audioSrc: [BiwaSrc]
  },
  { 
    id: 4, 
    name: 'Hichiriki', 
    keyword: 'uncertain', 
    imgSrc: HichirikiImg,
    audioSrc: [HichirikiSrc]
  },
  { 
    id: 5, 
    name: 'Taiko', 
    keyword: 'daisuke', 
    imgSrc: TaikoImg,
    audioSrc: [TaikoSrc]
  },
  { 
    id: 6, 
    name: 'Horagai', 
    keyword: 'sip', 
    imgSrc: HoragaiImg,
    audioSrc: [HoragaiSrc]
  }
];

// Mock data for combined sounds
const COMBINATIONS = [
  { ids: [1, 2], audioSrc: [FluteShamisen] },
  { ids: [1, 2, 3], audioSrc: [FluteShamisenBiwa] },
  { ids: [1, 2, 3, 4], audioSrc: [FluteShamisenBiwaHichiriki] },
  { ids: [1, 2, 3, 4, 5], audioSrc: [FluteShamisenBiwaHichirikiTaiko] },
  { ids: [1, 2, 3, 4, 5, 6], audioSrc: [PlayAll] }
];

const App = () => {
  const [keywords, setKeywords] = useState(Array(6).fill(''));
  const [unlockedInstruments, setUnlockedInstruments] = useState([]);
  const [currentInstrument, setCurrentInstrument] = useState({id: 0});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState([null]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
        setIsMobile(window.innerWidth <= 768);
    }

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleKeywordChange = (index, value) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);

    // Check if keyword unlocks an instrument
    const instrument = INSTRUMENTS[index];
    if (value.toLowerCase() === instrument.keyword && !unlockedInstruments.includes(instrument.id)) {
      setUnlockedInstruments([...unlockedInstruments, instrument.id]);
    }
  };

  const playInstrument = (instrumentId) => {
    if (instrumentId !== currentInstrument.id) {
        const instrument = INSTRUMENTS.find(inst => inst.id === instrumentId);
        setCurrentInstrument(instrument);
        setCurrentAudio(instrument.audioSrc);
        if (!isPlaying) {
            setIsPlaying(true);
        }
    } else {
        setIsPlaying(!isPlaying);
    }

  };

  const playCombination = () => {
    
    if (isPlaying && currentInstrument.id === 0) {
        setIsPlaying(false);
        return;
    }

    if (unlockedInstruments.length > 1) {
      // Find the best matching combination
      const sortedUnlocked = [...unlockedInstruments].sort((a, b) => a - b);
      
      // Try to find an exact match first
      let combinationToPlay = COMBINATIONS.find(
        combo => JSON.stringify(combo.ids.sort((a, b) => a - b)) === JSON.stringify(sortedUnlocked)
      );
      
      // If no exact match, find the combination with the most matching instruments
      if (!combinationToPlay) {
        let bestMatch = null;
        let highestMatchCount = 0;
        
        COMBINATIONS.forEach(combo => {
          const matchingIds = combo.ids.filter(id => sortedUnlocked.includes(id));
          if (matchingIds.length > highestMatchCount && matchingIds.length === combo.ids.length) {
            highestMatchCount = matchingIds.length;
            bestMatch = combo;
          }
        });
        
        combinationToPlay = bestMatch;
      }
      
      if (combinationToPlay) {
        console.log(`Playing combination: ${combinationToPlay.ids.join(', ')}`);
        setCurrentInstrument({id: 0}) 
        setCurrentAudio(combinationToPlay.audioSrc);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="hunt-app">
        <div className="video-wrapper">
            <ReactPlayer 
                url={BG} 
                playing 
                loop 
                muted 
                width={isMobile ? 'auto' : '100vw'}
                height={isMobile ? '100vh' : 'auto'} 
            />
        </div>
      {/* Left side - Input fields */}
        <div className="container">
            <div className="left-col">
                <h2>Unlock Instruments</h2>
                <div className="control-container">
                    {INSTRUMENTS.map((instrument, index) => (
                        <div key={instrument.id} className="instrument-control">
                            <label className="instrument-label">
                                Instrument {index + 1} Keyword:
                            </label>
                            <input
                                type="text"
                                value={keywords[index]}
                                onChange={(e) => handleKeywordChange(index, e.target.value)}
                                placeholder={`Enter keyword for ${instrument.name}`}
                                className="input-field"
                            />
                            {unlockedInstruments.includes(instrument.id) && (
                                <div className="unlocked-message">
                                🎉 Unlocked: {instrument.name}!
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side - Instruments display */}
            <div className="right-col">
                
                {unlockedInstruments.length > 0 ? (
                <div className="instruments-container">
                    {/* Conductor in the middle */}
                    {unlockedInstruments.length > 1 && (
                    <div className="instrument play-all">
                        <button
                        onClick={playCombination}
                        className={`play-btn ${currentInstrument.id === 0 && isPlaying ? 'red' : 'green'}`}
                        >
                            { currentInstrument.id === 0 && isPlaying ? <img src ={Pause} alt="Pause" /> : <img src ={Play} alt="Play" />}
                        </button>
                    </div>
                    )}
                    
                    {/* Instrument icons in a circle */}
                    {INSTRUMENTS.filter(instrument => 
                        unlockedInstruments.includes(instrument.id)
                    ).map(instrument => (
                        <div key={instrument.id} className={`instrument ${instrument.name.toLowerCase()}`}>
                            <img className="img-control" src={instrument.imgSrc} alt={instrument.name}
                                onClick={() => playInstrument(instrument.id)}
                            >
                                {instrument.icon}
                            </img>
                            <div className="name">{instrument.name}</div>
                        </div>
                    ))}
                </div>
                ) : (
                <div className="default-msg">
                    Enter keywords to unlock instruments
                </div>
                )}
                <ReactHowler src={currentAudio} playing={isPlaying} />
            </div>
        </div>
    </div>
  );
};

export default App;