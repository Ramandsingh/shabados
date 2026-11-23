/**
 * Reduces Unicode Gurmukhi to a "skeleton" that speech recognition and the corpus can agree on.
 *
 * Why a skeleton: speech recognition hears sounds, not spellings. It gets consonants mostly
 * right, but vowel signs, tippi/bindi, addak and nukta are where its spelling drifts most from
 * the text of Gurbani. Matching on consonants alone makes a noisy transcript comparable with the
 * corpus without ever showing the transcript to anyone.
 *
 * Every rule here is listed in a table so a maintainer can read, question, and test each one.
 * Only orthographic rules are applied. Folding consonants that merely sound alike when sung
 * (for example ਣ/ਨ or ਬ/ਵ) is a domain judgement and is deliberately left out until it is
 * decided; see the open questions in the Listen mode proposal.
 * @ignore
 */

/**
 * Letters written with a nukta, folded to their base letter.
 * The corpus rarely uses these, while speech recognition trained on modern Punjabi often does.
 */
export const NUKTA_FOLDS = {
  'ਸ਼': 'ਸ',
  'ਖ਼': 'ਖ',
  'ਗ਼': 'ਗ',
  'ਜ਼': 'ਜ',
  'ਫ਼': 'ਫ',
  'ਲ਼': 'ਲ',
}

/**
 * Independent vowels and vowel carriers. All become one placeholder, because which carrier is
 * written depends on the vowel sign, and vowel signs are dropped.
 */
export const VOWEL_CARRIER = 'ਅ'
const VOWEL_CARRIERS = /[ਅ-ਔੲੳ]/g

// Vowel signs, virama, tippi, bindi, addak, nukta, udaat and yakash. Dropped entirely.
const DROPPED_MARKS = /[ਁ-ਃ਼ਾ-੍ੑੰੱੵ]/g

// After the steps above, anything that is not a Gurmukhi consonant, the carrier, or a space
// (digits, ॥, ੴ, vishraam punctuation, Latin) is noise for matching purposes.
const NOT_SKELETON = /[^ਅਕ-ਹ\s]/g

/**
 * Converts Unicode Gurmukhi into its consonant skeleton, keeping word breaks.
 * @param {string} text Unicode Gurmukhi, from the corpus or from speech recognition.
 * @returns {string} The skeleton, with words separated by single spaces.
 */
export const toSkeleton = ( text = '' ) => Object
  .entries( NUKTA_FOLDS )
  .reduce( ( acc, [ from, to ] ) => acc.split( from ).join( to ), text.normalize( 'NFC' ) )
  .replace( DROPPED_MARKS, '' )
  .replace( VOWEL_CARRIERS, VOWEL_CARRIER )
  .replace( NOT_SKELETON, ' ' )
  .replace( /\s+/g, ' ' )
  .trim()

/**
 * Removes word breaks from a skeleton.
 * Speech recognition splits and joins words differently from the corpus (Gurbani is often sung
 * as larivaar would read), so matching ignores them.
 * @param {string} skeleton A skeleton from `toSkeleton`.
 * @returns {string} The skeleton with no spaces.
 */
export const joinWords = skeleton => skeleton.replace( / /g, '' )
