// A curated list of daily scriptures
const DAILY_SCRIPTURES = [
  { reference: 'Psalm 46:10', text: 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.' },
  { reference: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
  { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.' },
  { reference: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.' },
  { reference: 'Romans 8:28', text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
  { reference: 'Isaiah 40:31', text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.' },
  { reference: 'Jeremiah 29:11', text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.' },
  { reference: 'Matthew 6:33', text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.' },
  { reference: 'Psalm 23:1', text: 'The LORD is my shepherd; I shall not want.' },
  { reference: '2 Timothy 1:7', text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.' },
  { reference: 'Hebrews 11:1', text: 'Now faith is the substance of things hoped for, the evidence of things not seen.' },
  { reference: 'Psalm 119:105', text: 'Thy word is a lamp unto my feet, and a light unto my path.' },
  { reference: 'Galatians 5:22-23', text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance: against such there is no law.' },
  { reference: 'Joshua 1:9', text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.' },
  { reference: 'Psalm 27:1', text: 'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?' },
  { reference: 'Romans 12:2', text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.' },
  { reference: '1 Corinthians 13:4-5', text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, doth not behave itself unseemly, seeketh not her own.' },
  { reference: 'Ephesians 6:10', text: 'Finally, my brethren, be strong in the Lord, and in the power of his might.' },
  { reference: 'James 1:2-3', text: 'My brethren, count it all joy when ye fall into divers temptations; knowing this, that the trying of your faith worketh patience.' },
  { reference: '1 John 4:8', text: 'He that loveth not knoweth not God; for God is love.' },
  { reference: 'Psalm 91:1', text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.' },
  { reference: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.' },
  { reference: 'Matthew 11:28', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.' },
  { reference: 'Psalm 34:8', text: 'O taste and see that the LORD is good: blessed is the man that trusteth in him.' },
  { reference: '2 Chronicles 7:14', text: 'If my people, which are called by my name, shall humble themselves, and pray, and seek my face, and turn from their wicked ways; then will I hear from heaven.' },
  { reference: 'Colossians 3:23', text: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men.' },
  { reference: 'Psalm 37:4', text: 'Delight thyself also in the LORD; and he shall give thee the desires of thine heart.' },
  { reference: 'Romans 5:8', text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.' },
  { reference: 'John 14:6', text: 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.' },
  { reference: 'Revelation 3:20', text: 'Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.' },
  { reference: 'Numbers 6:24-26', text: 'The LORD bless thee, and keep thee: the LORD make his face shine upon thee, and be gracious unto thee: the LORD lift up his countenance upon thee, and give thee peace.' },
]

export function getDailyScripture(): { reference: string; text: string } {
  const now = new Date()
  // Day of year (0–365) as the index seed
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
  return DAILY_SCRIPTURES[dayOfYear % DAILY_SCRIPTURES.length]
}