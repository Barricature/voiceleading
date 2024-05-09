

const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

function generateScale(root, pattern, useFlats) {
    const scaleNotes = useFlats ? notesFlat : notesSharp;
    const scale = [root];
    let currentIndex = scaleNotes.indexOf(root);
    for (let interval of pattern) {
        currentIndex = (currentIndex + interval) % scaleNotes.length;
        scale.push(scaleNotes[currentIndex]);
    }
    return scale;
}

const majorPattern = [2, 2, 1, 2, 2, 2, 1]; // Intervals for a major scale
const minorPattern = [2, 1, 2, 2, 1, 2, 2]; // Intervals for a natural minor scale

const scales = {};

const flatKeys = ["F", "Bb", "Eb", "Ab", "Db", "Gb"]; // Excluding Cb major (7 flats)
const sharpKeys = ["C", "G", "D", "A", "E", "B", "F#"]; // Excluding C# major (7 sharps)

sharpKeys.forEach(note => {
    scales[note + "Major"] = generateScale(note, majorPattern, false);
    scales[note + "Minor"] = generateScale(note, minorPattern, false);
});

flatKeys.forEach(note => {
    scales[note + "Major"] = generateScale(note, majorPattern, true);
    scales[note + "Minor"] = generateScale(note, minorPattern, true);
});
console.log(scales);

export function scaleDegreeToVexFlow(tonic, mode, degree) {
    return new VF.StaveNote({
        keys: [scales[tonic + mode][degree]],
        duration: 'q'
    });
}

export function vexFlowToScaleDegree(tonic, mode, note) {
    return scales[tonic + mode].findIndex(note.getKeys());
}

// Map Roman numerals to intervals based on mode
const romanNumeralMap = {
    major: {
        'I': [1, 3, 5],
        'ii': [2, 4, 6],
        'iii': [3, 5, 7],
        'IV': [4, 6, 1],
        'V': [5, 7, 2],
        'vi': [6, 1, 3],
        'vii°': [7, 2, 4]
    },
    minor: {
        'i': [1, 3, 5],
        'ii°': [2, 4, 6],
        'III': [3, 5, 7],
        'iv': [4, 6, 1],
        'v': [5, 7, 2],
        'VI': [6, 1, 3],
        'VII': [7, 2, 4]
    }
};

/**
 * Converts a Roman numeral in a specific key and mode to scale degrees.
 * @param {String} tonic - The tonic of the key (e.g., 'C', 'Db').
 * @param {String} mode - 'Major' or 'Minor'.
 * @param {String} chord - The Roman numeral of the chord (e.g., 'I', 'ii').
 * @return {Array} Scale degrees corresponding to the Roman numeral.
 */
export function romanNumeralToScaleDegree(mode, chord) {
    mode = mode.toLowerCase(); // Ensure mode is lowercase for matching keys in the map
    const scaleDegrees = romanNumeralMap[mode][chord];
    if (!scaleDegrees) {
        throw new Error(`Chord ${chord} is not recognized in ${mode} mode.`);
    }
    return scaleDegrees;
}
