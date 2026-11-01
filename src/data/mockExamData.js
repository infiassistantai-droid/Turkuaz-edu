// =====================================================================
// Türkçe Marathon — Data layer
// Realistic Turkish / Uzbek educational content for Milliy Sertifikat
// preparation (B1 / B2 / C1). All UI strings are Uzbek (Latin script).
// =====================================================================

export const appInfo = {
  brand: 'Türkçe Marathon',
  subtitle: 'Milliy Sertifikat (B1 · B2 · C1)',
  examDate: '2026-11-20T09:00:00',
}

// ----------------------------------------------------------------------
// Learning content
// ----------------------------------------------------------------------
// Reading passages (O'qib tushunish)
// ----------------------------------------------------------------------
export const readingPassages = [
  {
    id: 'cay',
    level: 'B2',
    title: "Çay Kültürü: Türkiye'nin Sosyal Yaşayışı",
    words: 170,
    minutes: 5,
    paragraphs: [
      "Türkiye'de çay, sadece bir içecek değil, sosyal yaşamın vazgeçilmez bir sembolüdür. İnsanlar kahvaltıda, iş yerlerinde, okullarda ve misafirliklerde bir araya gelerek bir bardak çay sohbet ederler. Bu gelenek, aileler ve dostlar arasında bağları güçlendirir.",
      "Çay genelde küçük fincanlarda, yanında şeker, lokum veya leblebi ile servis edilir. Yaz aylarında sıcak havalar bile bu geleneğin duraksamasına izin vermez; aksine, çay ocakları şehirlerin en hareketli noktalarıdır.",
      "Turistler, bu ortamda bir araya gelerek Türk çayı tadına bakmadan Türkiye'den ayrılmaz. Çaylık alanlarda hasat zamanı, köylerde hemen her evde «çay buluşmaları» düzenlenir. Bu buluşmalarda insanlar, hasadın ilk ürününü tadarken, aynı zamanda güncel konuları konuşurlar.",
    ],
    questions: [
      {
        id: 'cay-q1',
        type: 'text',
        question: "Metne göre Türkiye'de çay hangi ortamlarda içilir?",
        answer: 'Kahvaltıda, iş yerlerinde, okullarda ve misafirliklerde.',
        explanation:
          "Metinde doğru yanıt verilmiştir: «İnsanlar kahvaltıda, iş yerlerinde, okullarda ve misafirliklerde bir araya gelerek bir bardak çay sohbet ederler.»",
      },
      {
        id: 'cay-q2',
        type: 'bool',
        question: 'Doğru / Yanlış: «Çay büyük fincanlarda ve şekersiz servis edilir.»',
        answer: false,
        explanation:
          'Metinde çayın genellikle küçük fincanlarda, yanında şeker, lokum veya leblebiyle servis edildiği belirtiliyor; bu ifade yanlıştır.',
      },
      {
        id: 'cay-q3',
        type: 'choice',
        question: 'Yaz aylarında insanlar ne yaparlar?',
        options: [
          'Çay içmeyi bırakırlar.',
          'Çay ocaklarını kapatırlar.',
          'Çay içme geleneğini sürdürürler.',
          'Leblebi yemeyi bırakırlar.',
        ],
        answer: 2,
        explanation:
          '«Yaz aylarında sıcak havalar bile bu geleneğin duraksamasına izin vermez» — aksine, gelenek sürer ve çay ocakları hareketli kalır.',
      },
      {
        id: 'cay-q4',
        type: 'choice',
        question: '«Çay buluşmaları» nerede ve ne zaman düzenlenir?',
        options: [
          'Şehirlerde, kış aylarında.',
          'Köylerde, hasat zamanı.',
          'Okullarda, her gün.',
          'İstanbul’da, bayramlarda.',
        ],
        answer: 1,
        explanation:
          '«Çaylık alanlarda hasat zamanı, köylerde hemen her evde çay buluşmaları düzenlenir» — yani köylerde hasat döneminde.',
      },
    ],
  },
  {
    id: 'iletisim',
    level: 'C1',
    title: 'İletişim Teknolojileri ve İnsan Bağları',
    words: 150,
    minutes: 6,
    paragraphs: [
      'Günümüzde iletişim teknolojileri, insan yaşamını derinden değiştirmiştir. Birbirinden uzaktaki aileler artık saniyeler içinde görüntülü konuşma yapabiliyor ve duygularını anlık olarak paylaşabiliyor. Ancak bu hızlı iletişimin bir bedeli de vardır: yazılmış ifadeler çoğu zaman anlamını yitirir ve insan ilişkilerinde yargılara yol açabilir.',
      'Örneğin, kısa ve karşılıklı mesajlar, duyguların tam olarak anlaşılmasını engeller. Bununla birlikte, dijital ortamda da dürüst, nazik ve dikkatli olmamız gerekmektedir. Gerçeği yansıtan, samimi ve düşünülerek yazılmış bir mesaj, yüzyıllardır süren kültürümüzün bir yansımasıdır.',
      'Teknoloji, iletişimi kolaylaştırsa da insani bağların gücünü asla azaltmamalıdır. Doğru kullanım, dijital dünyayı gerçek dünyanın bir buluşması haline getirebilir.',
    ],
    questions: [
      {
        id: 'iletisim-q1',
        type: 'choice',
        question: 'Metne göre hızlı iletişimin bedeli nedir?',
        options: [
          'Duyguların tam olarak anlaşılmasını engeller.',
          'Aileleri birbirinden uzaklaştırır.',
          'Kültürel zenginliği yok eder.',
          'Türkiye’nin gelirini azaltır.',
        ],
        answer: 0,
        explanation:
          'Metinde «yazılan ifadeler çoğu zaman anlamını yitirir ve insan ilişkilerinde yargılara yol açabilir» ve «duyguların tam olarak anlaşılmasını engeller» deniyor; hızlı iletişim duyguların doğru anlaşılmasını zorlaştırabilir.',
      },
      {
        id: 'iletisim-q2',
        type: 'bool',
        question: 'Doğru / Yanlış: «Teknoloji insani bağların gücünü azaltmıştır.»',
        answer: false,
        explanation:
          'Metnin sonunda «Teknoloji, iletişimi kolaylaştırsa da insani bağların gücünü asla azaltmamalıdır» deniyor; ifade yanlıştır.',
      },
      {
        id: 'iletisim-q3',
        type: 'choice',
        question: 'Metindeki «dürüst, nazik ve dikkatli olma» neden önerilmektedir?',
        options: [
          'Grafik tasarım için.',
          'Dijital ortamda yazarken.',
          'Telefon görüşmesi yaparken.',
          'Resim çizerken.',
        ],
        answer: 1,
        explanation:
          'Metinde «dijital ortamda da dürüst, nazik ve dikkatli olmamız gerekmektedir» deniyor; bu öneri dijital ortamda yazarken geçerlidir.',
      },
      {
        id: 'iletisim-q4',
        type: 'text',
        question: 'Metne göre samimi ve düşünülerek yazılmış bir mesaj neyin yansımasıdır?',
        answer: 'Yüzyıllardır süren kültürümüzün.',
        explanation:
          'Metinde «Gerçeği yansıtan, samimi ve düşünülerek yazılmış bir mesaj, yüzyıllardır süren kültürümüzün bir yansımasıdır» deniyor.',
      },
    ],
  },
]

// ----------------------------------------------------------------------
// Listening track (Tinglab tushunish)
// ----------------------------------------------------------------------
export const listeningTracks = [
  {
    id: 'kitap-kafe',
    level: 'B2',
    title: '«Kitap Kafe» — Ayşe’nin Konuşması',
    duration: 135, // seconds
    transcript: {
      tr: 'Merhaba, ben Ayşe. Ben bir lise öğretmeniyim ve bu yıl okulumuzda başlayan «Kitap Kafe» projesinden söz etmek istiyorum. Öğrencilerimiz her hafta bir araya gelip yeni kitaplar okuyor ve fikirlerini paylaşıyorlar. Bu proje başladığında okulumdaki bazı öğrenciler okumakta zorlanıyordu. Ancak şimdi hem okuma ilgileri arttı hem de düşünme becerileri gelişti. Ayrıca öğrenciler, sohbetlerinin birbirleriyle daha samimi hale geldiğini söylüyorlar. Umarım diğer okullarda da benzer projeler uygulanır.',
      uz: "Salom, men Ayshe. Men litsey o'qituvchisiman va shu yili maktabimizda boshlangan «Kitob Kafe» loyihasi haqida gapirmoqchiman. O'quvchilar har hafta birga yig'ilib yangi kitoblar o'qiydilar va fikrlarini baham ko'rishadi. Ushbu loyiha boshlanganda maktabimdagi ba'zi o'quvchilar o'qishga qiynalar edi. Ammo hozir o'qish qiziqishlari oshdi, fikrlash qobiliyatlari ham rivojlandi. Shuningdek, o'quvchilar suhbatlari bir-birlari bilan yanada samimiylashganini aytishadi. Umid qilamiz, boshqa maktablarda ham shunga o'xshash loyihalar amalga oshiriladi.",
    },
    questions: [
      {
        id: 'lq1',
        question: 'Ayşe kimdir?',
        options: ['Bir öğrenci', 'Bir öğretmen', 'Bir yazar', 'Bir kütüphaneci'],
        answer: 1,
        explanation: 'Ayşe, «Ben bir lise öğretmeniyim» diyerek lise öğretmeni olduğunu söylüyor.',
      },
      {
        id: 'lq2',
        question: '«Kitap Kafe» projesindeki öğrenciler her hafta ne yaparlar?',
        options: [
          'Kitap yazarlar.',
          'Bir araya gelip kitap okur ve fikirlerini paylaşırlar.',
          'Spor yaparlar.',
          'Müzik dinlerler.',
        ],
        answer: 1,
        explanation:
          '«Her hafta bir araya gelip yeni kitaplar okuyor ve fikirlerini paylaşıyorlar» — öğrenciler kitap okuyup fikirlerini paylaşırlar.',
      },
      {
        id: 'lq3',
        question: 'Proje sonucunda öğrencilerin hangi özellikleri gelişmiştir?',
        options: [
          'Hafızaları güçlenmiştir.',
          'Okuma ilgileri ve düşünme becerileri gelişmiştir.',
          'Uyku süreleri uzamıştır.',
          'Televizyon izleme süreleri artmıştır.',
        ],
        answer: 1,
        explanation:
          '«Hem okuma ilgileri arttı hem de düşünme becerileri gelişti» — öğrencilerin okuma ilgileri ve düşünme becerileri gelişmiştir.',
      },
      {
        id: 'lq4',
        question: 'Ayşe, projenin diğer okullarda da ne olmasını istiyor?',
        options: [
          'Kapatılmasını.',
          'Benzer projelerin uygulanmasını.',
          'Öğrenci sayısının artırılmasını.',
          'Bütçenin artırılmasını.',
        ],
        answer: 1,
        explanation:
          'Son cümlede «Umarım diğer okullarda da benzer projeler uygulanır» deniyor; Ayşe benzer projelerin yaygınlaşmasını istiyor.',
      },
    ],
  },
]

// ----------------------------------------------------------------------
// Writing tasks (Yozma ish) — official Milliy Sertifikat structure
// 1-Topshiriq: Rasmiy/Norasmiy maktub (120–150 soʻz)
// 2-Topshiriq: Esse / Fikr bildirish (180–220 soʻz)
// ----------------------------------------------------------------------
export const writingTasks = [
  {
    id: 'mektup',
    task: 1,
    level: 'B2',
    title: '1. Görev: Resmî / Samimi Mektup',
    promptTr:
      'Bir lise öğrencisisiniz. Okul müdürüne «Atık Toplama Etkinliği»nin amacını ve öğrenciler ile çevre için neden önemli olduğunu açıklayan 120–150 kelimelik resmî bir mektup yazınız.',
    promptUz:
      "Siz litsey o'quvchisiz. Maktab direktoriga «Atıkto'plash Tadbiri»ning maqsadi va u o'quvchilarga hamda atrof-muhitga qanchalik ahamiyatli ekanligini tushuntirib, 120–150 so'zlik rasmiy maktub yozing.",
    criteria: [
      'Resmî mektup biçimine uygun hitap ve kapanış kullanın.',
      '120–150 kelime yazın.',
      'Etkinliğin amacını ve önemini açıklayın.',
      'Uygun ve nazik bir kapanış cümlesi kullanın.',
    ],
    sample:
      'Saygıylarımı sunarım. Ben okulumuz öğrencisiyim ve bu yıl okulumuzda düzenlenecek «Atıktoplama Etkinliği» hakkında bu mektubu yazıyorum. Öncelikle, bu etkinliğin amacı, öğrenciler tarafından üretilen atıklar yeniden değerlendirilmesini ve doğamızın korunmasını sağlamak olduğunu belirtmek isterim. Çevremizin temiz kalması için atıkların ayrıştırılması son derece önemlidir. Bu etkinlik sayesinde hem doğal kaynaklar korunacak hem de öğrencilerde geri dönüşüm bilinci gelişecektir. Ayrıca, etkinlik sonrası okul çevremiz daha temiz ve düzenli bir görünüme kavuşacak, bu da tüm öğrenciler için daha sağlıklı bir ortam yaratacaktır. Bu etkinlik, okulumuzun dört bir yanını renkli ve bilinçli bir atmosfere büründürecektir. Bundan sonraki süreçte bu bilinç, evlerimize ve mahallemizde de yayılacaktır. Ben, tüm öğrencilerin bu değerli etkinliğe katılımını rica ederim. Katılımınız, geleceğe bırakacağımız en güzel mirasa katkıda bulunacağına inanıyorum. Bu adım, toplumumuzun geleceği için hayati bir öneme sahiptir. Saygılarımla.',
    targetWords: '120–150',
  },
  {
    id: 'makale',
    task: 2,
    level: 'C1',
    title: '2. Görev: Görüş Bildiren Kompozisyon',
    promptTr:
      'Sosyal medya günlük yaşamın, özellikle de gençlerin hayatının önemli bir parçası hâline gelmiştir. Gençler üzerindeki olumlu ve olumsuz etkilerini örneklerle değerlendiren 180–220 kelimelik bir kompozisyon yazınız.',
    promptUz:
      "Ijtimoiy tarmoqlar kundalik hayotning, ayniqsa yoshlarning hayotidagi muhim o'ringa ega bo'ldi. Yoshlardagi ijobiy va salbiy ta'sirlarni misollar bilan baholab, 180–220 so'zlik esse yozing.",
    criteria: [
      '180–220 kelime yazın.',
      'Olumlu ve olumsuz etkileri dengeli biçimde değerlendirin.',
      'Görüşlerinizi örneklerle destekleyin.',
      'Giriş, gelişme ve sonuç bölümlerine yer verin.',
    ],
    sample:
      'Sosyal medya, günümüz yaşamının vazgeçilmez bir parçası haline gelmiştir. Gençler için dünyayla bağ kurmanın, bilgiye erişimin ve kendi seslerini duyurmanın önemli bir aracıdır. Bir yandan, sosyal medya gençlere farklı kültürlerden insanlarla tanışma ve yaratıcılıklarını sergileme imkanı sunar. Örneğin, birçok genç bu platformlarda kendi yolunu bulur ve yeteneklerini ortaya koyar. Bir diğer yandan ise, gençler bu ortamda inisiyatif geliştirebiliyor ve toplumsal konularda seslerini yükseltebiliyorlar. Diğer yandan ise, sürekli karşılaştırma kültürü gençlerin özgüvenini zedeler. Özellikle, tekdüze içeriklerin sürekli maruz kalınması, gençlerin kendilerini değersiz hissetmelerine neden olabilir. Beğeni sayısının önemli bir huzur kaynağı olması, gençlerde kaygı ve tekdüzeliğe yol açabilir. Ayrıca, yanlış bilgilerin hızla yayılması toplumsal güvensizliği artırır. İfadesiz ve yargı dolu yorumlar, gençler arasında güvensizlik ve önyargıyı da besleyebilir. Bu nedenle, gençlerin medya okuryazarlığının geliştirilmesi ve dijital dünyayı bilinçle kullanmalarının sağlanması büyük önem taşır. Okullarda dijital vatandaşlık derslerinin öğretilmesi, gençleri bu risklere karşı hazırlamanın en etkili yollarından biridir. Eğitimciler ve aileler, gençlere teknolojinin iyi yönlerini ortaya çıkarmalarında yardımcı olmalı; bu, herkesin görevidir. Sonuç olarak, sosyal medya hem iyiyi hem de kötüyü barındıran bir araçtır; nasıl kullanıldığımıza bağlı olarak ya fayda getirir ya da zarar. Dolayısıyla, dikkatli ve sorumlu kullanım esasına üstünlük verilmelidir.',
    targetWords: '180–220',
  },
]

// ----------------------------------------------------------------------
// Speaking prompts (Konuşma)
// ----------------------------------------------------------------------
export const speakingPrompts = [
  {
    id: 1,
    level: 'C1', categoryKey: 'module.speaking.tag.personal',
    tr: 'Gözlem yeteneğiniz hakkında bahsedin.',
    uz: 'Kuzatuv qobiliyatingiz haqida gapiring — oʻzingiz qanday narsalarni payqaysiz?',
  },
  {
    id: 2,
    level: 'B2', categoryKey: 'module.speaking.tag.study',
    tr: 'Son dönemde okuduğunuz bir kitaptan bahsedin.',
    uz: 'Yaqinda oʻqigan kitobingiz haqida gapiring — u sizga nima berdi?',
  },
  {
    id: 3,
    level: 'C1', categoryKey: 'module.speaking.tag.community',
    tr: 'Ana dilinizden başka bir dil öğrenmenin avantajlarını açıklayın.',
    uz: 'Asosiy tilingizdan boshqa til oʻrganish afzalliklarini tushuntiring.',
  },
  {
    id: 4,
    level: 'B2', categoryKey: 'module.speaking.tag.personal',
    tr: 'Kendinizi tanıtırken hangi bilgileri verirsiniz?',
    uz: 'Oʻzingiz haqingizda gap boshlashda qanday maʼlumotlarni berasiz?',
  },
  {
    id: 5,
    level: 'C1', categoryKey: 'module.speaking.tag.community',
    tr: 'Büyük bir şehirde yaşamanın zorluklarından bahsedin.',
    uz: 'Katta shaharda yashashning qiyinchiliklari haqida gapiring.',
  },
  {
    id: 6,
    level: 'C1', categoryKey: 'module.speaking.tag.environment',
    tr: 'Sürdürebilir bir yaşam için neler yapabilirsiniz?',
    uz: 'Barqaror (sürdürebilir) hayot uchun nima qilaolasiz?',
  },
]

// ----------------------------------------------------------------------
// Vocabulary flashcards (Lug'at)
// ----------------------------------------------------------------------
export const flashcards = [
  {
    tr: 'merhaba', level: 'B1',
    oqishi: 'mehraba',
    uz: 'salom',
    exTr: 'Merhaba, nasılsınız?',
    exUz: 'Salom, qalaysiz?',
  },
  {
    tr: 'teşekkür ederim', level: 'B1',
    oqishi: 'teshekkür',
    uz: 'rahmat',
    exTr: 'Teşekkür ederim, çok yardımcı oldunuz.',
    exUz: 'Rahmat, juda yordam berdingiz.',
  },
  {
    tr: 'kısmet', level: 'B2',
    oqishi: 'kesh-met',
    uz: 'omad, baxt',
    exTr: 'Bugün kısmetimiz yaver, çok güldüm.',
    exUz: 'Bugun omadimiz chogʻ, juda kuldim.',
  },
  {
    tr: 'gözlem', level: 'B2',
    oqishi: 'gözlem',
    uz: 'kuzatish, nazorat',
    exTr: 'Çocuklar hayvanları gözlemliyor.',
    exUz: 'Bolalar hayvonlarni kuzatmoqda.',
  },
  {
    tr: 'öğrenci', level: 'B1',
    oqishi: 'örenji',
    uz: 'talaba, oʻquvchi',
    exTr: 'Ben bir öğrenciyim ve okuyorum.',
    exUz: 'Men talabaman va oʻqiyapman.',
  },
  {
    tr: 'dert', level: 'B2',
    oqishi: 'dert',
    uz: 'muammo, gʻam',
    exTr: 'Aklındaki dertleri anlattı.',
    exUz: 'Hayolidagi muammolarni aytdi.',
  },
  {
    tr: 'cesaret', level: 'C1',
    oqishi: 'chesharet',
    uz: 'jasorat',
    exTr: 'Cesaretinizi yitirmeyin!',
    exUz: 'Jasoratingizni yoʻqotmang!',
  },
  {
    tr: 'anı', level: 'C1',
    oqishi: 'an-ı',
    uz: 'xotira, yodda saqlash',
    exTr: 'Okul günlerimin anıları kalıcı oldu.',
    exUz: 'Maktab kunlarimning xotiralari yodda qoldi.',
  },
  {
    tr: 'birlikte', level: 'B1',
    oqishi: 'bir-li-kte',
    uz: 'birga',
    exTr: 'Ailemiz birlikte tatile gider.',
    exUz: "O'ilamiz birgalikda dam olishiga boradi.",
  },
  {
    tr: 'farklı', level: 'B1',
    oqishi: 'far-klı',
    uz: 'boshqa, farqli',
    exTr: 'Biz farklı kültürlerden gelen insanlar.',
    exUz: 'Biz boshqa madaniyatlardan kelgan odamlar.',
  },
  {
    tr: 'önemli', level: 'C1',
    oqishi: 'ön-em-li',
    uz: 'muhim, ahamiyatli',
    exTr: 'Bu konuda önemli bir karar vermeliyiz.',
    exUz: 'Bunda muhim qaror qabul qilishimiz kerak.',
  },
  {
    tr: 'iyi', level: 'B1',
    oqishi: 'iyi',
    uz: 'yaxshi',
    exTr: 'Bu çok iyi bir haber!',
    exUz: 'Bu juda yaxshi xabar!',
  },
]

// ----------------------------------------------------------------------
// Turkish suffix cheat sheet (Qo'shimchalar / Ekler)
// ----------------------------------------------------------------------
export const vowelHarmony = [
  {
    group: 'back',
    labelKey: 'vocab.harmony.back',
    vowels: ['a', 'ı', 'o', 'u'],
    suffixes: ['-lar', '-da', '-dan'],
    examples: ['kitaplar', 'okulda', 'yoldan'],
  },
  {
    group: 'front',
    labelKey: 'vocab.harmony.front',
    vowels: ['e', 'i', 'ö', 'ü'],
    suffixes: ['-ler', '-de', '-den'],
    examples: ['evler', 'evde', 'evden'],
  },
]

export const suffixTable = [
  { typeKey: 'vocab.suffixType.plural', suffix: '-ler / -lar', meaningKey: 'vocab.suffixMeaning.plural', example: 'ev → evler, okul → okullar' },
  { typeKey: 'vocab.suffixType.possessive', suffix: '-(i)m', meaningKey: 'vocab.suffixMeaning.possessive', example: 'kitap → kitabım, ev → evim' },
  { typeKey: 'vocab.suffixType.dative', suffix: '-(y)e / -(y)a', meaningKey: 'vocab.suffixMeaning.dative', example: 'ev → eve, araba → arabaya' },
  { typeKey: 'vocab.suffixType.locative', suffix: '-de / -da', meaningKey: 'vocab.suffixMeaning.locative', example: 'ev → evde, okul → okulda' },
  { typeKey: 'vocab.suffixType.ablative', suffix: '-den / -dan', meaningKey: 'vocab.suffixMeaning.ablative', example: 'ev → evden, yol → yoldan' },
  { typeKey: 'vocab.suffixType.genitive', suffix: '-ın / -in / -un / -ün', meaningKey: 'vocab.suffixMeaning.genitive', example: 'kitap → kitabın, okul → okulun' },
  { typeKey: 'vocab.suffixType.present', suffix: '-yor', meaningKey: 'vocab.suffixMeaning.present', example: 'oku- → okuyorum' },
  { typeKey: 'vocab.suffixType.past', suffix: '-di / -ti', meaningKey: 'vocab.suffixMeaning.past', example: 'git- → gitti' },
]

export const suffixPlayground = {
  words: ['ev', 'kitap', 'okul', 'araba', 'şehir', 'gül', 'yol', 'çocuk'],
  suffixes: [
    { id: 'plural', nameKey: 'vocab.suffix.play.plural' },
    { id: 'p1', nameKey: 'vocab.suffix.play.possessive' },
    { id: 'dat', nameKey: 'vocab.suffix.play.dative' },
    { id: 'loc', nameKey: 'vocab.suffix.play.locative' },
    { id: 'abl', nameKey: 'vocab.suffix.play.ablative' },
    { id: 'gen', nameKey: 'vocab.suffix.play.genitive' },
  ],
}

// ----------------------------------------------------------------------
// Mock exam questions (Sinov imtihoni) — 10 questions, B1–C1 mix
// ----------------------------------------------------------------------
export const mockExamQuestions = [
  {
    id: 1,
    category: 'Dil bilgisi',
    question: 'Size güzel bir hediye ______. aldım.',
    options: ['olarak', 'için', 'ile', 'hakkında'],
    answer: 1,
    explanation: '-için eki amaç bildirir. Cümlede hediye alma amacı ifade edildiği için doğru seçenek budur.',
  },
  {
    id: 2,
    category: 'Dil bilgisi',
    question: 'Bu tren ______. geliyor?',
    options: ['istasyondan', 'istasyon', 'istasyonda', 'istasyona'],
    answer: 0,
    explanation: '-dan/-den eki, bir yerden ayrılmayı veya hareketin kaynağını belirtir. Tren istasyondan geliyor.',
  },
  {
    id: 3,
    category: 'Dil bilgisi',
    question: 'Biz ______. oturuyoruz?',
    options: ['ev', 'eve', 'evde', 'evden'],
    answer: 2,
    explanation: '-de/-da eki bulunma bildirir. Oturma eyleminin gerçekleştiği yer evdir.',
  },
  {
    id: 4,
    category: 'Dil bilgisi',
    question: 'Bu kitabın ______. çok güzel yazılmış.',
    options: ['sayfa', 'sayfada', 'sayfaları', 'sayfadan'],
    answer: 2,
    explanation: "İlgi eki ve iyelik eki birlikte kullanılır: «kitabın sayfaları» (kitabın sayfaları).",
  },
  {
    id: 5,
    category: 'Dil bilgisi',
    question: 'Öğrenciler okulun ______. gidiyorlar.',
    options: ['bahçe', 'bahçede', 'bahçesine', 'bahçeden'],
    answer: 2,
    explanation: "«Bahçesine» sözcüğünde iyelik eki -si ve yönelme eki -ne kullanılmıştır.",
  },
  {
    id: 6,
    category: 'Dil bilgisi',
    question: 'Annem yemek ______. hazırlıyor.',
    options: ['yapıyor', 'yaptı', 'yapılıyor', 'yapın'],
    answer: 0,
    explanation: "-yor eki şimdiki zamanı belirtir: «Annem yemek yapıyor.»",
  },
  {
    id: 7,
    category: 'Dil bilgisi',
    question: 'Dün gece güzel bir film ______.',
    options: ['görüyordu', 'gördüm', 'görüyorum', 'görmüştüm'],
    answer: 1,
    explanation: "-dı/-di/-du/-dü ve sert ünsüzlerden sonra -tı/-ti/-tu/-tü biçimleri görülen geçmiş zamanı belirtir: «Dün gece güzel bir film gördüm.»",
  },
  {
    id: 8,
    category: 'Kelime bilgisi',
    question: 'Bu sözcük «çok iyi, mükemmel» ______. gelir.',
    options: ['göre', 'doğru', 'anlamına', 'benzer'],
    answer: 2,
    explanation: "«Anlamına gelir» ifadesi, bir sözcüğün veya ifadenin anlamını açıklamak için kullanılır.",
  },
  {
    id: 9,
    category: 'Okuma',
    question: 'Metne göre, turizm Türkiye için ______.',
    miniText: "Turizm, Türkiye'nin ekonomik gelirinin önemli bir kısmını sağlar. Her yıl milyonlarca turist ülkeyi ziyaret eder.",
    options: [
      'unutulmuş bir alandır',
      'önemli bir gelir kaynağıdır',
      'bir sorun oluşturur',
      'yalnızca yaz aylarına özgüdür',
    ],
    answer: 1,
    explanation: "Metinde turizmin Türkiye'nin ekonomik gelirinin önemli bir kısmını sağladığı belirtiliyor.",
  },
  {
    id: 10,
    category: 'Kelime bilgisi',
    question: 'Okula ______. geldiniz?',
    options: ['zaman', 'zamanlar', 'zamanında', 'zamanı'],
    answer: 2,
    explanation: '«Zamanında» sözcüğü, bir işin belirlenen veya uygun zamanda yapıldığını anlatır.',
  },
]
