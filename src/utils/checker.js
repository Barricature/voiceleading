// Assume import { scaleDegreeToVexFlow, vexFlowToScaleDegree } from './convert';
// Here, we'll simulate an example of this function (which should be replaced with actual imports and implementations)

/**
 * Takes the voices in scale degree notation and return voice leading errors
 * @param {Array} voices [[1, 7, ...], [5, 4, ...], [3, 2, ...], [1, 7, ...]]
 * @return {Array} [
 *  {description: String, noteIndices: Int[][] }
 * ]
 */
function checkChordProgressions(voices) {
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
 * Set error to true if there's an error, 
 * otherwise set to false and leave notes field empty
 * @param {*} voices
 * @returns {Object} {error: Boolean, notes: Int[][]}
 */
function resolveSeventhToTonic(voices) {
    return {error: false};
}

function noParallelFifths(chords) {
    return {error: false};
}

function noParallelOctaves(chord1, chord2, interval) {
    return {error: false};
}
