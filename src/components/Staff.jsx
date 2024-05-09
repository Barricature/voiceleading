import React, { useRef, useEffect } from 'react';
import Vex from 'vexflow';
import './Staff.css';
import {placeNote} from '@utils/placer.js';

const VF = Vex.Flow;

const Staff = ({ notes, setNotes, tonic, mode, chords }) => {
    const divRef = useRef(null);

    useEffect(() => {
        const div = divRef.current;
        if (div) {
            div.innerHTML = '';  // Clear the container for redrawing
            const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
            renderer.resize(1200, 300);
            const context = renderer.getContext();
            let trebleStave = null;
            let bassStave = null
            const keySignature = mode === 'Major' ? tonic : tonic + 'm'; // Ensure proper key signature format
            if(chords.length == 0) {
                // Initialize treble and bass staves with all settings in one go
                trebleStave = new VF.Stave(0, 0, 900);
                bassStave = new VF.Stave(0, 120, 900);

                trebleStave.addClef('treble').addTimeSignature('2/4').addKeySignature(keySignature).setContext(context).draw();
                bassStave.addClef('bass').addTimeSignature('2/4').addKeySignature(keySignature).setContext(context).draw();

                // Connect the staves
                const line1 = new VF.StaveConnector(trebleStave, bassStave).setType(VF.StaveConnector.type.SINGLE);
                line1.setContext(context).draw();

                const line2 = new VF.StaveConnector(trebleStave, bassStave).setType(VF.StaveConnector.type.SINGLE_RIGHT);
                line2.setContext(context).draw();
            } else{
                let startX = 0; // Start X position for the first stave
                const numberOfMeasures = Math.floor(chords.length / 2);
                const measureWidth = 200; // Width of each measure

                const sNum = notes.soprano.length
                const aNum = notes.alto.length
                const tNum = notes.tenor.length
                const bNum = notes.bass.length

                for (let i = 0; i < numberOfMeasures; i++) {
                
                    if (i === 0) {
                        // Only add clef and time signature to the first stave
                        // Make the first stave wider
                        trebleStave = new VF.Stave(startX, 0, measureWidth * 1.5);
                        bassStave = new VF.Stave(startX, 120, measureWidth * 1.5);
                        trebleStave.addClef('treble').addTimeSignature('2/4').addKeySignature(keySignature);
                        bassStave.addClef('bass').addTimeSignature('2/4').addKeySignature(keySignature);
                        startX += measureWidth * 1.5;

                    } else{
                        // Set context and draw the staves for the current measure
                        trebleStave = new VF.Stave(startX, 0, measureWidth);
                        bassStave = new VF.Stave(startX, 120, measureWidth);
                        startX += measureWidth;
                    }
                    trebleStave.setContext(context).draw();
                    bassStave.setContext(context).draw();

                    // Assuming 'chords' is an array of chord symbols like ['I', 'ii', 'V', 'I']
                    const chordsForThisMeasure = chords.slice(i * 2, (i * 2) + 2);  // Get two chords for this measure

                    // Draw chords as text under the stave
                    chordsForThisMeasure.forEach((chord, index) => {
                        const xOffset = index * (measureWidth / 2);  // Centers each chord in its half of the measure
                        const chordText = new VF.TextNote({
                            text: chord,
                            font: { family: "SERIF", size: 15,},
                            duration: 8,  
                            stave: bassStave,
                            line: 13
                        }).setJustification(VF.TextNote.Justification.LEFT); 
                        chordText.setLeftDisplacedHeadPx(xOffset);
                        VF.Formatter.FormatAndDraw(context, bassStave, [chordText]);
                    });
                
                    // Draw a connecting line for all staves, including the last one
                    const line1 = new VF.StaveConnector(trebleStave, bassStave).setType(VF.StaveConnector.type.SINGLE);
                    line1.setContext(context).draw(); 
                    // Draw barline at the end of each stave, including after the last measure
                    if (i === numberOfMeasures - 1) {
                        const line2 = new VF.StaveConnector(trebleStave, bassStave).setType(VF.StaveConnector.type.SINGLE_RIGHT);
                        line2.setContext(context).draw();
                    }

                    // Draw notes
                    if (i * 2 < sNum) {
                        const voice = new VF.Voice({ num_beats: 2, beat_value: 4 }); // Set up for 2/4 time
                        voice.addTickable(notes.soprano[i * 2]);
                        if (sNum - i * 2 == 1) {
                            const restNote = new VF.GhostNote({
                                keys: ["b/4"],  // Use a neutral position for the rest
                                duration: 'q',
                                clef: "treble",
                                auto_stem: true
                            });
                            voice.addTickable(restNote);
                        } else {
                            voice.addTickable(notes.soprano[i * 2 + 1]);
                        }
                        new VF.Formatter().joinVoices([voice]).format([voice], measureWidth - 10); // Slightly less width for formatting
                        voice.draw(context, trebleStave);
                    }
                    if (i * 2 < aNum) {
                        const voice = new VF.Voice({ num_beats: 2, beat_value: 4 }); // Set up for 2/4 time
                        voice.addTickable(notes.alto[i * 2]);
                        if (aNum - i * 2 == 1) {
                            const restNote = new VF.GhostNote({
                                keys: ["b/4"],  // Use a neutral position for the rest
                                duration: 'q',
                                clef: "treble",
                                auto_stem: true
                            });
                            voice.addTickable(restNote);
                        } else {
                            voice.addTickable(notes.alto[i * 2 + 1]);
                        }
                        new VF.Formatter().joinVoices([voice]).format([voice], measureWidth - 10); // Slightly less width for formatting
                        voice.draw(context, trebleStave);
                    }
                    if (i * 2 < tNum) {
                        const voice = new VF.Voice({ num_beats: 2, beat_value: 4 }); // Set up for 2/4 time
                        voice.addTickable(notes.tenor[i * 2]);
                        if (tNum - i * 2 == 1) {
                            const restNote = new VF.GhostNote({
                                keys: ["b/4"],  // Use a neutral position for the rest
                                duration: 'q',
                                clef: "bass",
                                auto_stem: true
                            });
                            voice.addTickable(restNote);
                        } else {
                            voice.addTickable(notes.tenor[i * 2 + 1]);
                        }
                        new VF.Formatter().joinVoices([voice]).format([voice], measureWidth - 10); // Slightly less width for formatting
                        voice.draw(context, bassStave);
                    }
                    if (i * 2 < bNum) {
                        const voice = new VF.Voice({ num_beats: 2, beat_value: 4 }); // Set up for 2/4 time
                        voice.addTickable(notes.bass[i * 2]);
                        if (bNum - i * 2 == 1) {
                            const restNote = new VF.GhostNote({
                                keys: ["b/4"],  // Use a neutral position for the rest
                                duration: 'q',
                                clef: "bass",
                                auto_stem: true
                            });
                            voice.addTickable(restNote);
                        } else {
                            voice.addTickable(notes.bass[i * 2 + 1]);
                        }
                        new VF.Formatter().joinVoices([voice]).format([voice], measureWidth - 10); // Slightly less width for formatting
                        voice.draw(context, bassStave);
                    }
                }
                
            }
        }
    }, [notes, mode, tonic, chords]);  // React to changes in notes, mode, or tonic
    
    // TODO: make a quarter note that follows the mouse
    // and indicate a temporary placement 
    const handleMouseMove = (event) => {
        const bounds = divRef.current.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
    }

    const handleStaffClick = (event) => {
        if (
            notes.soprano.length >= chords.length &&
            notes.alto.length >= chords.length &&
            notes.tenor.length >= chords.length &&
            notes.bass.length >= chords.length
        ) {
            return;
        }
    
        const bounds = divRef.current.getBoundingClientRect();
        const y = event.clientY - bounds.top;
    
        console.log(y);
        if (y < 32.5 || (y > 95 && y < 155) || y > 207.5) {
            return;
        }
        
        //TODO: augment the voice ranges,
        // Determin which voice to draw on automatically by the x position
        const voiceRange = {
            soprano: ['B/3', 'C/6'],
            alto: ['F/3', 'F/5'],
            tenor: ['C/3', 'B/4'],
            bass: ['E/2', 'E/4']
        }
    
        const voiceRanges = [
            { range: [32.5, 62.5], voice: 'soprano' },
            { range: [62.5, 92.5], voice: 'alto' },
            { range: [92.5, 177.5], voice: 'tenor' },
            { range: [177.5, 207.5], voice: 'bass' }
        ];
    
        const voice = voiceRanges.find(v => y > v.range[0] && y < v.range[1])?.voice;
        if (voice) {
            const note = placeNote(y);
            const updatedNotes = notes[voice].concat(note);
            setNotes({ ...notes, [voice]: updatedNotes });
            console.log(updatedNotes);
        }
    };
    

    return (
        <div className="staff-container">
            <div ref={divRef} onClick={handleStaffClick} className="staff-area"></div>
        </div>
    );
};

export default Staff;
