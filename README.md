A very basic voice leading checker

Internal representation:
    Select a key, then record everything in scale degree
        Key of C:
            1 - C
            1# - C#
            2b - Db
            2 - D
            ...

Flow of work:
    1. Generate a random key
    2. Generate random progressions from a library of classical progressions
        Chords for major keys should include: I, ii, iii, IV, V, vi, viio, N6, Ger+6, Fr+6, It+6 and their common inversions
        Chords for minor keys: i, iio, III, iv, v, VI, viiØ, N6, Ger+6, Fr+6, It+6 and their common inversions
    3. Display the chord symbols under the staff
    4. User clicks on the staff to create notes
    5. After they're done, click the "Check" button, convert vex flow notation back into our scale degree system
    6. Use checker.js to check for voice leading violations
    7. encode the errors and send it back to the frontend to display
        For every error, highlight the related notes and display a description underneath.


    