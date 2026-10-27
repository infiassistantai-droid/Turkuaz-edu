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
      "Çay genelde küçük fincanlarda, yanında şeker, lokum veya leblebi ile servis edilir. Yaz aylarında sıcak havalar bile bu geleneğin duraksamasına izin vermez; aksine, çay ocağıları şehirlerin en hareketli noktalarıdır.",
      "Turistler, bu ortamda bir araya gelerek Türk çayı tadına bakmadan Türkiye'den ayrılmaz. Çaylık alanlarda hasat zamanı, köylerde hemen her evde «çay buluşmaları» düzenlenir. Bu buluşmalarda insanlar, hasadın ilk ürününü tadarken, aynı zamanda güncel konuları konuşurlar.",
    ],
    questions: [
      {
        id: 'cay-q1',
        type: 'text',
        question: "Metne göre, Türkiye'de çay qaysi holatlara ichiladi?",
        answer: 'Kahvaltıda, iş yerlerinde, okullarda va misafirliklarda.',
        explanation:
          "Matnda to'g'ri javob berilgan: «İnsanlar kahvaltıda, iş yerlerinde, okullarda ve misafirliklerde bir araya gelerek bir bardak çay sohbet ederler.»",
      },
      {
        id: 'cay-q2',
        type: 'bool',
        question: 'Doğru / Yanlış: «Çay, katta fincanlarda va shekersiz servis qilinadi.»',
        answer: false,
        explanation:
          'Matnda: «Çay genelde küçük fincanlarda, yanında şeker, lokum veya leblebi ile servis edilir.» — demak, bu gap yalg\'in.',
      },
      {
        id: 'cay-q3',
        type: 'choice',
        question: 'Yaz aylarida odamlar nima qiladilar?',
        options: [
          'Çay ichishni to\'qisadi',
          'Çay ocaqlarini yopadi',
          'Aksine, çay ichishni davom ettiradi',
          'Leblebi yeyishni to\'qisadi',
        ],
        answer: 2,
        explanation:
          '«Yaz aylarında sıcak havalar bile bu geleneğin duraksamasına izin vermez» — aksine, anʼana davom etadi, çay ocağılari harakatlidir.',
      },
      {
        id: 'cay-q4',
        type: 'choice',
        question: '«Çay uchrashuvlari» qayerda va nima vaqtda oʻtkaziladi?',
        options: [
          'Shaherlarda, qish aylarida',
          'Koylarda, hasat vaqti',
          'Okullarda, har kuni',
          'Istanbulda, bayramlarda',
        ],
        answer: 1,
        explanation:
          '«Çaylık alanlarda hasat zamanı, köylerde hemen her evde çay buluşmaları düzenlenir» — yaʼni qishloqlarda, hasad davrida.',
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
        question: 'Metnga koʻra, tez aloqasining bedevini nima?',
        options: [
          'Duygularni tam anglashni to\'qisadi',
          'Oilalarni bir-biridan uzoqlashtiradi',
          'Kulturali boylikni yo\'q qiladi',
          ' Turkiya daromadini kamaytiradi',
        ],
        answer: 0,
        explanation:
          'Matnda: «yazılan ifadeler çoğu zaman anlamını yitirir ve insan ilişkilerinde yargılara yol açabilir» va «duyguların tam olarak anlaşılmasını engeller» — demak, tez aloqa hissiyotlarni to\'qliq anglashni qiyinlashtiradi.',
      },
      {
        id: 'iletisim-q2',
        type: 'bool',
        question: 'True / False: «Texnologiya insoniy bogʻlarning kuchini kamaytirdi.»',
        answer: false,
        explanation:
          'Matn oxirida: «Teknologiya, iletişimi kolaylaştırsa da insani bağların gücünü asla azaltmamalıdır» — bu gap yalgʻin, chunki matn buni rad etadi.',
      },
      {
        id: 'iletisim-q3',
        type: 'choice',
        question: 'Metndagí «dürüst, nazik va diqqatli boʻlish» nima uchun tavsiya etiladi?',
        options: [
          'Grafik dizayn uchun',
          'Raqamli muhitda yozishda',
          'Telefonda arama qilish uchun',
          'Rasm chizish uchun',
        ],
        answer: 1,
        explanation:
          'Matnda: «dijital ortamda da dürüst, nazik ve dikkatli olmamız gerekmektedir» — yaʼni raqamli (onlayn) muhitda yozishda.',
      },
      {
        id: 'iletisim-q4',
        type: 'text',
        question: 'Metnga koʻra, samimiy va oʻylab yozilgan xabar nimaning ifodasidir?',
        answer: 'Yuz yillardan beri davom etgan madaniyatning.',
        explanation:
          'Matnda: «Gerçeği yansıtan, samimi ve düşünülerek yazılmış bir mesaj, yüzyıllardır süren kültürümüzün bir yansımasıdır» — madaniyatning ifodasi.',
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
    title: '«Kitap Kafe»HE — Ayşeʼnin Monologue',
    duration: 135, // seconds
    transcript: {
      tr: 'Merhaba, ben Ayşe. Ben bir lise öğretmeniyim ve bu yıl okulumuzda başlayan «Kitap Kafe»HE projesi hakkında bahsetmek istiyorum. Öğrencilerimiz her hafta bir araya gelip yeni kitaplar okuyor ve fikirlerini paylaşıyorlar. Bu proje başladığında okulumdaki bazı öğrenciler okumakta zorlanıyordu. Ancak şimdi hem okuma ilgileri arttı hem de düşünme becerileri gelişti. Ayrıca öğrenciler, sohbetlerinin birbirleriyle daha samimi hale geldiğini söylüyorlar. Umarım diğer okullarda da benzer projeler uygulanır.',
      uz: "Salom, men Ayshe. Men litsey o'qituvchisiman va shu yili maktabimizda boshlangan «Kitob Kafe»HE loyihasi haqida gapirmoqchiman. O'quvchilar har hafta birga yig'ilib yangi kitoblar o'qiydilar va fikrlarini baham ko'rishadi. Ushbu loyiha boshlanganda maktabimdagi ba'zi o'quvchilar o'qishga qiynalar edi. Ammo hozir o'qish qiziqishlari oshdi, fikrlash qobiliyatlari ham rivojlandi. Shuningdek, o'quvchilar suhbatlari bir-birlari bilan yanada samimiylashganini aytishadi. Umid qilamiz, boshqa maktablarda ham shunga o'xshash loyihalar amalga oshiriladi.",
    },
    questions: [
      {
        id: 'lq1',
        question: 'Ayşe kimdir?',
        options: ['Bir oʻquvchi', 'Bir oʻqituvchi', 'Bir yozuvchi', 'Bir kutubxonachi'],
        answer: 1,
        explanation: "Ayşe matnda «Ben bir lise öğretmeniyim» deb aytadi — litsey o'qituvchisi.",
      },
      {
        id: 'lq2',
        question: '«Kitob Kafe»HE dasturida oʻquvchilar har hafta nima qiladilar?',
        options: [
          'Kitob yozadilar',
          'Birga yigʻilib kitob oʻqib fikr almashadilar',
          'Sport bilan shugʻullanadilar',
          'Muzika tinglaydilar',
        ],
        answer: 1,
        explanation:
          '«Her hafta bir araya gelip yeni kitaplar okuyor ve fikirlerini paylaşıyorlar» — aynan birga yigʻilib kitob oʻqish va fikr almashish.',
      },
      {
        id: 'lq3',
        question: 'Loyiha natijasida oʻquvchilarning nima ortdi?',
        options: [
          'Xotira chaqligi',
          'Kelime dağarcığı va düşünme becerileri',
          'Uyqu muddati',
          'Televizor koʻrish vaqti',
        ],
        answer: 1,
        explanation:
          '«hem okuma ilgileri arttı hem de düşünme becerileri gelişti» — soʻz principi va fikrlash qobiliyatlari ortdi.',
      },
      {
        id: 'lq4',
        question: 'Ayşe, loyihaning boshqa maktablarda nima boʻlishini xohlaydi?',
        options: [
          'Yopilishi',
          'Shunga oʻxshash loyihalarning amalga oshirilishi',
          'Oʻquvchilar sonining oshishi',
          'Byudjetning oshishi',
        ],
        answer: 1,
        explanation:
          'Oxirgi gap: «Umarım diğer okullarda da benzer projeler uygulanır» — shunga oʻxshash loyihalar amalga oshiriladi.',
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
    title: '1-Topshiriq: Rasmiy/Norasmiy Maktub',
    promptTr:
      'You are a high school student. Write a 120–150 word formal letter to the school principal explaining the purpose of the «Atıktoplama Etkinliği» (recycling event) and why it is important for students and the environment.',
    promptUz:
      "Siz litsey o'quvchisiz. Maktab direktoriga «Atıkto'plash Tadbiri»ning maqsadi va u o'quvchilarga hamda atrof-muhitga qanchalik ahamiyatli ekanligini tushuntirib, 120–150 so'zlik rasmiy maktub yozing.",
    criteria: [
      'Formal shakl: «Saygıylarımı sunarım» bilan ochiladi',
      '120–150 soʻz',
      'Maqsad va ahamiyat tushuntirilgan',
      '«Katılımınızı rica ederim» bilan xushlik',
    ],
    sample:
      'Saygıylarımı sunarım. Ben okulumuz öğrencisiyim ve bu yıl okulumuzda düzenlenecek «Atıktoplama Etkinliği» hakkında bu mektubu yazıyorum. Öncelikle, bu etkinliğin amacı, öğrenciler tarafından üretilen atıklar yeniden değerlendirilmesini ve doğamızın korunmasını sağlamak olduğunu belirtmek isterim. Çevremizin temiz kalması için atıkların ayrıştırılması son derece önemlidir. Bu etkinlik sayesinde hem doğal kaynaklar korunacak hem de öğrencilerde geri dönüşüm bilinci gelişecektir. Ayrıca, etkinlik sonrası okul çevremiz daha temiz ve düzenli bir görünüme kavuşacak, bu da tüm öğrenciler için daha sağlıklı bir ortam yaratacaktır. Bu etkinlik, okulumuzun dört bir yanını renkli ve bilinçli bir atmosfere büründürecektir. Bundan sonraki süreçte bu bilinç, evlerimize ve mahallemizde de yayılacaktır. Ben, tüm öğrencilerin bu değerli etkinliğe katılımını rica ederim. Katılımınız, geleceğe bırakacağımız en güzel mirasa katkıda bulunacağına inanıyorum. Bu adım, toplumumuzun geleceği için hayati bir öneme sahiptir. Saygılarımla.',
    targetWords: '120–150',
  },
  {
    id: 'makale',
    task: 2,
    level: 'C1',
    title: '2-Topshiriq: Esse (Fikr bildirish)',
    promptTr:
      'Sosyal medya, günlük yaşamın ve özellikle gençler üzerindeki önemli bir parçası haline gelmiştir. Gençler üzerindeki olumlu ve olumsuz etkilerini örneklerle değerlendiren 180–220 kelimelik bir esse yazınız.',
    promptUz:
      "Ijtimoiy tarmoqlar kundalik hayotning, ayniqsa yoshlarning hayotidagi muhim o'ringa ega bo'ldi. Yoshlardagi ijobiy va salbiy ta'sirlarni misollar bilan baholab, 180–220 so'zlik esse yozing.",
    criteria: [
      '180–220 soʻz',
      'Ijobiy va salbiy taʼsirlar muvozanatli koʻrsatilgan',
      'Misollar bilan isbotlangan',
      'Kirish, rivojlanish va xulosa qismi bor',
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
    tag: 'C1 · Shaxsiy',
    tr: 'Gözlem yeteneğiniz hakkında bahsedin.',
    uz: 'Kuzatuv qobiliyatingiz haqida gapiring — oʻzingiz qanday narsalarni payqaysiz?',
  },
  {
    id: 2,
    tag: 'B2 · Oʻqish',
    tr: 'Son dönemde okuduğunuz bir kitaptan bahsedin.',
    uz: 'Yaqinda oʻqigan kitobingiz haqida gapiring — u sizga nima berdi?',
  },
  {
    id: 3,
    tag: 'C1 · Jamiyat',
    tr: 'Ana dilinizden başka bir dil öğrenmenin avantajlarını açıklayın.',
    uz: 'Asosiy tilingizdan boshqa til oʻrganish afzalliklarini tushuntiring.',
  },
  {
    id: 4,
    tag: 'B2 · Shaxs',
    tr: 'Kendinizi tanıtırken hangi bilgileri verirsiniz?',
    uz: 'Oʻzingiz haqingizda gap boshlashda qanday maʼlumotlarni berasiz?',
  },
  {
    id: 5,
    tag: 'C1 · Jamiyat',
    tr: 'Büyük bir şehirde yaşamanın zorluklarından bahsedin.',
    uz: 'Katta shaharda yashashning qiyinchiliklari haqida gapiring.',
  },
  {
    id: 6,
    tag: 'C1 · Atrof-muhit',
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
    label: 'Katta unlilar — orqa shox unlilar',
    vowels: ['a', 'ı', 'o', 'u'],
    suffixes: ['-lar', '-da', '-dan'],
    examples: ['kitaplar', 'okulda', 'yoldan'],
  },
  {
    group: 'front',
    label: 'Kichik unlilar — old shox unlilar',
    vowels: ['e', 'i', 'ö', 'ü'],
    suffixes: ['-ler', '-de', '-den'],
    examples: ['evler', 'evde', 'evden'],
  },
]

export const suffixTable = [
  { type: 'Koʻplik', suffix: '-ler / -lar', meaning: 'koʻplik', example: 'ev → evler, okul → okullar' },
  { type: 'Sahov (1-shaxs)', suffix: '-(i)m', meaning: 'mening', example: 'kitap → kitabım, ev → evim' },
  { type: 'Yoʻl (dativ)', suffix: '-(y)e / -(y)a', meaning: 'tomonga', example: 'ev → eve, araba → arabaya' },
  { type: 'Joy (lokativ)', suffix: '-de / -da', meaning: 'joyda', example: 'ev → evde, okul → okulda' },
  { type: 'Manba (ablativ)', suffix: '-den / -dan', meaning: 'kelmoqdan', example: 'ev → evden, yol → yoldan' },
  { type: 'Ichki (genitif)', suffix: '-ın / -in / -un / -ün', meaning: 'nining', example: 'kitap → kitabın, okul → okulun' },
  { type: 'Zamon (feʼl)', suffix: '-yor', meaning: 'hozirgi zamon', example: 'oku- → okuyorum (oʻqiyapman)' },
  { type: 'Oʻtgan zamon', suffix: '-di / -ti', meaning: 'ketdi', example: 'git- → gitti (ketdi)' },
]

export const suffixPlayground = {
  words: ['ev', 'kitap', 'okul', 'araba', 'şehir', 'gül', 'yol', 'çocuk'],
  suffixes: [
    { id: 'plural', name: 'Koʻplik (-lar / -ler)' },
    { id: 'p1', name: 'Sahov 1-shaxs (-(i)m)' },
    { id: 'dat', name: 'Yoʻl (-(y)e / -(y)a)' },
    { id: 'loc', name: 'Joy (-de / -da)' },
    { id: 'abl', name: 'Manba (-den / -dan)' },
    { id: 'gen', name: 'Ichki (-ın / -in / -un / -ün)' },
  ],
}

// ----------------------------------------------------------------------
// Mock exam questions (Sinov imtihoni) — 10 questions, B1–C1 mix
// ----------------------------------------------------------------------
export const mockExamQuestions = [
  {
    id: 1,
    category: 'Gramatika',
    question: 'Size güzel bir hediye ______. aldım.',
    options: ['olarak', 'için', 'ile', 'hakkında'],
    answer: 1,
    explanation: '-için qoʻshimchasi maqsadni bildiradi: «size hediye uchun oldim». Dativ + maqsad maʼnosi.',
  },
  {
    id: 2,
    category: 'Gramatika',
    question: 'Bu tren ______. geliyor?',
    options: ['istasyondan', 'istasyon', 'istasyonda', 'istasyona'],
    answer: 0,
    explanation: '-den/-dan (manba) qoʻshimchasi: «istasyon-dan» — kelmoqdan kelib chiqmoqda.',
  },
  {
    id: 3,
    category: 'Gramatika',
    question: 'Biz ______. oturuyoruz?',
    options: ['ev', 'eve', 'evde', 'evden'],
    answer: 2,
    explanation: '-de/-da (joy) qoʻshimchasi: «ev-de» — joyda.',
  },
  {
    id: 4,
    category: 'Gramatika',
    question: 'Bu kitabın ______. çok güzel yazılmış.',
    options: ['sayfa', 'sayfada', 'sayfaları', 'sayfadan'],
    answer: 2,
    explanation: "Ichki (-un) + ko'plik (-lar): «kitab-ın sayfa-lar-ı» — kitobning sahifalari.",
  },
  {
    id: 5,
    category: 'Gramatika',
    question: 'Öğrenciler okulun ______. gidiyorlar.',
    options: ['bahçe', 'bahçede', 'bahçesine', 'bahçeden'],
    answer: 2,
    explanation: "«bahçe-si-ne» — bog'ga yo'l: possessive -si + dativ -ne qo'shimchalari.",
  },
  {
    id: 6,
    category: 'Gramatika',
    question: 'Annem yemek ______. hazırlıyor.',
    options: ['yapıyor', 'yaptı', 'yapılıyor', 'yapın'],
    answer: 0,
    explanation: "-yor (hozirgi zamon): «yap-ıyor» — hozir tayyorlayapti.",
  },
  {
    id: 7,
    category: 'Gramatika',
    question: 'Dün gece güzel bir film ______.',
    options: ['görüyordu', 'gördüm', 'görüyorum', 'görmüştüm'],
    answer: 1,
    explanation: "-di/-ti (o'tgan zamon, 1-shaxs): «gör-düm» — ko'rdim.",
  },
  {
    id: 8,
    category: 'Lugʻat',
    question: 'Bu sözcük «çok iyi, mükemmel» ______. gelir.',
    options: ['göre', 'doğru', 'anlamına', 'benzer'],
    answer: 2,
    explanation: "«anlamına gelir» — ma'noga ega bo'ladi. Lug'at so'rash turi.",
  },
  {
    id: 9,
    category: 'Oʻqish',
    question: 'Metne göre, turizm Türkiye için ______.',
    miniText: "Turizm, Türkiye'nin ekonomik gelirinin önemli bir kısmını sağlar. Her yıl milyonlarca turist ülkeyi ziyaret eder.",
    options: [
      'unutuilmiş bir alandır',
      'önemli bir gelir kaynağıdır',
      'bir sorun oluşturur',
      'yalnızca yaz aylarına özgüdür',
    ],
    answer: 1,
    explanation: "Matnda: «ekonomik gelirinin önemli bir kısmını sağlar» — iqtisodiy daromadning muhim qismi.",
  },
  {
    id: 10,
    category: 'Lugʻat',
    question: 'Okula ______. geldiniz?',
    options: ['zaman', 'zamanlar', 'zamanında', 'zamanı'],
    answer: 2,
    explanation: '«zamanında» — vaqtida, kelish vaqtida. Qayda soʻzning maʼnoga koʻra tanlanishi.',
  },
]
