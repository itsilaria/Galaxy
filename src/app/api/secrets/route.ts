import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, position, color, language } = body;

        if (!text || !position || !color || !language) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const secret = {
            id: `secret-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text,
            position,
            color,
            timestamp: Date.now(),
            language,
        };

        // Salva il segreto
        await redis.hset('secrets', { [secret.id]: JSON.stringify(secret) });

        return NextResponse.json({ success: true, secret });
    } catch (error) {
        console.error('Error saving secret:', error);
        return NextResponse.json({ error: 'Failed to save secret' }, { status: 500 });
    }
}

export async function GET() {
    try {
        // Recupera tutti i segreti
        const secretsObj = await redis.hgetall('secrets');

        let secrets = [];

        if (!secretsObj || Object.keys(secretsObj).length === 0) {
            // Database vuoto - inizializza con segreti mock
            console.log('Initializing database with mock secrets...');
            secrets = await initializeMockSecrets();
        } else {
            secrets = Object.values(secretsObj).map((s) => JSON.parse(s as string));
        }

        return NextResponse.json({ secrets });
    } catch (error) {
        console.error('Error fetching secrets:', error);
        return NextResponse.json({ error: 'Failed to fetch secrets' }, { status: 500 });
    }
}

async function initializeMockSecrets() {
    const mockSecrets = generateMockSecrets(150);

    const secretsToSave: Record<string, string> = {};
    mockSecrets.forEach(secret => {
        secretsToSave[secret.id] = JSON.stringify(secret);
    });

    await redis.hset('secrets', secretsToSave);

    return mockSecrets;
}

function generateMockSecrets(count: number) {
    const secrets = [];
    const colors = ['#ffddcc', '#ccddff', '#ffccdd', '#ddffcc', '#ffffff'];

    const contentPool = {
        en: ["I haven't told my parents I lost my job.", "I'm in love with my best friend.", "I want to move to Mars.", "I stole a balloon when I was 5.", "Sometimes I just want to disappear.", "I'm afraid of the dark."],
        it: ["Non ho detto ai miei che ho perso il lavoro.", "Sono innamorato della mia migliore amica.", "Voglio trasferirmi su Marte.", "Ho rubato un palloncino a 5 anni.", "A volte vorrei solo sparire.", "Ho paura del buio.", "La pizza con l'ananas mi piace."],
        es: ["No le he dicho a mis padres que perdí mi trabajo.", "Estoy enamorado de mi mejor amigo.", "Quiero mudarme a Marte.", "Robé un globo cuando tenía 5 años."],
        fr: ["Je n'ai pas dit à mes parents que j'ai perdu mon emploi.", "Je suis amoureux de mon meilleur ami.", "Je veux déménager sur Mars."],
        de: ["Ich habe meinen Eltern nicht gesagt, dass ich meinen Job verloren habe.", "Ich bin in meinen besten Freund verliebt."],
        jp: ["両親に仕事を失ったことを言っていません。", "親友に恋しています。"]
    };

    let seed = 42;
    const pseudoRandom = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };

    const languages = Object.keys(contentPool);

    for (let i = 0; i < count; i++) {
        const lang = languages[Math.floor(pseudoRandom() * languages.length)];
        const pool = contentPool[lang as keyof typeof contentPool];

        const r = 10 + pseudoRandom() * 40;
        const theta = pseudoRandom() * Math.PI * 2;
        const phi = Math.acos(2 * pseudoRandom() - 1);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        secrets.push({
            id: `mock-${lang}-${i}`,
            text: pool[Math.floor(pseudoRandom() * pool.length)],
            position: [x, y, z],
            color: colors[Math.floor(pseudoRandom() * colors.length)],
            timestamp: 1640995200000 + i * 100000,
            language: lang,
        });
    }

    return secrets;
}
