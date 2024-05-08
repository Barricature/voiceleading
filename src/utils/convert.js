const noteSequence = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Key signatures: number of sharps or flats and affected notes
// Sharps for major keys and their relative minors
const sharps = {
    'C': [], 
    'G': ['F#'], 
    'D': ['F#', 'C#'], 
    'A': ['F#', 'C#', 'G#'],
    'E': ['F#', 'C#', 'G#', 'D#'], 
    'B': ['F#', 'C#', 'G#', 'D#', 'A#'],
    'F#': ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'], 
    'C#': ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#']
};
// Flats for major keys and their relative minors
const flats = {
    'F': ['Bb'], 
    'Bb': ['Bb', 'Eb'], 
    'Eb': ['Bb', 'Eb', 'Ab'], 
    'Ab': ['Bb', 'Eb', 'Ab', 'Db'],
    'Db': ['Bb', 'Eb', 'Ab', 'Db', 'Gb'], 
    'Gb': ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'], 
    'Cb': ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']
};

function generateKeyMappings(root, mode = 'major') {
    const rootNote = root.split('/')[0];
    const octaveStart = parseInt(root.split('/')[1]);
    let scale = [];
    let keySignature = [];

    if (sharps[rootNote]) {
        keySignature = sharps[rootNote];
    } else if (flats[rootNote]) {
        keySignature = flats[rootNote];
    }

    // Find starting index of root note in noteSequence
    let currentIndex = noteSequence.findIndex(note => note === rootNote);
    let currentOctave = octaveStart;
    let noteCount = 0;

    // Generate scale notes based on mode
    while (noteCount < 7) {
        const currentNote = noteSequence[currentIndex] + '/' + currentOctave;
        if (noteSequence[currentIndex] === 'B') {
            currentOctave++;
        }

        // Only add note to scale if it's not a chromatic passing tone
        if (keySignature.includes(noteSequence[currentIndex]) || noteSequence[currentIndex].length === 1) {
            scale.push(currentNote);
            noteCount++;
        }

        currentIndex = (currentIndex + 1) % 12; // Move to next note chromatically
    }

    // Map scale degrees to notes in scale
    const mapping = {};
    scale.forEach((note, index) => {
        mapping[index + 1] = note;
    });

    return mapping;
}

export function scaleDegreeToVexFlow(key, degree) {
    const note = keyMappings[key][degree];
    if (!note) {
        throw new Error(`No note found for key ${key} and degree ${degree}`);
    }
    return note;
}

export function vexFlowToScaleDegree(key, note) {
    const reverseMapping = Object.fromEntries(
        Object.entries(keyMappings[key]).map(([k, v]) => [v, k])
    );
    const degree = reverseMapping[note];
    if (!degree) {
        throw new Error(`No scale degree found for key ${key} and note ${note}`);
    }
    return degree;
}

// Example usage
const keyMappings = {
    'C/4': generateKeyMappings('C/4'),
    'A/4': generateKeyMappings('A/4', 'minor'),
    'G/4': generateKeyMappings('G/4'),
    'E/4': generateKeyMappings('E/4', 'minor')
    // Add other keys as needed
};
