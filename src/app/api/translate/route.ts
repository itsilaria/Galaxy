import { NextRequest, NextResponse } from "next/server";

const LANG_NAMES: Record<string, string> = {
  en: "English",
  it: "Italian",
  es: "Spanish",
  fr: "French",
  de: "German",
  jp: "Japanese",
};

// Simple dictionary-based translations for common words/phrases.
// For a production app you would call a real translation API.
const DICTIONARY: Record<string, Record<string, string>> = {
  en: {
    "I still think about that moment every day...":
      "I still think about that moment every day...",
    "Nobody knows I cried that night.":
      "Nobody knows I cried that night.",
    "I pretend to be happy but I'm not.":
      "I pretend to be happy but I'm not.",
    "I wish I could go back in time.":
      "I wish I could go back in time.",
    "My biggest fear is being alone.":
      "My biggest fear is being alone.",
    "I never told anyone this before.":
      "I never told anyone this before.",
    "Sometimes I just want to disappear.":
      "Sometimes I just want to disappear.",
    "I forgave them but I didn't forget.":
      "I forgave them but I didn't forget.",
    "The stars remind me of you.":
      "The stars remind me of you.",
    "I talk to the moon when nobody's watching.":
      "I talk to the moon when nobody's watching.",
    "I'm braver than I think.":
      "I'm braver than I think.",
    "One day I'll make it.": "One day I'll make it.",
    "I secretly love rainy days.": "I secretly love rainy days.",
    "I miss who I used to be.": "I miss who I used to be.",
    "Music saved my life.": "Music saved my life.",
  },
  it: {
    "I still think about that moment every day...":
      "Penso ancora a quel momento ogni giorno...",
    "Nobody knows I cried that night.":
      "Nessuno sa che ho pianto quella notte.",
    "I pretend to be happy but I'm not.":
      "Fingo di essere felice ma non lo sono.",
    "I wish I could go back in time.":
      "Vorrei poter tornare indietro nel tempo.",
    "My biggest fear is being alone.":
      "La mia più grande paura è restare solo.",
    "I never told anyone this before.":
      "Non l'ho mai detto a nessuno prima.",
    "Sometimes I just want to disappear.":
      "A volte vorrei solo scomparire.",
    "I forgave them but I didn't forget.":
      "Li ho perdonati ma non ho dimenticato.",
    "The stars remind me of you.":
      "Le stelle mi ricordano te.",
    "I talk to the moon when nobody's watching.":
      "Parlo con la luna quando nessuno mi guarda.",
    "I'm braver than I think.":
      "Sono più coraggioso di quanto pensi.",
    "One day I'll make it.": "Un giorno ce la farò.",
    "I secretly love rainy days.":
      "Amo segretamente i giorni di pioggia.",
    "I miss who I used to be.":
      "Mi manca la persona che ero.",
    "Music saved my life.": "La musica mi ha salvato la vita.",
  },
  es: {
    "I still think about that moment every day...":
      "Todavía pienso en ese momento todos los días...",
    "Nobody knows I cried that night.":
      "Nadie sabe que lloré esa noche.",
    "I pretend to be happy but I'm not.":
      "Finjo ser feliz pero no lo soy.",
    "I wish I could go back in time.":
      "Desearía poder volver atrás en el tiempo.",
    "My biggest fear is being alone.":
      "Mi mayor miedo es estar solo.",
    "I never told anyone this before.":
      "Nunca se lo dije a nadie antes.",
    "Sometimes I just want to disappear.":
      "A veces solo quiero desaparecer.",
    "I forgave them but I didn't forget.":
      "Los perdoné pero no olvidé.",
    "The stars remind me of you.":
      "Las estrellas me recuerdan a ti.",
    "I talk to the moon when nobody's watching.":
      "Hablo con la luna cuando nadie mira.",
    "I'm braver than I think.":
      "Soy más valiente de lo que creo.",
    "One day I'll make it.": "Un día lo lograré.",
    "I secretly love rainy days.":
      "Amo secretamente los días lluviosos.",
    "I miss who I used to be.":
      "Extraño quién solía ser.",
    "Music saved my life.": "La música salvó mi vida.",
  },
  fr: {
    "I still think about that moment every day...":
      "Je pense encore à ce moment chaque jour...",
    "Nobody knows I cried that night.":
      "Personne ne sait que j'ai pleuré cette nuit-là.",
    "I pretend to be happy but I'm not.":
      "Je fais semblant d'être heureux mais je ne le suis pas.",
    "I wish I could go back in time.":
      "J'aimerais pouvoir revenir en arrière.",
    "My biggest fear is being alone.":
      "Ma plus grande peur est d'être seul.",
    "I never told anyone this before.":
      "Je ne l'ai jamais dit à personne avant.",
    "Sometimes I just want to disappear.":
      "Parfois je veux juste disparaître.",
    "I forgave them but I didn't forget.":
      "Je leur ai pardonné mais je n'ai pas oublié.",
    "The stars remind me of you.":
      "Les étoiles me rappellent toi.",
    "I talk to the moon when nobody's watching.":
      "Je parle à la lune quand personne ne regarde.",
    "I'm braver than I think.":
      "Je suis plus brave que je ne le pense.",
    "One day I'll make it.": "Un jour j'y arriverai.",
    "I secretly love rainy days.":
      "J'aime secrètement les jours de pluie.",
    "I miss who I used to be.":
      "La personne que j'étais me manque.",
    "Music saved my life.": "La musique a sauvé ma vie.",
  },
  de: {
    "I still think about that moment every day...":
      "Ich denke noch jeden Tag an diesen Moment...",
    "Nobody knows I cried that night.":
      "Niemand weiß, dass ich in dieser Nacht geweint habe.",
    "I pretend to be happy but I'm not.":
      "Ich tue so, als wäre ich glücklich, aber bin es nicht.",
    "I wish I could go back in time.":
      "Ich wünschte, ich könnte die Zeit zurückdrehen.",
    "My biggest fear is being alone.":
      "Meine größte Angst ist es, allein zu sein.",
    "I never told anyone this before.":
      "Ich habe das noch nie jemandem erzählt.",
    "Sometimes I just want to disappear.":
      "Manchmal möchte ich einfach verschwinden.",
    "I forgave them but I didn't forget.":
      "Ich habe ihnen vergeben, aber nicht vergessen.",
    "The stars remind me of you.":
      "Die Sterne erinnern mich an dich.",
    "I talk to the moon when nobody's watching.":
      "Ich spreche mit dem Mond, wenn niemand zusieht.",
    "I'm braver than I think.":
      "Ich bin mutiger als ich denke.",
    "One day I'll make it.": "Eines Tages werde ich es schaffen.",
    "I secretly love rainy days.":
      "Ich liebe heimlich Regentage.",
    "I miss who I used to be.":
      "Ich vermisse, wer ich früher war.",
    "Music saved my life.": "Musik hat mein Leben gerettet.",
  },
  jp: {
    "I still think about that moment every day...":
      "あの瞬間を毎日考えています...",
    "Nobody knows I cried that night.":
      "あの夜泣いたことは誰も知らない。",
    "I pretend to be happy but I'm not.":
      "幸せなふりをしているけど、本当は違う。",
    "I wish I could go back in time.":
      "時間を戻せたらいいのに。",
    "My biggest fear is being alone.":
      "一番の恐怖は一人になること。",
    "I never told anyone this before.":
      "これを誰にも言ったことがない。",
    "Sometimes I just want to disappear.":
      "時々ただ消えてしまいたい。",
    "I forgave them but I didn't forget.":
      "許したけど、忘れてはいない。",
    "The stars remind me of you.":
      "星を見るとあなたを思い出す。",
    "I talk to the moon when nobody's watching.":
      "誰も見ていない時、月と話す。",
    "I'm braver than I think.":
      "自分が思うより勇敢だ。",
    "One day I'll make it.": "いつか必ず成功する。",
    "I secretly love rainy days.":
      "実は雨の日が好き。",
    "I miss who I used to be.":
      "昔の自分が懐かしい。",
    "Music saved my life.": "音楽が私の命を救った。",
  },
};

// Attempt dictionary lookup first; for user-written secrets use a
// simple heuristic approach. In production you would call a real
// translation API (Google Translate, DeepL, etc.).
function translateText(text: string, targetLang: string): string {
  // Look up in dictionary
  const langDict = DICTIONARY[targetLang];
  if (langDict && langDict[text]) {
    return langDict[text];
  }

  // For user secrets: return original text with a language note
  // A real app would call an external translation API here
  return text;
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Missing text or targetLang" },
        { status: 400 }
      );
    }

    const langCode = targetLang in LANG_NAMES ? targetLang : "en";
    const translated = translateText(text, langCode);

    return NextResponse.json({ translated, lang: langCode });
  } catch (err) {
    console.error("Translation error:", err);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
