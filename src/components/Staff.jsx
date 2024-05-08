import React, { useRef, useEffect } from 'react';
import Vex from 'vexflow';
import './Staff.css';

const VF = Vex.Flow;

const Staff = ({ onNotesChange, notes, setNotes, tonic, mode, chords }) => {
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
            if(!chords) {
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
                }
                
            }
    
            // Draw notes for each voice
            drawNotes(trebleStave, context, notes.soprano, 'soprano');
            drawNotes(trebleStave, context, notes.alto, 'alto');
            drawNotes(bassStave, context, notes.tenor, 'tenor');
            drawNotes(bassStave, context, notes.bass, 'bass');
        }
    }, [notes, mode, tonic, chords]);  // React to changes in notes, mode, or tonic
    
    

    const drawNotes = (stave, context, notesArray, voice) => {
        if (notesArray && notesArray.length > 0) {
            const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
            const staveNotes = notesArray.map(note => new VF.StaveNote({
                keys: [note.pitch],
                duration: note.duration
            }));
            voice.addTickables(staveNotes);
            new VF.Formatter().joinVoices([voice]).format([voice], 400);
            voice.draw(context, stave);
        }
    };

    const handleStaffClick = (event) => {
        // Handle staff click to add notes
        // This needs implementation based on where the user clicks and what note should be added
    };

    return (
        <div className="staff-container">
            <div ref={divRef} onClick={handleStaffClick} className="staff-area"></div>
        </div>
    );
};

export default Staff;
