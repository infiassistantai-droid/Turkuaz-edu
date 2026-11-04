export type ReadingOption = { id: string; label: string }
export type ReadingQuestionKind = 'choice' | 'matching' | 'tfng'
export type ReadingQuestion = {
  id: string
  number: number
  partId: string
  prompt: string
  kind: ReadingQuestionKind
  options: ReadingOption[]
  correctAnswer: string
}
export type ReadingPart = {
  id: string
  title: string
  instructions: string
  stimulusTitle: string
  passage?: string
  paragraphs?: Array<{ label: string; text: string }>
  wordBank?: ReadingOption[]
  questions: ReadingQuestion[]
}

const letters = (values: string[]) => values.map((id) => ({ id, label: id }))
const mcqOptions = (values: string[]) => values.map((label, index) => ({ id: String.fromCharCode(65 + index), label }))
const tfngOptions: ReadingOption[] = [
  { id: 'A', label: 'A — Doğru' },
  { id: 'B', label: 'B — Yanlış' },
  { id: 'C', label: 'C — Metinde belirtilmemiş' },
]

let nextQuestionNumber = 1
function makePart(
  id: string,
  title: string,
  instructions: string,
  stimulusTitle: string,
  content: Pick<ReadingPart, 'passage' | 'paragraphs' | 'wordBank'>,
  drafts: Array<Omit<ReadingQuestion, 'id' | 'number' | 'partId'>>,
): ReadingPart {
  return {
    id,
    title,
    instructions,
    stimulusTitle,
    ...content,
    questions: drafts.map((question, index) => ({
      ...question,
      id: `${id}-q${index + 1}`,
      number: nextQuestionNumber++,
      partId: id,
    })),
  }
}

const clozeWordBank: ReadingOption[] = [
  { id: 'A', label: 'karar verdiler' },
  { id: 'B', label: 'ortaklaşa' },
  { id: 'C', label: 'paylaştığı' },
  { id: 'D', label: 'zorlaştırdı' },
  { id: 'E', label: 'güncellenmesi' },
  { id: 'F', label: 'canlandırılabileceğini' },
  { id: 'G', label: 'tesadüfen' },
]

const listingOptions = letters(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'])
const headingOptions: ReadingOption[] = [
  { id: 'A', label: 'A — Yerel üretimin yeni pazarı' },
  { id: 'B', label: 'B — Sessiz bir ulaşım seçeneği' },
  { id: 'C', label: 'C — Veriyi anlamlı karara dönüştürmek' },
  { id: 'D', label: 'D — Kuşaklar arasında kurulan bağ' },
  { id: 'E', label: 'E — Kamusal alanın yeniden paylaşılması' },
  { id: 'F', label: 'F — Onarım kültürünün geri dönüşü' },
  { id: 'G', label: 'G — Küçük işletmeler için ortak çözüm' },
  { id: 'H', label: 'H — Doğal kaynakları koruyan tasarım' },
]

export const readingMockExam = {
  id: 'reading-multilevel-2026-01',
  title: 'Türkçe Multilevel · Okuma Denemesi',
  durationMinutes: 60,
  totalQuestions: 35,
  parts: [
    makePart(
      'reading-p1',
      'Bölüm 1 · Boşluk doldurma',
      'Metni okuyun. A–G kelime havuzundan her boşluk için en uygun seçeneği bulun. Bir seçenek kullanılmayacaktır.',
      'Mahallede ortak yaşam alanı',
      {
        passage: 'Mahalledeki eski postane binası yıllarca kapalı kaldı. Çevrede yaşayanlar, yapının yıkılmak yerine ortak bir kültür merkezine dönüştürülmesini önerdi. İlk toplantılarda herkesin beklentisi farklı olsa da katılımcılar, ihtiyaçları birlikte değerlendirip hangi etkinliklerin öncelikli olacağına ____1____. Projenin başarısı yalnızca binanın yenilenmesine değil, kararların mahalle sakinleri tarafından ____2____ alınmasına dayanıyordu. Merkez açıldıktan sonra çocuklar için ücretsiz okuma saatleri düzenlendi; yetişkinler de akşamları dil ve fotoğrafçılık atölyelerine katıldı. Zamanla burası, farklı yaşlardan insanların bir araya gelip deneyimlerini ____3____ bir buluşma noktasına dönüştü. Bununla birlikte gönüllü sayısının azalması, programın sürdürülebilirliğini ____4____. Yönetim bu nedenle görevleri daha geniş bir toplulukla paylaştı ve katılımcılardan düzenli geri bildirim aldı. Böylece programın gerçek ihtiyaçlara göre ____5____ mümkün oldu. Bu örnek, kamusal yapıların ortak sorumlulukla yeniden ____6____ gösteriyor.',
        wordBank: clozeWordBank,
      },
      [
        { prompt: '1. boşluk: “hangi etkinliklerin öncelikli olacağına …”', kind: 'matching', options: clozeWordBank, correctAnswer: 'A' },
        { prompt: '2. boşluk: “kararların mahalle sakinleri tarafından … alınmasına”', kind: 'matching', options: clozeWordBank, correctAnswer: 'B' },
        { prompt: '3. boşluk: “deneyimlerini … bir buluşma noktası”', kind: 'matching', options: clozeWordBank, correctAnswer: 'C' },
        { prompt: '4. boşluk: “gönüllü sayısının azalması programı …”', kind: 'matching', options: clozeWordBank, correctAnswer: 'D' },
        { prompt: '5. boşluk: “programın gerçek ihtiyaçlara göre … mümkün oldu”', kind: 'matching', options: clozeWordBank, correctAnswer: 'E' },
        { prompt: '6. boşluk: “kamusal yapıların ortak sorumlulukla yeniden …”', kind: 'matching', options: clozeWordBank, correctAnswer: 'F' },
      ],
    ),
    makePart(
      'reading-p2',
      'Bölüm 2 · İlanları eşleştirme',
      'A–H ilanlarını okuyun. Her ihtiyacı karşılayan ilanı seçin. Her ilan en fazla bir kez kullanılabilir.',
      'Kent yaşamından kısa ilanlar',
      {
        paragraphs: [
          { label: 'A', text: 'Çocuk Kütüphanesi — Her cumartesi 10.00–12.00 arasında 7–11 yaş grubu için ücretsiz masal saati ve yaratıcı yazma çalışması. Kayıt gerekmez.' },
          { label: 'B', text: 'Mahalle Tamir Atölyesi — Küçük ev aletleri ve bisikletler için ayda iki kez ücretsiz onarım buluşması. Gönüllü ustalarla birlikte öğrenin.' },
          { label: 'C', text: 'Akşam Türkçe Kulübü — Salı ve perşembe günleri 19.00’da B1-B2 düzeyinde konuşma pratiği. Küçük gruplar ve dönüşümlü tartışma konuları.' },
          { label: 'D', text: 'Pati Dostu Geçici Yuva — Aşıları tam, küçük ırk köpekler için en fazla iki haftalık geçici bakım. Ön görüşme ve ev ziyareti yapılır.' },
          { label: 'E', text: 'Sessiz Masa — Hafta içi 08.00–22.00 arasında bireysel çalışma masası ve kablosuz internet. Günlük veya aylık üyelik seçeneği.' },
          { label: 'F', text: 'Kıyı Bisiklet — Şehir içi kullanım için bakımlı ikinci el bisikletler ve güvenlik ekipmanı. Deneme sürüşü hafta içi 18.00’den sonra.' },
          { label: 'G', text: 'Fotoğraf Arşivi — Basılı aile fotoğraflarınızı tarayıp yüksek çözünürlüklü dijital dosyaya dönüştürüyoruz; isteğe bağlı renk düzeltme hizmeti.' },
          { label: 'H', text: 'Kent Bahçesi Gönüllüleri — Pazar sabahları ortak bostanda sebze yetiştirme, kompost hazırlama ve tohum paylaşımı. Aletler alanda sağlanır.' },
        ],
      },
      [
        { prompt: 'Hafta sonu çocuğunun hem kitap dinleyip hem kısa metinler yazmasını isteyen bir aile.', kind: 'matching', options: listingOptions, correctAnswer: 'A' },
        { prompt: 'Bozuk bir ev aletini atmak yerine onarmayı öğrenmek isteyen biri.', kind: 'matching', options: listingOptions, correctAnswer: 'B' },
        { prompt: 'İş çıkışından sonra Türkçe konuşma pratiği yapmak isteyen B1-B2 öğrencisi.', kind: 'matching', options: listingOptions, correctAnswer: 'C' },
        { prompt: 'Kısa süreliğine küçük köpeğine güvenli bakım arayan bir kişi.', kind: 'matching', options: listingOptions, correctAnswer: 'D' },
        { prompt: 'Hafta içi gün boyunca sessiz bir yerde ders çalışması gereken öğrenci.', kind: 'matching', options: listingOptions, correctAnswer: 'E' },
        { prompt: 'İşe gidip gelmek için uygun fiyatlı, kullanılmış bir bisiklet arayan kişi.', kind: 'matching', options: listingOptions, correctAnswer: 'F' },
        { prompt: 'Eski aile albümündeki fotoğrafları bilgisayara aktarmak isteyen biri.', kind: 'matching', options: listingOptions, correctAnswer: 'G' },
        { prompt: 'Toprakla uğraşarak mevsimlik sebze yetiştirmek ve kompost yapmayı öğrenmek isteyen komşu.', kind: 'matching', options: listingOptions, correctAnswer: 'H' },
      ],
    ),
    makePart(
      'reading-p3',
      'Bölüm 3 · Paragraflara başlık bulma',
      'I–VI paragraflarını okuyun. A–H başlıklarından en uygun olanı seçin. İki başlık kullanılmayacaktır.',
      'Kentleri daha yaşanabilir kılan küçük değişiklikler',
      {
        paragraphs: [
          { label: 'I', text: 'Birçok belediye, pazar yerlerinde yerel üreticilere ayrılmış küçük bölümler oluşturuyor. Üreticiler ürünün nerede ve nasıl yetiştirildiğini anlatırken tüketiciler de mevsiminde yetişen gıdaya daha kolay ulaşıyor. Böylece satışın ötesinde güvene dayalı bir ilişki kuruluyor.' },
          { label: 'II', text: 'Bisiklet yollarının birbiriyle bağlantılı olması, tek tek şeritler çizmekten daha önemlidir. Ev, okul ve iş yeri arasında kesintisiz bir güzergâh bulunduğunda insanlar kısa mesafelerde otomobil yerine bisikleti tercih edebiliyor.' },
          { label: 'III', text: 'Kent yönetimleri artık yalnızca trafik sayımına bakmıyor; hava kalitesi, yolculuk süresi ve mahalle sakinlerinin deneyimleri gibi farklı verileri birlikte değerlendiriyor. Bu bilgiler, hangi sokağın önce düzenleneceğine ilişkin kararları daha gerekçeli hâle getiriyor.' },
          { label: 'IV', text: 'Bir semtte farklı yaşlardan insanların birlikte katıldığı atölyeler, yalnızca yeni bir beceri kazandırmaz. Gençler yaşlıların deneyiminden yararlanırken yaşlılar da dijital araçları gençlerden öğrenebilir; karşılıklı öğrenme önyargıları azaltır.' },
          { label: 'V', text: 'Eski bir meydanın yeniden düzenlenmesi sırasında banklar, gölgelik alanlar ve çocuk oyun bölümleri farklı grupların ihtiyaçlarına göre yerleştirildi. Tasarım sürecine mahalle sakinlerinin katılması, alanın günün farklı saatlerinde daha çok kişi tarafından kullanılmasını sağladı.' },
          { label: 'VI', text: 'Bir kafede kullanılan kahve posası ve sebze artıkları ayrı toplandığında, birkaç ay içinde mahalle bostanında kullanılabilecek komposta dönüşüyor. Küçük işletmelerin ortak bir toplama sistemi kurması, hem atığı azaltıyor hem de maliyeti tek başına üstlenmelerini önlüyor.' },
        ],
      },
      [
        { prompt: 'I paragrafının ana fikri nedir?', kind: 'matching', options: headingOptions, correctAnswer: 'A' },
        { prompt: 'II paragrafının ana fikri nedir?', kind: 'matching', options: headingOptions, correctAnswer: 'B' },
        { prompt: 'III paragrafının ana fikri nedir?', kind: 'matching', options: headingOptions, correctAnswer: 'C' },
        { prompt: 'IV paragrafının ana fikri nedir?', kind: 'matching', options: headingOptions, correctAnswer: 'D' },
        { prompt: 'V paragrafının ana fikri nedir?', kind: 'matching', options: headingOptions, correctAnswer: 'E' },
        { prompt: 'VI paragrafının ana fikri nedir?', kind: 'matching', options: headingOptions, correctAnswer: 'G' },
      ],
    ),
    makePart(
      'reading-p4',
      'Bölüm 4 · Anlatı ve çıkarım',
      'Metni okuyun. İlk dört soruda doğru seçeneği, son beş soruda Doğru / Yanlış / Metinde belirtilmemiş seçeneklerinden birini işaretleyin.',
      'Bir kıyı kasabasında değişen ulaşım alışkanlıkları',
      {
        passage: 'Ece, üniversiteyi bitirdikten sonra çocukluğunun geçtiği kıyı kasabasına döndü. Kasabanın merkezindeki dar sokaklarda yaz aylarında araç trafiği artıyor, kısa mesafeler bile uzun sürede aşılabiliyordu. Belediyenin yeni ulaşım planı, bazı sokakları belirli saatlerde araçlara kapatmayı ve sahil boyunca güvenli bir bisiklet yolu kurmayı öneriyordu.\n\nPlan açıklandığında esnafın bir bölümü müşterilerin araçla dükkânlarına ulaşamayacağından endişelendi. Ece de ilk toplantıya kuşkuyla katıldı; ancak toplantıda yalnızca sunum dinlemek yerine sakinlerden hangi saatlerde yük indirilmesi gerektiği ve nerelerde oturma alanı istedikleri soruldu. Ece, ailesinin işlettiği fırının sabah erken saatlerde mal kabul ettiğini anlattı. Belediye ekibi bu bilgiyi dikkate alarak yükleme için kısa bir zaman aralığı belirledi.\n\nUygulama önce üç aylık bir deneme olarak başladı. Yazın ilk haftalarında bazı sürücüler yeni yönlendirme levhalarını fark etmeyip kapalı sokağa girdi. Gönüllüler kavşaklarda bilgi verdi; belediye de levhaları daha görünür noktalara taşıdı. Bisiklet yolunun bir bölümü, yağmur suyunun biriktiği alçak bir noktadan geçtiği için kısa süre içinde yeniden düzenlendi.\n\nDeneme süresinin sonunda belediye, dükkân ziyaretlerinin toplam sayısında belirgin bir artış olduğunu açıkladı; fakat artışın yalnızca yeni ulaşım planından kaynaklandığını söylemedi. Ece, fırına gelenlerin çoğunun hâlâ yürüyerek veya otobüsle geldiğini gözlemledi. Ona göre planın en önemli sonucu, kasaba halkının sokakları kimin için ve nasıl kullanmak istediğini birlikte tartışmaya başlamasıydı. Deneme sona erdiğinde bazı düzenlemeler kalıcı oldu, bazılarıysa yeni ölçümler yapılana kadar ertelendi.',
      },
      [
        { prompt: 'Ece ilk toplantıya hangi tutumla katıldı?', kind: 'choice', options: mcqOptions(['Planın bütün ayrıntılarını zaten biliyordu.', 'Öneriye başlangıçta temkinli yaklaşıyordu.', 'Kasabadan taşınmayı planlıyordu.', 'Esnaf adına karar vermek istiyordu.']), correctAnswer: 'B' },
        { prompt: 'Fırın için hangi düzenleme yapıldı?', kind: 'choice', options: mcqOptions(['Sabahları tüm araç trafiği kaldırıldı.', 'Fırının önüne yeni bir bisiklet yolu yapıldı.', 'Mal kabulü için kısa bir zaman aralığı belirlendi.', 'Fırın kasabanın dışına taşındı.']), correctAnswer: 'C' },
        { prompt: 'Bisiklet yolunun bir kısmı neden yeniden düzenlendi?', kind: 'choice', options: mcqOptions(['Yağmur suyu alçak bir noktada biriktiği için.', 'Esnaf bisiklet kullanılmasını istemediği için.', 'Yol yalnızca kışın açık olduğu için.', 'Gönüllüler güzergâhı yanlış çizdiği için.']), correctAnswer: 'A' },
        { prompt: 'Ece’ye göre planın önemli sonuçlarından biri neydi?', kind: 'choice', options: mcqOptions(['Kasabadaki bütün dükkânların çalışma saati değişti.', 'Otomobiller kasabadan tamamen çıkarıldı.', 'Turist sayısı kesin olarak iki katına çıktı.', 'Halk kamusal sokakların kullanımı üzerine ortaklaşa düşünmeye başladı.']), correctAnswer: 'D' },
        { prompt: 'Ulaşım planı ilk aşamada üç aylık bir deneme olarak uygulandı.', kind: 'tfng', options: tfngOptions, correctAnswer: 'A' },
        { prompt: 'Ece’nin fırını, mal kabulünü öğleden sonra yapıyordu.', kind: 'tfng', options: tfngOptions, correctAnswer: 'B' },
        { prompt: 'Deneme sonunda dükkân ziyaretleri arttı; ancak belediye artışın tek nedenini plan olarak göstermedi.', kind: 'tfng', options: tfngOptions, correctAnswer: 'A' },
        { prompt: 'Yeni bisiklet yolunun yapım maliyetini kasabadaki esnaf karşıladı.', kind: 'tfng', options: tfngOptions, correctAnswer: 'C' },
        { prompt: 'Deneme sona erdiğinde önerilen düzenlemelerin tamamı kalıcı hâle getirildi.', kind: 'tfng', options: tfngOptions, correctAnswer: 'B' },
      ],
    ),
    makePart(
      'reading-p5',
      'Bölüm 5 · Bilimsel biyografi ve çıkarım',
      'Bilimsel biyografiyi okuyun. Her soruda metinden doğrudan çıkarılabilecek en güçlü yorumu seçin.',
      'Dr. Leyla Demir ve kentlerde ısı araştırmaları',
      {
        paragraphs: [
          { label: 'A', text: 'Çevre mühendisi Leyla Demir, çocukluğunu yazları çok sıcak geçen bir İç Anadolu kentinde geçirdi. Üniversitede su yönetimi üzerine çalışırken, aynı kentteki mahallelerin yaz sıcaklığından eşit ölçüde etkilenmediğini fark etti. Bu gözlem, lisansüstü araştırmasının yönünü değiştirdi.' },
          { label: 'B', text: 'Demir, farklı mahallelerde sıcaklığı ölçmek için yalnızca resmî hava istasyonlarından yararlanmadı. Gönüllülerin gölgede ve güneşte yaptığı ölçümleri, uydu görüntülerini ve yapı yoğunluğu verilerini karşılaştırdı. Ölçümlerin günün hangi saatinde yapıldığını kaydetmek, sonuçları doğru yorumlamak için özellikle önemliydi.' },
          { label: 'C', text: 'Araştırma ekibi, ağaç sayısının tek başına açıklayıcı olmadığını gördü. Ağaçların gölge oluşturması, toprağın suyu geçirebilmesi ve yapıların birbirine yakınlığı birlikte değerlendirilmeliydi. Bu nedenle ekip, her mahalle için tek bir puan vermek yerine farklı göstergeleri ayrı ayrı yayımladı.' },
          { label: 'D', text: 'Demir, bulguları belediye çalışanları ve mahalle dernekleriyle düzenli toplantılarda paylaştı. Toplantılarda bazı sokaklara gölgelik eklenmesi, okul bahçelerinde geçirgen zemin kullanılması ve su tüketiminin izlenmesi gibi öneriler tartışıldı. Araştırmacı, önerilerin her yerde aynı biçimde uygulanamayacağını vurguladı.' },
          { label: 'E', text: 'Bir yıl sonra ekip aynı noktaların bir bölümünde ölçümleri tekrarladı. Bazı alanlarda yüzey sıcaklığının düştüğü görüldü; ancak ekip, kısa süreli değişimin tek başına uzun vadeli başarıyı kanıtlamadığını belirtti. Hava koşulları ve ölçüm zamanı gibi etkenler sonuçları etkileyebilirdi.' },
          { label: 'F', text: 'Demir, daha sonra açık bir çevrim içi harita hazırlayarak ölçüm yöntemini ve verilerin sınırlarını da yayımladı. Harita, mahalle sakinlerinin yerel gözlemlerini eklemesine izin veriyordu. Araştırmacıya göre bilimsel bilgi, nasıl üretildiği anlaşılır olduğunda ve farklı grupların deneyimleriyle sınandığında daha yararlı hâle gelir.' },
        ],
      },
      [
        { prompt: 'Demir’in araştırma konusunu değiştirmesine en doğrudan ne yol açtı?', kind: 'choice', options: mcqOptions(['Su yönetiminin kentlerde önemini yitirmesi.', 'Farklı mahallelerin sıcaklıktan farklı biçimde etkilenmesi gözlemi.', 'Belediyenin kendisinden çevrim içi harita istemesi.', 'Uydu görüntülerinin araştırmadan kaldırılması.']), correctAnswer: 'B' },
        { prompt: 'Gönüllü ölçümlerinin saatini kaydetmek neden önemliydi?', kind: 'choice', options: mcqOptions(['Günün zamanı ölçüm sonuçlarının yorumunu etkileyebileceği için.', 'Gönüllüler yalnızca akşamları çalışabildiği için.', 'Uydu görüntüleri yalnızca geceleri çekildiği için.', 'Her mahallede ölçüm sayısını eşitlemek için.']), correctAnswer: 'A' },
        { prompt: 'Ekibin göstergeleri ayrı ayrı yayımlaması hangi yaklaşımı yansıtır?', kind: 'choice', options: mcqOptions(['Her mahalle için tek bir çözümün yeterli olduğunu.', 'Verilerin yerel farklılıkları tamamen ortadan kaldırdığını.', 'Karmaşık bir durumu tek bir puana indirgemekten kaçındığını.', 'Ağaçların sıcaklık üzerinde etkisi olmadığını.']), correctAnswer: 'C' },
        { prompt: 'Demir’in önerilerin her yerde aynı biçimde uygulanamayacağını vurgulaması neyi gösterir?', kind: 'choice', options: mcqOptions(['Araştırma bulgularının hiçbir uygulamaya uygun olmadığını.', 'Yerel koşulların çözüm seçimini etkilemesi gerektiğini.', 'Belediye çalışanlarının araştırmaya katılmadığını.', 'Mahalle derneklerinin bilimsel veriyi reddettiğini.']), correctAnswer: 'B' },
        { prompt: 'Bir yıl sonraki ölçümler neden tek başına uzun vadeli başarı kanıtı sayılmadı?', kind: 'choice', options: mcqOptions(['Ölçümler yalnızca uyduyla yapıldığı için.', 'Bütün mahallelerde sıcaklık arttığı için.', 'Hava ve ölçüm zamanı gibi etkenler sonucu değiştirebileceği için.', 'Ekip ilk verileri yayımlamaktan vazgeçtiği için.']), correctAnswer: 'C' },
        { prompt: 'Metnin son paragrafına göre açık harita, bilimsel bilginin hangi özelliğini güçlendirebilir?', kind: 'choice', options: mcqOptions(['Yöntem ve sınırlamalar görülebildiğinde, bilgi farklı deneyimlerle sınanabilir.', 'Veri toplama sürecinde uzman görüşüne ihtiyaç kalmaz.', 'Yerel gözlemler ölçümlerin yerine geçer.', 'Harita yayımlandıktan sonra bulgular değişmez.']), correctAnswer: 'A' },
      ],
    ),
  ],
} satisfies {
  id: string
  title: string
  durationMinutes: number
  totalQuestions: number
  parts: ReadingPart[]
}

export const readingQuestions: ReadingQuestion[] = readingMockExam.parts.flatMap((part) => part.questions)
