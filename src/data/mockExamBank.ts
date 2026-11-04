import type { SkillKey } from '../lib/multilevelScoring'

export type Option = { id: string; label: string }
export type QuestionKind = 'choice' | 'matching' | 'boolean'
export type TestQuestion = {
  id: string
  number: number
  prompt: string
  kind: QuestionKind
  options: Option[]
  correctAnswer: string
  audioText?: string
}
export type TestPart = {
  id: string
  title: string
  instructions: string
  contextTitle?: string
  context?: string
  audioText?: string
  transcriptLabel?: string
  planLocations?: string[]
  questions: TestQuestion[]
}
export type QuestionSection = { key: 'dinleme' | 'okuma'; label: string; durationMinutes: number; totalQuestions: 35; parts: TestPart[] }
export type WritingPrompt = { id: string; task: 1 | 2; title: string; prompt: string; minWords: number; maxWords: number; maxRaw: 12 | 24 }
export type SpeakingPrompt = { id: string; part: 1 | 2 | 3; title: string; prompt: string; preparationSeconds?: number }
export type GeneratedMock = {
  id: string
  generatedAt: string
  dinleme: QuestionSection
  okuma: QuestionSection
  yazma: { key: 'yazma'; label: string; durationMinutes: number; tasks: WritingPrompt[] }
  konusma: { key: 'konusma'; label: string; durationMinutes: number; parts: SpeakingPrompt[] }
}

const ABC = ['A', 'B', 'C'].map((id) => ({ id, label: id }))
const ABCD = ['A', 'B', 'C', 'D'].map((id) => ({ id, label: id }))
type RandomSource = () => number
const optionLetters = (letters: string[]) => letters.map((id) => ({ id, label: id }))
const shuffle = <T,>(items: T[], random: RandomSource = Math.random) => {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}
const sample = <T,>(items: T[], count: number, random: RandomSource = Math.random) => shuffle(items, random).slice(0, count)
const optionList = (labels: string[]) => labels.map((label, index) => ({ id: String.fromCharCode(65 + index), label: `${String.fromCharCode(65 + index)}. ${label}` }))
function randomizedChoiceOptions(labels: string[], correctLetter: string, random: RandomSource = Math.random) {
  const correctLabel = labels[correctLetter.charCodeAt(0) - 65]
  const shuffledLabels = shuffle(labels, random)
  return {
    options: optionList(shuffledLabels),
    correctAnswer: String.fromCharCode(65 + shuffledLabels.indexOf(correctLabel)),
  }
}

function makeQuestion(id: string, number: number, prompt: string, correctAnswer: string, options: Option[], kind: QuestionKind = 'choice', audioText?: string): TestQuestion {
  return { id, number, prompt, correctAnswer, options, kind, ...(audioText ? { audioText } : {}) }
}

function makePartQuestions(partId: string, firstNumber: number, items: Array<Omit<TestQuestion, 'number' | 'id'>>, title: string, instructions: string, extra: Partial<TestPart> = {}): TestPart {
  return {
    id: partId,
    title,
    instructions,
    ...extra,
    questions: items.map((item, index) => ({ ...item, id: `${partId}-${index + 1}`, number: firstNumber + index })),
  }
}

const reactionPools = [
  [
    ['Yarınki toplantı saat kaçta başlayacak?', ['Saat dokuzda başlayacak.', 'Geçen hafta başladık.', 'Toplantı çok ilginçti.'], 'A'],
    ['Bugün hava çok soğuk, değil mi?', ['Evet, kalın giyinmek iyi olur.', 'Saatimi evde unuttum.', 'İki kilometre uzakta.'], 'A'],
    ['Bu kitabı nereden aldın?', ['Kitapçıdan aldım.', 'Dün okumayı bitirdim.', 'Çok teşekkür ederim.'], 'A'],
    ['Bana biraz yardım edebilir misiniz?', ['Elbette, neye ihtiyacınız var?', 'Yardımı geçen yıl aldık.', 'Saat beşte kapandı.'], 'A'],
    ['Akşam yemeğine bize katılır mısın?', ['Memnuniyetle, teşekkür ederim.', 'Yemek masanın üstünde.', 'Benim adım Ayşe.'], 'A'],
    ['Otobüs durağına nasıl gidebilirim?', ['İkinci sokaktan sağa dönün.', 'Otobüs çok kalabalıktı.', 'Biletimi dün aldım.'], 'A'],
    ['Sınav sonuçları açıklandı mı?', ['Henüz açıklanmadı, bekliyoruz.', 'Sonuçları çok beğendim.', 'Sınav salonu üçüncü katta.'], 'A'],
    ['Bu gömleğin fiyatı ne kadar?', ['Etikette dört yüz lira yazıyor.', 'Mavi rengi daha çok severim.', 'Gömleğimi ütüledim.'], 'A'],
    ['Pencereyi açabilir miyim?', ['Tabii, biraz hava alalım.', 'Pencereyi geçen ay satın aldık.', 'Açık mavi benim rengim.'], 'A'],
    ['Hafta sonu dağ yürüyüşüne gidelim mi?', ['Harika fikir, erkenden çıkalım.', 'Dağın yüksekliği iki bin metre.', 'Yürüyüş ayakkabılarım kahverengi.'], 'A'],
    ['Randevumu başka bir güne alabilir miyiz?', ['Elbette, perşembe günü uygun musunuz?', 'Randevu defterim masada.', 'Günler hızlı geçiyor.'], 'A'],
    ['Yemek çok lezzetli olmuş, elinize sağlık.', ['Afiyet olsun, beğenmenize sevindim.', 'Ellerimi yemekten önce yıkadım.', 'Restoran saat onda açılıyor.'], 'A'],
    ['Kütüphane bugün kaça kadar açık?', ['Akşam sekize kadar açık.', 'Kitaplığım yeni ve beyaz.', 'Bugün çok kitap okudum.'], 'A'],
    ['Tren biletimi internetten alabilir miyim?', ['Evet, uygulamadan kolayca alabilirsiniz.', 'Tren istasyonu çok eski.', 'Biletimi cüzdanımda buldum.'], 'A'],
    ['Bu hafta sonu müzeyi ziyaret ettin mi?', ['Evet, sergi gerçekten etkileyiciydi.', 'Müzik dinlemeyi çok severim.', 'Hafta içi üç gün çalışıyorum.'], 'A'],
    ['Çantanızı burada unutmuşsunuz.', ['Uyardığınız için çok teşekkür ederim.', 'Çantalar genellikle pahalıdır.', 'Burada oturmayı tercih ederim.'], 'A'],
  ],
  [
    ['Yeni işin nasıl gidiyor?', ['Çok iyi, ekibimle uyum içindeyim.', 'İş yerim geçen yıl yapıldı.', 'Pazartesi günü saat yedide.'], 'A'],
    ['Kahvenize süt ister misiniz?', ['Evet, biraz süt lütfen.', 'Kahve çekirdeği Güney Amerika’da yetişir.', 'Sütü buzdolabına koydum.'], 'A'],
    ['Bu akşam sinemaya bilet bulabildin mi?', ['Evet, son seansta iki yer var.', 'Film geçen yıl çekildi.', 'Sinemanın önünde buluştuk.'], 'A'],
    ['Ödevini ne zamana kadar teslim etmelisin?', ['Cuma gününe kadar teslim etmeliyim.', 'Ödevim çok renkli görünüyor.', 'Teslimat kapının önünde.'], 'A'],
    ['Şehir merkezine hangi otobüs gidiyor?', ['On iki numaralı otobüse binebilirsiniz.', 'Şehir merkezinde bir çeşme var.', 'Otobüs şoförü çok nazikti.'], 'A'],
    ['Dün neden derse gelemedin?', ['Kendimi iyi hissetmiyordum.', 'Ders kitabımın kapağı yeşil.', 'Dersler saat üçte bitiyor.'], 'A'],
    ['Bu fotoğrafı kim çekti?', ['Kardeşim çekti, çok güzel değil mi?', 'Fotoğraf makinesi çantada.', 'Çekim yarın yapılacak.'], 'A'],
    ['Banka hafta içi kaçta kapanıyor?', ['Saat beşte kapanıyor.', 'Bankta arkadaşımı bekledim.', 'Hafta içi hava güneşliydi.'], 'A'],
    ['Tatilde nerede kalmayı düşünüyorsunuz?', ['Sahile yakın küçük bir otelde.', 'Tatiller çok çabuk geçiyor.', 'Kalemimi masada bıraktım.'], 'A'],
    ['Bana adresinizi mesajla gönderir misiniz?', ['Tabii, hemen gönderiyorum.', 'Mesaj kutusu dolu görünüyor.', 'Adres defterini dün aldım.'], 'A'],
    ['Daha önce hiç Türk kahvesi denediniz mi?', ['Evet, köpüklü olanı çok seviyorum.', 'Kahverengi ayakkabılarım eskidi.', 'Deniz bugün sakin.'], 'A'],
    ['Bu raporu bugün bitirebilir misin?', ['Elimden geleni yapacağım.', 'Rapor masanın üzerindeydi.', 'Bugün ayın on beşi.'], 'A'],
    ['Kayıp eşya bürosu hangi katta?', ['Zemin katta, danışmanın yanında.', 'Eşyalarımı dün taşıdım.', 'Katlar çok temiz.'], 'A'],
    ['Çocuklar için indirim var mı?', ['On iki yaşından küçüklere indirim var.', 'Çocuklar parkta oynuyor.', 'İndirimli gün pazartesiydi.'], 'A'],
    ['Toplantı notlarını benimle paylaşır mısın?', ['Tabii, birazdan e-posta gönderirim.', 'Not defterim çok küçük.', 'Paylaşım geçen ay yapıldı.'], 'A'],
    ['Bu bitkiyi ne sıklıkla sulamalıyım?', ['Toprağı kurudukça sulayın.', 'Bitki örtüsü çok çeşitli.', 'Suyu marketten aldım.'], 'A'],
  ],
]

const announcementSets = [
  {
    title: 'Üniversite Doğa Kulübü Duyurusu',
    audioText: 'Sevgili öğrenciler, Doğa Kulübümüz bu cumartesi Sapanca Gölü çevresinde bir çevre temizliği etkinliği düzenliyor. Otobüs saat sekizde ana kapıdan hareket edecek. Katılımcıların yanlarında su şişesi ve rahat ayakkabı getirmelerini rica ediyoruz. Etkinliğe katılım ücretsizdir; öğle yemeği kulüp tarafından karşılanacaktır. Kayıtlar cuma günü saat beşe kadar öğrenci işleri ofisinde yapılabilir.',
    statements: [
      ['Etkinlik cumartesi günü yapılacaktır.', 'A'], ['Kulüp üyeleri göl çevresinde temizlik yapacaktır.', 'A'],
      ['Otobüs saat dokuzda hareket edecektir.', 'B'], ['Katılımcılar rahat ayakkabı getirmelidir.', 'A'],
      ['Etkinlik için katılım ücreti alınacaktır.', 'B'], ['Öğle yemeğini katılımcılar kendileri getirecektir.', 'B'],
    ],
  },
  {
    title: 'Şehir Kütüphanesi Yaz Programı',
    audioText: 'Değerli ziyaretçiler, yaz dönemi boyunca kütüphanemiz hafta içi akşam dokuzda kapanacaktır. Her çarşamba çocuklar için ücretsiz masal saati düzenlenecek. Yetişkinler için yaratıcı yazarlık atölyesi ise salı günleri yapılacak ve ön kayıt gerektirecektir. Okuma salonunda yiyecek tüketilmesine izin verilmemektedir. Üyelik kartınızı girişte göstermeniz yeterlidir.',
    statements: [
      ['Kütüphane yazın hafta içi akşam dokuzda kapanır.', 'A'], ['Masal etkinliği her çarşamba çocuklara açıktır.', 'A'],
      ['Yaratıcı yazarlık atölyesi perşembe günleri yapılır.', 'B'], ['Atölye için ön kayıt yapılmalıdır.', 'A'],
      ['Okuma salonunda yiyecek yenebilir.', 'B'], ['Kütüphaneye giriş için üyelik kartı gösterilmelidir.', 'A'],
    ],
  },
]

const speakerSets = [
  {
    title: 'Dört kişinin hafta sonu tercihleri',
    options: ['A. Doğada vakit geçirmek', 'B. Yeni bir yemek tarifi denemek', 'C. Tarihi yerleri gezmek', 'D. Evde dinlenmek', 'E. Spor karşılaşması izlemek', 'F. Arkadaşlarla müzik yapmak'],
    speakers: [
      ['Bu hafta sonu şehirden uzaklaşacağım. Çadırımızı ve yürüyüş çantamızı hazırladık; gölün etrafındaki patikada uzun bir rota izleyeceğiz.', 'A'],
      ['Evde yeni bir şeyler pişirmek istiyorum. İnternette yöresel bir börek tarifi buldum, malzemeleri de şimdiden aldım.', 'B'],
      ['Geçen ay restore edilen eski kervansarayı görmeyi çok istiyorum. Rehberli tur için bilet aldım.', 'C'],
      ['Bütün hafta yoğun çalıştım. Bu iki günde telefonumu kapatıp kitap okuyacağım ve biraz uyuyacağım.', 'D'],
    ],
  },
  {
    title: 'Dört kişinin öğrenme yöntemleri',
    options: ['A. Bir çalışma grubuna katılmak', 'B. Görsel malzemeler kullanmak', 'C. Düzenli kısa tekrarlar yapmak', 'D. Öğrendiğini başkasına anlatmak', 'E. Sessiz bir ortamda çalışmak', 'F. Gerçek yaşamda pratik yapmak'],
    speakers: [
      ['Yeni kelimeleri bir arkadaşımla karşılıklı sorup cevaplıyoruz. Birbirimize açıklayınca bilgiler daha iyi aklımda kalıyor.', 'D'],
      ['Konuları uzun süre tek başıma çalışmak yerine her gün yirmi dakika gözden geçiriyorum. Böylece unutmuyorum.', 'C'],
      ['Bir dil kursunda küçük bir ekibimiz var. Her hafta belirli bir konu seçip beraber alıştırma yapıyoruz.', 'A'],
      ['Harita, renkli kart ve şema hazırlıyorum. Bilgileri resimlerle ilişkilendirince daha kolay öğreniyorum.', 'B'],
    ],
  },
]

const planSets = [
  {
    title: 'Kent Müzesi Ziyaret Planı',
    locations: ['A. Giriş ve bilet gişesi', 'B. Arkeoloji salonu', 'C. Kafe', 'D. Geçici sergi', 'E. Çocuk atölyesi', 'F. Hediyelik eşya dükkânı', 'G. Dinlenme bahçesi', 'H. Müze kütüphanesi'],
    tasks: [['Biletinizi burada alıp ziyaretçi haritası edinebilirsiniz.', 'A'], ['Antik dönemden kalan taş eserler bu bölümde sergileniyor.', 'B'], ['Sıcak bir içecek ve hafif bir atıştırmalık alabileceğiniz yer.', 'C'], ['Bu ay yalnızca üç hafta açık olan fotoğraf sergisi burada.', 'D'], ['Çocuklar burada kil kullanarak küçük objeler yapıyor.', 'E']],
  },
  {
    title: 'Üniversite Kampüsü Planı',
    locations: ['A. Öğrenci işleri', 'B. Merkez kütüphane', 'C. Spor salonu', 'D. Yemekhane', 'E. Sağlık merkezi', 'F. Dil laboratuvarı', 'G. Konferans salonu', 'H. Bisiklet parkı'],
    tasks: [['Ders programı ve öğrenci belgesi işlemleri burada yapılır.', 'A'], ['Sessiz çalışma alanları ve ödünç kitap bölümü bu binadadır.', 'B'], ['Basketbol sahası ve kondisyon aletleri burada bulunur.', 'C'], ['Öğrenciler öğle yemeğini uygun fiyatla burada yiyebilir.', 'D'], ['Küçük sağlık sorunları için hemşireye danışabileceğiniz yer.', 'E']],
  },
]

const dialogueSets = [
  [
    { text: 'A: Yarınki sunum için görseller hazır mı? B: Evet, son düzenlemeleri bu akşam yapıp sana göndereceğim.', questions: [['Kadın/erkek sunum görsellerini ne zaman gönderecek?', ['Bu akşam', 'Yarın sabah', 'Geçen hafta', 'Henüz karar vermedi'], 'A'], ['Görseller hangi etkinlik için hazırlanıyor?', ['Bir sunum', 'Bir konser', 'Bir gezi', 'Bir yarışma'], 'A']] },
    { text: 'A: Bu otobüs sahil yolundan geçiyor mu? B: Hayır, meydanda inip on sekiz numaraya aktarma yapmanız gerekiyor.', questions: [['Yolcu nereye gitmek istiyor?', ['Sahile', 'Hastaneye', 'Havaalanına', 'Müzeye'], 'A'], ['Yolcu ne yapmalı?', ['Meydanda aktarma yapmalı', 'Yürüyerek devam etmeli', 'Biletini iptal etmeli', 'Taksi çağırmalı'], 'A']] },
    { text: 'A: Kütüphaneden aldığım romanı uzatabilir miyim? B: Tabii, başka biri ayırtmadıysa uygulamadan iki hafta uzatabilirsiniz.', questions: [['Romanın süresi nasıl uzatılabilir?', ['Uygulama üzerinden', 'Telefonla arayarak', 'Kütüphaneye mektup yazarak', 'Yeni kitap alarak'], 'A'], ['Uzatma ne zaman mümkün olmayabilir?', ['Kitap başkası tarafından ayrılmışsa', 'Kütüphane açıksa', 'Roman kısa ise', 'Uygulama güncelse'], 'A']] },
  ],
  [
    { text: 'A: Yeni mahalledeki fırını denedin mi? B: Evet, ekmekleri çok taze; sabah erken gitmek gerekiyor çünkü çabuk tükeniyor.', questions: [['Fırının ürünleri nasıldır?', ['Taze', 'Çok pahalı', 'Tuzsuz', 'Dondurulmuş'], 'A'], ['Fırına ne zaman gitmek daha iyi?', ['Sabah erken', 'Gece geç', 'Öğleden sonra', 'Pazar akşamı'], 'A']] },
    { text: 'A: Toplantı odasını bulamadım. B: Asansörle üçüncü kata çık, koridorun sonunda solda.', questions: [['Oda hangi kattadır?', ['Üçüncü', 'Birinci', 'İkinci', 'Beşinci'], 'A'], ['Oda koridorun neresindedir?', ['Sonunda solda', 'Başında sağda', 'Ortasında solda', 'Asansörün yanında'], 'A']] },
    { text: 'A: Hafta sonu seramik atölyesine katılacak mısın? B: İsterim ama kayıt için bugün son günmüş; öğle arasında formu dolduracağım.', questions: [['Atölye hangi gün yapılacak?', ['Hafta sonu', 'Bugün öğle', 'Cuma sabahı', 'Gelecek ay'], 'A'], ['Kayıt için son gün ne zaman?', ['Bugün', 'Yarın', 'Hafta sonu', 'Gelecek hafta'], 'A']] },
  ],
]

type LongTalk = { title: string; audioText: string; questions: Array<[string, string[], string]> }
const longTalks: LongTalk[] = [
  {
    title: 'Kentlerde yeşil alanların önemi',
    audioText: 'Son yıllarda şehirlerde yaşayan insan sayısı hızla arttı. Bu büyüme, konut ve ulaşım ihtiyacını artırırken açık alanların azalmasına da yol açabiliyor. Oysa parklar yalnızca dinlenme yeri değildir; yazın sıcaklığı düşürür, yağmur suyunun toprağa karışmasını sağlar ve farklı yaşlardan insanları bir araya getirir. Uzmanlar, mahalle ölçeğinde küçük yeşil alanlar oluşturmanın bile ruh sağlığına olumlu katkı verdiğini belirtiyor. Belediyeler, yeni yapı projelerinde ağaçları korumalı ve çocuklar ile yaşlıların güvenle kullanabileceği alanlar tasarlamalıdır. Ayrıca vatandaşların bakım çalışmalarına katılması, bu alanların daha uzun süre temiz ve canlı kalmasına yardımcı olur.',
    questions: [
      ['Kent nüfusundaki artış hangi sonucu doğurabilir?', ['Açık alanların azalmasını', 'Yağışların tamamen durmasını', 'Toplu taşımanın ücretsiz olmasını', 'Bütün parkların büyümesini'], 'A'],
      ['Parkların şehirdeki işlevlerinden biri nedir?', ['Yağmur suyunun toprağa ulaşmasını desteklemek', 'Konut fiyatlarını belirlemek', 'Trafiği tamamen ortadan kaldırmak', 'Okul sayısını azaltmak'], 'A'],
      ['Uzmanlara göre küçük yeşil alanlar neye katkı sağlar?', ['Ruh sağlığına', 'İnternet hızına', 'Bina yüksekliğine', 'Ticaret saatlerine'], 'A'],
      ['Belediyeler yeni projelerde ne yapmalıdır?', ['Ağaçları koruyup güvenli alanlar tasarlamalı', 'Parkları yalnızca yetişkinlere açmalı', 'Bütün yolları genişletmeli', 'Bakım işlerini durdurmalı'], 'A'],
      ['Vatandaşların bakım çalışmalarına katılması ne sağlar?', ['Alanların daha temiz ve canlı kalmasını', 'Yeni binaların daha hızlı yapılmasını', 'Yağışların azalmasını', 'Şehir dışına taşınmayı'], 'A'],
      ['Metnin temel amacı nedir?', ['Kentsel yeşil alanların yararlarını açıklamak', 'Bir parkın tarihini anlatmak', 'Belediye bütçesini karşılaştırmak', 'Ağaç türlerini sınıflandırmak'], 'A'],
    ],
  },
  {
    title: 'Uzaktan çalışma ve yeni alışkanlıklar',
    audioText: 'Uzaktan çalışma, birçok meslekte günlük hayatın bir parçası haline geldi. Evden çalışmak yol süresini azaltabilir ve çalışanlara günlerini daha esnek planlama olanağı verebilir. Ancak ev ile iş arasındaki sınır belirsizleştiğinde dinlenme zamanı kısalabilir. Bu nedenle uzmanlar, çalışma saatlerini önceden belirlemeyi ve gün sonunda bilgisayarı kapatmayı öneriyor. Ekiplerin düzenli çevrim içi görüşmeler yapması iletişimi kolaylaştırsa da her konunun toplantıyla çözülmesi verimli değildir. Açık görev listeleri ve kısa yazılı güncellemeler, ekip üyelerinin birbirinden haberdar kalmasına yardımcı olur. Kurumlar, çalışanların yalnızca iş çıktısını değil, iyi olma hâlini de önemsemelidir.',
    questions: [
      ['Uzaktan çalışmanın olası yararlarından biri nedir?', ['Yol süresini azaltması', 'Bütün toplantıları kaldırması', 'İş gününü uzatması', 'Ekip iletişimini gereksiz kılması'], 'A'],
      ['Ev ve iş sınırları belirsizleşince ne olabilir?', ['Dinlenme süresi azalabilir', 'Ulaşım masrafı artar', 'İş tamamen durur', 'Çevrim içi iletişim kaybolur'], 'A'],
      ['Uzmanlar gün sonunda ne öneriyor?', ['Bilgisayarı kapatmayı', 'Yeni görevler eklemeyi', 'Toplantı sayısını artırmayı', 'Çalışma saatini uzatmayı'], 'A'],
      ['Metne göre ekip iletişimini ne destekler?', ['Kısa yazılı güncellemeler', 'Sürekli uzun toplantılar', 'Görevleri gizli tutmak', 'Mesajları haftada bir okumak'], 'A'],
      ['Kurumlar çalışanlarda neye de önem vermelidir?', ['İyi olma hâline', 'Ev adreslerine', 'Bilgisayar markasına', 'Günlük yol uzunluğuna'], 'A'],
      ['Metnin ana düşüncesi hangisidir?', ['Uzaktan çalışmanın yarar ve sınırlarını dengeli yönetmek', 'Ofisleri tamamen kapatmak', 'Her işi çevrim içi toplantıyla yürütmek', 'Çalışanların yalnız çalışmasını sağlamak'], 'A'],
    ],
  },
]

const clozeSets = [
  {
    title: 'Mahallem',
    context: 'Yaşadığım mahalle küçük ama oldukça canlıdır. Sabahları fırından taze ekmek kokusu gelir. Komşular birbirini iyi ____1____ ve zor zamanlarda hemen yardıma koşar. Sokağımızdaki park, çocukların oyun ____2____ olurken yetişkinler için de dinlenme alanıdır. Belediyenin geçen yıl yaptığı düzenlemeyle kaldırımlar daha güvenli ____3____. Her ay mahalle sakinleri ortak bir toplantıda sorunları ____4____ ve çözüm önerileri sunar. Bu toplantılar sayesinde yeni fikirler ____5____, mahalleye bağlılık duygusu da ____6____.',
    words: ['A. tanır', 'B. alanı', 'C. hâle geldi', 'D. paylaşır', 'E. ortaya çıkar', 'F. güçlenir', 'G. kaybolur'],
    answers: ['A', 'B', 'C', 'D', 'E', 'F'],
  },
  {
    title: 'Günlük Rutinim',
    context: 'Güne erken başlamayı seviyorum. Önce kısa bir yürüyüş ____1____, sonra kahvaltı yaparım. İşe giderken otobüste haberleri ____2____. Gün içinde işlerimi önem sırasına göre ____3____, böylece zamanımı daha verimli kullanırım. Öğle arasında biraz dinlenmek enerjimi ____4____. Akşam eve dönünce ertesi gün için çantamı ____5____ ve günü sakin bir kitap okuyarak ____6____.',
    words: ['A. dinlerim', 'B. sıralarım', 'C. tamamlarım', 'D. yaparım', 'E. hazırlarım', 'F. artırır', 'G. azaltır'],
    answers: ['D', 'A', 'B', 'F', 'E', 'C'],
  },
]

const adSets = [
  {
    title: 'Günlük ilanlar ve aradığınız hizmetler',
    statements: ['A. Hafta sonu çocuklar için ücretsiz etkinlik arayan aileler', 'B. İkinci el bisiklet satın almak isteyenler', 'C. Akşam saatlerinde yabancı dil dersi almak isteyenler', 'D. Evine yakın taze sebze ve meyve arayanlar', 'E. Küçük bir evcil hayvanı geçici olarak bırakacak yer arayanlar', 'F. Hafta içi sessiz çalışılabilecek bir ortam arayanlar', 'G. Eski fotoğrafları dijital ortama aktarmak isteyenler', 'H. Şehir içinde uygun fiyatlı taşınma yardımı arayanlar', 'I. Hafta sonu doğa yürüyüşüne katılmak isteyenler', 'J. Kullanılmış kitaplarını takas etmek isteyenler'],
    ads: [
      ['Her cumartesi 10.00–12.00 arasında çocuk kütüphanesinde masal, resim ve drama çalışmaları. Katılım için ön kayıt gerekmiyor.', 'A'],
      ['Bakımlı şehir bisikletimi uygun fiyata satıyorum. Vitesleri yeni değişti, hafta içi akşamları gelip deneyebilirsiniz.', 'B'],
      ['Merkez Dil Evi’nde pazartesi ve çarşamba 19.00’da başlangıç düzeyinde Türkçe konuşma grubu.', 'C'],
      ['Kooperatif pazarımız her gün 08.00’de açılıyor. Ürünler yakın köylerden geliyor; pazar yeri metro çıkışının yanında.', 'D'],
      ['Kitapçı Arka Oda’da cumartesi günü okuduğunuz kitapları getirip başka kitaplarla değiştirebilirsiniz.', 'J'],
      ['Kent Parkı Doğa Topluluğu pazar sabahı kolay seviyede yürüyüş düzenliyor. Su ve rahat ayakkabı yeterli.', 'I'],
      ['Fotoğraf Atölyesi eski albümlerinizi tarayıp yüksek çözünürlüklü dosya olarak teslim eder.', 'G'],
      ['Sessiz Masa çalışma salonu hafta içi 22.00’ye kadar açık; öğrenci üyeliği indirimlidir.', 'F'],
    ],
  },
  {
    title: 'Şehir rehberi: duyurular',
    statements: ['A. Evdeki mobilyalarını taşıyacak uygun fiyatlı ekip arayanlar', 'B. Hafta sonu ücretsiz çocuk atölyesi arayan aileler', 'C. Akşamları başlangıç düzeyinde Türkçe öğrenmek isteyenler', 'D. Yakın çevreden mevsimlik ürün almak isteyenler', 'E. Bisiklet için yedek parça arayanlar', 'F. Kısa süreli kedi bakımı arayanlar', 'G. Haftada birkaç gün sessiz çalışma masası isteyenler', 'H. Eski kitapları elden çıkarmak isteyenler', 'I. Dijital fotoğraf tarama hizmeti arayanlar', 'J. Pazar sabahı rehber eşliğinde yürüyüş isteyenler'],
    ads: [
      ['Minik Eller Sanat Evi’nde pazar günü 11.00’de ücretsiz seramik tanıtımı. Malzemeler merkez tarafından sağlanır.', 'B'],
      ['Usta Taşıma ekibi, şehir içindeki küçük ev taşımalarında sabit ve uygun fiyatlı paket sunuyor.', 'A'],
      ['Akşam Türkçe Kulübü salı ve perşembe günleri 18.30’da A1 seviyesinde buluşuyor.', 'C'],
      ['Çınar Üretici Pazarı’nda bölgedeki çiftçilerin mevsim sebzeleri ve ev yapımı ürünleri bulunur.', 'D'],
      ['Kampüs Çalışma Salonu’nda günlük veya haftalık masa ayırtabilirsiniz; ortam sessizdir.', 'G'],
      ['Eski romanlarınızı Kitap Değişim Noktası’na getirin, seçtiğiniz başka kitaplarla ücretsiz değiştirin.', 'H'],
      ['Anı Fotoğrafçılık, eski baskıları renk ve çizik düzeltmesiyle dijital dosyaya dönüştürür.', 'I'],
      ['Pazar günleri saat 08.00’de başlayan yürüyüşte rehber, kıyı patikasındaki bitkileri tanıtıyor.', 'J'],
    ],
  },
]

const headingSets = [
  {
    title: 'Dünyanın dört bir yanındaki pazarlar',
    headings: ['A. Pazarlık geleneği', 'B. Yerel üreticilerin buluşması', 'C. Tarihi bir ticaret merkezi', 'D. Sokak lezzetleri', 'E. Yeni teknolojiyle alışveriş', 'F. Pazarın toplumsal rolü', 'G. İklime göre değişen ürünler', 'H. Zanaatkârların sergisi'],
    paragraphs: [
      ['Bazı kentlerde pazar, yüzyıllardır aynı meydanda kuruluyor. Taş kemerlerin altındaki dükkânlar geçmişte tüccarların buluştuğu yerken bugün de ziyaretçileri ağırlıyor.', 'C'],
      ['Küçük çiftliklerden gelen satıcılar ürünlerini doğrudan tüketiciye sunuyor. Böylece üretici emeğinin karşılığını alırken alıcı da ürünün nerede yetiştiğini öğreniyor.', 'B'],
      ['Satıcı ile müşteri arasındaki fiyat konuşması burada alışverişin doğal bir parçası. İki taraf da uygun bir noktada anlaşana kadar nazikçe fikir alışverişinde bulunuyor.', 'A'],
      ['Tezgâhların çevresinde yayılan ekmek, baharat ve ızgara kokuları ziyaretçileri durduruyor. Birçok kişi alışverişten çok farklı tatları denemek için buraya geliyor.', 'D'],
      ['Pazar yalnızca alışveriş yeri değildir. İnsanlar tanıdıklarıyla karşılaşır, haber paylaşır ve yeni komşularıyla ilişki kurar.', 'F'],
      ['Dağ köylerindeki tezgâhlarda kışın kurutulmuş meyveler, yazın ise taze otlar bulunur. Ürün çeşitliliğini bölgenin hava koşulları belirler.', 'G'],
    ],
  },
  {
    title: 'Geleneksel sanatlar ve ustalık',
    headings: ['A. Usta-çırak ilişkisi', 'B. Günümüzde yeniden ilgi', 'C. Doğal malzemenin seçimi', 'D. Sabır isteyen bir süreç', 'E. Motiflerin anlamı', 'F. Ürünlerin korunması', 'G. Sanatın aile ekonomisine katkısı', 'H. Yeni tasarım araçları'],
    paragraphs: [
      ['Bir zanaatı öğrenmek çoğu zaman atölyede uzun yıllar geçirmeyi gerektirir. Gençler, ustalarını izleyerek önce temel hareketleri, sonra işin inceliklerini kavrar.', 'A'],
      ['Bir kilimin renkleri ve tekrar eden şekilleri, onu dokuyan topluluğun doğa ve yaşam anlayışına dair ipuçları taşır. Her desenin kendine özgü bir hikâyesi olabilir.', 'E'],
      ['İyi bir seramik için kullanılacak toprağın yapısı dikkatle incelenir. Usta, malzemenin pişirme sırasında nasıl davranacağını önceden anlamaya çalışır.', 'C'],
      ['Ahşabı oyarken acele etmek çatlaklara ve biçim bozukluğuna yol açabilir. Bu nedenle her küçük bölümün tamamlanması dikkat ve zaman ister.', 'D'],
      ['Son yıllarda genç tasarımcılar geleneksel dokuma ve çiniyi çağdaş ürünlerle birleştiriyor. Bu yaklaşım, eski teknikleri yeni kuşaklarla buluşturuyor.', 'B'],
      ['Müzeler eserleri sabit sıcaklık ve nem koşullarında saklıyor. Böylece boya, kumaş ve ahşap gibi hassas malzemelerin yıpranması yavaşlatılıyor.', 'F'],
    ],
  },
]

type NarrativeSet = { title: string; context: string; mcq: Array<[string, string[], string]>; tf: Array<[string, string]> }
const narrativeSets: NarrativeSet[] = [
  {
    title: 'Kapadokya’da bir hafta sonu',
    context: 'Ece ve arkadaşları sonbaharda Kapadokya’ya gitmek için uzun zamandır plan yapıyordu. İlk gün Göreme’deki açık hava müzesini gezdiler; rehber, kaya kiliselerinin farklı dönemlerde nasıl kullanıldığını anlattı. Öğleden sonra hava aniden yağmurlu oldu ve balon turu ertesi sabaha ertelendi. Grup, otellerine dönmek yerine küçük bir seramik atölyesine uğradı. Usta, bölgedeki kırmızı toprağın çömlek yapımında neden tercih edildiğini gösterdi. Ertesi sabah gökyüzü açık olmasına rağmen rüzgâr kuvvetliydi; güvenlik ekibi uçuşu iptal etti. Ece biraz hayal kırıklığına uğradı, ancak vadi yollarında yürüyüş yaparken gün doğumunun renklerini izledi. Dönüşten önce arkadaşlar, yerel üreticilerin hazırladığı kahvaltıyı denedi ve ziyaret ettikleri yerlerin fotoğraflarını birbirleriyle paylaştı. Ece, geziyi yalnızca balon uçuşuyla hatırlamayacağını, plansız karşılaşmaların da yolculuğu güzelleştirdiğini düşündü.',
    mcq: [
      ['Grup ilk gün nereleri ziyaret etti?', ['Göreme Açık Hava Müzesi’ni', 'Bir yer altı hastanesini', 'Ankara’daki müzeyi', 'Sahil kasabasını'], 'A'],
      ['Balon turu neden ertelendi?', ['Hava yağmurlu olduğu için', 'Biletler kaybolduğu için', 'Rehber gelmediği için', 'Grup geç kaldığı için'], 'A'],
      ['Atölyede hangi konu gösterildi?', ['Kırmızı toprağın çömlek yapımında kullanılması', 'Balonların nasıl onarıldığı', 'Vadi bitkilerinin yetiştirilmesi', 'Kilise resimlerinin çizilmesi'], 'A'],
      ['Uçuş ertesi sabah neden iptal edildi?', ['Rüzgâr kuvvetli olduğu için', 'Gökyüzü kapalı olduğu için', 'Ece istemediği için', 'Araçlar bozulduğu için'], 'A'],
    ],
    tf: [['İlk gün hava baştan sona güneşliydi.', 'B'], ['Balon uçuşu güvenlik nedeniyle yapılmadı.', 'A'], ['Ece geziyi yalnızca balonla hatırlayacağını söyledi.', 'B'], ['Grup dönüşten önce yerel kahvaltı denedi.', 'A'], ['Ece’nin otelinin adı metinde belirtiliyor.', 'C']],
  },
  {
    title: 'Llandudno’ya tren yolculuğu',
    context: 'Mert, yaz tatilinde kuzeniyle birlikte kuzey kıyısındaki Llandudno’ya trenle gitti. Yolculuk sırasında denizi gören pencere kenarında oturdu ve küçük istasyonlarda inen yolcuları izledi. Varışta yağmur başladığı için önce sahil yolundaki müzeye girdiler. Müzede kasabanın balıkçılık geçmişini anlatan haritalar ve eski tekneler vardı. Öğleden sonra yağmur dindi; kuzenler teleferikle tepeye çıkmak istedi fakat bakım çalışması nedeniyle seferler başlamadı. Bunun üzerine yürüyüş yolunu seçtiler. Tepeden kasabanın limanını ve uzun sahil şeridini gördüler. Ertesi gün Mert yerel pazardan el yapımı bir kartpostal aldı. Satıcı, kartpostalın desenini kasabanın eski binalarından esinlenerek çizdiğini anlattı. Mert eve dönerken yolculuğun en güzel bölümünün beklenmedik yürüyüş olduğunu düşündü.',
    mcq: [
      ['Mert Llandudno’ya nasıl gitti?', ['Trenle', 'Otobüsle', 'Bisikletle', 'Gemiyle'], 'A'],
      ['Kuzenler varınca ilk olarak ne yaptı?', ['Sahil yolundaki müzeye gitti', 'Pazardan kartpostal aldı', 'Teleferiğe bindi', 'Otele döndü'], 'A'],
      ['Teleferik neden çalışmıyordu?', ['Bakım çalışması vardı', 'Rüzgâr çok kuvvetliydi', 'Bilet kalmamıştı', 'Yağmur yeniden başladı'], 'A'],
      ['Kartpostalın deseni nereden esinlenmişti?', ['Kasabanın eski binalarından', 'Tren istasyonundan', 'Deniz canlılarından', 'Müze haritalarından'], 'A'],
    ],
    tf: [['Mert yolculukta denizi gören yerde oturdu.', 'A'], ['Müzede kasabanın balıkçılık geçmişi anlatılıyordu.', 'A'], ['Kuzenler tepeye teleferikle çıktı.', 'B'], ['Pazardaki kartpostal el yapımıydı.', 'A'], ['Mert’in otelinin adı metinde veriliyor.', 'C']],
  },
]

type BiographySet = { title: string; context: string; mcq: Array<[string, string[], string]>; matches: Array<[string, string]> }
const biographySets: BiographySet[] = [
  {
    title: 'Aziz Sancar: bilim ve azim',
    context: 'A. Aziz Sancar, 1946 yılında Mardin’in Savur ilçesinde dünyaya geldi. Eğitimine küçük bir yerleşimde başladı ve ailesinin desteğiyle bilim öğrenmeye yöneldi.\n\nB. İstanbul Üniversitesi Tıp Fakültesi’nden mezun olduktan sonra bir süre hekimlik yaptı. Daha sonra araştırma yapmak için Amerika Birleşik Devletleri’ne gitti.\n\nC. Sancar, hücrelerin hasarlı DNA’yı nasıl onardığını inceleyen çalışmalarıyla tanındı. Araştırmaları, hücrelerin genetik bilgiyi koruma yollarının anlaşılmasına katkı sağladı.\n\nD. Bilim insanı, laboratuvar çalışmalarının yanı sıra öğrencilerin araştırmaya katılmasını destekledi. Ona göre sabırlı ve düzenli çalışma bilimsel ilerlemenin temelidir.\n\nE. 2015 yılında DNA onarımı alanındaki çalışmaları nedeniyle Nobel Kimya Ödülü’nü aldı. Ödül, uzun süreli araştırmaların uluslararası bilim dünyasında görünür olmasına yardımcı oldu.\n\nF. Sancar, bilim eğitiminin yaygınlaşmasını önemser ve gençlerin merak ettikleri soruların peşinden gitmesini teşvik eder.',
    mcq: [
      ['Metne göre Aziz Sancar’ın hayatıyla ilgili hangisi çıkarılamaz?', ['Mardin’de doğduğu', 'Tıp eğitimi aldığı', 'DNA onarımı üzerine çalıştığı', 'Üniversiteden önce Nobel ödülü kazandığı'], 'D'],
      ['Sancar’ın araştırmalarının konusu aşağıdakilerden hangisi değildir?', ['DNA hasarının onarılması', 'Genetik bilginin korunması', 'Hücrelerin onarım yolları', 'Deniz canlılarının göçü'], 'D'],
      ['Metinden aşağıdaki yargılardan hangisine ulaşılamaz?', ['Araştırmaları uzun yıllara yayılmıştır', 'Öğrencilerin araştırmaya katılmasını desteklemiştir', 'Nobel Kimya Ödülü almıştır', 'Tıp fakültesini Mardin’de tamamlamıştır'], 'D'],
    ],
    matches: [['Eğitim hayatının ilk yılları', 'A'], ['Hekimlikten araştırmaya geçiş', 'B'], ['DNA onarımı çalışmaları', 'C']],
  },
  {
    title: 'Kilian Jornet: dağlarda dayanıklılık',
    context: 'A. Kilian Jornet çocukluğunu dağlara yakın bir bölgede geçirdi. Ailesi doğa yürüyüşlerini sevdiği için küçük yaşlardan itibaren uzun patikalarda vakit geçirdi.\n\nB. Gençlik yıllarında koşu ve kayak antrenmanlarını birlikte sürdürdü. Bu iki spor, farklı hava koşullarına ve arazi türlerine uyum sağlamasına yardımcı oldu.\n\nC. Jornet, yüksek dağlarda hızlı tırmanışlarıyla tanındı. Başarılarının arkasında yalnızca fiziksel güç değil, rota planlaması ve hava durumunu dikkatle değerlendirme de vardır.\n\nD. Sporcu, antrenmanlarının büyük bölümünü doğada yapar. Eğim, zemin ve sıcaklık değiştiğinde hızını ayarlamayı öğrenir; dinlenme sürelerini de planına ekler.\n\nE. Dağ ortamının korunması onun için önemlidir. Yarışlarda ve gezilerde atık bırakmamaya, hassas bitki alanlarından uzak durmaya çalışır.\n\nF. Deneyimlerini kitaplar ve konuşmalar aracılığıyla paylaşan Jornet, genç sporculara kendi sınırlarını tanımalarını ve güvenliği ön planda tutmalarını önerir.',
    mcq: [
      ['Metne göre Kilian Jornet hakkında hangisi çıkarılamaz?', ['Dağlara yakın büyüdüğü', 'Koşu ve kayak yaptığı', 'Rota planlamasına önem verdiği', 'Bütün yarışlarını şehir içinde yaptığı'], 'D'],
      ['Metinde Jornet’in antrenmanlarıyla ilgili hangisi söylenmiyor?', ['Doğada antrenman yaptığı', 'Zemin koşullarına göre hızını ayarladığı', 'Dinlenmeyi planladığı', 'Her gün aynı mesafeyi koştuğu'], 'D'],
      ['Aşağıdakilerden hangisi metinden çıkarılamaz?', ['Çevreyi korumaya dikkat eder', 'Güvenliği önemser', 'Deneyimlerini paylaşır', 'Dağ koşusuna yetişkinlikte başlamıştır'], 'D'],
    ],
    matches: [['Çocukluk dönemi', 'A'], ['Farklı sporlarla antrenman', 'B'], ['Doğa ve çevre duyarlılığı', 'E']],
  },
]

const writingTask1 = [
  { id: 'letter-community', title: 'Görev 1 · Resmî mektup', prompt: 'Mahallenizde yeni bir kütüphane açılması için belediyeye resmî bir mektup yazın. Kütüphaneye neden ihtiyaç duyulduğunu açıklayın, hangi hizmetlerin sunulmasını istediğinizi belirtin ve yetkililerden bir görüşme talep edin.', minWords: 120, maxWords: 150, maxRaw: 12 as const, task: 1 as const },
  { id: 'letter-course', title: 'Görev 1 · Resmî mektup', prompt: 'Katıldığınız bir dil kursunda ders saatlerinin değiştirilmesini istemek için kurs yönetimine mektup yazın. Mevcut programın neden zor olduğunu anlatın, uygun saat önerin ve yanıt rica edin.', minWords: 120, maxWords: 150, maxRaw: 12 as const, task: 1 as const },
  { id: 'letter-park', title: 'Görev 1 · Resmî mektup', prompt: 'Mahallenizdeki parkın daha güvenli ve kullanışlı hâle getirilmesi için belediyeye mektup yazın. Sorunları, önerdiğiniz düzenlemeleri ve bu değişikliklerin kimlere yarar sağlayacağını açıklayın.', minWords: 120, maxWords: 150, maxRaw: 12 as const, task: 1 as const },
]
const writingTask2 = [
  { id: 'essay-technology', title: 'Görev 2 · Kompozisyon', prompt: 'Teknolojinin eğitim üzerindeki olumlu ve olumsuz etkilerini örneklerle tartışın. Kendi görüşünüzü gerekçelendirin ve dengeli bir sonuç yazın.', minWords: 180, maxWords: 220, maxRaw: 24 as const, task: 2 as const },
  { id: 'essay-transport', title: 'Görev 2 · Kompozisyon', prompt: 'Büyük şehirlerde toplu taşımanın geliştirilmesi yaşam kalitesini nasıl etkiler? Farklı görüşleri değerlendirip kendi çözüm önerilerinizi açıklayın.', minWords: 180, maxWords: 220, maxRaw: 24 as const, task: 2 as const },
  { id: 'essay-social', title: 'Görev 2 · Kompozisyon', prompt: 'Sosyal medyanın gençler üzerindeki etkilerini tartışın. Bilgiye erişim, iletişim ve zaman yönetimi açısından örnekler vererek görüşünüzü savunun.', minWords: 180, maxWords: 220, maxRaw: 24 as const, task: 2 as const },
]

const speakingPools = [
  [
    { id: 'sp1-family', part: 1 as const, title: 'Kişisel konular', prompt: 'Ailenizle birlikte yapmaktan hoşlandığınız bir etkinliği anlatın. Ne zaman yaptığınızı ve sizin için neden önemli olduğunu açıklayın.' },
    { id: 'sp1-book', part: 1 as const, title: 'Kişisel konular', prompt: 'Son zamanlarda okuduğunuz bir kitap ya da izlediğiniz bir filmden söz edin. Size ne düşündürdü?' },
    { id: 'sp1-city', part: 1 as const, title: 'Kişisel konular', prompt: 'Yaşadığınız şehirde en sevdiğiniz yeri tanıtın. Oraya ne sıklıkla gidersiniz?' },
  ],
  [
    { id: 'sp2-cue-trip', part: 2 as const, title: 'İpucu kartı', prompt: 'Unutamadığınız bir yolculuğu anlatın. Nerede ve ne zaman gerçekleşti? Kimlerle gittiniz? Yolculukta karşılaştığınız bir sorunu ve bu deneyimden ne öğrendiğinizi açıklayın.', preparationSeconds: 60 },
    { id: 'sp2-cue-person', part: 2 as const, title: 'İpucu kartı', prompt: 'Size ilham veren bir kişiyi tanıtın. Bu kişiyi nereden tanıyorsunuz? Hangi özelliklerini takdir ediyorsunuz? Size nasıl örnek oldu?', preparationSeconds: 60 },
    { id: 'sp2-cue-project', part: 2 as const, title: 'İpucu kartı', prompt: 'Tamamladığınız önemli bir projeyi anlatın. Amacınız neydi, hangi zorluklarla karşılaştınız ve sonuç nasıl oldu?', preparationSeconds: 60 },
  ],
  [
    { id: 'sp3-environment', part: 3 as const, title: 'Sosyal konular', prompt: 'Şehirlerde çevreyi korumak bireylerin mi yoksa yerel yönetimlerin mi daha büyük sorumluluğudur? Görüşünüzü örneklerle savunun.' },
    { id: 'sp3-remote', part: 3 as const, title: 'Sosyal konular', prompt: 'Uzaktan çalışma toplumun yaşam biçimini nasıl değiştiriyor? Bu değişimin yararlarını ve olası sorunlarını tartışın.' },
    { id: 'sp3-education', part: 3 as const, title: 'Sosyal konular', prompt: 'Yabancı dil öğrenmek için sınıf eğitimi mi yoksa dijital kaynaklar mı daha etkilidir? Farklı öğrenen ihtiyaçlarını dikkate alarak değerlendirin.' },
  ],
]

function buildListening(random: RandomSource = Math.random): QuestionSection {
  const parts: TestPart[] = []
  let number = 1
  const reactionPool = sample(reactionPools[Math.floor(random() * reactionPools.length)], 8, random)
  parts.push(makePartQuestions('listening-p1', number, reactionPool.map(([audioText, choices, correct]) => {
    const randomized = randomizedChoiceOptions(choices as string[], String(correct), random)
    return { prompt: 'Bu cümleye en uygun tepkiyi seçin.', kind: 'choice' as const, ...randomized, audioText: audioText as string }
  }), 'Bölüm 1 · Kısa cümlelere tepki', 'Cümleyi Türkçe dinleyin ve en uygun cevabı seçin. Her soru için tek doğru seçenek vardır.', { transcriptLabel: 'Metni göster' }))
  number += 8

  const announcement = announcementSets[Math.floor(random() * announcementSets.length)]
  const tfOptions = [{ id: 'A', label: 'A — Doğru' }, { id: 'B', label: 'B — Yanlış' }]
  parts.push(makePartQuestions('listening-p2', number, announcement.statements.map(([text, answer]) => ({ prompt: text, kind: 'boolean' as const, options: tfOptions, correctAnswer: answer })), 'Bölüm 2 · Duyuru', 'Duyuruyu dinleyin. Her ifadeyi A (Doğru) veya B (Yanlış) olarak işaretleyin.', { contextTitle: announcement.title, audioText: announcement.audioText, transcriptLabel: 'Duyuru metnini göster' }))
  number += 6

  const speakers = speakerSets[Math.floor(random() * speakerSets.length)]
  parts.push(makePartQuestions('listening-p3', number, speakers.speakers.map(([text, answer], index) => ({ prompt: `Konuşmacı ${index + 1}: Bu kişinin tercihi hangisidir?`, kind: 'matching' as const, options: speakers.options.map((label, i) => ({ id: String.fromCharCode(65 + i), label })), correctAnswer: answer, audioText: text })), 'Bölüm 3 · Konuşmacıları eşleştirme', 'Dört konuşmacıyı dinleyin ve her birini A–F seçeneklerinden biriyle eşleştirin. İki seçenek kullanılmayacaktır.', { contextTitle: speakers.title, transcriptLabel: 'Konuşmacı metnini göster' }))
  number += 4

  const plan = planSets[Math.floor(random() * planSets.length)]
  parts.push(makePartQuestions('listening-p4', number, plan.tasks.map(([text, answer]) => ({ prompt: 'Dinlediğiniz açıklama plandaki hangi konumu anlatıyor?', kind: 'matching' as const, options: optionLetters(plan.locations.map((_, i) => String.fromCharCode(65 + i))), correctAnswer: answer, audioText: text })), 'Bölüm 4 · Plan üzerinde yer bulma', 'Açıklamaları dinleyin ve plandaki A–H konumlarıyla eşleştirin.', { contextTitle: plan.title, planLocations: plan.locations }))
  number += 5

  const dialogues = sample(dialogueSets[Math.floor(random() * dialogueSets.length)], 3, random)
  const dialogueQuestions = dialogues.flatMap((dialogue, dialogueIndex) => dialogue.questions.map(([prompt, choices, answer]) => ({
    prompt: `Diyalog ${dialogueIndex + 1}: ${prompt}`,
    kind: 'choice' as const,
    ...randomizedChoiceOptions(choices as string[], String(answer), random),
    audioText: dialogue.text,
  })))
  parts.push(makePartQuestions('listening-p5', number, dialogueQuestions, 'Bölüm 5 · Kısa diyaloglar', 'Üç kısa diyaloğu dinleyin. Her diyalog için iki soruyu cevaplayın.', { transcriptLabel: 'Diyalog metnini göster' }))
  number += 6

  const talk = longTalks[Math.floor(random() * longTalks.length)]
  const talkQuestions = talk.questions.map(([prompt, choices, answer]) => ({ prompt, kind: 'choice' as const, ...randomizedChoiceOptions(choices, String(answer), random) }))
  parts.push(makePartQuestions('listening-p6', number, talkQuestions, 'Bölüm 6 · Uzun konuşma', 'Konuşmayı dinleyin ve altı soruyu cevaplayın.', { contextTitle: talk.title, audioText: talk.audioText, transcriptLabel: 'Konuşma metnini göster' }))

  return { key: 'dinleme', label: 'Dinleme', durationMinutes: 45, totalQuestions: 35, parts }
}

function buildReading(random: RandomSource = Math.random): QuestionSection {
  const parts: TestPart[] = []
  let number = 1
  const cloze = clozeSets[Math.floor(random() * clozeSets.length)]
  parts.push(makePartQuestions('reading-p1', number, cloze.answers.map((answer, index) => ({ prompt: `${index + 1}. boşluk için doğru kelimeyi seçin.`, kind: 'matching' as const, options: optionLetters(cloze.words.map((word) => word.slice(0, 1))), correctAnswer: answer })), 'Bölüm 1 · Boşluk doldurma', 'Metni okuyun. A–G kelime seçeneklerinden uygun olanı her boşlukla eşleştirin; bir kelime kullanılmayacaktır.', { contextTitle: cloze.title, context: `${cloze.context}\n\nKelime havuzu: ${cloze.words.join(' · ')}` }))
  number += 6

  const ads = adSets[Math.floor(random() * adSets.length)]
  parts.push(makePartQuestions('reading-p2', number, ads.ads.map(([text, answer], index) => ({ prompt: `İlan ${index + 1}: ${text}`, kind: 'matching' as const, options: ads.statements.map((label, i) => ({ id: String.fromCharCode(65 + i), label })), correctAnswer: answer })), 'Bölüm 2 · İlanları eşleştirme', 'Sekiz ilanı okuyun ve A–J ihtiyaç ifadelerinden en uygun olanla eşleştirin. İki ifade kullanılmayacaktır.', { contextTitle: ads.title }))
  number += 8

  const headings = headingSets[Math.floor(random() * headingSets.length)]
  parts.push(makePartQuestions('reading-p3', number, headings.paragraphs.map(([text, answer], index) => ({ prompt: `Paragraf ${['I', 'II', 'III', 'IV', 'V', 'VI'][index]}: ${text}`, kind: 'matching' as const, options: headings.headings.map((label, i) => ({ id: String.fromCharCode(65 + i), label })), correctAnswer: answer })), 'Bölüm 3 · Paragraflara başlık bulma', 'Altı paragrafı okuyun ve A–H başlıklarından uygun olanı seçin. İki başlık kullanılmayacaktır.', { contextTitle: headings.title }))
  number += 6

  const narrative = narrativeSets[Math.floor(random() * narrativeSets.length)]
  const tfngOptions = [{ id: 'A', label: 'A — Doğru' }, { id: 'B', label: 'B — Yanlış' }, { id: 'C', label: 'C — Bilgi yok' }]
  const narrativeQuestions = [
    ...narrative.mcq.map(([prompt, choices, answer]) => ({ prompt, kind: 'choice' as const, ...randomizedChoiceOptions(choices, String(answer), random) })),
    ...narrative.tf.map(([prompt, answer]) => ({ prompt, kind: 'boolean' as const, options: tfngOptions, correctAnswer: answer })),
  ]
  parts.push(makePartQuestions('reading-p4', number, narrativeQuestions, 'Bölüm 4 · Uzun anlatı', 'Metni okuyun. İlk dört soruda doğru seçeneği, sonraki beş soruda Doğru/Yanlış/Bilgi yok cevabını işaretleyin.', { contextTitle: narrative.title, context: narrative.context }))
  number += 9

  const biography = biographySets[Math.floor(random() * biographySets.length)]
  const bioQuestions = [
    ...biography.mcq.map(([prompt, choices, answer]) => ({ prompt, kind: 'choice' as const, ...randomizedChoiceOptions(choices, String(answer), random) })),
    ...biography.matches.map(([prompt, answer]) => ({ prompt: `Hangi paragraf bu bilgiyi içeriyor? ${prompt}`, kind: 'matching' as const, options: optionLetters(['A', 'B', 'C', 'D', 'E']), correctAnswer: answer })),
  ]
  parts.push(makePartQuestions('reading-p5', number, bioQuestions, 'Bölüm 5 · Biyografik/bilimsel metin', 'Metni okuyun. Q30–32 için çıkarılamayan bilgiyi; Q33–35 için A–E paragraflarından doğru olanı seçin.', { contextTitle: biography.title, context: biography.context }))

  return { key: 'okuma', label: 'Okuma', durationMinutes: 60, totalQuestions: 35, parts }
}

export function generateMockExam(random: RandomSource = Math.random): GeneratedMock {
  const task1 = writingTask1[Math.floor(random() * writingTask1.length)]
  const task2 = writingTask2[Math.floor(random() * writingTask2.length)]
  const speaking = speakingPools.map((pool) => pool[Math.floor(random() * pool.length)])
  return {
    id: `mock-${Date.now()}-${random().toString(36).slice(2, 8)}`,
    generatedAt: new Date().toISOString(),
    dinleme: buildListening(random),
    okuma: buildReading(random),
    yazma: { key: 'yazma', label: 'Yazma', durationMinutes: 60, tasks: [task1, task2] },
    konusma: { key: 'konusma', label: 'Konuşma', durationMinutes: 15, parts: speaking },
  }
}

export const SECTION_LABELS: Record<SkillKey, string> = { dinleme: 'Dinleme', okuma: 'Okuma', yazma: 'Yazma', konusma: 'Konuşma' }
