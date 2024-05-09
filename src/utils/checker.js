import { scaleDegreeToVexFlow, vexFlowToScaleDegree } from '@utils/convert';

/**
 * Takes the voices in scale degree notation and return voice leading errors
 * @param {Array} voices [[1, 7, ...], [5, 4, ...], [3, 2, ...], [1, 7, ...]]
 * @return {Array} [
 *  {description: String, noteIndices: Int[][] }
 * ]
 */
export function checkChordProgressions(voices, chords) {
    errors = []
    if (resolveSeventhToTonic(voices).error == false) {
        errors.push({description: 'Seventh resolves to tonic', notesIndices: resolveSeventhToTonic(voices).notes});
    }
    if (noParallelFifths(voices).error == false) {
        errors.push({description: 'Parallel fifth', notesIndices: resolveSeventhToTonic(voices).notes});
    }
    if (noParallelOctaves(voices).error == false) {
        errors.push({description: 'Parallel octave', notesIndices: resolveSeventhToTonic(voices).notes});
    }
    return errors;
}
 /**
  * Given the voice leanding instance in four voices, 
  * check if every vertical alignment contains exactly the notes in the corresponding chord in the chord progression
  * @param {Object} voices {
  *     soprano: VexFlow.StaveNote[],
  *     alto: VexFlow.StaveNote[],
  *     tenor: VexFlow.StaveNote[],
  *     bass: VexFlow.StaveNote[]
  * }
  * @param {StringArray} chords the chord progression, e.g. ['I', 'ii', 'V', I]
  */
function checkChordNotes(voices, chords) {
    let errors = [];
    const voiceArray = [voices.soprano, voices.alto, voices.tenor, voices.bass];

    chords.forEach((chord, index) => {
        const expectedNotes = scales[chord].slice(0, 3);  // Assuming triad: root, third, fifth
        const actualNotes = voiceArray.map(voice => vexFlowToScaleDegree(voice[index].getKeys()[0]));

        if (!expectedNotes.every(note => actualNotes.includes(note))) {
            errors.push({
                chord: chord,
                expected: expectedNotes,
                actual: actualNotes,
                description: `Mismatched notes in chord ${chord} at position ${index}`
            });
        }
    });

    return errors;
}

/**
 * Set error to true if there's an error, 
 * otherwise set to false and leave notes field empty
 * @param {*} voices
 * @returns {Object} {error: Boolean, notes: Int[][]}
 */
function resolveSeventhToTonic(voices) {
    let notesIndices = [];
    for (let i = 0; i < voices.length - 1; i++) {
        const currentSeventh = voices[i][6];  // Assuming the seventh degree is at index 6
        const nextTonic = voices[i + 1][0];   // Assuming the tonic is at index 0 in the next chord

        if (currentSeventh !== nextTonic - 1 && currentSeventh !== nextTonic + 6) {
            notesIndices.push([i, i + 1]);
        }
    }

    return {
        error: notesIndices.length > 0,
        notes: notesIndices
    };
}

function noParallelFifths(voices) {
    return checkParallelIntervals(voices, 7);  // Perfect fifth interval is 7 semitones
}

function noParallelOctaves(voices) {
    return checkParallelIntervals(voices, 12);  // Octave interval is 12 semitones
}

function checkParallelIntervals(voices, interval) {
    let notesIndices = [];
    for (let i = 0; i < voices.length - 1; i++) {
        for (let j = 0; j < voices[0].length - 1; j++) {
            const interval1 = Math.abs(voices[i][j] - voices[i][j + 1]);
            const interval2 = Math.abs(voices[i + 1][j] - voices[i + 1][j + 1]);
            if (interval1 === interval && interval1 === interval2) {
                notesIndices.push([i, j]);
            }
        }
    }

    return {
        error: notesIndices.length > 0,
        notes: notesIndices
    };
}
