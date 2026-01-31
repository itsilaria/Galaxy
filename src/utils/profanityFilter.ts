export const bannedWords = [
    // Bestemmie (Le più comuni e gravi)
    'porco dio', 'dio porco', 'dio cane', 'cane dio', 'madonna ladra',
    'porca madonna', 'dio bastardo', 'dio boia', 'dio schifoso',
    'dio lupo', 'dio fa', 'dio merde', 'dio stronzo', 'dio infame',

    // Offese Gravi / Insulti
    'stronzo', 'stronza', 'vaffanculo', 'coglione', 'cogliona',
    'pezzo di merda', 'merdoso', 'merdosa', 'testa di cazzo',
    'frocio', 'finocchio', 'negro', 'negra', 'zoccola', 'troia',
    'puttana', 'bastardo', 'bastarda', 'cretino', 'scemo',
    'deficiente', 'handicappato', 'ritardato', 'terrone', 'polentone',

    // Sessuali / Volgari
    'cazzo', 'figa', 'pompino', 'segone', 'sborra', 'minchia',
    'culattone', 'ricchione', 'bucaiolo', 'mignotta'
];

export const containsProfanity = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return bannedWords.some(word => lowerText.includes(word));
};
