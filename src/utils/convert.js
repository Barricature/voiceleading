

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
    return scales[tonic + mode].findIndex(note.getKeys[0]);
}