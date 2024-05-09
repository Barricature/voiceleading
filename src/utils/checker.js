import { scaleDegreeToVexFlow, vexFlowToScaleDegree, romanNumeralToScaleDegree } from '@utils/convert.js';

/**
 * Takes the notes object and check for errors
 * @param {Array} notes {
  *     soprano: VexFlow.StaveNote[],
  *     alto: VexFlow.StaveNote[],
  *     tenor: VexFlow.StaveNote[],
  *     bass: VexFlow.StaveNote[]
  * }
 * @return {Object} [
 *  {description: String, noteIndices: }
 * ]
 */
export function checkChordProgressions(tonic, mode, notes, chords) {
    // Make sure that all voices are filled
    const progressionLength = chords.length;
    for (const [voicePart, voiceNotes] of Object.entries(notes)) {
        if (voiceNotes.length < progressionLength) {
            return new Error(voicePart + 'does not have enough notes');
        }
    }
    // Check for erros
    const errors = []
    const voices = ['soprano', 'alto', 'tenor', 'bass'].reduce((acc, voice) => {
        acc[voice] = notes[voice].map(note => vexFlowToScaleDegree(tonic, mode, note));
        return acc;
    }, {});
    if (checkChordNotes(voices, chords, mode).length > 0) {
        checkChordNotes(voices, chords).forEach(error => errors.push(error));
    }
    if (resolveSeventhToTonic(voices).error == true) {
        errors.push({description: 'Seventh should resolve to tonic', notesIndices: resolveSeventhToTonic(voices).notes});
    }
    if (noParallelFifths(voices).error == true) {
        errors.push({description: 'Parallel fifth', notesIndices: resolveSeventhToTonic(voices).notes});
    }
    if (noParallelOctaves(voices).error == true) {
        errors.push({description: 'Parallel octave', notesIndices: resolveSeventhToTonic(voices).notes});
    }
    return errors;
}

/**
 * Checks if every vertical alignment (chord) contains exactly the notes specified in the corresponding chord from the progression.
 * @param {Object} voices - An object with keys as voice parts and values as arrays of scale degrees.
 * @param {Array} chords - The chord progression using Roman numerals, e.g., ['I', 'ii', 'V', 'I'].
 * @param {String} tonic - The tonic of the key, e.g., 'C'.
 * @param {String} mode - The mode, e.g., 'Major' or 'Minor'.
 * @returns {Array} - An array of errors with descriptions and indices of problematic chords.
 */
function checkChordNotes(voices, chords, mode) {
    const errors = [];
    const voiceParts = Object.keys(voices);
    const numberOfChords = chords.length;

    for (let i = 0; i < numberOfChords; i++) {
        const chord = chords[i];
        const expectedDegrees = romanNumeralToScaleDegree(mode, chord);
        const presentDegrees = [];

        // Collect all notes present in this chord from all voices
        voiceParts.forEach(voice => {
            const degree = voices[voice][i];
            if (degree) {
                presentDegrees.push(degree);
            }
        });

        // Check for any missing notes from the expected chord
        expectedDegrees.forEach(degree => {
            if (!presentDegrees.includes(degree)) {
                errors.push({
                    description: 'Missing note from chord',
                    index: i,
                });
            }
        });

        // Check for any incorrect notes that shouldn't be in the chord
        presentDegrees.forEach(degree => {
            if (!expectedDegrees.includes(degree)) {
                errors.push({
                    description: 'Incorrect note',
                    index: i,
                });
            }
        });
    }

    return errors;
}


/**
 * Set error to true if there's an error, 
 * otherwise set to false and leave notes field empty
 * @param {*} voices
 * @returns {Object} {error: Boolean, notes: Object[]}
 */
function resolveSeventhToTonic(voices) {
    const message = {
        error: false,
        notes: []
    }
    for (const [voicePart, scaleDegreeNotes] of Object.entries(voices)) {
        for (let i = 1; i < scaleDegreeNotes.length; i += 1) {
            if (scaleDegreeNotes[i - 1] == 7 && scaleDegreeNotes[i] != 1) {
                message.error = true;
                message.notes.push({voicePart: i-1})
            }
        }
    }
    return message;
}

function noParallelFifths(voices) {
    return checkParallelIntervals(voices, 7);  // Perfect fifth interval is 7 semitones
}

function noParallelOctaves(voices) {
    return checkParallelIntervals(voices, 12);  // Octave interval is 12 semitones
}

/**
 * Checks for parallel intervals specified by the interval parameter across consecutive chords.
 * @param {Object} voices - An object where each key is a voice part and each value is an array of scale degrees.
 * @param {number} interval - The musical interval to check for parallel motion (e.g., 7 for fifths, 12 for octaves).
 * @returns {Object} {error: Boolean, notes: Array} - Contains a boolean indicating if an error was found and an array of details for each error.
 */
function checkParallelIntervals(voices, interval) {
    const message = {
        error: false,
        notes: []
    };
    
    const voiceParts = Object.keys(voices);
    const numberOfChords = voices[voiceParts[0]].length; // Using the length of the first voice part as the reference

    // Check for parallel intervals between each pair of voices across all chords
    for (let i = 0; i < numberOfChords - 1; i++) { // Iterate through each chord, stopping before the last
        for (let j = 0; j < voiceParts.length; j++) { // Iterate through each voice part
            for (let k = j + 1; k < voiceParts.length; k++) { // Compare with every other voice part
                const currentVoice1 = voices[voiceParts[j]][i];
                const nextVoice1 = voices[voiceParts[j]][i + 1];
                const currentVoice2 = voices[voiceParts[k]][i];
                const nextVoice2 = voices[voiceParts[k]][i + 1];

                // Check if the intervals between the two voices in the current chord and the next chord are both the specified interval
                if (Math.abs(currentVoice1 - currentVoice2) === interval && Math.abs(nextVoice1 - nextVoice2) === interval) {
                    message.error = true;
                    message.notes.push(voiceParts[j]);
                    message.notes.push(voiceParts[k]);
                }
            }
        }
    }

    return message;
}

