import Vex from 'vexflow';
const VF = Vex.Flow;

/**
 * Determines the musical note based on the y-coordinate and sets stem direction for notes below B/4.
 * 
 * @param {number} y the y position of the note on the staff
 * @return {VF.StaveNote} the corresponding VexFlow StaveNote
 */
export function placeNote(y) {
    const notes = [
        { maxY: 37.5, key: 'G/5' },
        { maxY: 42.5, key: 'F/5' },
        { maxY: 47.5, key: 'E/5' },
        { maxY: 52.5, key: 'D/5' },
        { maxY: 57.5, key: 'C/5' },
        { maxY: 62.5, key: 'B/4' },
        { maxY: 67.5, key: 'A/4', stemDown: true },
        { maxY: 72.5, key: 'G/4', stemDown: true },
        { maxY: 77.5, key: 'F/4', stemDown: true },
        { maxY: 82.5, key: 'E/4', stemDown: true },
        { maxY: 87.5, key: 'D/4', stemDown: true },
        { maxY: 92.5, key: 'C/4', stemDown: true },
        { maxY: 157.5, key: 'B/3', clef: 'bass' },
        { maxY: 162.5, key: 'A/3', clef: 'bass' },
        { maxY: 167.5, key: 'G/3', clef: 'bass' },
        { maxY: 172.5, key: 'F/3', clef: 'bass' },
        { maxY: 177.5, key: 'E/3', clef: 'bass' },
        { maxY: 182.5, key: 'D/3', clef: 'bass', stemDown: true },
        { maxY: 187.5, key: 'C/3', clef: 'bass', stemDown: true },
        { maxY: 192.5, key: 'B/2', clef: 'bass', stemDown: true },
        { maxY: 197.5, key: 'A/2', clef: 'bass', stemDown: true },
        { maxY: 202.5, key: 'G/2', clef: 'bass', stemDown: true },
        { maxY: 207.5, key: 'F/2', clef: 'bass', stemDown: true },
    ];

    const duration = 'q';  // Quarter note

    for (let noteDef of notes) {
        if (y <= noteDef.maxY) {
            return new VF.StaveNote({
                keys: [noteDef.key],
                duration: duration,
                stem_direction: noteDef.stemDown ? VF.StaveNote.STEM_DOWN : VF.StaveNote.STEM_UP,
                clef: noteDef.clef || 'treble'
            });
        }
    }

    return new Error('unknown position');
}
