import React from 'react';
import {
    useState,
} from "react";
import Staff from'@components/Staff.jsx';
import Button from '@assets/Button.jsx'; // Import the new Button component
import {checker} from '@utils/checker.js'
import {converter} from '@utils/convert.js'

import "./styles.css";

export default function App() {
    const [notes, setNotes] = useState({
        soprano: [],
        alto: [],
        tenor: [],
        bass: []
    });
    const [mode, setMode] = useState('Major');
    const [tonic, setTonic] = useState('C');
    const [chords, setChords] = useState([]);
    
    /**
     * Initiate a new practice session by picking a mode, a key, and generating chords
     */
    const initiatePractice = () => {
        setNotes({
            soprano: [],
            alto: [],
            tenor: [],
            bass: []
        })
        pickMode();
        generateTonic();
        generateChords(mode);
    }

    /**
     * Randomly picks between major and minor mode
     */
    const pickMode = () => {
        const modes = ['Major', 'Minor'];
        const selectedMode = modes[Math.floor(Math.random() * modes.length)];
        setMode(selectedMode);
    }

    /**
     * Randomly chooses a tonic from the 12 tones 
     */
    const generateTonic = () => {
        const tonics = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
        const selectedTonic = tonics[Math.floor(Math.random() * tonics.length)];
        setTonic(selectedTonic);
    }

    /**
     * Generates random chord progressions in roman numerals
     * The rules are: T -> D, T -> PD, PD -> D, PD -> PD, D -> D, D -> T
     */
    const generateChords = () => {
        const functionTransitions = {
            'T': ['PD', 'D'], // Tonic can lead to Predominant or Dominant
            'PD': ['D'],      // Predominant leads to Dominant
            'D': ['T', 'D']   // Dominant leads to Tonic or remains Dominant
        };
    
        const chordsByFunction = {
            'Major': {
                'T': ['I', 'iii'],
                'PD': ['ii', 'IV'],
                'D': ['V', 'vii°']
            },
            'Minor': {
                'T': ['i', 'III'],
                'PD': ['ii°', 'iv'],
                'D': ['V', 'vii°']
            }
        };
    
        // Start with a Tonic function
        let currentFunction = 'T';
        const progressionLength = 6 + Math.floor(Math.random() * 5); // Random progression length from 6 to 10
        let progression = mode == 'Major'? ['I'] : ['i'];
    
        for (let i = 1; i < progressionLength - 2; i++) {
            // Select the next function based on allowed transitions
            const possibleNextFunctions = functionTransitions[currentFunction];
            const nextFunction = possibleNextFunctions[Math.floor(Math.random() * possibleNextFunctions.length)];
            
            // Select a random chord from the chosen function
            const possibleChords = chordsByFunction[mode][nextFunction];
            const chord = possibleChords[Math.floor(Math.random() * possibleChords.length)];
            
            progression.push(chord);
            currentFunction = nextFunction; // Update the current function for the next iteration
        }
        progression.push('V');
        progression.push(mode == 'Major'? 'I' : 'i');
    
        setChords(progression);
    };
    

    return (
        <div>
            <Button onClick={initiatePractice} >Start</Button>
            <Staff notes={notes} setNotes={setNotes} tonic={tonic} mode={mode} chords={chords}/>
            {/* Additional UI elements to show notes, errors, etc. */}
        </div>
    );
}
