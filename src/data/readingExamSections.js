// Uploaded reading exam sets: each section has five passages and 30 four-option questions.
// The source True/False/Not Given items receive a fourth exclusive-choice distractor.
// Sections 18–20 contain their uploaded tests but stay marked upcoming until opened later.
// Add further content by appending a numbered source object and updating READING_SECTION_COUNT.
const uploadedReadingSections = [
  {
    "id": "reading-section-1",
    "sectionNumber": 1,
    "status": "active",
    "sourceFile": "turkuaz_bmba_mock_exam.json",
    "passages": [
      {
        "id": "s01-p1",
        "title": "Öğrenci Yurdu Genel Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli öğrencilerimiz, yurtlarımızda huzurlu ve güvenli bir ortam sağlamak için aşağıdaki kurallara uyulması zorunludur:\n1. Yurt binasına son giriş saati 23:00'tür. Bu saatten sonra gelen öğrenciler içeri alınmayacak ve tutanak tutulacaktır.\n2. Odalarda elektrikli ocak, ısıtıcı ve su ısıtıcısı (kettle) kullanmak yangın riski nedeniyle kesinlikle yasaktır.\n3. Ziyaretçiler sadece giriş katındaki kafeteryada, saat 10:00 ile 20:00 arasında ağırlanabilir. Misafirlerin odalara çıkarılması yasaktır.\n4. Çamaşırhane her gün 08:00 - 22:00 saatleri arasında hizmet vermektedir. Yıkama işlemi için yurt idaresinden jeton alınmalıdır.\n5. Çalışma odalarında yüksek sesle konuşmak ve müzik dinlemek yasaktır.\nKurallara uymayan öğrencilerin yurt kayıtları silinecektir.",
        "questions": [
          {
            "id": "s01-p1-q1",
            "type": "multiple_choice",
            "question": "Yurda en geç saat kaçta giriş yapılabilir?",
            "options": [
              "20:00",
              "22:00",
              "23:00",
              "00:00"
            ],
            "correctOption": 2,
            "explanation": "Matnda 'son giriş saati 23:00'tür' deb aniq yozilgan."
          },
          {
            "id": "s01-p1-q2",
            "type": "multiple_choice",
            "question": "Odalarda ısıtıcı kullanılmasının yasak olma nedeni nedir?",
            "options": [
              "Çok elektrik tüketmesi",
              "Yangın çıkarma tehlikesi",
              "Odalarda yeterli priz olmaması",
              "Gürültü yapması"
            ],
            "correctOption": 1,
            "explanation": "Yangın riski nedeniyle kesinlikle yasaktır, deyilgan."
          },
          {
            "id": "s01-p1-q3",
            "type": "multiple_choice",
            "question": "Bir öğrenci, kendisini ziyarete gelen arkadaşıyla nerede görüşebilir?",
            "options": [
              "Kendi odasında",
              "Çalışma odasında",
              "Yurt bahçesinde",
              "Giriş katındaki kafeteryada"
            ],
            "correctOption": 3,
            "explanation": "Ziyaretçiler sadece giriş katındaki kafeteryada ağırlanabilir."
          },
          {
            "id": "s01-p1-q4",
            "type": "multiple_choice",
            "question": "Gece saat 23:30'da çamaşır yıkamak isteyen bir öğrenci ne yapmalıdır?",
            "options": [
              "Ertesi sabah 08:00'i beklemelidir",
              "İdareden jeton alıp hemen yıkayabilir",
              "Kendi odasında yıkamalıdır",
              "Çamaşırhanenin anahtarını görevliden istemelidir"
            ],
            "correctOption": 0,
            "explanation": "Kir yuvish xonasi 22:00 da yopiladi, demak ertesini kutish kerak."
          },
          {
            "id": "s01-p1-q5",
            "type": "multiple_choice",
            "question": "Öğrenci yurdunda kurallara uymamanın en büyük cezası nedir?",
            "options": [
              "Para cezası ödemek",
              "Yurttan atılmak (kaydın silinmesi)",
              "Ailesine haber verilmesi",
              "Çamaşırhaneyi kullanamamak"
            ],
            "correctOption": 1,
            "explanation": "Matn oxirida 'yurt kayıtları silinecektir' (yotoqxonadan o'chiriladi) deyilgan."
          },
          {
            "id": "s01-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin temel amacı nedir?",
            "options": [
              "Yeni öğrencilere yurdu tanıtmak",
              "Öğrencileri yangın konusunda eğitmek",
              "Yurttaki düzeni ve güvenliği sağlamak",
              "Kafeteryanın çalışma saatlerini duyurmak"
            ],
            "correctOption": 2,
            "explanation": "Qoidalar ro'yxati asosan tartib va xavfsizlik (huzur ve güvenli ortam) uchun yoziladi."
          }
        ]
      },
      {
        "id": "s01-p2",
        "title": "Hayatlarını Değiştiren Cesur Kararlar",
        "category": "Kariyer / Eşleştirme",
        "level": "B1",
        "content": "A) Ayşe: On yıl boyunca bir bankada çalıştım. Her gün sabah 9 akşam 6 aynı ofiste olmak beni çok yoruyordu. Sonunda istifa edip, çocukluğumdan beri hayalim olan pastacılık kursuna yazıldım. Şimdi küçük ama çok sevdiğim bir kafem var.\n\nB) Burak: Başarılı bir yazılım mühendisiydim ama büyük şehirlerin kalabalığı beni boğuyordu. Ailemin tüm itirazlarına rağmen, Ege'de küçük bir köye yerleşip zeytin yetiştiriciliğine başladım. Artık doğayla iç içeyim.\n\nC) Cem: Öğretmenlik mesleğimi çok seviyordum ama Türkiye'deki maaşım hayallerimi gerçekleştirmem için yeterli değildi. Dil öğrenip Almanya'ya taşındım ve orada tamamen farklı bir sektörde, lojistik alanında çalışmaya başladım.\n\nD) Deniz: Uzun yıllar profesyonel fotoğrafçılık yaptım. Ancak bir süre sonra bu işin stresi sağlığımı bozmaya başladı. Şimdi bir yoga eğitmeniyim ve insanlara fiziksel ve ruhsal olarak nasıl rahatlayacaklarını öğretiyorum.",
        "questions": [
          {
            "id": "s01-p2-q1",
            "type": "matching_paragraph",
            "question": "Kariyer değişikliğini sağlığı bozulduğu için yapan kişi kimdir?",
            "options": [
              "A) Ayşe",
              "B) Burak",
              "C) Cem",
              "D) Deniz"
            ],
            "correctOption": 3,
            "explanation": "Deniz işin stresinin sağlığını bozduğunu belirtmiştir."
          },
          {
            "id": "s01-p2-q2",
            "type": "matching_paragraph",
            "question": "Daha fazla maddi gelir elde etmek amacıyla meslek ve ülke değiştiren kişi kimdir?",
            "options": [
              "A) Ayşe",
              "B) Burak",
              "C) Cem",
              "D) Deniz"
            ],
            "correctOption": 2,
            "explanation": "Cem maaşının yetersizliğinden bahsedip Almanya'ya gitmiştir."
          },
          {
            "id": "s01-p2-q3",
            "type": "matching_paragraph",
            "question": "Ailesinin karşı çıkmasına rağmen şehir hayatını terk eden kişi kimdir?",
            "options": [
              "A) Ayşe",
              "B) Burak",
              "C) Cem",
              "D) Deniz"
            ],
            "correctOption": 1,
            "explanation": "Burak, 'ailemin tüm itirazlarına rağmen Ege'de küçük bir köye yerleşip...' demiştir."
          },
          {
            "id": "s01-p2-q4",
            "type": "matching_paragraph",
            "question": "Çocukluk hayalini gerçekleştirmek için kurumsal hayattan vazgeçen kişi kimdir?",
            "options": [
              "A) Ayşe",
              "B) Burak",
              "C) Cem",
              "D) Deniz"
            ],
            "correctOption": 0,
            "explanation": "Ayşe çocukluk hayali olan pastacılık için bankadaki işinden istifa etmiştir."
          },
          {
            "id": "s01-p2-q5",
            "type": "matching_paragraph",
            "question": "Mesleğini tamamen doğa ve tarım üzerine kuran kişi kimdir?",
            "options": [
              "A) Ayşe",
              "B) Burak",
              "C) Cem",
              "D) Deniz"
            ],
            "correctOption": 1,
            "explanation": "Burak zeytin yetiştiriciliğine başlamış ve doğayla iç içe olduğunu söylemiştir."
          },
          {
            "id": "s01-p2-q6",
            "type": "matching_paragraph",
            "question": "Hangi kişi başkalarının fiziksel ve ruhsal gelişimine yardımcı olan bir meslek seçmiştir?",
            "options": [
              "A) Ayşe",
              "B) Burak",
              "C) Cem",
              "D) Deniz"
            ],
            "correctOption": 3,
            "explanation": "Deniz yoga eğitmeni olarak insanlara rahatlamayı öğretmektedir."
          }
        ]
      },
      {
        "id": "s01-p3",
        "title": "Kahvenin Dünyayı Saran Kokusu",
        "category": "Tarih ve Kültür",
        "level": "B2",
        "content": "Kahvenin anavatanının Etiyopya olduğu ve ilk olarak MS 800'lü yıllarda Kaldi adında bir çoban tarafından keşfedildiği anlatılır. Efsaneye göre Kaldi, keçilerinin kırmızı bir meyveyi yedikten sonra çok enerjik olduklarını fark etmiştir. Bu keşiften sonra kahve, Arap Yarımadası'na, oradan da 16. yüzyılda Osmanlı İmparatorluğu'na ulaşmıştır. Osmanlı'da kahve kültürü o kadar gelişmiştir ki, Avrupa'ya kahveyi tanıtanlar Osmanlı elçileri olmuştur. 17. yüzyılda Avrupa'da açılan kahvehaneler, insanların sadece kahve içtiği değil, aynı zamanda siyaset, bilim ve sanat konuştuğu entelektüel merkezler haline gelmiştir. Günümüzde kahve, petrolden sonra dünyada en çok ticareti yapılan ikinci üründür ve milyarlarca insanın sabah rutininin vazgeçilmez bir parçasıdır.",
        "questions": [
          {
            "id": "s01-p3-q1",
            "type": "true_false_not_given",
            "question": "Kahve, ilk olarak Etiyopya'daki bir çoban tarafından tesadüfen bulunmuştur.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Matnda 'Kaldi adında bir çoban tarafından keşfedildiği' aytilgan."
          },
          {
            "id": "s01-p3-q2",
            "type": "true_false_not_given",
            "question": "Kahveyi Avrupa'ya ilk kez İtalyan tüccarlar getirmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Noto'g'ri. Matnda 'Avrupa'ya kahveyi tanıtanlar Osmanlı elçileri olmuştur' deyilgan."
          },
          {
            "id": "s01-p3-q3",
            "type": "true_false_not_given",
            "question": "17. yüzyılda Avrupa'daki kahvehaneler aynı zamanda birer kültür ve tartışma merkezi olarak kullanılmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Siyaset, bilim, sanat konuşulan entelektüel merkezler bo'lgani yozilgan."
          },
          {
            "id": "s01-p3-q4",
            "type": "true_false_not_given",
            "question": "Günümüzde dünyada en çok tüketilen içecek kahvedir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Matnda eng ko'p savdosi qilinadigan 2-mahsulot (petrolden sonra) ekani aytilgan, lekin eng ko'p ichiladigan ichimlik (masalan, suv yoki choy) haqida ma'lumot yo'q."
          },
          {
            "id": "s01-p3-q5",
            "type": "true_false_not_given",
            "question": "Kahvenin dünyada ticareti petrolden daha fazladır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Noto'g'ri. Petroldan keyin 2-o'rinda."
          },
          {
            "id": "s01-p3-q6",
            "type": "true_false_not_given",
            "question": "Kaldi'nin keçileri kahve meyvesini yediğinde uykuya dalmışlardır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Noto'g'ri, ular uyquga ketmagan, aksincha 'çok enerjik olduklarını' sezgan."
          }
        ]
      },
      {
        "id": "s01-p4",
        "title": "Mars: Yeni Evimiz Olabilir mi?",
        "category": "Bilim ve Uzay",
        "level": "C1",
        "content": "Kızıl Gezegen olarak bilinen Mars, yıllardır bilim insanlarının kolonileşme hayallerini süslüyor. [ 1 ]. Çünkü Mars'ın bir günü Dünya'nınkine çok yakındır (24 saat 37 dakika) ve gezegende geçmişte sıvı halde su bulunduğuna dair kesin kanıtlar vardır. Ancak Mars'ta yaşamanın önünde devasa engeller de bulunuyor. [ 2 ]. Bu nedenle gezegenin yüzeyi ölümcül radyasyona açıktır. Ayrıca ortalama sıcaklık eksi 60 derece civarındadır. Gelecekte Mars'a gidecek ilk astronotların, yeraltında veya radyasyona dayanıklı özel kapsüllerde yaşaması gerekecektir. Elon Musk'ın SpaceX şirketi ve NASA, 2030'lu yıllarda Mars'a insanlı ilk uçuşu gerçekleştirmeyi planlıyor. Eğer bu başarıya ulaşılırsa, insanlık tarihindeki en büyük teknolojik sıçrama gerçekleşmiş olacaktır.",
        "questions": [
          {
            "id": "s01-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Mars, Güneş Sistemi'ndeki en büyük gezegendir.",
              "Bunun en büyük nedeni, Mars'ın Dünya'ya birçok açıdan benzemesidir.",
              "Mars'ta şu an milyonlarca uzaylı yaşamaktadır.",
              "Ay'a gitmek Mars'a gitmekten daha zordur."
            ],
            "correctOption": 1,
            "explanation": "Bo'shliqdan keyingi gapda (Çünkü Mars'ın bir günü Dünya'nınkine çok yakındır...) o'xshashliklar sanalgan. Shuning uchun B varianti eng mantiqiy."
          },
          {
            "id": "s01-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Mars'ın çok ince bir atmosferi vardır ve manyetik alanı yoktur.",
              "Mars'ta bol miktarda oksijen ve tatlı su bulunmaktadır.",
              "Uzay gemileri henüz Mars'a ulaşacak hıza sahip değildir.",
              "Mars'ta çok sık orman yangınları çıkmaktadır."
            ],
            "correctOption": 0,
            "explanation": "Keyingi gapda 'Bu nedenle gezegenin yüzeyi ölümcül radyasyona açıktır' deyilgan. Atmosfera va magnit maydon yo'qligi radiatsiyaga sabab bo'ladi."
          },
          {
            "id": "s01-p4-q3",
            "type": "multiple_choice",
            "question": "Metne göre Mars'ın Dünya'ya benzeyen özelliği nedir?",
            "options": [
              "Oksijen oranının aynı olması",
              "Gün uzunluğunun neredeyse aynı olması",
              "Aynı sıcaklığa sahip olmaları",
              "Manyetik alanlarının benzerliği"
            ],
            "correctOption": 1,
            "explanation": "Bir kunning uzunligi juda yaqinligi (24 soat 37 daqiqa) aytilgan."
          },
          {
            "id": "s01-p4-q4",
            "type": "multiple_choice",
            "question": "Mars'a gidecek astronotların yeraltında yaşamak zorunda olmasının temel nedeni nedir?",
            "options": [
              "Mars yüzeyinde yeterli alan olmaması",
              "Yeraltında su aramak istemeleri",
              "Ölümcül radyasyondan ve aşırı soğuktan korunmak",
              "Uzaylılardan saklanmak"
            ],
            "correctOption": 2,
            "explanation": "Radiatsiya va -60 gradus sovuqdan himoyalanish uchun yeralti yoki maxsus kapsulalar kerak."
          },
          {
            "id": "s01-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'hayallerini süslüyor' ifadesinin cümleye kattığı anlam nedir?",
            "options": [
              "Bir şeyi çok istemek, onunla ilgili büyük umutlar ve planlar yapmak.",
              "Sadece gece rüya görmek.",
              "Odayı resimlerle güzelleştirmek.",
              "Korkutucu düşüncelere dalmak."
            ],
            "correctOption": 0,
            "explanation": "Hayallerini süslemek - orzulariga yetaklash, katta umid bog'lash majoziy ma'nosida."
          },
          {
            "id": "s01-p4-q6",
            "type": "cikarim",
            "question": "Metinden çıkarılabilecek en mantıklı sonuç hangisidir?",
            "options": [
              "Mars kolonileşmesi çok yakında ve sıfır riskli bir projedir.",
              "Mars'ta yaşam potansiyeli olsa da, zorlu doğa koşulları kolonileşmeyi zorlaştırmaktadır.",
              "İnsanlık 2030'a kadar kesinlikle Mars'a taşınacaktır.",
              "Dünya yaşanmaz hale geldiği için Mars tek çaredir."
            ],
            "correctOption": 1,
            "explanation": "Yashash ehtimoli borligi, lekin oldinda ulkan to'siqlar (radyatsiya, sovuq) borligi xulosa qilingan."
          }
        ]
      },
      {
        "id": "s01-p5",
        "title": "İnsan Hafızası: Unutmak Kötü Müdür?",
        "category": "Psikoloji ve Sağlık",
        "level": "C1",
        "content": "Çoğu zaman bir şeyleri unutmaktan şikayet ederiz ve güçlü bir hafızaya sahip olmanın mükemmel bir özellik olduğunu düşünürüz. Ancak nörobilimciler, 'unutmanın' beyin sağlığı için en az hatırlamak kadar kritik bir fonksiyon olduğunu ortaya koymuştur. Beynimiz, gün boyunca maruz kaldığımız milyarlarca gereksiz bilgi kırıntısını (yoldan geçen arabaların rengi, yan masadaki sohbetler vb.) ayıklamak zorundadır. Eğer beynimiz her şeyi kapasite sınırı olmaksızın kaydetseydi, bilişsel aşırı yüklenme (cognitive overload) yaşar, karar verme ve odaklanma yeteneklerimizi tamamen kaybederdik. Nitekim tıp tarihinde 'hipertimezi' (hiçbir şeyi unutamama hastalığı) teşhisi konulan hastaların, geçmişteki acı hatıraları sürekli canlı yaşamak zorunda kaldıkları için ciddi psikolojik çöküntüler yaşadığı görülmüştür. Kısacası unutmak, beynin gereksiz dosyaları sildiği sağlıklı bir 'temizlik' işlemidir.",
        "questions": [
          {
            "id": "s01-p5-q1",
            "type": "ana_fikir",
            "question": "Bu metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Hipertimezi hastalığının tedavisi çok zordur.",
              "İnsan hafızası teknolojiden daha güçlü bir depolama alanıdır.",
              "Unutmak sanıldığının aksine beynin sağlıklı çalışması için gerekli ve faydalı bir süreçtir.",
              "Her şeyi hatırlamak, işte ve okulda çok başarılı olmamızı sağlar."
            ],
            "correctOption": 2,
            "explanation": "Muallif unutishning miya uchun foydali tozalash ekanini ta'kidlagan."
          },
          {
            "id": "s01-p5-q2",
            "type": "multiple_choice",
            "question": "Beynimiz gün içindeki gereksiz bilgileri ayıklamazsa ne olur?",
            "options": [
              "Bilişsel aşırı yüklenme yaşanır ve odaklanma yeteneği kaybolur.",
              "İnsanlar çok daha zeki ve yaratıcı hale gelir.",
              "Uyku düzenimiz tamamen düzelir.",
              "Hipertimezi hastalığı tamamen iyileşir."
            ],
            "correctOption": 0,
            "explanation": "Matnda miya hamma narsani saqlasa 'bilişsel aşırı yüklenme' (kognitiv ortiqcha yuk) yuzaga kelishi aniq aytilgan."
          },
          {
            "id": "s01-p5-q3",
            "type": "multiple_choice",
            "question": "Nörobilimcilere göre 'unutmak' eylemi neye benzetilmiştir?",
            "options": [
              "Geri dönüşü olmayan bir hataya",
              "Beynin gereksiz dosyaları sildiği bir 'temizlik' işlemine",
              "Yaşlanmanın en büyük belirtisine",
              "Bir bilgisayar virüsüne"
            ],
            "correctOption": 1,
            "explanation": "Kısacası unutmak, beynin gereksiz dosyaları sildiği sağlıklı bir 'temizlik' işlemidir."
          },
          {
            "id": "s01-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'ayıklamak' kelimesi hangi anlamda kullanılmıştır?",
            "options": [
              "İşe yaramayanları, gereksiz olanları seçip ayırmak.",
              "Tamamını bir araya getirmek, birleştirmek.",
              "Bir sırrı başkasına söylemek.",
              "Kitap okuyarak öğrenmek."
            ],
            "correctOption": 0,
            "explanation": "Ayıklamak (saralash) bu kontekstda kerakli va keraksiz ma'lumotlarni bir-biridan ajratib tashlash ma'nosini bildiradi."
          },
          {
            "id": "s01-p5-q5",
            "type": "cikarim",
            "question": "Hipertimezi (hiçbir şeyi unutamama) hastalarının psikolojik çöküntü yaşamasının temel nedeni nedir?",
            "options": [
              "Çok fazla fiziksel ağrı çekmeleri.",
              "Geçmişteki acı ve kötü anıların zihinlerinde sürekli taze kalması.",
              "Gelecekle ilgili hiçbir plan yapamamaları.",
              "Beyinlerinin normal insanlardan daha küçük olması."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'geçmişteki acı hatıraları sürekli canlı yaşamak zorunda kaldıkları için' deyilgan."
          },
          {
            "id": "s01-p5-q6",
            "type": "multiple_choice",
            "question": "Metne göre insanların hafıza ile ilgili yaygın ama yanlış olan inancı nedir?",
            "options": [
              "Unutmanın tamamen bir hastalık olduğuna inanılması.",
              "Güçlü bir hafızanın her zaman mükemmel bir özellik olduğunun düşünülmesi.",
              "İnsanların sadece güzel şeyleri hatırladığına inanılması.",
              "Hafızanın yaşlandıkça güçlendiğinin düşünülmesi."
            ],
            "correctOption": 1,
            "explanation": "Ilk gapda: 'Çoğu zaman... güçlü bir hafızaya sahip olmanın mükemmel bir özellik olduğunu düşünürüz' deb noto'g'ri tushuncha aytilgan."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-2",
    "sectionNumber": 2,
    "status": "active",
    "sourceFile": "turkuaz_bmba_mock_exam_2.json",
    "passages": [
      {
        "id": "s02-p1",
        "title": "Havalimanı Bagaj Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Sayın yolcularımız, güvenli ve hızlı bir uçuş deneyimi için havalimanımızda aşağıdaki bagaj kuralları uygulanmaktadır:\n1. Her yolcunun uçağa binerken yanına sadece 1 adet el bagajı (en fazla 8 kg) almasına izin verilir.\n2. Kayıtlı (uçak altına verilen) bagaj hakkınız bilet türünüze göre 15 kg veya 20 kg'dır. Sınırı aşan her 1 kg için 50 TL ek ücret alınır.\n3. El bagajınızda 100 ml'den büyük sıvı, parfüm veya krem taşımak kesinlikle yasaktır. Bu ürünler güvenlik noktasında çöpe atılacaktır.\n4. Kesici aletler (makas, bıçak) sadece uçak altı kayıtlı bagajlarda taşınabilir.\n5. Kaybolan eşyalarınız için varış salonundaki 'Kayıp Eşya Ofisi'ne 24 saat içinde başvurmanız gerekmektedir.",
        "questions": [
          {
            "id": "s02-p1-q1",
            "type": "multiple_choice",
            "question": "Yolcular uçağın içine yanlarında en fazla kaç kiloluk bagaj alabilirler?",
            "options": [
              "10 kg",
              "8 kg",
              "15 kg",
              "20 kg"
            ],
            "correctOption": 1,
            "explanation": "El bagajı en fazla 8 kg olabilir."
          },
          {
            "id": "s02-p1-q2",
            "type": "multiple_choice",
            "question": "Bagaj hakkı 15 kg olan bir yolcu, 18 kg bagaj teslim ederse ne kadar ek ücret öder?",
            "options": [
              "50 TL",
              "100 TL",
              "150 TL",
              "Ücret ödemez"
            ],
            "correctOption": 2,
            "explanation": "3 kg fazla (18-15=3). Her kg için 50 TL'den jami 150 TL."
          },
          {
            "id": "s02-p1-q3",
            "type": "multiple_choice",
            "question": "Bir yolcu 150 ml'lik bir parfümü nerede taşıyabilir?",
            "options": [
              "El bagajında",
              "Cebinde",
              "Uçak altı kayıtlı bagajında",
              "Uçağa hiçbir şekilde sokamaz"
            ],
            "correctOption": 2,
            "explanation": "100 ml'den katta suyuqliklar el bagajda taqiqlangan, uni faqat uçak altı bagajda (kayıtlı bagaj) olib o'tish mumkin."
          },
          {
            "id": "s02-p1-q4",
            "type": "multiple_choice",
            "question": "Makas veya bıçak gibi kesici aletler için hangi kural geçerlidir?",
            "options": [
              "Tamamen yasaktır.",
              "Sadece el bagajında taşınabilir.",
              "Sadece kayıtlı bagajlarda taşınabilir.",
              "Özel bir kutuda uçağa alınabilir."
            ],
            "correctOption": 2,
            "explanation": "Kesici aletler sadece uçak altı kayıtlı bagajlarda taşınabilir."
          },
          {
            "id": "s02-p1-q5",
            "type": "multiple_choice",
            "question": "Havalimanında çantasını kaybeden bir kişi ne yapmalıdır?",
            "options": [
              "Polisi aramalıdır.",
              "Hemen yeni bir bilet almalıdır.",
              "24 saat içinde Kayıp Eşya Ofisi'ne gitmelidir.",
              "Uçuş görevlisine şikayet etmelidir."
            ],
            "correctOption": 2,
            "explanation": "Kayıp eşya ofisine 24 saat içinde başvurmanız gerekmektedir."
          },
          {
            "id": "s02-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin yazılış amacı nedir?",
            "options": [
              "Uçak biletlerinin fiyatlarını açıklamak",
              "Yolcuları bagaj kuralları ve güvenlik hakkında bilgilendirmek",
              "Yeni bir havalimanının tanıtımını yapmak",
              "Uçuş saatlerindeki değişiklikleri duyurmak"
            ],
            "correctOption": 1,
            "explanation": "Matn yo'lovchilarni xavfsizlik va bagaj qoidalari bilan tanishtirish maqsadida yozilgan."
          }
        ]
      },
      {
        "id": "s02-p2",
        "title": "Yabancı Dil Öğrenme Sırları",
        "category": "Eğitim / Eşleştirme",
        "level": "B1",
        "content": "A) Ali: Bence dil öğrenmenin en iyi yolu teknolojiyi kullanmaktır. Telefonuma indirdiğim uygulamalar sayesinde her gün işe giderken otobüste 20 dakika kelime ezberliyorum. Oyunlaştırılmış testler çok eğlenceli.\n\nB) Zeynep: Ben tamamen dizi ve filmlere inanıyorum. İngilizce bir diziyi önce Türkçe altyazılı, sonra İngilizce altyazılı izliyorum. Bu sayede hem dinleme becerim gelişiyor hem de günlük konuşma kalıplarını doğal ortamında duyuyorum.\n\nC) Murat: Dil, konuşulmadan öğrenilmez! Hata yapmaktan hiç korkmuyorum. İnternet üzerinden yabancı arkadaşlar buldum ve onlarla haftada üç gün görüntülü konuşuyorum. Dil bilgisi (gramer) kurallarını pek takmıyorum.\n\nD) Elif: Ben eski usul çalışmayı seviyorum. Elime kalın bir gramer kitabı ve bir sözlük alırım. Kuralları defterime yazar, bol bol test çözerim. Sistematik bir temel olmadan konuşmaya çalışmak bana mantıksız geliyor.",
        "questions": [
          {
            "id": "s02-p2-q1",
            "type": "matching_paragraph",
            "question": "Yabancı dili görsel ve işitsel medyayı (sinema/TV) takip ederek öğrenen kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 1,
            "explanation": "Zeynep dizi ve filmlere inandığını belirtmiştir."
          },
          {
            "id": "s02-p2-q2",
            "type": "matching_paragraph",
            "question": "Geleneksel yöntemlerle, kurallara ve kitaplara bağlı kalarak çalışan kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 3,
            "explanation": "Elif eski usul çalışmayı (gramer kitabı ve test) sevdiğini söylemiştir."
          },
          {
            "id": "s02-p2-q3",
            "type": "matching_paragraph",
            "question": "Boş vakitlerini (yolculuk vb.) mobil uygulamalarla değerlendiren kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 0,
            "explanation": "Ali otobüste mobil uygulamalarla kelime ezberlediğini ifade etmiştir."
          },
          {
            "id": "s02-p2-q4",
            "type": "matching_paragraph",
            "question": "Dil bilgisi (gramer) hatalarını umursamadan doğrudan pratiğe odaklanan kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 2,
            "explanation": "Murat hata yapmaktan korkmadığını ve gramer kurallarını takmadığını söylemiştir."
          },
          {
            "id": "s02-p2-q5",
            "type": "matching_paragraph",
            "question": "Dilin günlük hayattaki doğal kullanımını ve sokak ağzını öğrenmeyi hedefleyen kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 1,
            "explanation": "Zeynep, diziler sayesinde günlük konuşma kalıplarını doğal ortamında duyduğunu belirtmiştir."
          },
          {
            "id": "s02-p2-q6",
            "type": "matching_paragraph",
            "question": "İnterneti kullanarak anadili İngilizce olan kişilerle iletişim kuran kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 2,
            "explanation": "Murat yabancı arkadaşlar bulup görüntülü konuştuğunu söylemiştir."
          }
        ]
      },
      {
        "id": "s02-p3",
        "title": "Tatlı Bir Tarih: Çikolata",
        "category": "Tarih ve Kültür",
        "level": "B2",
        "content": "Bugün market raflarını süsleyen tatlı çikolata, aslında tarih yolculuğuna acı bir içecek olarak başlamıştır. Orta Amerika'da yaşayan Mayalar ve Aztekler, kakao çekirdeklerini ezip su ve acı biberle karıştırarak 'Xocoatl' adını verdikleri bir içecek yapıyorlardı. Bu içecek o kadar değerliydi ki, kakao çekirdekleri para yerine kullanılıyordu. 16. yüzyılda İspanyol kâşifler kakaoyu Avrupa'ya getirdiğinde, Avrupalılar bu acı içeceği pek sevmedi. Ancak içine şeker ve vanilya eklenmesiyle çikolata Avrupa saraylarında lüks bir tüketim maddesi haline geldi. 19. yüzyılda Sanayi Devrimi ile birlikte icat edilen yeni makineler, kakao yağının ayrıştırılmasını sağladı ve bugün bildiğimiz 'katı (kalıp) çikolata' üretilmeye başlandı. Böylece çikolata sadece zenginlerin değil, herkesin ulaşabileceği bir tatlıya dönüştü.",
        "questions": [
          {
            "id": "s02-p3-q1",
            "type": "true_false_not_given",
            "question": "Çikolata, tarih boyunca her zaman tatlı ve katı bir yiyecek olarak tüketilmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Başlangıçta acı bir içecek (su ve biberle) olarak tüketilmiştir."
          },
          {
            "id": "s02-p3-q2",
            "type": "true_false_not_given",
            "question": "Aztekler döneminde kakao çekirdekleri ticarette bir ödeme aracı (para) olarak kullanılmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'kakao çekirdekleri para yerine kullanılıyordu' deyilgan."
          },
          {
            "id": "s02-p3-q3",
            "type": "true_false_not_given",
            "question": "Avrupalılar çikolatayı ilk tattıklarında çok beğenmiş ve hemen tüketmeye başlamışlardır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. İspanyollar getirdiğinde 'Avrupalılar bu acı içeceği pek sevmedi' deyilgan."
          },
          {
            "id": "s02-p3-q4",
            "type": "true_false_not_given",
            "question": "Bugün bildiğimiz kalıp (katı) çikolatanın üretilmesi Sanayi Devrimi'ndeki teknolojik gelişmeler sayesinde olmuştur.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 19. asrdagi mashinalar ixtirosi orqali qattiq shokolad ishlab chiqarilgan."
          },
          {
            "id": "s02-p3-q5",
            "type": "true_false_not_given",
            "question": "Dünyada en kaliteli kakao çekirdekleri Afrika kıtasında yetişmektedir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Afrika yoki eng sifatli kakao haqida ma'lumot berilmagan."
          },
          {
            "id": "s02-p3-q6",
            "type": "true_false_not_given",
            "question": "Avrupa'ya geldiğinde çikolatanın tadını güzelleştirmek için içine şeker ve vanilya katılmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'içine şeker ve vanilya eklenmesiyle...' yozilgan."
          }
        ]
      },
      {
        "id": "s02-p4",
        "title": "Tıpta Yapay Zeka Devrimi",
        "category": "Bilim ve Teknoloji",
        "level": "C1",
        "content": "Yapay zeka (YZ), hayatımızın birçok alanını dönüştürdüğü gibi tıp ve sağlık sektöründe de sessiz bir devrim yaratıyor. [ 1 ]. Geleneksel yöntemlerde doktorlar hastalıkları teşhis etmek için tahlil sonuçlarını ve röntgenleri kendi tecrübelerine dayanarak incelerler. Ancak YZ destekli algoritmalar, milyonlarca tıbbi görüntüyü saniyeler içinde tarayarak bir insanın gözden kaçırabileceği en küçük kanserli hücreleri bile tespit edebilmektedir. [ 2 ]. Buna rağmen tıp dünyasında YZ'nin tamamen doktorların yerini alacağı düşüncesi korku yaratmaktadır. Uzmanlar, YZ'nin bir rakip değil, doktorların kararlarını destekleyen güçlü bir asistan olarak görülmesi gerektiğini vurguluyor. Nihai kararı vermek ve hastayla empati kurmak, her zaman insan hekimlerin sorumluluğunda kalacaktır.",
        "questions": [
          {
            "id": "s02-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Yapay zeka en çok oyun sektöründe kullanılmaktadır.",
              "Özellikle hastalıkların erken teşhisi konusunda YZ eşsiz bir başarı gösteriyor.",
              "Hastanelerdeki hemşire eksikliği robotlarla çözülmektedir.",
              "Doktorlar artık hastaneye gitmeden evden çalışabilmektedir."
            ],
            "correctOption": 1,
            "explanation": "Bo'shliqdan keyin tashxis (teşhis) haqida gap ketgan. Shuning uchun B varianti mantiqan to'g'ri."
          },
          {
            "id": "s02-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Bu hız ve doğruluk payı, hastaların tedavi şansını büyük oranda artırmaktadır.",
              "Yapay zeka uygulamaları cep telefonlarında çok fazla şarj tüketmektedir.",
              "Gelecekte tüm ilaçlar sadece bitkilerden üretilecektir.",
              "Bu yüzden hastanelerdeki doktor sayısı yarı yarıya azaltılmıştır."
            ],
            "correctOption": 0,
            "explanation": "Yapay zekaning tez va aniq ishlashi bemorlarning davolanish imkoniyatini oshirishi mantiqan mos keladi."
          },
          {
            "id": "s02-p4-q3",
            "type": "multiple_choice",
            "question": "Metne göre yapay zekanın teşhis (tanı) koymadaki en büyük avantajı nedir?",
            "options": [
              "Çok ucuz olması",
              "İnsan gözünün kaçırabileceği küçük detayları saniyeler içinde tespit edebilmesi",
              "Hastalarla empati kurabilmesi",
              "Doktorlara hiç ihtiyaç bırakmaması"
            ],
            "correctOption": 1,
            "explanation": "Algoritmlar inson ko'zidan qochishi mumkin bo'lgan hujayralarni soniyalarda topishi aytilgan."
          },
          {
            "id": "s02-p4-q4",
            "type": "multiple_choice",
            "question": "Uzmanların yapay zeka ve doktor ilişkisi hakkındaki görüşü nedir?",
            "options": [
              "Yapay zeka doktorların tamamen yerini almalıdır.",
              "Doktorlar yapay zeka kullanımını derhal protesto etmelidir.",
              "Yapay zeka doktorların yerine geçecek bir rakip değil, onlara yardımcı olan bir asistandır.",
              "Yapay zeka sadece ameliyatlarda kullanılmalıdır."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'bir rakip değil, doktorların kararlarını destekleyen güçlü bir asistan' deyilgan."
          },
          {
            "id": "s02-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'Nihai kararı vermek' ifadesiyle anlatılmak istenen nedir?",
            "options": [
              "İlk kararı vermek",
              "Son, kesin ve bağlayıcı kararı vermek",
              "Yanlış bir karar vermek",
              "Hiçbir şeye karar verememek"
            ],
            "correctOption": 1,
            "explanation": "Nihai (arabcha 'nihoyat') - eng so'nggi, yakuniy degan ma'noni bildiradi."
          },
          {
            "id": "s02-p4-q6",
            "type": "cikarim",
            "question": "Bu metinden çıkarılabilecek en kapsamlı sonuç hangisidir?",
            "options": [
              "Teknoloji ne kadar gelişirse gelişsin, tıp alanında insan faktörüne (empati ve sorumluluk) her zaman ihtiyaç duyulacaktır.",
              "Gelecekte hastanelerde insan doktorlar çalışmayacaktır.",
              "Yapay zeka sadece röntgen çekmek için tasarlanmış basit bir yazılımdır.",
              "Geleneksel tıp yöntemleri tamamen yanlış ve tehlikelidir."
            ],
            "correctOption": 0,
            "explanation": "Matn so'ngida empatik va yakuniy qaror inson shifokorlarda qolishi haqida xulosa qilingan."
          }
        ]
      },
      {
        "id": "s02-p5",
        "title": "Pazarlamada Renklerin Psikolojisi",
        "category": "Psikoloji ve Ekonomi",
        "level": "C1",
        "content": "Bir mağazaya girdiğinizde veya bir markanın logosuna baktığınızda hissettikleriniz tesadüf değildir. Büyük markalar, tüketicilerin satın alma davranışlarını etkilemek için 'renk psikolojisini' kusursuz bir silah olarak kullanırlar. Örneğin, kırmızı renk insan beyninde aciliyet hissi ve açlık duygusu uyandırır; bu yüzden dünyanın en büyük fast-food zincirlerinin logoları genellikle kırmızıdır. Mavi ise güveni, istikrarı ve profesyonelliği temsil eder; teknoloji firmaları ve bankalar müşterilerinde güven inşa etmek için maviyi tercih eder. Yeşil, doğayı ve sağlığı çağrıştırdığı için organik ürünlerde sıkça kullanılırken, siyah renk lüks ve asaletin simgesidir. Pazarlama uzmanlarına göre, tüketicilerin bir ürün hakkındaki ilk izlenimlerinin %90'ı sadece ürünün rengine bağlı olarak ilk 90 saniye içinde oluşmaktadır. Bu nedenle doğru renk seçimi, bir markanın başarısı ile başarısızlığı arasındaki o ince çizgiyi belirler.",
        "questions": [
          {
            "id": "s02-p5-q1",
            "type": "ana_fikir",
            "question": "Bu metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Tüketiciler sadece kaliteli ürünleri satın alırlar.",
              "Markalar, renklerin insan psikolojisi üzerindeki etkisini kullanarak tüketici davranışlarını yönlendirmektedir.",
              "Kırmızı renk, pazarlamada kullanılabilecek en kötü renktir.",
              "Sadece teknoloji firmaları logolarına önem verir."
            ],
            "correctOption": 1,
            "explanation": "Asosiy e'tibor ranglar psixologiyasining xaridor xatti-harakatiga ta'siriga qaratilgan."
          },
          {
            "id": "s02-p5-q2",
            "type": "multiple_choice",
            "question": "Fast-food zincirlerinin logolarında kırmızı rengi tercih etmelerinin nedeni nedir?",
            "options": [
              "Kırmızının çok ucuza mal olan bir boya türü olması.",
              "Doğayı ve sağlıklı yaşamı temsil etmesi.",
              "Açlık hissi ve aciliyet (hemen tüketme) duygusu uyandırması.",
              "İnsanlara güven vermesi."
            ],
            "correctOption": 2,
            "explanation": "Kırmızı renk açlık duygusu ve aciliyet hissi uyandırdığı için tercih ediliyor."
          },
          {
            "id": "s02-p5-q3",
            "type": "multiple_choice",
            "question": "Bankaların ve finans kuruluşlarının genellikle mavi rengi seçmelerinin psikolojik sebebi nedir?",
            "options": [
              "Mavinin lüksü ve zenginliği temsil etmesi.",
              "İnsanlarda güven, istikrar ve profesyonellik hissi yaratması.",
              "Açlık duygusunu bastırması.",
              "Dikkat çekici ve rahatsız edici bir renk olması."
            ],
            "correctOption": 1,
            "explanation": "Mavi güveni, istikrarı ve profesyonelliği temsil eder."
          },
          {
            "id": "s02-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'çağrıştırmak' kelimesi hangi anlama gelmektedir?",
            "options": [
              "Bir şeyi tamamen unutturmak.",
              "Bir düşünceyi, nesneyi veya hissi akla getirmek, hatırlatmak.",
              "İnsanları yüksek sesle bir yere davet etmek.",
              "Bir ürünün fiyatını düşürmek."
            ],
            "correctOption": 1,
            "explanation": "Çağrıştırmak - assotsiatsiya qilish, yodga solish demakdir."
          },
          {
            "id": "s02-p5-q5",
            "type": "multiple_choice",
            "question": "Bir tüketici, bir ürün hakkındaki ilk izlenimini ne kadar sürede oluşturmaktadır?",
            "options": [
              "Ürünü kullandıktan 1 ay sonra.",
              "İlk 90 saniye içinde ve büyük oranda renge bağlı olarak.",
              "Reklamı televizyonda gördükten hemen sonra.",
              "Mağazadan içeri girer girmez."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'ilk izlenimlerinin %90'ı sadece rengine bağlı olarak ilk 90 saniye içinde oluşmaktadır' deb aniq fakt berilgan."
          },
          {
            "id": "s02-p5-q6",
            "type": "cikarim",
            "question": "Metinden yola çıkarak lüks bir mücevher (takı) markasının logosunda veya kutularında hangi rengi kullanması beklenir?",
            "options": [
              "Sarı",
              "Kırmızı",
              "Siyah",
              "Turuncu"
            ],
            "correctOption": 2,
            "explanation": "Matnda 'siyah renk lüks ve asaletin simgesidir' deyilgan, luks taqinchoqlar aynan siyah (qora) rangni talab qiladi."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-3",
    "sectionNumber": 3,
    "status": "active",
    "sourceFile": "turkuaz_bmba_mock_exam_3.json",
    "passages": [
      {
        "id": "s03-p1",
        "title": "Müze Ziyaret Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Tarih ve Sanat Müzemize hoş geldiniz! Ziyaretiniz sırasında tarihi eserlerin korunması için aşağıdaki kurallara uymanızı önemle rica ederiz:\n1. Müze içinde koşmak, yüksek sesle konuşmak ve diğer ziyaretçileri rahatsız etmek yasaktır.\n2. Sergilenen tablolara ve tarihi eserlere el ile dokunmak kesinlikle yasaktır.\n3. Flaşlı fotoğraf çekmek eserlerin boyalarına zarar verdiği için flaş kullanımına izin verilmemektedir.\n4. Müze salonlarına yiyecek, içecek ve evcil hayvan ile girilmesi yasaktır. (Sadece kapalı şişede suya izin vardır.)\n5. Müze çıkışında yer alan hediyelik eşya dükkanımız saat 18:30'a kadar açıktır.\nKurallara uyan tüm ziyaretçilerimize teşekkür ederiz.",
        "questions": [
          {
            "id": "s03-p1-q1",
            "type": "multiple_choice",
            "question": "Müzede eserlerin boyalarına zarar verdiği için ne yasaklanmıştır?",
            "options": [
              "Yakından bakmak",
              "Flaşlı fotoğraf çekmek",
              "Rehber eşliğinde gezmek",
              "Not defterine yazı yazmak"
            ],
            "correctOption": 1,
            "explanation": "Flaşlı fotoğraf çekmek eserlerin boyalarına zarar verdiği için yasaktır."
          },
          {
            "id": "s03-p1-q2",
            "type": "multiple_choice",
            "question": "Müzeye giren bir ziyaretçi yanına hangi içeceği alabilir?",
            "options": [
              "Sıcak kahve",
              "Kutu kola",
              "Kapalı şişede su",
              "Hiçbir içecek alamaz"
            ],
            "correctOption": 2,
            "explanation": "Parantez içinde 'Sadece kapalı şişede suya izin vardır' deyilgan."
          },
          {
            "id": "s03-p1-q3",
            "type": "multiple_choice",
            "question": "Müzedeki tarihi eşyalara dokunmak serbest midir?",
            "options": [
              "Evet, eğer temiz ellerle dokunulursa serbesttir.",
              "Hayır, eserlere el ile dokunmak kesinlikle yasaktır.",
              "Sadece rehberden izin alınırsa serbesttir.",
              "Sadece taş eserlere dokunulabilir."
            ],
            "correctOption": 1,
            "explanation": "Eserlere el ile dokunmak kesinlikle yasaktır."
          },
          {
            "id": "s03-p1-q4",
            "type": "multiple_choice",
            "question": "Hediyelik eşya almak isteyen bir turist en geç saat kaçta dükkana gitmelidir?",
            "options": [
              "17:00",
              "18:00",
              "18:30",
              "19:00"
            ],
            "correctOption": 2,
            "explanation": "Dükkan saat 18:30'a kadar açıktır."
          },
          {
            "id": "s03-p1-q5",
            "type": "multiple_choice",
            "question": "Hangi davranışın müzede yapılmasına izin verilmez?",
            "options": [
              "Sessizce eserleri incelemek",
              "Müze haritası kullanmak",
              "Müze içinde koşmak ve yüksek sesle konuşmak",
              "Fotoğraf makinesi (flaşsız) kullanmak"
            ],
            "correctOption": 2,
            "explanation": "Koşmak ve yüksek sesle konuşmak yasaktır."
          },
          {
            "id": "s03-p1-q6",
            "type": "multiple_choice",
            "question": "Metnin yazılış amacı nedir?",
            "options": [
              "Müzenin giriş biletlerinin fiyatını söylemek",
              "Ziyaretçileri müze kuralları hakkında uyarmak",
              "Müzenin tarihçesini anlatmak",
              "Yeni bir ressamın sergisini tanıtmak"
            ],
            "correctOption": 1,
            "explanation": "Kurallara uymak ve tarihi eserleri korumak için yazılmış bir uyarı metnidir."
          }
        ]
      },
      {
        "id": "s03-p2",
        "title": "Hayalimdeki Tatil",
        "category": "Seyahat / Eşleştirme",
        "level": "B1",
        "content": "A) Hakan: Benim için tatil demek deniz, kum ve güneş demektir. Bütün yılın yorgunluğunu ancak sıcak bir kumsalda uzanarak ve yüzerek atabilirim. Soğuk yerleri ve yorucu aktiviteleri hiç sevmem.\n\nB) Aylin: Ben tarihi ve kültürel gezileri seviyorum. Eski medeniyetlerin kalıntılarını görmek, müzeleri gezmek ve yerel halkın geleneklerini öğrenmek bana çok büyük heyecan veriyor. Turist rehberi olmadan bir yere gitmem.\n\nC) Can: Tatilde otelde oturmaktan nefret ederim. Adrenalin tutkunuyum! Yüksek dağlara tırmanmak, ormanda kamp kurmak veya nehirde rafting yapmak tam bana göre. Doğanın vahşi ve zorlu yanını seviyorum.\n\nD) Selin: Benim hayalimdeki tatil, yeni lezzetler keşfetmek üzerine kuruludur. Gittiğim şehrin en ünlü restoranlarını araştırır, sokak lezzetlerini denerim. Gurme turlarına katılmak benim için müzeleri gezmekten daha keyiflidir.",
        "questions": [
          {
            "id": "s03-p2-q1",
            "type": "matching_paragraph",
            "question": "Tatilde dinlenmeyi tercih eden ve sıcak yerleri seven kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Selin"
            ],
            "correctOption": 0,
            "explanation": "Hakan sıcak kumsalda uzanarak dinlenmeyi tercih ediyor."
          },
          {
            "id": "s03-p2-q2",
            "type": "matching_paragraph",
            "question": "Seyahatlerinde yemek kültürünü ve yeni tatları ön planda tutan kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Selin"
            ],
            "correctOption": 3,
            "explanation": "Selin yeni lezzetler keşfetmek ve gurme turlarına katılmak istiyor."
          },
          {
            "id": "s03-p2-q3",
            "type": "matching_paragraph",
            "question": "Heyecan verici ve tehlikeli sporları, vahşi doğayı tercih eden kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Selin"
            ],
            "correctOption": 2,
            "explanation": "Can dağlara tırmanmak, rafting yapmak ve adrenalin yaşamak istiyor."
          },
          {
            "id": "s03-p2-q4",
            "type": "matching_paragraph",
            "question": "Eski çağlardan kalma yapıları ve müzeleri incelemeyi seven kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Selin"
            ],
            "correctOption": 1,
            "explanation": "Aylin tarihi gezileri ve müzeleri sevdiğini söylüyor."
          },
          {
            "id": "s03-p2-q5",
            "type": "matching_paragraph",
            "question": "Tatillerinde konfor alanından çıkmayı (yorucu aktiviteleri) sevmeyen kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Selin"
            ],
            "correctOption": 0,
            "explanation": "Hakan 'yorucu aktiviteleri hiç sevmem' demiştir."
          },
          {
            "id": "s03-p2-q6",
            "type": "matching_paragraph",
            "question": "Gideceği yerlerde mutlaka bir uzmandan (rehberden) yardım alan kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Selin"
            ],
            "correctOption": 1,
            "explanation": "Aylin 'Turist rehberi olmadan bir yere gitmem' demiştir."
          }
        ]
      },
      {
        "id": "s03-p3",
        "title": "Bilginin Taşıyıcısı: Kâğıdın İcadı",
        "category": "Tarih ve Teknoloji",
        "level": "B2",
        "content": "Kâğıt, insanlık tarihinin en önemli icatlarından biridir. Kâğıttan önce insanlar yazı yazmak için kil tabletler, hayvan derileri (parşömen) ve taş gibi ağır malzemeler kullanıyordu. Kâğıt, ilk olarak MS 105 yılında Çin'de Cai Lun adında bir saray memuru tarafından icat edilmiştir. Cai Lun; ağaç kabukları, eski balık ağları ve bez parçalarını suda kaynatıp hamur haline getirerek ilk kâğıdı üretmiştir. Çinliler bu icadı yüzlerce yıl bir sır olarak sakladılar. Ancak 8. yüzyılda Araplarla yapılan Talas Savaşı sırasında Çinli kâğıt ustaları esir düşünce, kâğıt üretimi önce İslam dünyasına, oradan da Avrupa'ya yayıldı. Kâğıdın ucuz ve kolay üretilebilir bir malzeme olması, 15. yüzyılda matbaanın icadıyla birleşince dünyada bilim ve edebiyatın hızla yayılmasını sağladı.",
        "questions": [
          {
            "id": "s03-p3-q1",
            "type": "true_false_not_given",
            "question": "Kâğıt icat edilmeden önce insanlar düşüncelerini kaydetmek için hayvan derisi ve taş gibi malzemeler kullanmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'kil tabletler, hayvan derileri (parşömen) ve taş' kullanıldığı belirtilmiştir."
          },
          {
            "id": "s03-p3-q2",
            "type": "true_false_not_given",
            "question": "İlk kâğıt, Çin'de sadece ipek iplikleri kullanılarak üretilmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. İpek değil; ağaç kabukları, balık ağları ve bez parçaları kullanılmıştır."
          },
          {
            "id": "s03-p3-q3",
            "type": "true_false_not_given",
            "question": "Çinliler kâğıt yapım teknolojisini diğer milletlerle hemen paylaşmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'yüzlerce yıl bir sır olarak sakladılar' denilmiştir."
          },
          {
            "id": "s03-p3-q4",
            "type": "true_false_not_given",
            "question": "Kâğıt üretimi sırrı, yaşanan bir savaş (Talas Savaşı) sonucunda Arapların eline geçmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. Talas savaşında esir düşen ustalar sayesinde yayılmıştır."
          },
          {
            "id": "s03-p3-q5",
            "type": "true_false_not_given",
            "question": "İlk matbaa makinesi kâğıdın icadından 200 yıl sonra İtalya'da yapılmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Matbaaning qayerda yasalgani haqida ma'lumot yo'q, faqat 15-asrda ekani aytilgan."
          },
          {
            "id": "s03-p3-q6",
            "type": "true_false_not_given",
            "question": "Kâğıt ve matbaanın birleşmesi bilimsel bilginin kitlelere ulaşmasını kolaylaştırmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'bilim ve edebiyatın hızla yayılmasını sağladı' denilmiştir."
          }
        ]
      },
      {
        "id": "s03-p4",
        "title": "İklim Değişikliği ve Okyanus Akıntıları",
        "category": "Çevre ve Doğa",
        "level": "C1",
        "content": "Dünyamızın iklim sistemi sadece atmosfere değil, aynı zamanda devasa bir termostat görevi gören okyanuslara bağlıdır. [ 1 ]. Gulf Stream olarak bilinen ve sıcak suyu Ekvator'dan Kuzey Avrupa'ya taşıyan bu akıntı, Avrupa kıtasının yaşanabilir ve ılıman bir iklime sahip olmasını sağlar. Ancak küresel ısınma nedeniyle kutuplardaki buzulların hızla erimesi, okyanuslara büyük miktarda soğuk tatlı su karışmasına neden olmaktadır. [ 2 ]. Bilim insanları, okyanus akıntılarındaki bu yavaşlamanın veya durmanın dünyayı yeni bir Buzul Çağı'na sürükleyebileceği konusunda uyarıyor. İklim krizinin yarattığı bu zincirleme reaksiyon, sadece belirli bölgeleri değil, tüm gezegenin biyolojik çeşitliliğini ve tarımsal kapasitesini tehdit etmektedir.",
        "questions": [
          {
            "id": "s03-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Okyanuslarda yaşayan balık türleri her geçen gün azalmaktadır.",
              "Okyanus akıntıları, sıcak ve soğuk suları gezegen etrafında taşıyarak iklimi dengeler.",
              "Göller ve nehirler kuruduğu için insanlar susuzluk çekmektedir.",
              "Atmosferdeki oksijenin büyük kısmı ormanlar tarafından üretilir."
            ],
            "correctOption": 1,
            "explanation": "Okyanuslarning termostat (haroratni ushlovchi) vazifasini bajarishi aytilgach, ularning suvlarni tashib iqlimni muvozanatda ushlashi (dengeler) mantiqan to'g'ri keladi."
          },
          {
            "id": "s03-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Tuzluluk ve sıcaklık dengesinin bozulması, Gulf Stream gibi hayati akıntıları yavaşlatmaktadır.",
              "Buzullar eridikçe yeni petrol kaynakları ortaya çıkmaktadır.",
              "Bu durum yaz aylarının çok daha sıcak geçmesini sağlamaktadır.",
              "Avrupa ülkeleri rüzgar enerjisi kullanımını artırmıştır."
            ],
            "correctOption": 0,
            "explanation": "Oldingi gapda erigan muzliklardan chuchuk suv (tatlı su) dengizga qo'shilishi aytildi, bu esa sho'rlik (tuzluluk) va haroratni buzib akıntıni sekinlashtiradi."
          },
          {
            "id": "s03-p4-q3",
            "type": "multiple_choice",
            "question": "Gulf Stream akıntısının Kuzey Avrupa üzerindeki en büyük etkisi nedir?",
            "options": [
              "Bölgede devasa kasırgalar oluşturması",
              "Avrupa kıtasında yeni buzullar yaratması",
              "Kıtaya sıcak su taşıyarak bölgenin daha ılıman (yaşanabilir) olmasını sağlaması",
              "Deniz trafiğini zorlaştırması"
            ],
            "correctOption": 2,
            "explanation": "Kuzey Avrupa'ya taşıyan bu akıntı, Avrupa kıtasının yaşanabilir ve ılıman bir iklime sahip olmasını sağlar."
          },
          {
            "id": "s03-p4-q4",
            "type": "multiple_choice",
            "question": "Kutuplardaki buzulların erimesinin okyanus akıntılarına olan olumsuz etkisi nedir?",
            "options": [
              "Okyanus suyunun sıcaklığını aniden 50 dereceye çıkarması.",
              "Sisteme büyük miktarda tatlı su karıştırarak akıntıların düzenini yavaşlatması.",
              "Balinaların göç yollarını uzatması.",
              "Okyanuslarda tsunami oluşturması."
            ],
            "correctOption": 1,
            "explanation": "Tatlı su karışması oqibatida akıntıların (Gulf Stream) yavaşlaması aytilgan."
          },
          {
            "id": "s03-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'zincirleme reaksiyon' ifadesiyle kastedilen nedir?",
            "options": [
              "Bir olayın başka bir olayı tetikleyerek birbirine bağlı sonuçlar doğurması.",
              "Sadece denizlerde meydana gelen fırtınalar.",
              "Kimyasal bir madde.",
              "Bilim insanlarının yaptığı uzun toplantılar."
            ],
            "correctOption": 0,
            "explanation": "Zanjir reaksiyasi — bir muammo ikkinchisini chaqirib, uzluksiz ta'sir qilishini bildiradi."
          },
          {
            "id": "s03-p4-q6",
            "type": "cikarim",
            "question": "Metinden çıkarılabilecek en kesin sonuç aşağıdakilerden hangisidir?",
            "options": [
              "Küresel ısınma sadece Ekvator bölgesindeki insanları etkilemektedir.",
              "Okyanus akıntılarının bozulması, uzun vadede dünyada büyük bir soğumaya (Buzul Çağı) sebep olabilir.",
              "Buzulların erimesi Avrupa için çok faydalıdır çünkü daha fazla su kaynağı yaratır.",
              "Gelecekte okyanus suları tamamen kuruyacaktır."
            ],
            "correctOption": 1,
            "explanation": "Akıntıların durmasının yeni bir Buzul Çağı'na (Muzlik davriga) sürüklashi aytilgan."
          }
        ]
      },
      {
        "id": "s03-p5",
        "title": "IQ mu, EQ mu? Başarının Gerçek Anahtarı",
        "category": "Psikoloji ve Eğitim",
        "level": "C1",
        "content": "On yıllar boyunca toplumlar ve eğitim sistemleri, insan zekâsını yalnızca analitik yeteneklere ve matematiksel mantığa dayanan IQ (Zeka Katsayısı) ile ölçtü. Ancak 1990'larda Daniel Goleman'ın çalışmalarıyla popülerleşen Duygusal Zekâ (EQ), başarının formülünü tamamen değiştirdi. EQ; bir insanın kendi duygularını tanıması, yönetmesi ve başkalarıyla empati kurarak sağlıklı sosyal ilişkiler geliştirebilme kapasitesidir. Yapılan uzun soluklu araştırmalar, çok yüksek IQ'ya sahip, parlak üniversitelerden mezun bireylerin iş hayatında, duygusal zekâsı yüksek (EQ) ama IQ'su ortalama olan kişilerin gerisinde kalabildiğini göstermiştir. Çünkü modern iş dünyası sadece problem çözmeyi değil; kriz anında sakin kalabilmeyi, takım çalışmasına uyum sağlamayı ve etkili iletişim kurmayı gerektirir. Özetle, IQ sizi bir şirkette işe aldırabilir, ancak o şirkette yükselmenizi ve lider olmanızı sağlayan şey kesinlikle EQ'dur.",
        "questions": [
          {
            "id": "s03-p5-q1",
            "type": "ana_fikir",
            "question": "Bu metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Matematik ve mantık, hayatta başarılı olmanın tek yoludur.",
              "EQ (Duygusal Zeka), iş ve sosyal hayatta başarılı ve iyi bir lider olmak için IQ'dan daha belirleyicidir.",
              "Yüksek IQ'lu insanlar genellikle kötü niyetlidir.",
              "Eğitim sistemleri tamamen değiştirilmeli ve sınavlar kaldırılmalıdır."
            ],
            "correctOption": 1,
            "explanation": "Matnda hissiy intellekt (EQ) muvaffaqiyat va liderlikda muhimroq ekani tushuntirilgan."
          },
          {
            "id": "s03-p5-q2",
            "type": "multiple_choice",
            "question": "Metne göre EQ (Duygusal Zeka) kavramı aşağıdakilerden hangisini içermez?",
            "options": [
              "Kendi duygularını fark etme ve kontrol etme",
              "Başkalarının ne hissettiğini anlama (empati)",
              "Çok karmaşık matematik denklemlerini akıldan çözme",
              "Takım çalışması ve etkili iletişim kurma"
            ],
            "correctOption": 2,
            "explanation": "Matematika va mantiq EQ emas, IQ ga tegishli."
          },
          {
            "id": "s03-p5-q3",
            "type": "multiple_choice",
            "question": "Araştırmalara göre, çok yüksek IQ'ya sahip bireyler iş hayatında neden bazen başarısız olabilmektedir?",
            "options": [
              "Çok fazla para istedikleri için.",
              "Sadece bireysel problem çözmeye odaklanıp, takım çalışması ve kriz yönetiminde zorlandıkları için.",
              "Üniversite diplomaları sahte olduğu için.",
              "Çok erken yaşta emekli olmak istedikleri için."
            ],
            "correctOption": 1,
            "explanation": "Ish dunyosi faqat problem yechish emas, balki asabni jilovlash (kriz anı) va jamoada ishlashni talab qilgani uchun."
          },
          {
            "id": "s03-p5-q4",
            "type": "kelime",
            "question": "Metinde geçen 'uzun soluklu araştırmalar' ifadesiyle kastedilen nedir?",
            "options": [
              "Çok fazla insanın katıldığı nefes egzersizleri.",
              "Birkaç gün süren hızlı anketler.",
              "Yıllar boyunca devam eden, derinlemesine ve sabır gerektiren bilimsel çalışmalar.",
              "Sadece sporcular üzerinde yapılan araştırmalar."
            ],
            "correctOption": 2,
            "explanation": "Uzun soluklu - uzoq muddat davom etgan degan ma'noni bildiradi."
          },
          {
            "id": "s03-p5-q5",
            "type": "multiple_choice",
            "question": "Yazara göre IQ ve EQ arasındaki işlev farkı nedir?",
            "options": [
              "IQ işe girmeyi sağlarken, EQ kariyerde yükselmeyi ve liderliği sağlar.",
              "IQ sadece okulda, EQ sadece evde işe yarar.",
              "IQ sanatçılar için, EQ mühendisler içindir.",
              "Aralarında hiçbir fark yoktur, ikisi de aynı şeydir."
            ],
            "correctOption": 0,
            "explanation": "Matn oxirida 'IQ sizi işe aldırabilir, yükselmenizi sağlayan şey EQ'dur' deyilgan."
          },
          {
            "id": "s03-p5-q6",
            "type": "cikarim",
            "question": "Bu metinden yola çıkarak, başarılı bir yönetici (lider) arayan şirketin adayda özellikle hangi özelliği araması beklenir?",
            "options": [
              "Sadece yabancı dil bilmesini",
              "Kriz anlarında sakin kalıp ekibiyle iyi iletişim kurabilmesini",
              "Çok hızlı bilgisayar kullanmasını",
              "İnsanlarla hiç konuşmadan sadece odasında çalışmasını"
            ],
            "correctOption": 1,
            "explanation": "Liderda EQ kuchli bo'lishi (krizda xotirjamlik va muloqot) kutiladi."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-4",
    "sectionNumber": 4,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_4.json",
    "passages": [
      {
        "id": "s04-p1",
        "title": "Şehir İçi Toplu Taşıma Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli yolcularımız, güvenli ve rahat bir yolculuk için otobüs ve metrolarımızda aşağıdaki kurallara uymanız gerekmektedir:\n1. Toplu taşıma araçlarına binerken elektronik biletinizi (kartınızı) okutmak zorunludur. Kartı olmayan yolculara ceza kesilecektir.\n2. Hamilelere, yaşlılara ve engelli vatandaşlara öncelikli koltuklarda yer verilmelidir.\n3. Araç içerisinde yüksek sesle müzik dinlemek ve telefonla konuşmak diğer yolcuları rahatsız ettiği için yasaktır.\n4. Otobüs ve metrolara koku yapan yiyeceklerle (örneğin döner, pizza) veya açık içeceklerle binilmesine izin verilmez.\n5. Bebek arabaları orta kapıdan bindirilmeli ve araç içinde kilitli (sabit) tutulmalıdır.\nİyi yolculuklar dileriz.",
        "questions": [
          {
            "id": "s04-p1-q1",
            "type": "multiple_choice",
            "question": "Elektronik biletini (kartını) okutmayan bir yolcu ne ile karşılaşır?",
            "options": [
              "Araca alınmaz",
              "Ceza ödemek zorunda kalır",
              "Sürücü tarafından uyarılır",
              "İndirimden yararlanamaz"
            ],
            "correctOption": 1,
            "explanation": "Matnda 'Kartı olmayan yolculara ceza kesilecektir' deb yozilgan."
          },
          {
            "id": "s04-p1-q2",
            "type": "multiple_choice",
            "question": "Araç içindeki öncelikli koltuklar kimler için ayrılmıştır?",
            "options": [
              "Sadece çocuklar için",
              "Şoförün yakınları için",
              "Hamile, yaşlı ve engelliler için",
              "Öğrenciler için"
            ],
            "correctOption": 2,
            "explanation": "Matnda bu guruhga 'öncelikli koltuklarda yer verilmelidir' deyilgan."
          },
          {
            "id": "s04-p1-q3",
            "type": "multiple_choice",
            "question": "Yolcuların araçta yüksek sesle müzik dinlemesi neden yasaktır?",
            "options": [
              "Sürücünün dikkatini dağıttığı için",
              "Müzik cihazları aracı bozduğu için",
              "Diğer yolcuları rahatsız ettiği için",
              "Araçta zaten radyo çaldığı için"
            ],
            "correctOption": 2,
            "explanation": "Boshqa yo'lovchilarni bezovta qilgani uchun (diğer yolcuları rahatsız ettiği için) taqiqlangan."
          },
          {
            "id": "s04-p1-q4",
            "type": "multiple_choice",
            "question": "Bir yolcu elinde açık bir kahve ve pizza ile otobüse binmek isterse ne olur?",
            "options": [
              "Arka kapıdan binmesine izin verilir.",
              "Şoföre fazladan bilet öder.",
              "Araca binmesine izin verilmez.",
              "Sadece ayakta yolculuk edebilir."
            ],
            "correctOption": 2,
            "explanation": "Hidi chiqadigan ovqat va ochiq ichimliklar bilan chiqishga 'izin verilmez'."
          },
          {
            "id": "s04-p1-q5",
            "type": "multiple_choice",
            "question": "Bebek arabası olan yolcular için kural nedir?",
            "options": [
              "Bebek arabasını katlayıp bagaja koymalıdır.",
              "Orta kapıdan binmeli ve arabayı sabitlemelidir.",
              "Ön kapıdan binip sürücünün yanına koymalıdır.",
              "Toplu taşımayı kullanmaları tamamen yasaktır."
            ],
            "correctOption": 1,
            "explanation": "O'rta eshikdan chiqib, aravachani qulflangan holatda (sabit) ushlash kerak."
          },
          {
            "id": "s04-p1-q6",
            "type": "multiple_choice",
            "question": "Metnin yazılış amacı nedir?",
            "options": [
              "Şehir içi ulaşım fiyatlarını açıklamak",
              "Yeni metro hatlarını tanıtmak",
              "Toplu taşıma kurallarını hatırlatmak",
              "Yolcuların şikayetlerini dinlemek"
            ],
            "correctOption": 2,
            "explanation": "Asosiy maqsad transportdagi qoidalarni e'lon qilishdir."
          }
        ]
      },
      {
        "id": "s04-p2",
        "title": "Gönüllülük Deneyimleri",
        "category": "Sosyal Yaşam / Eşleştirme",
        "level": "B1",
        "content": "A) Ahmet: Ben haftanın iki günü yerel hayvan barınağına gidiyorum. Oradaki terk edilmiş köpeklere mama veriyor, altlarını temizliyor ve onlarla oyun oynuyorum. Hayvanların sevgisi benim bütün stresimi alıyor.\n\nB) Elif: Üniversiteden mezun olduktan sonra bir eğitim derneğine katıldım. Hafta sonları durumu iyi olmayan ailelerin çocuklarına ücretsiz matematik ve Türkçe dersleri veriyorum. Onların gözündeki öğrenme hevesini görmek paha biçilemez.\n\nC) Sinan: Benim tutkum doğa! Bir çevre örgütüne üyeyim ve sık sık ormanlık alanlara gidip ağaç dikiyoruz. Ayrıca sahil kenarlarında çevre temizliği kampanyaları düzenleyip, piknikçilerin bıraktığı çöpleri topluyoruz.\n\nD) Merve: Ben huzurevindeki yaşlı vatandaşlarımızı ziyaret ediyorum. Onlarla çay içip geçmiş hatıralarını dinliyorum, kitap okuyorum veya örgü örmelerine yardım ediyorum. Onların tek ihtiyacı aslında birazcık sohbet etmek.",
        "questions": [
          {
            "id": "s04-p2-q1",
            "type": "matching_paragraph",
            "question": "Hangi kişi zamanını çocukların eğitimi için harcamaktadır?",
            "options": [
              "A) Ahmet",
              "B) Elif",
              "C) Sinan",
              "D) Merve"
            ],
            "correctOption": 1,
            "explanation": "Elif ücretsiz ders verdiğini belirtmiştir."
          },
          {
            "id": "s04-p2-q2",
            "type": "matching_paragraph",
            "question": "Hangi kişinin yaptığı gönüllü çalışma doğayı korumaya yöneliktir?",
            "options": [
              "A) Ahmet",
              "B) Elif",
              "C) Sinan",
              "D) Merve"
            ],
            "correctOption": 2,
            "explanation": "Sinan ağaç dikme ve sahil temizliği yaptığını anlatmıştır."
          },
          {
            "id": "s04-p2-q3",
            "type": "matching_paragraph",
            "question": "Kim yalnızlık çeken insanlarla duygusal bağ kurup onlarla vakit geçirmektedir?",
            "options": [
              "A) Ahmet",
              "B) Elif",
              "C) Sinan",
              "D) Merve"
            ],
            "correctOption": 3,
            "explanation": "Merve huzurevindeki yaşlılarla sohbet edip kitap okuduğunu belirtmiştir."
          },
          {
            "id": "s04-p2-q4",
            "type": "matching_paragraph",
            "question": "Hangi kişi gönüllü çalışmasının kendisinin stresini azalttığını söylemiştir?",
            "options": [
              "A) Ahmet",
              "B) Elif",
              "C) Sinan",
              "D) Merve"
            ],
            "correctOption": 0,
            "explanation": "Ahmet, 'Hayvanların sevgisi benim bütün stresimi alıyor' demiştir."
          },
          {
            "id": "s04-p2-q5",
            "type": "matching_paragraph",
            "question": "Sokaklara ve çevreye atılan atıkları toplayan kişi kimdir?",
            "options": [
              "A) Ahmet",
              "B) Elif",
              "C) Sinan",
              "D) Merve"
            ],
            "correctOption": 2,
            "explanation": "Sinan çöpleri topladığını belirtmiştir."
          },
          {
            "id": "s04-p2-q6",
            "type": "matching_paragraph",
            "question": "İnsanlara değil, doğrudan yardıma muhtaç canlılara hizmet eden kişi kimdir?",
            "options": [
              "A) Ahmet",
              "B) Elif",
              "C) Sinan",
              "D) Merve"
            ],
            "correctOption": 0,
            "explanation": "Ahmet barınaktaki köpeklere (hayvanlara) yardım etmektedir."
          }
        ]
      },
      {
        "id": "s04-p3",
        "title": "Anadolu'nun Kayıp Şehri: Truva",
        "category": "Tarih ve Kültür",
        "level": "B2",
        "content": "Truva (Troya), Çanakkale sınırları içinde yer alan ve dünyaca ünlü İlyada destanına konu olan antik bir şehirdir. Yıllar boyunca birçok insan Truva Savaşı'nın ve ünlü 'Truva Atı'nın sadece bir efsaneden ibaret olduğuna inandı. Ancak 1870'lerde Alman amatör arkeolog Heinrich Schliemann, İlyada destanını bir harita gibi kullanarak yaptığı kazılarda bu antik kenti buldu. Kazılar sırasında üst üste kurulmuş 9 farklı şehir katmanı keşfedildi; bu da şehrin depremler ve savaşlar nedeniyle defalarca yıkılıp yeniden yapıldığını kanıtladı. Schliemann, bulduğu paha biçilmez altın hazineleri gizlice yurtdışına kaçırdı. Günümüzde UNESCO Dünya Mirası Listesi'nde yer alan Truva, tarih meraklılarının ve edebiyat severlerin en çok ziyaret ettiği ören yerlerinden biridir. Truva Atı'nın aslı olmasa da, devasa ahşap bir kopyası bugün ziyaretçileri antik kentin girişinde karşılamaktadır.",
        "questions": [
          {
            "id": "s04-p3-q1",
            "type": "true_false_not_given",
            "question": "Truva antik kentinin keşfedilmesinde eski bir edebiyat eseri yol gösterici olmuştur.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'İlyada destanını bir harita gibi kullanarak...' deyilgan."
          },
          {
            "id": "s04-p3-q2",
            "type": "true_false_not_given",
            "question": "Heinrich Schliemann profesyonel bir Türk arkeologdur.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. U 'Alman amatör arkeolog' bo'lgan."
          },
          {
            "id": "s04-p3-q3",
            "type": "true_false_not_given",
            "question": "Truva şehrinin tarihinde sadece bir kez kurulup yıkıldığı anlaşılmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. '9 farklı şehir katmanı keşfedildi' va 'defalarca yıkılıp yeniden yapıldığı' aytilgan."
          },
          {
            "id": "s04-p3-q4",
            "type": "true_false_not_given",
            "question": "Truva kazılarında bulunan altın hazineler bugün Türkiye'deki müzelerde sergilenmektedir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'gizlice yurtdışına kaçırdı' (chet elga qochirib olib ketgan) deb yozilgan."
          },
          {
            "id": "s04-p3-q5",
            "type": "true_false_not_given",
            "question": "Truva Savaşı tamamen ekonomik nedenlerle (ticaret yolları) başlamıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Urushning sababi (iqtisodiy yoki boshqa) haqida ma'lumot berilmagan."
          },
          {
            "id": "s04-p3-q6",
            "type": "true_false_not_given",
            "question": "Günümüzde kentin girişinde duran Truva Atı, binlerce yıl öncesinden kalan orijinal bir eserdir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'Truva Atı'nın aslı olmasa da, devasa ahşap bir kopyası...' deyilgan."
          }
        ]
      },
      {
        "id": "s04-p4",
        "title": "Giyilebilir Teknoloji ve Biyolojik Takip",
        "category": "Teknoloji ve Sağlık",
        "level": "C1",
        "content": "Akıllı saatler ve bileklikler gibi giyilebilir teknolojiler, son beş yılda sadece bir iletişim aracı olmaktan çıkıp kişisel sağlık asistanlarına dönüştü. [ 1 ]. Bu cihazlar, kalp ritmimizi, kandaki oksijen oranını, uyku kalitemizi ve gün içinde attığımız adımları saniye saniye kaydediyor. Elde edilen bu büyük veri (big data), hastalıkların daha belirti vermeden önce tespit edilebilmesine olanak sağlıyor. Örneğin, bazı akıllı saat modelleri kalp ritminde düzensizlik sezdiğinde kullanıcıyı uyararak olası bir kalp krizini önleyebilmektedir. Ancak bu gelişmeler büyük bir tartışmayı da beraberinde getirdi. [ 2 ]. Sigorta firmalarının veya işverenlerin bu sağlık verilerini ele geçirip insanlara karşı kullanabileceği endişesi, dijital mahremiyet savunucularını harekete geçirmiştir. Sonuç olarak, bedenimizden toplanan bu verilerin kime ait olduğu ve nasıl korunacağı sorusu hala cevapsızdır.",
        "questions": [
          {
            "id": "s04-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Bunun nedeni, insanların artık daha az spor yapmasıdır.",
              "Artık bileğimizdeki küçük bir ekran, vücudumuzun iç işleyişi hakkında bize detaylı raporlar sunabiliyor.",
              "Geleneksel saat üreticileri bu duruma büyük tepki göstermektedir.",
              "Bu akıllı saatler sayesinde telefonla konuşmak çok daha kolaydır."
            ],
            "correctOption": 1,
            "explanation": "Bo'shliqdan keyin qurilmalar nimalarni (yurak, kislorod, uyqu) o'lchashi sanalgan, shuning uchun 'ichki faoliyat haqida raport berishi' mantiqan mos."
          },
          {
            "id": "s04-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Cihazların şarj süreleri maalesef hala bir günü geçememektedir.",
              "Akıllı saat fiyatları her geçen gün ucuzlamaktadır.",
              "İnsanların en mahrem (özel) biyolojik verilerinin şirketlerin sunucularında saklanması güvenlik riskleri yaratmaktadır.",
              "Doktorlar bu cihazların verdiği bilgilere kesinlikle inanmamaktadır."
            ],
            "correctOption": 2,
            "explanation": "Keyingi gapda sug'urta kompaniyalari bu ma'lumotlarni qo'lga kiritish xavfi haqida so'z boradi. Shuning uchun 'xavfsizlik tavakkalchiligi va maxfiylik' haqidagi variant to'g'ri."
          },
          {
            "id": "s04-p4-q3",
            "type": "multiple_choice",
            "question": "Akıllı saatlerin sağlık açısından en önemli özelliği nedir?",
            "options": [
              "Hastanelerdeki röntgen cihazlarının yerini alması",
              "Hastalıkları daha belirtiler ortaya çıkmadan önce fark edebilecek veriler toplaması",
              "Kullanıcılarına anında ilaç verebilmesi",
              "Sadece spor yapan insanlar için kalori hesaplaması"
            ],
            "correctOption": 1,
            "explanation": "Matnda 'hastalıkların daha belirti vermeden önce tespit edilebilmesine olanak sağlıyor' deyilgan."
          },
          {
            "id": "s04-p4-q4",
            "type": "kelime",
            "question": "Metinde geçen 'mahremiyet' kelimesi hangi anlama gelmektedir?",
            "options": [
              "Bireyin sadece kendine ait olan, başkalarından gizli kalması gereken özel hayatı ve bilgileri.",
              "Bir cihazın ne kadar süreyle çalışabileceği (pil ömrü).",
              "Doktorların yazdığı gizli reçeteler.",
              "Toplum içinde uyulması gereken görgü kuralları."
            ],
            "correctOption": 0,
            "explanation": "Mahremiyet (privacy) shaxsiy hayotning daxlsizligi va maxfiyligini bildiradi."
          },
          {
            "id": "s04-p4-q5",
            "type": "multiple_choice",
            "question": "Dijital mahremiyet savunucularının temel endişesi nedir?",
            "options": [
              "Akıllı saatlerin radyasyon yayarak kansere sebep olması.",
              "İnsanların sürekli saatlerine bakarak asosyal hale gelmesi.",
              "Kişisel sağlık verilerinin kötü niyetli şirketlerin eline geçerek istismar edilmesi.",
              "Cihazların yanlış kalp krizi uyarıları vererek panik yaratması."
            ],
            "correctOption": 2,
            "explanation": "Sug'urta yoki ish beruvchilar ma'lumotlarni qo'lga kiritib, odamlarga qarshi ishlatish xavfi ularni xavotirga solmoqda."
          },
          {
            "id": "s04-p4-q6",
            "type": "cikarim",
            "question": "Metinden çıkarılabilecek ana sonuç aşağıdakilerden hangisidir?",
            "options": [
              "Giyilebilir teknolojiler faydalı olsa da, veri güvenliği ve etik kurallar konusunda çözülmemiş ciddi sorunlar barındırmaktadır.",
              "Herkesin derhal bir akıllı saat alması sağlığımız için zorunludur.",
              "Akıllı saatler yüzünden gelecekte doktorlara hiç ihtiyaç kalmayacaktır.",
              "Sadece hasta insanlar akıllı saat kullanmalıdır."
            ],
            "correctOption": 0,
            "explanation": "Matnda foydali tomonlari ko'p bo'lsa-da, katta tortishuvlarga sabab bo'layotgan xavfsizlik muammolari ta'kidlangan."
          }
        ]
      },
      {
        "id": "s04-p5",
        "title": "Nöropazarlama: Beynimiz Nasıl Satın Alır?",
        "category": "Psikoloji ve Pazarlama",
        "level": "C1",
        "content": "Reklamverenler yıllarca tüketicilere 'Bu ürünü neden satın aldınız?' diye sormak için anketler düzenledi. Ancak insanlar genellikle kararlarının arkasındaki gerçek duygusal sebepleri bilmez veya gizlerler. İşte bu noktada devreye 'Nöropazarlama' (Neuromarketing) girmektedir. Nöropazarlama; tüketicilerin beyin dalgalarını, göz hareketlerini ve kalp atış hızını ölçerek reklamların veya ürün ambalajlarının bilinçaltında nasıl bir etki yarattığını inceler. Örneğin, bir süpermarketteki müzik temposu, reyondaki ışıklandırma veya bir cips paketinin çıkardığı hışırtı sesi tamamen beynin ödül merkezini uyarmak için özel olarak tasarlanır. Deneyler, tüketicilerin satın alma kararlarının %95'inin mantıkla değil, tamamen bilinçaltı (duygusal) süreçlerle saniyeler içinde verildiğini kanıtlamıştır. Bu durum, markalara muazzam bir güç verirken, tüketicilerin özgür iradelerinin gizlice manipüle edildiği yönünde derin etik tartışmalara yol açmaktadır.",
        "questions": [
          {
            "id": "s04-p5-q1",
            "type": "ana_fikir",
            "question": "Bu metnin temel konusu aşağıdakilerden hangisidir?",
            "options": [
              "Süpermarketlerin mimari yapıları ve iç tasarımı.",
              "Anket şirketlerinin ekonomik sorunları.",
              "Tüketicilerin satın alma kararlarının bilinçaltı düzeyde nörolojik yöntemlerle nasıl ölçüldüğü ve yönlendirildiği.",
              "Sadece kaliteli ve ucuz ürünlerin daha fazla satıldığı gerçeği."
            ],
            "correctOption": 2,
            "explanation": "Matn neyromarketing va uning inson ong ostiga ta'siri haqidadir."
          },
          {
            "id": "s04-p5-q2",
            "type": "multiple_choice",
            "question": "Metne göre anket yönteminin yetersiz kalmasının temel nedeni nedir?",
            "options": [
              "Anketlerin çok pahalı olması.",
              "İnsanların satın alma kararlarının arkasındaki gerçek bilinçaltı sebepleri bilmemesi veya söyleyememesi.",
              "Anketörlerin yeterince eğitilmemiş olması.",
              "İnsanların anket sorularını okumaya üşenmesi."
            ],
            "correctOption": 1,
            "explanation": "Odamlar ko'pincha hissiy qarorlarining sababini bilmasligi yoki yashirishi aytilgan."
          },
          {
            "id": "s04-p5-q3",
            "type": "multiple_choice",
            "question": "Nöropazarlama araştırmalarında aşağıdakilerden hangisi ölçülmez?",
            "options": [
              "Göz hareketlerinin odaklandığı noktalar",
              "Beyin dalgaları",
              "Kalp atış hızı",
              "Kişinin eğitim ve gelir düzeyi"
            ],
            "correctOption": 3,
            "explanation": "Ta'lim va daromad neyromarketing o'lchovlariga kirmaydi, ular miya, ko'z va yurak urishini o'lchaydilar."
          },
          {
            "id": "s04-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'manipüle edilmek' kelimesinin anlamı nedir?",
            "options": [
              "Birini kendi çıkarları doğrultusunda, ona hissettirmeden yönlendirmek ve etkilemek.",
              "Birine çok kaba davranmak, hakaret etmek.",
              "Fiziksel olarak bir şeyi tamir etmek.",
              "Bir konuda çok fazla bilgi vermek."
            ],
            "correctOption": 0,
            "explanation": "Manipulyatsiya qilish insonni o'z manfaatlariga yashirincha boshqarishni bildiradi."
          },
          {
            "id": "s04-p5-q5",
            "type": "multiple_choice",
            "question": "Metne göre satın alma eylemi hakkında ulaşılan en çarpıcı gerçek nedir?",
            "options": [
              "İnsanların her zaman en mantıklı kararı verdiği.",
              "Satın alma kararlarının %95'inin mantıkla değil, duygusal bilinçaltı süreçlerle verildiği.",
              "Ambalaj renklerinin hiçbir öneminin olmadığı.",
              "Erkeklerin kadınlardan daha fazla para harcadığı."
            ],
            "correctOption": 1,
            "explanation": "Satın alma kararlarının %95'inin mantıkla değil, tamamen bilinçaltı (duygusal) süreçlerle berilishi eng muhim kashfiyotdir."
          },
          {
            "id": "s04-p5-q6",
            "type": "cikarim",
            "question": "Nöropazarlama uygulamalarının yarattığı etik (ahlaki) tartışmanın temel sebebi nedir?",
            "options": [
              "Ürün fiyatlarının bu araştırmalar yüzünden artması.",
              "Tüketicilerin farkında olmadan satın almaya zorlanması ve özgür iradelerinin ihlal edilmesi.",
              "Reklamların televizyonlarda çok uzun sürmesi.",
              "Sadece çok zengin şirketlerin bu teknolojiyi kullanabilmesi."
            ],
            "correctOption": 1,
            "explanation": "Matn so'ngida 'özgür iradelerinin gizlice manipüle edildiği yönünde derin etik tartışmalara' sabab bo'layotgani aytilgan."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-5",
    "sectionNumber": 5,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_5.json",
    "passages": [
      {
        "id": "s05-p1",
        "title": "FitLife Spor Salonu Üyelik Sözleşmesi",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "FitLife Spor Salonu'na hoş geldiniz! Sağlıklı ve düzenli bir ortam için lütfen aşağıdaki kurallara dikkat ediniz:\n1. Salonumuz hafta içi 06:00 - 23:00, hafta sonu ise 08:00 - 21:00 saatleri arasında hizmet vermektedir.\n2. Hijyen kuralları gereği, spor yaparken yanınızda mutlaka temiz bir havlu bulundurmanız ve aletlerin üzerine sermeniz zorunludur.\n3. Yoğun saatlerde (18:00-20:00 arası) kardiyo cihazlarında (koşu bandı vb.) kalma süresi maksimum 30 dakikadır.\n4. Ağırlık çalışmalarınız bittikten sonra kullandığınız dambıl ve plakaları yerlerine bırakmalısınız.\n5. Üyeliğini iptal etmek isteyen kişiler, bu durumu bir ay önceden yönetime yazılı olarak (dilekçe ile) bildirmelidir. Aksi takdirde sonraki ayın ücreti kesilecektir.\nBol sporlu günler dileriz!",
        "questions": [
          {
            "id": "s05-p1-q1",
            "type": "multiple_choice",
            "question": "FitLife Spor Salonu Pazar günü saat kaçta açılmaktadır?",
            "options": [
              "06:00",
              "08:00",
              "10:00",
              "Kapalıdır"
            ],
            "correctOption": 1,
            "explanation": "Hafta sonu (shanba, yakshanba) saat 08:00 da ochiladi."
          },
          {
            "id": "s05-p1-q2",
            "type": "multiple_choice",
            "question": "Üyelerin spor yaparken havlu kullanmasının temel sebebi nedir?",
            "options": [
              "Terleyince üşümemek için",
              "Hijyen sağlamak ve aletleri temiz tutmak için",
              "Havlu satışı yapmak için",
              "Kıyafetlerin yırtılmasını önlemek için"
            ],
            "correctOption": 1,
            "explanation": "Hijyen kuralları gereği havlu qo'yish majburiydir."
          },
          {
            "id": "s05-p1-q3",
            "type": "multiple_choice",
            "question": "Akşam saat 18:30'da koşu bandına çıkan bir üye en geç saat kaçta cihazdan inmelidir?",
            "options": [
              "18:45",
              "19:00",
              "19:30",
              "İstediği kadar kalabilir"
            ],
            "correctOption": 1,
            "explanation": "Yoğun saatlerde (18:00-20:00 arası) maksimum 30 daqiqa yugurish mumkin. 18:30+30=19:00."
          },
          {
            "id": "s05-p1-q4",
            "type": "multiple_choice",
            "question": "Bir üye ağırlık çalışmasını bitirdiğinde ne yapmalıdır?",
            "options": [
              "Aletleri olduğu yerde bırakıp gitmelidir.",
              "Hemen duş almalıdır.",
              "Kullandığı ağırlıkları (dambılları) yerine geri bırakmalıdır.",
              "Görevliyi çağırıp temizletmelidir."
            ],
            "correctOption": 2,
            "explanation": "Kullandığınız dambıl ve plakaları yerlerine bırakmalısınız deyilgan."
          },
          {
            "id": "s05-p1-q5",
            "type": "multiple_choice",
            "question": "Üyeliğini bitirmek isteyen bir kişi ne yapmalıdır?",
            "options": [
              "Artık salona gelmemesi yeterlidir.",
              "Durumu bir ay önceden dilekçe ile bildirmelidir.",
              "Salondaki antrenöre söylemelidir.",
              "Kayıt ücretini geri istemelidir."
            ],
            "correctOption": 1,
            "explanation": "Bir ay önceden yönetime yazılı olarak (dilekçe ile) bildirmelidir."
          },
          {
            "id": "s05-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin hedef kitlesi kimdir?",
            "options": [
              "Spor salonu antrenörleri",
              "Spor ekipmanı satan mağazalar",
              "Spor salonuna üye olan kişiler",
              "Profesyonel futbolcular"
            ],
            "correctOption": 2,
            "explanation": "Sözleşme bevosita zalga qatnaydigan a'zolar (üyeler) uchun yozilgan."
          }
        ]
      },
      {
        "id": "s05-p2",
        "title": "Farklı Ülkelerdeki İlginç Gelenekler",
        "category": "Kültür / Eşleştirme",
        "level": "B1",
        "content": "A) Ali (Japonya): Burada saygı her şey demek. İnsanlarla tanışırken asla el sıkışmıyorlar, bunun yerine birbirlerine doğru eğiliyorlar (selam veriyorlar). Ayrıca birinin evine veya restorana girerken ayakkabı çıkarmak kesin ve çok katı bir kural.\n\nB) Buse (Hindistan): Hindistan inanılmaz renkli bir yer. Özellikle 'Holi Festivali'nde binlerce insan sokaklara çıkıp birbirlerine renkli tozlar atıyor, baharın gelişini devasa bir partiyle kutluyorlar. Yemekleri ise aşırı baharatlı.\n\nC) Cem (İtalya): İtalyanlar yemek konusunda çok kuralcı! Yemek kurallarına uymak zorundasınız. Mesela sabah saat 11'den sonra kesinlikle Cappuccino içmiyorlar, sütlü kahveyi sadece sabah saatlerinde tüketiyorlar. Makarnaya ketçap sıkmak ise onlar için büyük bir suç!\n\nD) Derya (İspanya): Burada hayat çok yavaş ve keyifli. Öğleden sonraları 'Siesta' adı verilen uyku molası var. Saat 14:00 ile 17:00 arasında dükkanlar, ofisler kapanıyor ve herkes evine gidip dinleniyor. Akşam yemeği ise gece çok geç saatlerde yeniyor.",
        "questions": [
          {
            "id": "s05-p2-q1",
            "type": "matching_paragraph",
            "question": "Hangi ülkede gün ortasında çalışma hayatı durur ve uyku molası verilir?",
            "options": [
              "A) Japonya",
              "B) Hindistan",
              "C) İtalya",
              "D) İspanya"
            ],
            "correctOption": 3,
            "explanation": "İspanya'da öğleden sonraları 'Siesta' uykusu olduğu söylenmiştir."
          },
          {
            "id": "s05-p2-q2",
            "type": "matching_paragraph",
            "question": "Yemek kültürü ve sofra kuralları konusunda en sert olan ülke hangisidir?",
            "options": [
              "A) Japonya",
              "B) Hindistan",
              "C) İtalya",
              "D) İspanya"
            ],
            "correctOption": 2,
            "explanation": "İtalya'da Cappuccino ve ketçapla ilgili çok kuralcı olunduğu belirtilmiştir."
          },
          {
            "id": "s05-p2-q3",
            "type": "matching_paragraph",
            "question": "Baharın gelişini sokaklarda boyalarla kutlayan ülke hangisidir?",
            "options": [
              "A) Japonya",
              "B) Hindistan",
              "C) İtalya",
              "D) İspanya"
            ],
            "correctOption": 1,
            "explanation": "Hindistan'daki Holi Festivali anlatılmıştır."
          },
          {
            "id": "s05-p2-q4",
            "type": "matching_paragraph",
            "question": "Selamlaşmada fiziksel temastan (el sıkışmaktan) kaçınılan ülke hangisidir?",
            "options": [
              "A) Japonya",
              "B) Hindistan",
              "C) İtalya",
              "D) İspanya"
            ],
            "correctOption": 0,
            "explanation": "Japonya'da el sıkışmayıp eğildikleri anlatılmıştır."
          },
          {
            "id": "s05-p2-q5",
            "type": "matching_paragraph",
            "question": "Hangi ülkede akşam yemeği gece çok geç saatlere bırakılır?",
            "options": [
              "A) Japonya",
              "B) Hindistan",
              "C) İtalya",
              "D) İspanya"
            ],
            "correctOption": 3,
            "explanation": "İspanya bölümünde 'Akşam yemeği ise gece çok geç saatlerde yeniyor' denmiştir."
          },
          {
            "id": "s05-p2-q6",
            "type": "matching_paragraph",
            "question": "Kapalı mekanlara (ev vb.) girerken ayakkabı çıkarmanın zorunlu olduğu ülke hangisidir?",
            "options": [
              "A) Japonya",
              "B) Hindistan",
              "C) İtalya",
              "D) İspanya"
            ],
            "correctOption": 0,
            "explanation": "Japonya'da eve girerken ayakkabı çıkarmak katı bir kuraldır."
          }
        ]
      },
      {
        "id": "s05-p3",
        "title": "Suyun Altındaki Tarih: Batan Gemiler",
        "category": "Tarih ve Bilim",
        "level": "B2",
        "content": "Okyanusların dibi, sadece farklı deniz canlılarına değil, aynı zamanda insanlık tarihinin büyük trajedilerine de ev sahipliği yapar. Bunların en ünlüsü hiç şüphesiz 1912'de bir buzdağına çarparak batan RMS Titanic'tir. Titanic'in enkazı 73 yıl boyunca bulunamadı. Nihayet 1985 yılında, deniz bilimci Robert Ballard ve ekibi, geliştirdikleri uzaktan kumandalı robot kameralar sayesinde enkazı Atlas Okyanusu'nun 3.800 metre derinliğinde keşfettiler. Oksijensiz ve dondurucu soğuk ortam, geminin içindeki bazı eşyaların (deri ayakkabılar, porselen tabaklar) çürümeden günümüze kadar ulaşmasını sağlamıştır. Ancak Titanic'in gövdesi, demir yiyen bakteriler yüzünden hızla erimektedir ve uzmanlara göre önümüzdeki 30 yıl içinde gemiden geriye sadece kocaman bir toz bulutu kalacaktır. Günümüzde gemiden çıkarılan yüzlerce eşya, dünyanın çeşitli müzelerinde sergilenmektedir.",
        "questions": [
          {
            "id": "s05-p3-q1",
            "type": "true_false_not_given",
            "question": "Titanic, battığı yıl olan 1912'de hemen bulunmuş ve içindeki eşyalar çıkarılmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'Enkazı 73 yıl boyunca bulunamadı' deyilgan."
          },
          {
            "id": "s05-p3-q2",
            "type": "true_false_not_given",
            "question": "Enkaz, dalgıçların bizzat su altına inerek yaptıkları araştırmalar sonucunda bulunmuştur.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'uzaktan kumandalı robot kameralar sayesinde' keşfedildiği belirtilmiştir."
          },
          {
            "id": "s05-p3-q3",
            "type": "true_false_not_given",
            "question": "Gemideki porselen tabaklar ve bazı deri eşyalar deniz altında bozulmadan kalabilmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'bazı eşyaların (deri ayakkabılar, porselen tabaklar) çürümeden günümüze kadar ulaşmasını sağlamıştır' yozilgan."
          },
          {
            "id": "s05-p3-q4",
            "type": "true_false_not_given",
            "question": "Okyanus dibindeki dondurucu soğuk, geminin demir gövdesinin erimesini tamamen durdurmuştur.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'Titanic'in gövdesi, demir yiyen bakteriler yüzünden hızla erimektedir' deyilgan."
          },
          {
            "id": "s05-p3-q5",
            "type": "true_false_not_given",
            "question": "Robert Ballard, Titanic'i bulduktan sonra İngiliz hükümeti tarafından ödüllendirilmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Ballardning mukofot olgani haqida gap yo'q."
          },
          {
            "id": "s05-p3-q6",
            "type": "true_false_not_given",
            "question": "Titanic'ten çıkarılan bazı parçalar bugün müzelerde ziyaretçilere gösterilmektedir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'çeşitli müzelerinde sergilenmektedir' deyilgan."
          }
        ]
      },
      {
        "id": "s05-p4",
        "title": "Tabağımızdaki Gelecek: Laboratuvar Üretimi Et",
        "category": "Bilim ve Gelecek",
        "level": "C1",
        "content": "Artan dünya nüfusu ve iklim krizi, bilim insanlarını geleneksel hayvancılığa alternatifler aramaya zorlamaktadır. Çünkü geleneksel hayvancılık; ormanların yok edilmesine, aşırı su tüketimine ve yüksek oranda metan gazı salınımına neden olarak küresel ısınmayı tetiklemektedir. [ 1 ]. Bu teknoloji, bir hayvandan zarar vermeden alınan küçük bir kök hücrenin, laboratuvar ortamında beslenerek kas dokusuna (gerçek ete) dönüştürülmesi işlemidir. Üstelik bu et, tat ve görünüm olarak geleneksel etten farksızdır. [ 2 ]. Buna karşın, birçok tüketici laboratuvarda üretilmiş bir yiyeceği tüketmeye karşı psikolojik bir bariyer taşımaktadır. Uzmanlar, yapay etin seri üretime geçip market raflarında ucuz bir şekilde yer alması için yasal düzenlemelerin ve maliyet düşürücü çalışmaların en az on yıl daha süreceğini tahmin etmektedir.",
        "questions": [
          {
            "id": "s05-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Birçok insan vejetaryen olmayı tercih etmektedir.",
              "Bu krizin en yenilikçi çözümlerinden biri ise 'kültür eti' veya laboratuvarda üretilen ettir.",
              "Çiftlik hayvanlarının sayısı dünyada giderek azalmaktadır.",
              "Suni gübre kullanımı tarımı da olumsuz etkilemektedir."
            ],
            "correctOption": 1,
            "explanation": "Oldingi gaplarda an'anaviy chorvachilikning zararlari sanaldi, undan keyin 'bu muammoning yechimi' sifatida 'kök hücre (hujayra)' bilan bog'liq jarayonni tushuntirishdan oldin laboratuvar go'shti (kültür eti) taklif qilinishi mantiqiy."
          },
          {
            "id": "s05-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Laboratuvar eti üretim süreci, geleneksel et üretimine kıyasla %90 daha az toprak ve su gerektirir.",
              "Bu etin içinde çok zararlı kimyasallar bulunmaktadır.",
              "Restoranlar sadece balık satmaya karar vermiştir.",
              "Hücre kültürü işlemi sadece bitkiler üzerinde yapılabilir."
            ],
            "correctOption": 0,
            "explanation": "Matn davomida bu texnologiyaning qanchalik foydali va ekologik ekanligi tasvirlanmoqda, ' %90 daha az toprak ve su' gapi jarayonning ustunligini ko'rsatadi."
          },
          {
            "id": "s05-p4-q3",
            "type": "multiple_choice",
            "question": "Metne göre geleneksel hayvancılığın çevreye verdiği zararlardan biri değildir?",
            "options": [
              "Ormanların yok edilmesi",
              "Aşırı su kullanılması",
              "Metan gazı üreterek küresel ısınmayı artırması",
              "Plastik atıkların çoğalması"
            ],
            "correctOption": 3,
            "explanation": "Plastik chiqindilar haqida matnda hech qanday ma'lumot berilmagan."
          },
          {
            "id": "s05-p4-q4",
            "type": "multiple_choice",
            "question": "Laboratuvarda et üretimi (yapay et) süreci nasıl başlamaktadır?",
            "options": [
              "Hayvanları tamamen kimyasal havuzlarda bekleterek",
              "Canlı bir hayvandan (hayvana zarar vermeden) alınan küçük bir kök hücre ile",
              "Soya fasulyesi ve mantarları birbirine karıştırarak",
              "Plastik maddeleri şekillendirip et görünümü vererek"
            ],
            "correctOption": 1,
            "explanation": "Kök hücrenin laboratuvar ortamında beslenerek... deyilgan."
          },
          {
            "id": "s05-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'psikolojik bir bariyer taşımaktadır' ifadesiyle tüketiciler hakkında ne anlatılmak istenmektedir?",
            "options": [
              "Yapay etin çok pahalı olduğunu düşündükleri.",
              "Doğal yollarla üretilmeyen (laboratuvardan çıkan) bir eti yemeye karşı içsel bir önyargı, iğrenme veya korku duydukları.",
              "Yapay eti satın almak için dükkanlara hücum ettikleri.",
              "Yapay etin tadının çok kötü olduğuna inandıkları."
            ],
            "correctOption": 1,
            "explanation": "Psixologik to'siq (bariyer) - ongda qabul qila olmaslik, shubha, qo'rquv kabilarni bildiradi."
          },
          {
            "id": "s05-p4-q6",
            "type": "cikarim",
            "question": "Yapay etin günümüzde (şu an) herkesin alabileceği bir şekilde satılamamasının sebebi nedir?",
            "options": [
              "Etin tadının gerçek etten çok farklı olması.",
              "Üretim maliyetlerinin hala çok yüksek olması ve yasal izinlerin henüz tamamlanmaması.",
              "Hiçbir hayvanın hücresini vermek istememesi.",
              "Etlerin laboratuvarda çok çabuk bozulması."
            ],
            "correctOption": 1,
            "explanation": "Matn so'ngida 'yasal düzenlemelerin ve maliyet düşürücü çalışmaların en az on yıl daha süreceğini tahmin etmektedir' deyilgan."
          }
        ]
      },
      {
        "id": "s05-p5",
        "title": "Dilin Düşünce Üzerindeki Etkisi",
        "category": "Psikoloji ve Dilbilim",
        "level": "C1",
        "content": "Kullandığımız kelimeler, sadece iletişim kurmamızı sağlamakla kalmaz; aynı zamanda dünyayı nasıl algıladığımızı ve düşündüğümüzü de şekillendirir. Dilbilimde 'Sapir-Whorf Hipotezi' (Dilsel Görecelilik) olarak bilinen bu teoriye göre, anadilimiz beynimizin çalışma şeklini doğrudan etkiler. Örneğin, Avustralya'daki Kuuk Thaayorre kabilesinin dilinde 'sağ' ve 'sol' kelimeleri yoktur. Onlar her şeyi 'kuzey, güney, doğu, batı' (yön bildiren coğrafi terimler) ile ifade ederler. Bu yüzden bir Thaayorre yerlisi karanlıkta bile her zaman yönünü kusursuz bir şekilde bulabilir. Benzer şekilde, Rusçada açık mavi (goluboy) ve koyu mavi (siniy) tamamen farklı iki ayrı renk olarak kabul edilirken, İngilizcede ikisi de 'blue' (mavi) olarak algılanır. Nörolojik testler, Rusça konuşanların mavinin tonları arasındaki farkları diğer insanlara göre saliseler içinde çok daha hızlı ayırt edebildiğini göstermiştir. Kısacası dil, sadece düşüncelerimizi dışa vuran bir araç değil, düşüncelerimizin sınırlarını çizen bir mimardır.",
        "questions": [
          {
            "id": "s05-p5-q1",
            "type": "ana_fikir",
            "question": "Metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Yabancı dil öğrenmek beynin yaşlanmasını durdurur.",
              "Rusça ve Avustralya yerli dilleri öğrenmesi en zor dillerdir.",
              "Konuştuğumuz dil, çevremizi nasıl algıladığımızı ve düşünce yapımızı doğrudan belirler.",
              "Sağ ve sol kavramını bilmeyen toplumlar geri kalmıştır."
            ],
            "correctOption": 2,
            "explanation": "Sapir-Whorf gipotezasiga asosan til tafakkurimizni va olamni qanday qabul qilishimizni belgilab berishi asosiy g'oyadir."
          },
          {
            "id": "s05-p5-q2",
            "type": "multiple_choice",
            "question": "Kuuk Thaayorre kabilesinin çok iyi bir yön bulma duygusuna sahip olmasının nedeni nedir?",
            "options": [
              "Gözlerinin karanlıkta çok iyi görmesi.",
              "Dillerinde sağ ve sol kelimeleri olmadığı için sürekli kuzey, güney gibi coğrafi yönleri düşünmek zorunda olmaları.",
              "Her zaman yanlarında pusula taşımaları.",
              "Sürekli açık havada ve ormanda yaşamaları."
            ],
            "correctOption": 1,
            "explanation": "Tillari ularni doimo geografik yo'nalishlarni o'ylashga majbur qilgani uchun shunday."
          },
          {
            "id": "s05-p5-q3",
            "type": "multiple_choice",
            "question": "Rusça konuşan kişilerin renkleri ayırt etme deneyindeki avantajı nereden gelmektedir?",
            "options": [
              "Rusların genetik olarak daha iyi gözlere sahip olmasından.",
              "Rusçada açık mavi ve koyu mavi için ayrı ayrı iki kelime bulunmasından (dilin kategorize etmesinden).",
              "Rusya'da mavi rengin çok sevilmesinden.",
              "İngilizcenin yetersiz bir dil olmasından."
            ],
            "correctOption": 1,
            "explanation": "Goluboy va siniy degan ikkita alohida so'z borligi uchun ular tez farqlaydi."
          },
          {
            "id": "s05-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'algılamak' kelimesi hangi anlamı taşımaktadır?",
            "options": [
              "Bir şeyi görmezden gelmek.",
              "Duyular aracılığıyla bir nesneyi, olayı veya dünyayı zihinde kavramak ve anlamlandırmak.",
              "Sürekli yalan söylemek.",
              "Bir konuyu başkasına zorla öğretmek."
            ],
            "correctOption": 1,
            "explanation": "Algılamak - idrok qilish, qabul qilish ma'nolarini anglatadi."
          },
          {
            "id": "s05-p5-q5",
            "type": "multiple_choice",
            "question": "Yazar, dili en sonunda neye benzetmiştir?",
            "options": [
              "Kötü bir müzik aletine",
              "Düşüncelerimizin sınırlarını çizen bir mimara",
              "Eski ve kullanışsız bir haritaya",
              "Sadece yazarların kullandığı bir silaha"
            ],
            "correctOption": 1,
            "explanation": "Matn so'ngida 'düşüncelerimizin sınırlarını çizen bir mimardır' deyilgan."
          },
          {
            "id": "s05-p5-q6",
            "type": "cikarim",
            "question": "Bu metinden (Sapir-Whorf hipotezinden) çıkarılabilecek sonuç aşağıdakilerden hangisidir?",
            "options": [
              "Farklı dilleri konuşan insanlar, aynı olaylara baksalar bile onları zihinsel olarak farklı şekillerde yorumlayabilirler.",
              "Dünyadaki tüm diller zamanla birleşip tek bir dil haline gelecektir.",
              "Çok dil bilen insanlar diğerlerine göre her zaman daha dürüsttür.",
              "Dillerin yapısı ile insan zekası arasında hiçbir bağ yoktur."
            ],
            "correctOption": 0,
            "explanation": "Tili boshqacha bo'lganlar (masalan ruslar va inglizlar) ayni narsani turlicha anglaydi va his qiladi."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-6",
    "sectionNumber": 6,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_6.json",
    "passages": [
      {
        "id": "s06-p1",
        "title": "Milli Park Kamp Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli doğaseverler, Milli Parkımızda güvenli ve doğaya saygılı bir kamp deneyimi için aşağıdaki kurallara uymanız gerekmektedir:\n1. Kamp alanlarında sadece belirlenen 'Ateş Yakma Noktaları'nda ateş yakılabilir. Orman içinde veya çadırların yanında ateş yakmak kesinlikle yasaktır.\n2. Gece saat 23:00'ten sonra yüksek sesle konuşmak, müzik aleti çalmak ve şarkı söylemek diğer kampçıları rahatsız etmemek için yasaktır.\n3. Parkımızda vahşi hayvanlar (ayı, domuz vb.) bulunabileceğinden, çöplerinizi çadırınızın dışında bırakmayınız; kapalı çöp kutularına atınız.\n4. Çadır kurmak için sadece 1, 2 ve 3 numaralı kamp alanları kullanılmalıdır. Gölet kenarına çadır kurmak tehlikeli ve yasaktır.\n5. Orman içinde kaybolmamak için belirlenmiş yürüyüş yollarının (kırmızı çizgilerle işaretlenmiş) dışına çıkmayınız.\nDoğayı koruduğunuz için teşekkür ederiz.",
        "questions": [
          {
            "id": "s06-p1-q1",
            "type": "multiple_choice",
            "question": "Kamp alanında nerede ateş yakılmasına izin verilmektedir?",
            "options": [
              "Çadırların hemen yanında",
              "Göletin kenarında",
              "Ormanın en derin yerinde",
              "Sadece belirlenmiş 'Ateş Yakma Noktaları'nda"
            ],
            "correctOption": 3,
            "explanation": "Matnda 'sadece belirlenen Ateş Yakma Noktaları'nda ateş yakılabilir' deyilgan."
          },
          {
            "id": "s06-p1-q2",
            "type": "multiple_choice",
            "question": "Saat 23:00'ten sonra ne yapmak yasaktır?",
            "options": [
              "Çadırdan dışarı çıkmak",
              "Yüksek sesle konuşmak ve müzik çalmak",
              "Ateşin etrafında oturmak",
              "Yemek yemek"
            ],
            "correctOption": 1,
            "explanation": "23:00 dan keyin shovqin qilish (müzik çalmak, şarkı söylemek) taqiqlanadi."
          },
          {
            "id": "s06-p1-q3",
            "type": "multiple_choice",
            "question": "Vahşi hayvanların gelmesini engellemek için kampçılar ne yapmalıdır?",
            "options": [
              "Çöpleri kapalı çöp kutularına atmalıdır.",
              "Çadırın dışında ateş yakmalıdır.",
              "Hayvanlara yiyecek vermelidir.",
              "Geceleri uyumayıp nöbet tutmalıdır."
            ],
            "correctOption": 0,
            "explanation": "Yovvoyi hayvonlar (ayı, domuz) kelmasligi uchun 'çöplerinizi... kapalı çöp kutularına atınız' deyilgan."
          },
          {
            "id": "s06-p1-q4",
            "type": "multiple_choice",
            "question": "Çadır kurmak için hangi bölge kesinlikle yasaktır?",
            "options": [
              "1 numaralı kamp alanı",
              "Ormanın girişi",
              "Gölet kenarı",
              "3 numaralı kamp alanı"
            ],
            "correctOption": 2,
            "explanation": "Gölet kenarına çadır kurmak tehlikeli ve yasaktır."
          },
          {
            "id": "s06-p1-q5",
            "type": "multiple_choice",
            "question": "Yürüyüş yaparken kaybolmamak için ziyaretçilere ne tavsiye ediliyor?",
            "options": [
              "Yanlarında bir köpek gezdirmeleri",
              "Kırmızı çizgilerle işaretlenmiş yollardan çıkmamaları",
              "Pusula kullanmaları",
              "Ağaçlara işaret koymaları"
            ],
            "correctOption": 1,
            "explanation": "Belirlenmiş yürüyüş yollarının (kırmızı çizgilerle işaretlenmiş) dışına çıkmamalari so'ralgan."
          },
          {
            "id": "s06-p1-q6",
            "type": "multiple_choice",
            "question": "Bu duyurunun en temel amacı nedir?",
            "options": [
              "Kamp alanının ücretini belirtmek",
              "İnsanları vahşi hayvan avına çağırmak",
              "Doğayı korumak ve güvenli kamp yapılmasını sağlamak",
              "Yeni kamp malzemeleri satmak"
            ],
            "correctOption": 2,
            "explanation": "Bu e'lonning maqsadi doğayı korumak va insanların güvenliğini sağlamaktır."
          }
        ]
      },
      {
        "id": "s06-p2",
        "title": "Farklı Ev Arkadaşı Alışkanlıkları",
        "category": "Sosyal Yaşam / Eşleştirme",
        "level": "B1",
        "content": "A) Emre: Ben temizlik konusunda biraz takıntılıyım. Evin her zaman düzenli ve pırıl pırıl olmasını isterim. Bulaşıkların lavaboda bekletilmesinden ve eşyaların dağınık bırakılmasından nefret ederim. Benimle yaşayacak kişi de titiz olmalıdır.\n\nB) Canan: Benim için ev, sosyalleşme alanıdır. Arkadaş grubumu eve davet etmeyi, onlara yemek yapmayı ve film geceleri düzenlemeyi çok severim. Biraz dağınığımdır ama evim her zaman eğlenceli ve hareketlidir.\n\nC) Berk: Ben tam bir spor tutkunuyum. Her sabah saat 6'da kalkar, koşuya çıkar ve sağlıklı kahvaltımı yaparım. Geceleri de çok erken uyurum. Ev arkadaşımın da gece geç saatlere kadar gürültü yapmayan biri olması benim için önemlidir.\n\nD) Selin: Üniversite son sınıftayım ve notlarım benim için her şeyden önemli. Evde genellikle kendi odamda, masa başında saatlerce ders çalışırım. Evde yüksek sesle müzik dinlenmesi veya televizyonun açık olması dikkatimi hemen dağıtır.",
        "questions": [
          {
            "id": "s06-p2-q1",
            "type": "matching_paragraph",
            "question": "Hangi kişinin evinde sessizliğe ve sakin bir çalışma ortamına ihtiyaç vardır?",
            "options": [
              "A) Emre",
              "B) Canan",
              "C) Berk",
              "D) Selin"
            ],
            "correctOption": 3,
            "explanation": "Selin saatlerce ders çalıştığı için sessizliğe ihtiyaç duymaktadır."
          },
          {
            "id": "s06-p2-q2",
            "type": "matching_paragraph",
            "question": "Sağlıklı yaşama ve erken uyanmaya (sabah rutinine) önem veren kişi kimdir?",
            "options": [
              "A) Emre",
              "B) Canan",
              "C) Berk",
              "D) Selin"
            ],
            "correctOption": 2,
            "explanation": "Berk sabah 6'da kalktığını ve spor yaptığını belirtmiştir."
          },
          {
            "id": "s06-p2-q3",
            "type": "matching_paragraph",
            "question": "Hangi kişi misafir ağırlamayı ve evde etkinlik (parti, film) düzenlemeyi sever?",
            "options": [
              "A) Emre",
              "B) Canan",
              "C) Berk",
              "D) Selin"
            ],
            "correctOption": 1,
            "explanation": "Canan arkadaşlarını davet etmeyi ve film geceleri düzenlemeyi sevmektedir."
          },
          {
            "id": "s06-p2-q4",
            "type": "matching_paragraph",
            "question": "Temizlik ve düzen konusunda sıfır toleransı olan (çok hassas) kişi kimdir?",
            "options": [
              "A) Emre",
              "B) Canan",
              "C) Berk",
              "D) Selin"
            ],
            "correctOption": 0,
            "explanation": "Emre temizlik konusunda takıntılı ve titiz olduğunu söylemiştir."
          },
          {
            "id": "s06-p2-q5",
            "type": "matching_paragraph",
            "question": "Evdeki gürültüden ve televizyon sesinden en çok rahatsız olan kişi kimdir?",
            "options": [
              "A) Emre",
              "B) Canan",
              "C) Berk",
              "D) Selin"
            ],
            "correctOption": 3,
            "explanation": "Selin yüksek sesin ve televizyonun dikkatini dağıttığını belirtmiştir."
          },
          {
            "id": "s06-p2-q6",
            "type": "matching_paragraph",
            "question": "Biraz dağınık olduğunu kabul eden ancak sosyal hayatı canlı olan kişi kimdir?",
            "options": [
              "A) Emre",
              "B) Canan",
              "C) Berk",
              "D) Selin"
            ],
            "correctOption": 1,
            "explanation": "Canan 'Biraz dağınığımdır ama evim her zaman eğlenceli...' demiştir."
          }
        ]
      },
      {
        "id": "s06-p3",
        "title": "Türkiye'de Çayın Şaşırtıcı Tarihi",
        "category": "Tarih ve Kültür",
        "level": "B2",
        "content": "Türkiye günümüzde kişi başına en çok çay tüketen ülke olmasına rağmen, çayın Anadolu'daki tarihi sanıldığı kadar eski değildir. Osmanlı İmparatorluğu döneminde halkın asıl içeceği kahveydi ve çay sadece bazı zengin ailelerin evlerinde lüks bir tüketim maddesi olarak bulunurdu. Ancak I. Dünya Savaşı'ndan sonra Osmanlı toprak kaybedince ve Yemen gibi kahve üreten bölgeler elden çıkınca kahve çok pahalı hale geldi. Mustafa Kemal Atatürk'ün de teşvikiyle, Türkiye'de iklimi çay yetiştirmeye en uygun olan Rize bölgesi seçildi. Ziraat mühendisi Zihni Derin'in çalışmaları sonucunda 1930'lu yıllarda Karadeniz'de ilk çay bahçeleri kuruldu. Kısa sürede halk tarafından benimsenen çay, kahvenin yerini alarak Türk kültürünün, sabah kahvaltılarının ve misafirperverliğin en büyük sembolü haline geldi.",
        "questions": [
          {
            "id": "s06-p3-q1",
            "type": "true_false_not_given",
            "question": "Türkiye, çay üretiminde ve tüketiminde binlerce yıllık bir tarihe sahiptir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Çayın tarihi sanıldığı kadar eski değildir; 1930'larda başlamıştır."
          },
          {
            "id": "s06-p3-q2",
            "type": "true_false_not_given",
            "question": "Osmanlı döneminde halkın günlük olarak en çok tükettiği sıcak içecek kahveydi.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'Osmanlı İmparatorluğu döneminde halkın asıl içeceği kahveydi' deyilgan."
          },
          {
            "id": "s06-p3-q3",
            "type": "true_false_not_given",
            "question": "Türk kahvesinin pahalılaşmasının temel sebebi, Brezilya'dan gelen kahve gemilerinin batmasıdır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Sabab: 1-Jahon urushidan so'ng Yemen gibi yerlerin (qahva o'sadigan) elden chiqishi."
          },
          {
            "id": "s06-p3-q4",
            "type": "true_false_not_given",
            "question": "Türkiye'de çay tarımının başlamasında ve gelişmesinde Zihni Derin önemli bir rol oynamıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. Zihni Derin'in çalışmaları sonucunda Rize'de çay bahçeleri kurulmuştur."
          },
          {
            "id": "s06-p3-q5",
            "type": "true_false_not_given",
            "question": "Bugün Türkiye, dünyada en kaliteli siyah çayı üreten ülkedir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Eng ko'p iste'mol qiluvchi davlat ekani aytilgan, lekin eng sifatli degan ma'lumot yo'q."
          },
          {
            "id": "s06-p3-q6",
            "type": "true_false_not_given",
            "question": "Çay tarımı için Türkiye'de sadece Karadeniz bölgesi (Rize ve çevresi) seçilmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'iklimi çay yetiştirmeye en uygun olan Rize bölgesi seçildi' deyilgan."
          }
        ]
      },
      {
        "id": "s06-p4",
        "title": "Kâinatın Yeni Gözü: James Webb Uzay Teleskobu",
        "category": "Bilim ve Teknoloji",
        "level": "C1",
        "content": "Uzay araştırmaları tarihinde yeni bir çığır açan James Webb Uzay Teleskobu (JWST), Hubble Uzay Teleskobu'nun halefi olarak 2021 yılında uzaya fırlatıldı. [ 1 ]. Hubble, uzayı daha çok görünür ışık spektrumunda (insan gözünün görebildiği ışıkta) incelerken, James Webb çok daha gelişmiş kızılötesi (infrared) kameralarla donatılmıştır. Kızılötesi görüş yeteneği, Webb'e evrenin devasa toz ve gaz bulutlarının arkasını bir röntgen cihazı gibi görme imkanı sağlamaktadır. [ 2 ]. Bu sayede bilim insanları, Büyük Patlama'dan (Big Bang) sadece birkaç yüz milyon yıl sonra oluşan ilk galaksilerin ve yıldızların ışığını görebilmektedir. Ayrıca, ötegezegenlerin atmosferlerinde su ve oksijen gibi yaşam belirtileri arama konusunda JWST, insanlığın elindeki en güçlü araçtır.",
        "questions": [
          {
            "id": "s06-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Teleskobun inşası planlanandan daha kısa sürmüş ve çok ucuza mal olmuştur.",
              "Ancak Webb, Hubble'ın sadece bir kopyası değil, ondan çok daha farklı ve güçlü bir çalışma prensibine sahiptir.",
              "James Webb teleskobu güneş sistemimizdeki gezegenleri incelemek için tasarlanmamıştır.",
              "Hubble teleskobu uzay çöpü haline gelmiş ve Dünya'ya düşmüştür."
            ],
            "correctOption": 1,
            "explanation": "Bo'shliqdan so'ng 'Hubble... görünür ışık... James Webb ise kızılötesi...' deb ikkisining ishlash prinsiplari farqi yozilgan. Shuning uchun 'farklı çalışma prensibi' jumlasi to'g'ri tushadi."
          },
          {
            "id": "s06-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Çünkü evren genişledikçe, eski yıldızların ışığı görünür ışıktan çıkıp kızılötesi dalga boyuna kayar (kızıla kayma).",
              "Kızılötesi kameralar Dünya üzerindeki askeri teknolojilerde de sıkça kullanılmaktadır.",
              "Teleskobun en büyük sorunu kızılötesi kameralarının çok çabuk bozulmasıdır.",
              "Bu gaz bulutları genellikle Güneş Sistemi'nin çok yakınında bulunur."
            ],
            "correctOption": 0,
            "explanation": "Keyingi gapda 'Bu sayede... ilk galaksilerin ışığını görebilmektedir' deyilgan. Eski (ilk) yulduzlarning nuri nima uchun qizilötesi ekanligini izohlovchi gap (kızıla kayma) mantiqiy bog'lanadi."
          },
          {
            "id": "s06-p4-q3",
            "type": "multiple_choice",
            "question": "James Webb Uzay Teleskobu'nun Hubble'dan en büyük teknolojik farkı nedir?",
            "options": [
              "Hubble'dan daha küçük ve hafif olması",
              "Sadece Güneş Sistemi'ni inceleyebilmesi",
              "Evreni ağırlıklı olarak kızılötesi (infrared) dalga boyunda incelemesi",
              "İçinde astronotların yaşayabileceği bir alana sahip olması"
            ],
            "correctOption": 2,
            "explanation": "Hubble görünür ışıkta, Webb ise gelişmiş kızılötesi (infrared) kameralarla ishlaydi."
          },
          {
            "id": "s06-p4-q4",
            "type": "multiple_choice",
            "question": "James Webb'in toz ve gaz bulutlarının arkasını görebilme özelliği neye benzetilmiştir?",
            "options": [
              "Bir mikroskoba",
              "Bir röntgen cihazına",
              "Bir büyütece",
              "Bir denizaltıya"
            ],
            "correctOption": 1,
            "explanation": "Matnda '...arkasını bir röntgen cihazı gibi görme imkanı sağlamaktadır' deyilgan."
          },
          {
            "id": "s06-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'halef' kelimesinin anlamı aşağıdakilerden hangisidir?",
            "options": [
              "Birinin ardından gelip onun makamını, yerini alan kişi veya nesne (yerine geçen).",
              "Bir projenin tamamen iptal edilmesi.",
              "Aynı anda birlikte çalışan iki şey.",
              "Önceki, geçmişteki (selef)."
            ],
            "correctOption": 0,
            "explanation": "Halef - bir narsaning o'rnini bosuvchi, davomchisi demakdir (Hubble'ın halefi)."
          },
          {
            "id": "s06-p4-q6",
            "type": "cikarim",
            "question": "Metinden çıkarılabilecek en kapsamlı sonuç aşağıdakilerden hangisidir?",
            "options": [
              "James Webb, evrenin kökenini (Big Bang sonrası) anlamamız ve dünya dışı yaşam arayışımız için eşsiz bir teknolojik adımdır.",
              "Uzay teleskopları sadece gezegenimizin fotoğraflarını çekmek için kullanılır.",
              "James Webb teleskobu sayesinde önümüzdeki yıl uzaylılarla iletişim kurulacaktır.",
              "Hubble teleskobu artık hiçbir bilimsel işe yaramamaktadır."
            ],
            "correctOption": 0,
            "explanation": "Big Bang'dan keyingi galaktikalarni ko'rishi va hayot izlari (su, oksijen) qidirishi uni tengsiz qadam ekanligini bildiradi."
          }
        ]
      },
      {
        "id": "s06-p5",
        "title": "Cehaletin Özgüveni: Dunning-Kruger Etkisi",
        "category": "Psikoloji ve Eğitim",
        "level": "C1",
        "content": "Hiç bir konuda çok az bilgisi olmasına rağmen o konunun uzmanıymış gibi cesurca konuşan insanlarla karşılaştınız mı? Psikoloji biliminde bu duruma 'Dunning-Kruger Etkisi' adı verilir. 1999 yılında Cornell Üniversitesi'nden David Dunning ve Justin Kruger, insanların kendi yetersizliklerini değerlendirememesi üzerine bir araştırma yayınladı. Bu araştırmaya göre, bir alanda çok az bilgisi olan veya beceriksiz olan kişiler, sahip oldukları cehaletin farkında olmadıkları için yeteneklerini fazlasıyla abartma eğilimindedirler (hayali bir üstünlük duygusu yaşarlar). Tam tersine, bir konuda gerçekten uzman olan ve o alanın ne kadar derin ve karmaşık olduğunu bilen kişiler ise genellikle yeteneklerinden şüphe eder ve mütevazı davranırlar. Filozof Bertrand Russell'ın yıllar önce söylediği gibi: 'Dünyanın sorunu, akıllılar hep şüphe içindeyken, aptalların küstahça kendilerinden emin olmalarıdır.' Özetle Dunning-Kruger etkisi, öğrenmenin ilk aşamasında yaşanan o tehlikeli 'her şeyi biliyorum' yanılgısıdır.",
        "questions": [
          {
            "id": "s06-p5-q1",
            "type": "ana_fikir",
            "question": "Bu metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Uzman kişiler her zaman çok mutlu insanlardır.",
              "Bilgi eksikliği, insanların kendi becerilerini abartmalarına ve yersiz bir özgüvene sahip olmalarına neden olur.",
              "Dünyadaki en zor bilim dalı psikolojidir.",
              "Çok okuyan insanlar her zaman liderlik özelliklerine sahiptir."
            ],
            "correctOption": 1,
            "explanation": "Matnda asosan bilimsizlikning soxta o'ziga ishonch (özgüven) berishi haqida (Dunning-Kruger) so'z boradi."
          },
          {
            "id": "s06-p5-q2",
            "type": "multiple_choice",
            "question": "Dunning-Kruger etkisine göre, bilgisiz insanların en büyük problemi nedir?",
            "options": [
              "Konuşurken sürekli yalan söylemeleri.",
              "Ne kadar bilgisiz olduklarının farkında (bilincinde) olmamaları.",
              "Okul hayatlarında başarısız olmaları.",
              "Uzmanların sözünü dikkatlice dinlemeleri."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'sahip oldukları cehaletin farkında olmadıkları için yeteneklerini fazlasıyla abartma eğilimindedirler' yozilgan."
          },
          {
            "id": "s06-p5-q3",
            "type": "multiple_choice",
            "question": "Gerçek uzmanların kendi yeteneklerinden şüphe etmelerinin (mütevazı olmalarının) sebebi nedir?",
            "options": [
              "Özgüvenlerinin çocuklukta kırılmış olması.",
              "İlgilendikleri konunun (alanın) ne kadar derin ve karmaşık olduğunu çok iyi bilmeleri.",
              "Başkalarının kendileriyle alay etmesinden korkmaları.",
              "Bildiklerini unutmaya başlamaları."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'o alanın ne kadar derin ve karmaşık olduğunu bilen kişiler ise genellikle yeteneklerinden şüphe eder' deyilgan."
          },
          {
            "id": "s06-p5-q4",
            "type": "kelime",
            "question": "Bertrand Russell'ın alıntısında geçen 'küstahça' kelimesi hangi anlama gelmektedir?",
            "options": [
              "Saygısız, haddini bilmez, kibirli ve kaba bir biçimde.",
              "Çok zekice ve nazik bir şekilde.",
              "Sessiz ve sakin kalarak.",
              "Ağlayarak, üzüntü içinde."
            ],
            "correctOption": 0,
            "explanation": "Küstahça - o'z haddini bilmaydigan, kibr bilan qilingan harakatni bildiradi."
          },
          {
            "id": "s06-p5-q5",
            "type": "cikarim",
            "question": "Dunning-Kruger etkisine kapılan bir kişinin yeni bir işe (veya hobiye) başlarken nasıl davranması beklenir?",
            "options": [
              "Ben bu işi yapamam diye hemen vazgeçmesi.",
              "Konuyu öğrenmek için uzun yıllar çalışması.",
              "İşi çok basit görüp, kısa sürede o işin en iyisi olduğuna inanması.",
              "Uzmanlardan sürekli yardım ve tavsiye istemesi."
            ],
            "correctOption": 2,
            "explanation": "Bu illatga chalingan odam o'zini 'her şeyi biliyorum' (hammasini bilaman) deb aldab, darhol o'zini eng zo'r deb o'ylaydi."
          },
          {
            "id": "s06-p5-q6",
            "type": "multiple_choice",
            "question": "Metne göre 'hayali bir üstünlük duygusu' yaşamak ne demektir?",
            "options": [
              "Kişinin aslında sahip olmadığı becerilere ve zekaya sahip olduğuna inanması.",
              "Gerçekten çok üstün yetenekli olmak.",
              "Geceleri sürekli uçtuğunu rüyasında görmek.",
              "Başkalarının başarılarını kıskanmak."
            ],
            "correctOption": 0,
            "explanation": "Soxta ustunlik hissi (hayali üstünlük) - aslida yo'q qobiliyatni bor deb bilishdir."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-7",
    "sectionNumber": 7,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_7.json",
    "passages": [
      {
        "id": "s07-p1",
        "title": "Otel Havuz ve Spa Kullanım Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Kıymetli misafirlerimiz, otelimizin havuz ve spa alanlarında sağlığınız ve güvenliğiniz için aşağıdaki kurallara dikkat etmenizi rica ederiz:\n1. Havuz ve Spa alanımız her gün 07:00 ile 22:00 saatleri arasında açıktır.\n2. Hijyen kuralları gereği, havuza girmeden önce duş almak ve bone takmak zorunludur.\n3. Güvenlik nedeniyle havuz kenarında koşmak ve havuza balıklama atlamak kesinlikle yasaktır.\n4. 12 yaşından küçük çocukların, yanlarında ebeveynleri (anne-baba) olmadan havuz alanına girmelerine izin verilmez.\n5. Spa, sauna ve Türk hamamı alanlarına cam şişe veya bardakla girilmesi, kırılma tehlikesine karşı yasaktır.\nİyi tatiller dileriz.",
        "questions": [
          {
            "id": "s07-p1-q1",
            "type": "multiple_choice",
            "question": "Havuza girmeden önce yapılması zorunlu olan hijyen kuralları nelerdir?",
            "options": [
              "Sadece bone takmak",
              "Duş almak ve bone takmak",
              "Güneş kremi sürmek",
              "Havlu ile kurulanmak"
            ],
            "correctOption": 1,
            "explanation": "Havuza girmeden önce duş almak ve bone takmak zorunludur."
          },
          {
            "id": "s07-p1-q2",
            "type": "multiple_choice",
            "question": "Otel havuzu akşam saat kaça kadar kullanıma açıktır?",
            "options": [
              "20:00",
              "21:00",
              "22:00",
              "23:00"
            ],
            "correctOption": 2,
            "explanation": "Havuz alanımız 07:00 ile 22:00 saatleri arasında açıktır."
          },
          {
            "id": "s07-p1-q3",
            "type": "multiple_choice",
            "question": "Havuz kenarında hangi davranış yasaklanmıştır?",
            "options": [
              "Şezlongda yatmak",
              "Su içmek",
              "Kitap okumak",
              "Koşmak ve balıklama atlamak"
            ],
            "correctOption": 3,
            "explanation": "Güvenlik nedeniyle koşmak ve balıklama atlamak kesinlikle yasaktır."
          },
          {
            "id": "s07-p1-q4",
            "type": "multiple_choice",
            "question": "10 yaşındaki bir çocuk havuza nasıl girebilir?",
            "options": [
              "Kendi başına girebilir.",
              "Sadece arkadaşlarıyla girebilir.",
              "Yanında anne veya babası (ebeveyni) olması şartıyla girebilir.",
              "Havuza girmesi tamamen yasaktır."
            ],
            "correctOption": 2,
            "explanation": "12 yaşından küçük çocukların, ebeveynleri olmadan girmesi yasaktır."
          },
          {
            "id": "s07-p1-q5",
            "type": "multiple_choice",
            "question": "Spa ve sauna alanına cam şişe ile girilmesinin yasaklanma nedeni nedir?",
            "options": [
              "Camın çok ısınması",
              "Kırılma ve insanlara zarar verme tehlikesi",
              "Camın kötü görünmesi",
              "İçeriye içecek sokmanın yasak olması"
            ],
            "correctOption": 1,
            "explanation": "Cam şişe veya bardakla girilmesi, kırılma tehlikesine karşı yasaktır."
          },
          {
            "id": "s07-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin amacı aşağıdakilerden hangisidir?",
            "options": [
              "Otelin restoran menüsünü tanıtmak",
              "Misafirleri havuz ve spa kuralları hakkında bilgilendirmek",
              "Oda fiyatlarını açıklamak",
              "Çocuklara yüzme öğretmek"
            ],
            "correctOption": 1,
            "explanation": "Mehmonlarni havza va dam olish joyi qoidalari bilan xabardor qilish maqsad qilingan."
          }
        ]
      },
      {
        "id": "s07-p2",
        "title": "Farklı Hobiler ve Boş Zaman Aktiviteleri",
        "category": "Sosyal Yaşam / Eşleştirme",
        "level": "B1",
        "content": "A) Yusuf: Ben boş zamanlarımda doğada vakit geçirmeyi ve gördüğüm güzellikleri ölümsüzleştirmeyi seviyorum. Kuşların, ağaçların ve gün batımının makinemdeki objektiften nasıl göründüğüne odaklanmak bana büyük huzur veriyor.\n\nB) Leyla: İşten arta kalan zamanlarımda mutfakta yeni deneyler yapmak en büyük tutkum. Özellikle farklı ülkelerin yöresel yemek tariflerini bulup, onları kendi damak zevkime göre uyarlayarak misafirlerime sunmaktan çok hoşlanıyorum.\n\nC) Kerem: Müzik benim için bir hobi değil, yaşam tarzı. Haftada en az üç gün gitar çalarak stres atıyorum. Kendi yazdığım sözleri notalara dökmek ve yeni melodiler yaratmak beni inanılmaz dinlendiriyor.\n\nD) Aslı: Balkonum benim küçük dünyam. Orada saksılarda domates, biber ve çeşitli rengarenk çiçekler yetiştiriyorum. Ellimi toprağa sürmek, bitkilerin büyümesini ve çiçek açmasını gün gün izlemek en büyük zevkim.",
        "questions": [
          {
            "id": "s07-p2-q1",
            "type": "matching_paragraph",
            "question": "Hangi kişi müzik aleti çalarak ve şarkı yazarak dinlenmektedir?",
            "options": [
              "A) Yusuf",
              "B) Leyla",
              "C) Kerem",
              "D) Aslı"
            ],
            "correctOption": 2,
            "explanation": "Kerem gitar çaldığını ve yeni melodiler yarattığını söylemiştir."
          },
          {
            "id": "s07-p2-q2",
            "type": "matching_paragraph",
            "question": "Boş zamanlarını bahçıvanlık yaparak (toprak ve bitkilerle uğraşarak) geçiren kişi kimdir?",
            "options": [
              "A) Yusuf",
              "B) Leyla",
              "C) Kerem",
              "D) Aslı"
            ],
            "correctOption": 3,
            "explanation": "Aslı balkonunda saksılarda çiçek ve sebze yetiştirmektedir."
          },
          {
            "id": "s07-p2-q3",
            "type": "matching_paragraph",
            "question": "Doğa fotoğrafçılığı ile ilgilenen ve anı ölümsüzleştiren kişi kimdir?",
            "options": [
              "A) Yusuf",
              "B) Leyla",
              "C) Kerem",
              "D) Aslı"
            ],
            "correctOption": 0,
            "explanation": "Yusuf makinesinin objektifiyle kuşların ve gün batımının fotoğrafını çekmektedir."
          },
          {
            "id": "s07-p2-q4",
            "type": "matching_paragraph",
            "question": "Yemek yapmayı ve mutfak sanatlarını bir tutku olarak gören kişi kimdir?",
            "options": [
              "A) Yusuf",
              "B) Leyla",
              "C) Kerem",
              "D) Aslı"
            ],
            "correctOption": 1,
            "explanation": "Leyla mutfakta yeni tarifler denediğini belirtmiştir."
          },
          {
            "id": "s07-p2-q5",
            "type": "matching_paragraph",
            "question": "Kendi ürettiği ürünleri arkadaşlarına (misafirlerine) sunmaktan keyif alan kişi kimdir?",
            "options": [
              "A) Yusuf",
              "B) Leyla",
              "C) Kerem",
              "D) Aslı"
            ],
            "correctOption": 1,
            "explanation": "Leyla yemek tariflerini hazırlayıp misafirlerine sunmaktan hoşlandığını ifade etmiştir."
          },
          {
            "id": "s07-p2-q6",
            "type": "matching_paragraph",
            "question": "Ellerini kirletmekten çekinmeyen ve doğanın gelişimini izlemeyi seven kişi kimdir?",
            "options": [
              "A) Yusuf",
              "B) Leyla",
              "C) Kerem",
              "D) Aslı"
            ],
            "correctOption": 3,
            "explanation": "Aslı, 'Ellimi toprağa sürmek, bitkilerin büyümesini izlemek...' demiştir."
          }
        ]
      },
      {
        "id": "s07-p3",
        "title": "Tarihi İpek Yolu: Sadece İpek mi Taşındı?",
        "category": "Tarih ve Ticaret",
        "level": "B2",
        "content": "İpek Yolu, milattan yüzyıllar önce Çin'den başlayarak Anadolu'ya ve oradan da Avrupa'ya uzanan, dünyanın en eski ve en önemli ticaret ağıdır. Adını, o dönemde Çin'in en değerli ihraç ürünü olan ipekten almasına rağmen, bu yolda sadece kumaş taşınmamıştır. Baharatlar, porselenler, değerli taşlar ve parfümler kervanlarla aylarca süren yolculuklar yapmıştır. Ancak İpek Yolu'nun insanlık tarihine en büyük katkısı maddi değil, kültürel olmuştur. Matbaa, kağıt yapımı, barut ve pusula gibi devrim niteliğindeki Çin icatları bu yol sayesinde Avrupa'ya ulaşmış; böylece Rönesans ve Coğrafi Keşifler'in temeli atılmıştır. Öte yandan bu yol her zaman fayda sağlamamış, 14. yüzyılda Avrupa nüfusunun üçte birini yok eden Büyük Veba Salgını (Kara Ölüm) da yine İpek Yolu'ndaki ticaret kervanları aracılığıyla Asya'dan Avrupa'ya taşınmıştır.",
        "questions": [
          {
            "id": "s07-p3-q1",
            "type": "true_false_not_given",
            "question": "İpek Yolu, Asya kıtasını Avrupa'ya bağlayan tarihi bir ticaret yoludur.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'Çin'den başlayarak Anadolu'ya ve oradan da Avrupa'ya uzanan' yozilgan."
          },
          {
            "id": "s07-p3-q2",
            "type": "true_false_not_given",
            "question": "Tarihi İpek Yolu'nda kervanlarla sadece ipek kumaşı ticareti yapılmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'sadece kumaş taşınmamıştır. Baharatlar, porselenler...' deb aytilgan."
          },
          {
            "id": "s07-p3-q3",
            "type": "true_false_not_given",
            "question": "Çin icadı olan pusula ve barut, İpek Yolu sayesinde Avrupa medeniyetine aktarılmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'kağıt yapımı, barut ve pusula... bu yol sayesinde Avrupa'ya ulaşmış' deyilgan."
          },
          {
            "id": "s07-p3-q4",
            "type": "true_false_not_given",
            "question": "İpek Yolu'ndaki kervanların güvenliğini sağlamak için Osmanlı Devleti çok sayıda kale inşa etmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Qal'alar (kale) yoki xavfsizlik haqida ma'lumot berilmagan."
          },
          {
            "id": "s07-p3-q5",
            "type": "true_false_not_given",
            "question": "Büyük Veba Salgını (Kara Ölüm), deniz yolu (gemiler) aracılığıyla Avrupa'ya yayılmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'İpek Yolu'ndaki ticaret kervanları aracılığıyla Asya'dan Avrupa'ya taşınmıştır' deyilgan."
          },
          {
            "id": "s07-p3-q6",
            "type": "true_false_not_given",
            "question": "İpek Yolu'nun en büyük katkısı taşınan ticari mallar değil, sağladığı kültürel ve teknolojik alışveriş olmuştur.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'insanlık tarihine en büyük katkısı maddi değil, kültürel olmuştur' deb aytilgan."
          }
        ]
      },
      {
        "id": "s07-p4",
        "title": "Tanrı'nın Makası: CRISPR Gen Düzenleme",
        "category": "Bilim ve Genetik",
        "level": "C1",
        "content": "Bilim dünyasında son 50 yılın en büyük devrimi olarak kabul edilen CRISPR-Cas9 teknolojisi, insanlığa kendi DNA'sını yeniden yazma gücü vermiştir. [ 1 ]. Tıpkı bir bilgisayar programında yanlış yazılan kelimeyi bulup silmek ve yerine doğrusunu yazmak gibi çalışan bu teknoloji, moleküler bir makas görevi görür. Uzmanlar bu teknoloji sayesinde, eskiden 'tedavisi imkansız' denilen kanser türlerini, kalıtsal körlüğü ve kas erimesi (SMA) gibi genetik hastalıkları tamamen ortadan kaldırmayı umut etmektedir. [ 2 ]. İnsan embriyolarının genetiğinin değiştirilerek daha zeki, daha kaslı veya belirli göz renklerine sahip 'tasarım bebekler' üretilmesi ihtimali, insan doğasının sınırlarıyla oynamak olarak değerlendirilmektedir. Bilim ile ahlakın kesiştiği bu tehlikeli çizgi, CRISPR teknolojisi üzerinde uluslararası katı kurallar konmasını zorunlu kılmaktadır.",
        "questions": [
          {
            "id": "s07-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Bu sistem aslında bakterilerin, virüslere karşı geliştirdiği doğal bir savunma mekanizmasından ilham alınarak keşfedilmiştir.",
              "Buna rağmen genetik bilimi henüz DNA'nın tam olarak nasıl çalıştığını çözememiştir.",
              "Astronotların uzayda radyasyondan korunması için genetik yapılarının değiştirilmesi gereklidir.",
              "Günümüzde klonlama teknolojisi tamamen yasaklanmıştır."
            ],
            "correctOption": 0,
            "explanation": "Bo'shliq oldida bu texnologiya (CRISPR-Cas9) nomi aytilgan. Keyin uning qayerdan kelib chiqqani (bakteriyalarning mudofaa mexanizmi) va qanday ishlashi tushuntirilishi eng to'g'ri oqimdir."
          },
          {
            "id": "s07-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Ancak CRISPR sadece insanlarda değil, tarım ürünlerinde de kullanılmaktadır.",
              "Fakat genleri istenilen şekilde kesip yapıştırma gücü, çok büyük ahlaki (etik) tartışmaları da beraberinde getirmiştir.",
              "Kanser hastalıklarının tek nedeni zararlı güneş ışınlarıdır.",
              "Laboratuvar ortamında DNA testi yapmak eskisinden daha ucuzdur."
            ],
            "correctOption": 1,
            "explanation": "Keyingi gapda 'tasarım bebekler' (dizayner chaqaloqlar) va etik muammolar muhokama qilingan, mantiqan unga ahlaki tartışmalar jumlasi ulanadi."
          },
          {
            "id": "s07-p4-q3",
            "type": "multiple_choice",
            "question": "Metne göre CRISPR-Cas9 teknolojisi nasıl bir prensiple çalışmaktadır?",
            "options": [
              "Hücrelere elektrik şoku vererek",
              "Bozuk gen dizilimini tıpkı bir kelime işlemcisi gibi bulup, keserek ve doğrusuyla değiştirerek",
              "Vücuda mikroskobik robotlar yerleştirerek",
              "İnsanlara sağlıklı hayvan organları naklederek"
            ],
            "correctOption": 1,
            "explanation": "Matnda 'bir bilgisayar programında yanlış yazılan kelimeyi bulup silmek ve yerine doğrusunu yazmak gibi... moleküler bir makas' deyilgan."
          },
          {
            "id": "s07-p4-q4",
            "type": "multiple_choice",
            "question": "Bilim insanları bu teknolojiyi temel olarak hangi amaçla kullanmayı hedeflemektedir?",
            "options": [
              "Sadece sporcuların performansını artırmak",
              "Daha büyük ve verimli sebzeler yetiştirmek",
              "Tedavisi olmayan genetik ve kalıtsal hastalıkları kökünden tedavi etmek",
              "Ölümsüzlüğü bulmak"
            ],
            "correctOption": 2,
            "explanation": "'kanser türlerini, kalıtsal körlüğü ve kas erimesi gibi genetik hastalıkları tamamen ortadan kaldırmayı umut etmektedir' deyilgan."
          },
          {
            "id": "s07-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'tasarım bebekler' (designer babies) kavramı ile kastedilen nedir?",
            "options": [
              "Çok güzel ve pahalı kıyafetler giydirilmiş bebekler.",
              "Laboratuvarda, genetiğine müdahale edilerek fiziksel veya zihinsel özellikleri (göz rengi, zeka vb.) ebeveynler tarafından seçilmiş bebekler.",
              "Oyuncak fabrikalarında üretilen çok gerçekçi bebek oyuncakları.",
              "Sadece tüp bebek yöntemiyle dünyaya gelen bebekler."
            ],
            "correctOption": 1,
            "explanation": "Tasarım bebek - genetikasi o'zgartirilib istalgan xususiyatlar (ko'z rangi, zeka) berilgan chaqaloq."
          },
          {
            "id": "s07-p4-q6",
            "type": "cikarim",
            "question": "Yazarın metnin sonunda vurguladığı 'tehlikeli çizgi' aşağıdakilerden hangisidir?",
            "options": [
              "Teknolojinin hastaları tedavi etmek (iyileştirmek) ile insan doğasını tasarlamak (mükemmelleştirmek) arasında yarattığı ahlaki çıkmaz.",
              "DNA ameliyatlarının çok riskli olması ve hastaların masada kalma ihtimali.",
              "Bu teknolojinin virüsleri daha güçlü hale getirmesi.",
              "Zenginler ile fakirler arasındaki gelir farkının artması."
            ],
            "correctOption": 0,
            "explanation": "Foydali davolash bilan inson chegaralarini buzish (tasarım bebek) orasidagi ahlakiy chiziq haqida xulosa qilingan."
          }
        ]
      },
      {
        "id": "s07-p5",
        "title": "Erteleme Hastalığı (Procrastination): Neden Sürekli Yarın Diyoruz?",
        "category": "Psikoloji ve Davranış",
        "level": "C1",
        "content": "Çoğumuz yapmamız gereken önemli bir iş veya ders çalışmak varken, kendimizi aniden evi temizlerken, sosyal medyada gezinirken veya 'Buna yarın başlarım, şu an modumda değilim' derken bulmuşuzdur. Kronik erteleme (procrastination), sanıldığının aksine bir 'zaman yönetimi' veya 'tembellik' problemi değildir. Psikologlara göre bu durum, tamamen bir 'duygu yönetimi' krizidir. İnsan beyni, yapılması gereken zor bir görevi strese, kaygıya veya başarısızlık korkusuna bağladığında, anlık bir rahatlama sağlamak için o işten kaçar. Beyin, uzun vadeli başarı (sınavı geçmek) yerine, kısa vadeli ödülü (eğlenceli bir video izlemek) seçmeye programlanmıştır. Erteleyen kişiler aslında tembel değillerdir; sadece işin yaratacağı olumsuz duygularla başa çıkacak psikolojik mekanizmalara o an sahip değillerdir. Bu döngüden çıkmanın tek yolu, devasa görevleri çok küçük, korkutucu olmayan mikro-adımlara bölmek ve mükemmeliyetçilikten vazgeçmektir.",
        "questions": [
          {
            "id": "s07-p5-q1",
            "type": "ana_fikir",
            "question": "Metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Erteleme alışkanlığı aslında sadece zamanımızı kötü kullandığımızı gösterir.",
              "Erteleme davranışı tembellik değil, beynin stresten ve kaygıdan kaçmak için yaptığı olumsuz bir duygu yönetimi problemidir.",
              "Sosyal medya, erteleme hastalığının dünyadaki tek sebebidir.",
              "Sadece başarısız ve zekası düşük insanlar işlerini erteler."
            ],
            "correctOption": 1,
            "explanation": "Muallif procrastination'ni vaqt yoki dangasalik emas, hissiyot (duygu) boshqaruvi inqirozi deb asoslaydi."
          },
          {
            "id": "s07-p5-q2",
            "type": "multiple_choice",
            "question": "Psikologlara göre beynimizin bir işi ertelemesinin temel nedeni nedir?",
            "options": [
              "O işi yapacak fiziksel güce sahip olmamak.",
              "İşin beyinde stres, kaygı veya başarısızlık korkusu uyandırması ve beynin bundan kaçmak istemesi.",
              "Kişinin o işi daha iyi yapmak için bilerek zaman kazanmaya çalışması.",
              "İşin çok kısa sürede biteceğini düşünmesi."
            ],
            "correctOption": 1,
            "explanation": "Miya qiyin vazifani stresga yoki qo'rquvga bog'laganda qochadi (kaçması)."
          },
          {
            "id": "s07-p5-q3",
            "type": "multiple_choice",
            "question": "Metne göre erteleyen kişinin zihinsel süreçlerinde nasıl bir çatışma vardır?",
            "options": [
              "Geçmiş ile gelecek arasındaki çatışma.",
              "Mantık ile matematik arasındaki çatışma.",
              "Uzun vadeli kalıcı başarı isteği ile kısa vadeli anlık rahatlama (ödül) arzusu arasındaki çatışma.",
              "Çok para kazanmak ile parasız kalmak arasındaki çatışma."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'uzun vadeli başarı yerine, kısa vadeli ödülü seçmeye programlanmıştır' deyilgan."
          },
          {
            "id": "s07-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'kronik' kelimesi ne anlama gelmektedir?",
            "options": [
              "Kısa süreli ve aniden ortaya çıkan.",
              "Uzun süredir devam eden, geçmeyen ve sürekli tekrarlayan.",
              "Sadece psikolojide kullanılan bir tedavi yöntemi.",
              "Çok faydalı ve gerekli olan."
            ],
            "correctOption": 1,
            "explanation": "Kronik (surunkali) - uzoq vaqt davom etadigan va takrorlanadigan holat."
          },
          {
            "id": "s07-p5-q5",
            "type": "multiple_choice",
            "question": "Yazara göre erteleme döngüsünden kurtulmanın yollarından biri nedir?",
            "options": [
              "Büyük işleri tek seferde bitirmeye çalışmak.",
              "İşi yapmak için ilham (motivasyon) gelmesini beklemek.",
              "Büyük görevleri çok küçük (mikro) parçalara bölmek ve mükemmel olmaya çalışmamak.",
              "İşleri başkalarına devretmek."
            ],
            "correctOption": 2,
            "explanation": "Oxirgi gapda yechim sifatida: 'devasa görevleri çok küçük, korkutucu olmayan mikro-adımlara bölmek ve mükemmeliyetçilikten vazgeçmektir' berilgan."
          },
          {
            "id": "s07-p5-q6",
            "type": "cikarim",
            "question": "Bir öğrencinin sınavına çalışmak yerine aniden kalkıp odasını temizlemeye başlaması neyin göstergesidir?",
            "options": [
              "Öğrencinin aslında çok titiz ve temiz bir insan olduğunun.",
              "Oda çok pis olduğu için ders çalışamadığının.",
              "Ders çalışmanın yarattığı stres ve kaygıdan kaçmak için beynin daha az korkutucu bir 'kaçış' yolu (temizlik) bulduğunun.",
              "Sınavın öğrenci için çok kolay olduğunun."
            ],
            "correctOption": 2,
            "explanation": "Bu erteleme (qochish) mexanizmi bo'lib, o'qish stresi o'rniga tozalash kabi qisqa muddatli taskin izlashni anglatadi."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-8",
    "sectionNumber": 8,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_8.json",
    "passages": [
      {
        "id": "s08-p1",
        "title": "Online Alışveriş İade Koşulları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli Müşterimiz, web sitemizden satın aldığınız ürünleri sorunsuz bir şekilde iade edebilmek için aşağıdaki kuralları okumanız önemlidir:\n1. Satın aldığınız ürünleri, kargoyu teslim aldığınız günden itibaren 14 gün içinde hiçbir gerekçe göstermeden iade edebilirsiniz.\n2. İade edilecek ürünlerin kullanılmamış, etiketinin koparılmamış ve orijinal kutusunun zarar görmemiş olması zorunludur.\n3. İç çamaşırı, mayo, küpe gibi kişisel hijyen ürünlerinin paketi açıldıktan sonra iadesi sağlık kuralları gereği kabul edilmez.\n4. İade kargonuzu, anlaşmalı olduğumuz 'Hızlı Kargo' şirketi ile gönderirseniz kargo ücreti ödemezsiniz. Farklı kargo şirketleriyle yapılan gönderimlerin ücreti müşteriye aittir.\n5. İade ettiğiniz ürün depomuza ulaştıktan sonra, ürün bedeli 3-5 iş günü içinde kredi kartınıza iade edilecektir.",
        "questions": [
          {
            "id": "s08-p1-q1",
            "type": "multiple_choice",
            "question": "Bir müşteri satın aldığı ürünü en geç ne zamana kadar iade edebilir?",
            "options": [
              "Sipariş verdikten 10 gün sonra",
              "Kargoyu teslim aldıktan sonraki 14 gün içinde",
              "Bir ay içinde",
              "Etiketi koptuktan 5 gün sonra"
            ],
            "correctOption": 1,
            "explanation": "Kargoyu teslim aldığınız günden itibaren 14 gün içinde iade edebilirsiniz."
          },
          {
            "id": "s08-p1-q2",
            "type": "multiple_choice",
            "question": "İade edilecek ürünler için hangi şart aranmaz?",
            "options": [
              "Ürünün hiç kullanılmamış olması",
              "Orijinal kutusunun sağlam olması",
              "Ürünün renginin beğenilmemesi",
              "Üzerindeki etiketinin koparılmamış olması"
            ],
            "correctOption": 2,
            "explanation": "Hiçbir gerekçe göstermeden (sebep olmadan) iade edebilirsiniz, ancak kullanılmamış, etiketli ve kutulu olması zorunludur."
          },
          {
            "id": "s08-p1-q3",
            "type": "multiple_choice",
            "question": "Hangi ürünlerin iadesi paketi açıldıktan sonra kabul edilmez?",
            "options": [
              "Sadece ayakkabılar",
              "Mont ve kabanlar",
              "İç çamaşırı, mayo ve küpe gibi hijyen ürünleri",
              "Elektronik eşyalar"
            ],
            "correctOption": 2,
            "explanation": "Kişisel hijyen ürünlerinin paketi açıldıktan sonra iadesi sağlık kuralları gereği kabul edilmez."
          },
          {
            "id": "s08-p1-q4",
            "type": "multiple_choice",
            "question": "Müşterinin iade kargo ücreti ödememesi için ne yapması gerekir?",
            "options": [
              "Ürünü mağazaya kendi götürmesi",
              "Herhangi bir kargo şirketiyle göndermesi",
              "Anlaşmalı 'Hızlı Kargo' şirketi ile göndermesi",
              "Önceden şirketi araması"
            ],
            "correctOption": 2,
            "explanation": "Anlaşmalı kargo ile gönderirseniz ücret ödemezsiniz."
          },
          {
            "id": "s08-p1-q5",
            "type": "multiple_choice",
            "question": "İade edilen ürünün parası ne zaman müşteriye geri verilir?",
            "options": [
              "Müşteri kargoya verdiği anda",
              "Ürün depoya ulaştıktan sonraki 3-5 iş günü içinde",
              "14 gün sonra",
              "Hemen aynı gün nakit olarak"
            ],
            "correctOption": 1,
            "explanation": "Ürün depomuza ulaştıktan sonra, ürün bedeli 3-5 iş günü içinde iade edilecektir."
          },
          {
            "id": "s08-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin hedef kitlesi kimlerdir?",
            "options": [
              "Kargo şirketi çalışanları",
              "Mağaza müdürleri",
              "İnternet üzerinden alışveriş yapan müşteriler",
              "Sadece giyim üreticileri"
            ],
            "correctOption": 2,
            "explanation": "Online (web sitesinden) alışveriş yapan müşteriler için yazılmıştır."
          }
        ]
      },
      {
        "id": "s08-p2",
        "title": "Sosyal Medya Alışkanlıkları",
        "category": "Sosyal Yaşam / Eşleştirme",
        "level": "B1",
        "content": "A) Mert: Ben sosyal medyayı sadece haber almak ve gündemi takip etmek için kullanıyorum. Twitter'da (X) güvendiğim gazetecileri ve bilim insanlarını takip ederim. Kendi fotoğrafımı paylaşmayı hiç sevmem, hesabım gizlidir.\n\nB) Ayşe: Sosyal medya benim işim! Instagram'da 50 binden fazla takipçim var. Gittiğim kafeleri, giydiğim kıyafetleri estetik bir şekilde fotoğraflayıp her gün paylaşırım. Markalarla işbirliği yapıyor ve oradan para kazanıyorum.\n\nC) Kemal: Vaktimin çoğunu YouTube'da geçiriyorum. Kendi videolarımı üretmiyorum ama eğitim kanalları, belgeseller ve teknoloji incelemelerini saatlerce izleyebilirim. Diğer uygulamalarda hiç hesabım yok, çünkü zaman kaybı olduklarını düşünüyorum.\n\nD) Eda: Benim için sosyal medya demek sadece arkadaşlarım ve ailemle iletişimde kalmak demek. Eski okul arkadaşlarımla Facebook'taki gruplardan yazışırız, fotoğraf paylaşarak birbirimizin hayatından haberdar oluruz. Tanımadığım kimseyi eklemem.",
        "questions": [
          {
            "id": "s08-p2-q1",
            "type": "matching_paragraph",
            "question": "Sosyal medyayı maddi gelir (para) elde etmek ve meslek olarak kullanan kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Ayşe",
              "C) Kemal",
              "D) Eda"
            ],
            "correctOption": 1,
            "explanation": "Ayşe markalarla işbirliği yaptığını ve para kazandığını belirtmiştir."
          },
          {
            "id": "s08-p2-q2",
            "type": "matching_paragraph",
            "question": "Sadece video içerikleri tüketen ve bilgi edinmek amacıyla uzun süre ekran başında kalan kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Ayşe",
              "C) Kemal",
              "D) Eda"
            ],
            "correctOption": 2,
            "explanation": "Kemal vaktini YouTube'da eğitim ve belgesel izleyerek geçirmektedir."
          },
          {
            "id": "s08-p2-q3",
            "type": "matching_paragraph",
            "question": "Kişisel fotoğraflarını paylaşmayan ve sadece güncel olayları/haberleri okumayı tercih eden kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Ayşe",
              "C) Kemal",
              "D) Eda"
            ],
            "correctOption": 0,
            "explanation": "Mert gündemi takip ettiğini ve fotoğraf paylaşmadığını söylemiştir."
          },
          {
            "id": "s08-p2-q4",
            "type": "matching_paragraph",
            "question": "İnternette sadece tanıdığı kişilerle (akraba ve arkadaşlar) bağlantı kuran kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Ayşe",
              "C) Kemal",
              "D) Eda"
            ],
            "correctOption": 3,
            "explanation": "Eda sadece aile ve arkadaşlarıyla iletişimde olduğunu, yabancıları eklemediğini belirtmiştir."
          },
          {
            "id": "s08-p2-q5",
            "type": "matching_paragraph",
            "question": "Görselliğe (estetik) çok önem veren ve hayatını herkese açık sergileyen kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Ayşe",
              "C) Kemal",
              "D) Eda"
            ],
            "correctOption": 1,
            "explanation": "Ayşe kıyafetleri ve kafeleri estetik fotoğraflayıp binlerce kişiyle paylaşıyor."
          },
          {
            "id": "s08-p2-q6",
            "type": "matching_paragraph",
            "question": "Sosyal medya platformlarının çoğunu gereksiz (zaman kaybı) bulan kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Ayşe",
              "C) Kemal",
              "D) Eda"
            ],
            "correctOption": 2,
            "explanation": "Kemal, YouTube hariç diğer uygulamaları zaman kaybı bulduğunu söylemiştir."
          }
        ]
      },
      {
        "id": "s08-p3",
        "title": "İlmek İlmek Anadolu: Türk Halı ve Kilim Sanatı",
        "category": "Tarih ve Sanat",
        "level": "B2",
        "content": "Türk kültüründe halı ve kilim dokumacılığı, göçebe yaşam tarzının bir sonucu olarak Orta Asya'da doğmuş ve Anadolu'ya taşınmıştır. Eskiden çadırları soğuktan korumak için kalın dokunan bu örtüler, zamanla estetik bir sanat eserine dönüşmüştür. Dünyanın bilinen en eski düğümlü halısı, M.Ö. 3. yüzyıla ait olduğu düşünülen ve Türk kültürünün izlerini taşıyan 'Pazırık Halısı'dır. Bu halı, Rusya'daki Altay Dağları'nda donmuş bir kurganın (mezarın) içinde bulunduğu için günümüze kadar bozulmadan ulaşabilmiştir. Anadolu kilimlerinin en büyük özelliği, üzerindeki motiflerin rastgele olmamasıdır. Genç kızlar hislerini, hayallerini veya üzüntülerini kelimelerle değil; 'koçboynuzu', 'elibelinde' veya 'göz' gibi motifleri dokuyarak ifade etmişlerdir. Günümüzde el dokuması Anadolu halıları, doğal kök boyaları ve sağlamlığı nedeniyle dünya koleksiyonerlerinin en çok aradığı antika eserler arasındadır.",
        "questions": [
          {
            "id": "s08-p3-q1",
            "type": "true_false_not_given",
            "question": "Halı ve kilim dokumacılığı Türk kültürüne sonradan Avrupa'dan geçmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'Orta Asya'da doğmuş ve Anadolu'ya taşınmıştır' deyilgan."
          },
          {
            "id": "s08-p3-q2",
            "type": "true_false_not_given",
            "question": "Tarihte halılar başlangıçta sadece süs eşyası (estetik) amacıyla üretilmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Başlangıçta 'çadırları soğuktan korumak için' dokunduğu, estetiğin sonradan geldiği yazılmıştır."
          },
          {
            "id": "s08-p3-q3",
            "type": "true_false_not_given",
            "question": "Pazırık Halısı, soğuk ve donmuş bir mezarda bulunduğu için çürümeden günümüze kadar gelebilmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'donmuş bir kurganın içinde bulunduğu için günümüze kadar bozulmadan ulaşabilmiştir' deyilgan."
          },
          {
            "id": "s08-p3-q4",
            "type": "true_false_not_given",
            "question": "Anadolu kilimlerindeki desenler, dokuyan kişinin duygularını ve mesajlarını anlatan sembollerdir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. Genç kızlar hislerini 'koçboynuzu' gibi motiflerle ifade etmişlerdir."
          },
          {
            "id": "s08-p3-q5",
            "type": "true_false_not_given",
            "question": "Günümüzde Anadolu'da halı dokuyan kadınların sayısı her geçen yıl azalmaktadır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Ayollar soni kamayayotgani haqida matnda aytilmagan."
          },
          {
            "id": "s08-p3-q6",
            "type": "true_false_not_given",
            "question": "Anadolu halılarının ipleri, kimyasal ve fabrikasyon boyalar kullanılarak renklendirilir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'doğal kök boyaları' (tabiiy o'simlik bo'yoqlari) ishlatilishi aytilgan."
          }
        ]
      },
      {
        "id": "s08-p4",
        "title": "Uyku ve Rüya Görmenin Sırrı",
        "category": "Psikoloji ve Biyoloji",
        "level": "C1",
        "content": "Uyku, beynin kendini kapattığı pasif bir dinlenme süreci değil, aksine inanılmaz derecede aktif olduğu bir onarım dönemidir. [ 1 ]. Bu evre sırasında gözlerimiz kapalı olsa da göz bebeklerimiz hızla hareket eder ve beynimiz neredeyse uyanıkken olduğu kadar enerji harcar. Rüyaların çoğu bu evrede görülür. Nörobilimciler, rüya görmenin zihinsel sağlığımız için kritik bir 'gece terapisi' olduğunu öne sürmektedir. Gün içinde yaşadığımız stresli olaylar, REM uykusu sırasında beyin tarafından işlenir ve duygusal yüklerinden arındırılarak hafızaya kaydedilir. [ 2 ]. Eğer beynimiz rüya görme işlevini yerine getiremezse, kişi ertesi gün yaşadığı strese karşı aşırı tepki verir ve karar verme mekanizmaları çöker. Kısacası, rüyalar sadece anlamsız kısa filmler değil, psikolojik sağlığımızın gizli koruyucularıdır.",
        "questions": [
          {
            "id": "s08-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Bebekler günün yaklaşık 16 saatini uyuyarak geçirirler.",
              "Uyku süreci çeşitli evrelerden oluşur, ancak bunların en gizemlisi ve önemlisi REM (Hızlı Göz Hareketi) uykusudur.",
              "Bazı insanlar uyurgezerlik adı verilen tehlikeli bir hastalığa sahiptir.",
              "Kafein tüketmek beynin uykuya dalmasını engeller."
            ],
            "correctOption": 1,
            "explanation": "Bo'shliqdan so'ng 'Bu evre sırasında gözlerimiz... hızla hareket eder' deyilgan. Shuning uchun REM (Hızlı Göz Hareketi) haqidagi gap eng mantiqiy."
          },
          {
            "id": "s08-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Böylece uyanıldığında o acı veya stres verici olay daha sakin ve mantıklı bir şekilde hatırlanır.",
              "Gündüzleri çok uyumak gece uykusuzluğa (insomnia) yol açabilir.",
              "Bazı rüyalar o kadar korkutucudur ki insan çığlık atarak uyanır.",
              "Gözlük takan insanlar rüyalarını genellikle siyah beyaz görürler."
            ],
            "correctOption": 0,
            "explanation": "Oldingi gapda miya stressli voqealarni hissiy yukdan tozalaydi (arındırılarak) deyilgan. Demak uning natijasi 'uyg'onganda voqeani sokin eslash' bo'ladi."
          },
          {
            "id": "s08-p4-q3",
            "type": "multiple_choice",
            "question": "Yazara göre uyku süreci ile ilgili doğru bilinen yanlış nedir?",
            "options": [
              "Uykunun insanları şişmanlattığı.",
              "Uykunun sadece pasif, beynin tamamen durduğu bir dinlenme süreci olduğunun düşünülmesi.",
              "Karanlıkta uyumanın tehlikeli olması.",
              "Rüyaların geleceği tahmin etmekte kullanılması."
            ],
            "correctOption": 1,
            "explanation": "Birinchi gapda uykunun beynin kapattığı pasif bir süreç olmadığı, aksine çok aktif olduğu aytilgan."
          },
          {
            "id": "s08-p4-q4",
            "type": "multiple_choice",
            "question": "Rüya görmenin (REM uykusunun) insan psikolojisi üzerindeki en temel faydası nedir?",
            "options": [
              "Stresli anıları duygusal yükünden temizleyerek ruhsal dengeyi (terapiyi) sağlaması.",
              "Yeni diller öğrenmeyi kolaylaştırması.",
              "Fiziksel kas ağrılarını iyileştirmesi.",
              "Kişinin daha uzun yaşamasını sağlaması."
            ],
            "correctOption": 0,
            "explanation": "Rüya görmek 'gece terapisi' vazifasini bajarib, hissiy yuklardan tozalashi yozilgan."
          },
          {
            "id": "s08-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'işlenmek' kelimesi (beyin tarafından işlenir) hangi anlamda kullanılmıştır?",
            "options": [
              "Bir kumaşa nakış yapmak.",
              "Bir suçun kasıtlı olarak yapılması.",
              "Bilginin, verinin veya anının beyin tarafından analiz edilip değerlendirilmesi.",
              "Çok fazla çalışıp yorulmak."
            ],
            "correctOption": 2,
            "explanation": "Protsessdan o'tkazish (işlemek) - ma'lumot yoki xotirani analiz qilib joylashni bildiradi."
          },
          {
            "id": "s08-p4-q6",
            "type": "cikarim",
            "question": "Düzenli olarak rüya göremediği (REM uykusuna giremediği) tespit edilen bir insanda ertesi gün nasıl bir davranış gözlemlenmesi beklenir?",
            "options": [
              "Olaylara karşı aşırı tepkili, sinirli olması ve sağlıklı karar verememesi.",
              "Her zamankinden daha enerjik ve neşeli olması.",
              "Matematik problemlerini çok hızlı çözmesi.",
              "Hiç konuşmadan tüm gün oturması."
            ],
            "correctOption": 0,
            "explanation": "Matnda miya bu vazifani bajarmasa 'kişi strese karşı aşırı tepki verir ve karar mekanizmaları çöker' deb aniq xulosa qilingan."
          }
        ]
      },
      {
        "id": "s08-p5",
        "title": "Seyirci Kalma Etkisi (Bystander Effect)",
        "category": "Sosyoloji ve Psikoloji",
        "level": "C1",
        "content": "Sokakta yürürken aniden yere düşen ve yardım isteyen birini görseniz ne yaparsınız? Çoğu insan hemen yardım edeceğini söyler. Ancak psikoloji bilimi bunun her zaman doğru olmadığını gösteriyor. 1964 yılında ABD'de yaşanan trajik bir olaydan sonra araştırılmaya başlanan 'Seyirci Kalma Etkisi', bir acil durumda ortamdaki kişi sayısı arttıkça, bireylerin yardım etme ihtimalinin dramatik şekilde düştüğünü kanıtlamıştır. Eğer olay anında sadece siz varsanız, sorumluluğun tamamen size ait olduğunu hisseder ve müdahale edersiniz. Fakat etrafınızda onlarca insan varsa, beyniniz 'Sorumluluğun Dağılması' (Diffusion of Responsibility) adı verilen bir mekanizmaya girerek 'Nasıl olsa başkası ambulansı arar' veya 'Kimse yardım etmediğine göre durum o kadar da acil değil' diye düşünür. Sosyologlara göre bu durum insanların duyarsız veya kötü olmasından değil, kalabalık içinde sorumluluğu başkasına atma içgüdüsünden kaynaklanmaktadır. Bu etkiyi kırmanın tek yolu, kalabalıktan spesifik bir kişiyi işaret ederek ('Hey mavi ceketli adam, ambulansı ara!') yardım istemektir.",
        "questions": [
          {
            "id": "s08-p5-q1",
            "type": "ana_fikir",
            "question": "Metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Şehir hayatı insanları zamanla daha bencil ve kötü niyetli yapmaktadır.",
              "Acil durumlarda kalabalığın büyüklüğü, bireylerin sorumluluk hissini azaltarak yardım etme olasılığını düşürür.",
              "Ambulansların geç kalması ölümlerin en büyük nedenidir.",
              "İnsanlar sadece tanıdıkları kişilere yardım etmeyi tercih ederler."
            ],
            "correctOption": 1,
            "explanation": "Bystander Effect asosan olomon qancha ko'p bo'lsa, mas'uliyat shuncha kamayishi (javobgarlik tarqalishi) haqidadir."
          },
          {
            "id": "s08-p5-q2",
            "type": "multiple_choice",
            "question": "Seyirci Kalma Etkisi'nin altında yatan asıl psikolojik neden nedir?",
            "options": [
              "İnsanların yardım etmeyi bilmemesi.",
              "Ortamdaki insan sayısı arttıkça 'nasıl olsa birisi yardım eder' düşüncesiyle sorumluluğun dağılması.",
              "İnsanların olaylara karışıp mahkemeye gitmekten korkması.",
              "İnsanların sadece kendilerini düşünmesi."
            ],
            "correctOption": 1,
            "explanation": "Sorumluluğun Dağılması (Diffusion of Responsibility) asıl nedendir."
          },
          {
            "id": "s08-p5-q3",
            "type": "multiple_choice",
            "question": "Yazara göre Seyirci Kalma Etkisi ne zaman en aza iner (yani kişi büyük ihtimalle yardım eder)?",
            "options": [
              "Olay anında ortamda sadece tek bir kişi (yardım edecek kişi) varsa.",
              "Ortamda yüzlerce insan toplanmışsa.",
              "Olay bir hastanenin önünde olmuşsa.",
              "Yardım isteyen kişi çok zengin görünüyorsa."
            ],
            "correctOption": 0,
            "explanation": "Eğer olay anında sadece siz varsanız, sorumluluğun tamamen size ait olduğunu hisseder ve müdahale edersiniz."
          },
          {
            "id": "s08-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'spesifik' kelimesi hangi anlama gelmektedir?",
            "options": [
              "Çok uzaktaki",
              "Herhangi biri",
              "Belirli, sınırları çizilmiş, özel (olan)",
              "Çok güçlü"
            ],
            "correctOption": 2,
            "explanation": "Spesifik - muayyan bir kishiga, aniq maqsadga qaratilgan demakdir."
          },
          {
            "id": "s08-p5-q5",
            "type": "cikarim",
            "question": "Seyirci Kalma Etkisi'ni anlatan bu metinden aşağıdaki çıkarımlardan hangisi yapılabilir?",
            "options": [
              "Sokakta kalp krizi geçiren birinin etrafında 50 kişi olması, sadece 1 kişinin olmasından daha tehlikeli olabilir.",
              "İnsanlar toplu haldeyken her zaman daha cesur ve kahraman olurlar.",
              "Sosyoloji bilimi tamamen insanları eleştirmek üzerine kuruludur.",
              "Kalabalık ortamlarda telefonlar genellikle çekmez."
            ],
            "correctOption": 0,
            "explanation": "Olomon qancha ko'p bo'lsa, yordam kelish ehtimoli shuncha kamayadi. 50 kishi bir kishidan ko'ra xavfliroq."
          },
          {
            "id": "s08-p5-q6",
            "type": "multiple_choice",
            "question": "Yazar, acil durumlarda (kalabalık içinde) yardım alabilmek için hangi yöntemi önermektedir?",
            "options": [
              "Sessizce bekleyip ilk yardımın gelmesini umut etmek.",
              "Herkesin yüzüne bakarak genel olarak bağırmak.",
              "Kalabalık içinden fiziksel özellikleriyle belirgin tek bir kişiyi seçip ona doğrudan görev vermek.",
              "Gözleri kapatıp dua etmek."
            ],
            "correctOption": 2,
            "explanation": "Oxirgi gapda 'spesifik bir kişiyi işaret ederek (Hey mavi ceketli adam, ambulansı ara!)' deb ko'rsatma berilgan."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-9",
    "sectionNumber": 9,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_9.json",
    "passages": [
      {
        "id": "s09-p1",
        "title": "Sinema Salonu İzleyici Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli sinemaseverler, filmden keyif alabilmeniz ve diğer izleyicileri rahatsız etmemeniz için aşağıdaki kurallara dikkat ediniz:\n1. Film boyunca cep telefonlarınızı kapalı veya tamamen sessiz (titreşimsiz) konumda tutunuz. Salon içinde telefon ekranının ışığı diğerlerini rahatsız eder.\n2. Biletinizde yazan koltuk numarasına oturmanız zorunludur. Boş olsa bile başka bir koltuğa geçmeyiniz.\n3. Salona sadece sinema büfesinden alınan yiyecek ve içeceklerle girilebilir. Dışarıdan getirilen yiyecekler içeri alınmaz.\n4. Filmin ses veya görüntü kaydını almak (korsan çekim yapmak) yasal bir suçtur.\n5. Film başladıktan ilk 15 dakika sonrasında gelen seyirciler salona kesinlikle alınmayacaktır.\nİyi seyirler dileriz.",
        "questions": [
          {
            "id": "s09-p1-q1",
            "type": "multiple_choice",
            "question": "Film sırasında telefonla ilgili hangi kurala dikkat edilmelidir?",
            "options": [
              "Telefonla sadece mesaj yazılabilir.",
              "Telefon kapalı veya titreşimsiz sessiz konumda olmalıdır.",
              "Sadece çok acil durumlarda yüksek sesle konuşulabilir.",
              "Telefonun ışığı kısılıp oyun oynanabilir."
            ],
            "correctOption": 1,
            "explanation": "Metinde telefonların kapalı veya tamamen sessiz (titreşimsiz) tutulması gerektiği yazılıdır."
          },
          {
            "id": "s09-p1-q2",
            "type": "multiple_choice",
            "question": "Koltuk seçimi ile ilgili kural nedir?",
            "options": [
              "Erken gelen izleyici istediği yere oturabilir.",
              "Ön sıralar sadece öğrencilere ayrılmıştır.",
              "Herkes mutlaka kendi biletinde yazan numaraya oturmalıdır.",
              "Sadece arka koltuklar boşsa yer değiştirilebilir."
            ],
            "correctOption": 2,
            "explanation": "Biletinizde yazan koltuk numarasına oturmanız zorunludur."
          },
          {
            "id": "s09-p1-q3",
            "type": "multiple_choice",
            "question": "Bir izleyici sinemaya gelirken evinden getirdiği patlamış mısırla içeri girebilir mi?",
            "options": [
              "Evet, eğer kokusuz ise girebilir.",
              "Evet, görevliye gösterirse girebilir.",
              "Hayır, sadece sinema büfesinden alınan yiyeceklerle girilebilir.",
              "Hayır, sinema salonunda yiyecek yemek tamamen yasaktır."
            ],
            "correctOption": 2,
            "explanation": "Dışarıdan getirilen yiyecekler içeri alınmaz."
          },
          {
            "id": "s09-p1-q4",
            "type": "multiple_choice",
            "question": "Filmi cep telefonu kamerasıyla videoya çekmenin sonucu nedir?",
            "options": [
              "Telefon salonda görevliler tarafından kırılır.",
              "Bilet parası iade edilmez.",
              "Bu davranış yasal bir suçtur.",
              "Film bittikten sonra çekim silinmelidir."
            ],
            "correctOption": 2,
            "explanation": "Filmin kaydını almak yasal bir suçtur."
          },
          {
            "id": "s09-p1-q5",
            "type": "multiple_choice",
            "question": "Film başladıktan 20 dakika sonra gelen bir izleyiciye ne söylenir?",
            "options": [
              "Lütfen sessizce boş bir yere oturun.",
              "Sadece en arka sıraya geçebilirsiniz.",
              "Salona girmeniz kesinlikle yasaktır.",
              "İki kişilik bilet almanız gerekmektedir."
            ],
            "correctOption": 2,
            "explanation": "İlk 15 dakika sonrasında gelenler salona kesinlikle alınmaz."
          },
          {
            "id": "s09-p1-q6",
            "type": "multiple_choice",
            "question": "Bu kuralların konulmasındaki ana amaç nedir?",
            "options": [
              "Sinema büfesinden daha fazla para kazanmak.",
              "Sinema salonunu temiz tutmak.",
              "İzleyicilerin filmden rahatsız olmadan keyif almasını sağlamak.",
              "Sinema çalışanlarının işini kolaylaştırmak."
            ],
            "correctOption": 2,
            "explanation": "Filmden keyif alabilmeniz ve diğer izleyicileri rahatsız etmemeniz için kural konulmuştur."
          }
        ]
      },
      {
        "id": "s09-p2",
        "title": "Sağlıklı Yaşam ve Diyet Seçimleri",
        "category": "Sosyal Yaşam / Eşleştirme",
        "level": "B1",
        "content": "A) Tolga: Benim diyetim tamamen protein odaklı. Spora çok zaman ayırıyorum, bu yüzden her gün mutlaka tavuk, yumurta ve et tüketiyorum. Karbonhidratı (ekmek, makarna) hayatımdan tamamen çıkardım.\n\nB) Selin: Ben bir veganım. Hayvanların acı çekerek sofralarımıza gelmesine karşıyım. Sadece bitkisel kaynaklı besleniyorum; et, süt, yumurta ve hatta bal bile yemiyorum. Badem sütü ve mercimek favorilerim.\n\nC) Zeynep: Benim belirli bir yasağım yok ama 'Aralıklı Oruç' (Intermittent Fasting) yapıyorum. Akşam saat 18:00'den ertesi gün öğlen 12:00'ye kadar hiçbir şey yemiyorum, sadece su ve kahve içiyorum. Bu yöntemle çok kilo verdim.\n\nD) Barış: Ben Akdeniz tipi beslenmeyi seviyorum. Bol bol zeytinyağı, taze sebze, balık ve kuruyemiş tüketiyorum. Katı diyetlere veya uzun süre aç kalmaya hiç dayanamam. Benim için önemli olan şey dengedir.",
        "questions": [
          {
            "id": "s09-p2-q1",
            "type": "matching_paragraph",
            "question": "Beslenme alışkanlıklarını tamamen hayvan hakları ve etik kurallara dayandıran kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Selin",
              "C) Zeynep",
              "D) Barış"
            ],
            "correctOption": 1,
            "explanation": "Selin hayvanların acı çekmesine karşı olduğunu ve vegan beslendiğini belirtmiştir."
          },
          {
            "id": "s09-p2-q2",
            "type": "matching_paragraph",
            "question": "Gün boyunca ne yediğini değil, hangi saat aralığında (zamanlama) yediğini önemseyen kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Selin",
              "C) Zeynep",
              "D) Barış"
            ],
            "correctOption": 2,
            "explanation": "Zeynep 18:00 ile 12:00 arası aralıklı oruç yaptığını söylemiştir."
          },
          {
            "id": "s09-p2-q3",
            "type": "matching_paragraph",
            "question": "Yüksek oranda et tüketip, ekmek ve makarna gibi gıdaları hayatından çıkaran kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Selin",
              "C) Zeynep",
              "D) Barış"
            ],
            "correctOption": 0,
            "explanation": "Tolga protein odaklı beslendiğini ve karbonhidratı çıkardığını belirtmiştir."
          },
          {
            "id": "s09-p2-q4",
            "type": "matching_paragraph",
            "question": "Katı kuralları olmayan, zeytinyağı ve taze sebzeye dayalı dengeli bir diyet uygulayan kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Selin",
              "C) Zeynep",
              "D) Barış"
            ],
            "correctOption": 3,
            "explanation": "Barış Akdeniz tipi beslenip, dengeli yediğini söylemiştir."
          },
          {
            "id": "s09-p2-q5",
            "type": "matching_paragraph",
            "question": "Kas kütlesini artırmak için sporla birlikte özel bir beslenme tarzı uygulayan kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Selin",
              "C) Zeynep",
              "D) Barış"
            ],
            "correctOption": 0,
            "explanation": "Tolga spora çok zaman ayırdığı için protein (tavuk, yumurta) tükettiğini söylemiştir."
          },
          {
            "id": "s09-p2-q6",
            "type": "matching_paragraph",
            "question": "Günde 18 saat boyunca bilinçli olarak aç kalarak kilo veren kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Selin",
              "C) Zeynep",
              "D) Barış"
            ],
            "correctOption": 2,
            "explanation": "Zeynep akşam 18'den ertesi gün 12'ye kadar (18 saat) aç kaldığını belirtmiştir."
          }
        ]
      },
      {
        "id": "s09-p3",
        "title": "Gökyüzüne İlk Adım: Uçuşun Tarihi",
        "category": "Tarih ve Bilim",
        "level": "B2",
        "content": "İnsanlık, kuşlar gibi uçma hayalini tarih boyunca hiç kaybetmedi. 17. yüzyılda Osmanlı İmparatorluğu'nda Hezârfen Ahmed Çelebi'nin, kendi yaptığı kartal kanatlarıyla Galata Kulesi'nden Üsküdar'a kadar uçtuğu Evliya Çelebi'nin yazılarında anlatılır. Ancak havacılık tarihinin en büyük ve bilimsel olarak kanıtlanmış dönüm noktası, 1903 yılında ABD'de yaşandı. Orville ve Wilbur Wright (Wright Kardeşler), kendi geliştirdikleri motorlu ve pervaneli uçakla tam 12 saniye havada kalarak 36 metre uçmayı başardılar. İlk bakışta komik ve kısa görünen bu 12 saniye, dünyanın kaderini değiştirdi. O günden sadece 66 yıl sonra (1969'da) insanoğlu Ay'a adım atmayı başardı. Wright Kardeşler'in tahtadan ve kumaştan yaptığı o ilk uçak, savaşların şeklini, turizmi ve küresel ticareti baştan sona yeniden yazan havacılık devriminin kıvılcımı olmuştur.",
        "questions": [
          {
            "id": "s09-p3-q1",
            "type": "true_false_not_given",
            "question": "İnsanların uçma hayali sadece 20. yüzyılda teknoloji geliştikçe ortaya çıkmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'tarih boyunca hiç kaybetmedi' ve 17. yüzyıl detayları verilmiştir."
          },
          {
            "id": "s09-p3-q2",
            "type": "true_false_not_given",
            "question": "Hezârfen Ahmed Çelebi'nin uçuş macerası, dönemin ünlü seyyahı Evliya Çelebi'nin kayıtlarında yer almaktadır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'Evliya Çelebi'nin yazılarında anlatılır' ifadesi var."
          },
          {
            "id": "s09-p3-q3",
            "type": "true_false_not_given",
            "question": "Wright Kardeşler, uçaklarını tasarlarken Avrupalı mühendislerden büyük yardım almışlardır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Wright akaukalari kimdan yordam olgani haqida matnda aytilmagan."
          },
          {
            "id": "s09-p3-q4",
            "type": "true_false_not_given",
            "question": "Motorlu ilk uçuş sadece 12 saniye sürmüş olmasına rağmen, havacılık tarihi için büyük bir adımdır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'komik ve kısa görünen bu 12 saniye, dünyanın kaderini değiştirdi' denmiştir."
          },
          {
            "id": "s09-p3-q5",
            "type": "true_false_not_given",
            "question": "Wright Kardeşlerin ilk uçağı tamamen çelikten ve modern alaşımlardan yapılmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'tahtadan ve kumaştan yaptığı' deb yozilgan."
          },
          {
            "id": "s09-p3-q6",
            "type": "true_false_not_given",
            "question": "İlk motorlu uçuştan aya gidilene kadar geçen süre bir asırdan (100 yıldan) daha kısadır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'O günden sadece 66 yıl sonra... Ay'a adım atmayı başardı' deyilgan."
          }
        ]
      },
      {
        "id": "s09-p4",
        "title": "Hızlı Modanın (Fast Fashion) Gizli Maliyeti",
        "category": "Ekonomi ve Çevre",
        "level": "C1",
        "content": "Günümüzde birçok küresel giyim markası, her hafta yeni bir koleksiyon çıkararak tişörtleri bir kahve fiyatına satmaktadır. 'Hızlı moda' (fast fashion) adı verilen bu sistem, tüketicilere ucuza şık giyinme fırsatı sunsa da, gezegenimiz için devasa bir fatura çıkarmaktadır. [ 1 ]. Satılamayan veya sadece birkaç kez giyilip çöpe atılan milyonlarca ton kıyafet, Afrika ve Asya'daki devasa çöp dağlarını oluşturmaktadır. Dahası, pamuk üretimi için harcanan su miktarı inanılmaz boyutlardadır; örneğin tek bir pamuklu tişört üretmek için yaklaşık 2.700 litre suya (bir insanın 2,5 yıllık içme suyuna) ihtiyaç vardır. [ 2 ]. Polyester gibi sentetik kumaşlar ise yıkandıkça mikroplastik olarak denizlere karışıp besin zincirimizi zehirlemektedir. Uzmanlar, tüketicileri bu 'kullan-at' kültüründen vazgeçip, daha dayanıklı, geri dönüştürülebilir ve etik şartlarda üretilmiş kıyafetleri (yavaş moda) tercih etmeye çağırmaktadır.",
        "questions": [
          {
            "id": "s09-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Bunun nedeni, insanların artık internetten alışveriş yapmayı tercih etmesidir.",
              "Tekstil sektörü, petrol endüstrisinden sonra dünyayı en çok kirleten ikinci büyük sektördür.",
              "Hızlı moda markaları genellikle çok pahalı ve lüks ürünler satmaktadır.",
              "Eskiden terziler kendi kıyafetlerini kendileri dikerdi."
            ],
            "correctOption": 1,
            "explanation": "Oldingi gapda 'gezegenimiz için devasa bir fatura (zarar)' haqida gap ketgan. Shuning uchun tekstilning eng ifloslantiruvchi soha ekanligini aytuvchi jumla mos tushadi."
          },
          {
            "id": "s09-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Doğal kaynakların bu denli israfı sadece suyla da sınırlı kalmamaktadır.",
              "Pamuklu tişörtler genellikle yaz aylarında daha çok tercih edilir.",
              "Suyu ısıtmak için çok fazla elektrik harcanır.",
              "Bu yüzden kıyafetlerin çoğu siyah ve beyaz renkte üretilmektedir."
            ],
            "correctOption": 0,
            "explanation": "Bo'shliqdan oldin suvning isrofi aytildi. Keyingi gapda esa polyester va mikroplastiklar (suvdan boshqa zarar) aytilmoqda, demak 'sadece suyla sınırlı kalmıyor' bog'lovchi gapdir."
          },
          {
            "id": "s09-p4-q3",
            "type": "multiple_choice",
            "question": "Metne göre 'hızlı moda'nın temel tüketici cazibesi nedir?",
            "options": [
              "Kıyafetlerin çok dayanıklı ve yıllarca giyilebilir olması.",
              "Ürünlerin doğa dostu (organik) materyallerden üretilmesi.",
              "Tüketicilere ucuz fiyata ve sürekli yenilenen tasarımlarla (şık) giyinme imkanı sunması.",
              "Sadece ünlü tasarımcıların ellerinden çıkması."
            ],
            "correctOption": 2,
            "explanation": "'tüketicilere ucuza şık giyinme fırsatı sunsa da' ifadesinden olinadi."
          },
          {
            "id": "s09-p4-q4",
            "type": "multiple_choice",
            "question": "Tek bir tişört üretmek için doğaya ödenen bedel metinde nasıl örneklendirilmiştir?",
            "options": [
              "Üretiminde çocuk işçilerin çalıştırılmasıyla.",
              "2.700 litre su (bir insanın 2,5 yıllık içme suyu) harcanmasıyla.",
              "Tişört başına bir ağaç kesilmesiyle.",
              "Nakliye sırasında çok fazla benzin tüketilmesiyle."
            ],
            "correctOption": 1,
            "explanation": "Pamuklu tişört üretmek için yaklaşık 2.700 litre suya ihtiyaç vardır, deb misol qilingan."
          },
          {
            "id": "s09-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'fatura çıkarmak' ifadesi (mecaz anlamda) ne anlama gelmektedir?",
            "options": [
              "Bir şeyin zararlı sonuçlara, büyük kayıplara ve bedellere neden olması.",
              "Sadece para ödeyerek bir fiş veya fatura (kağıt) almak.",
              "Elektrik ve su borçlarını ödemek.",
              "Birini mahkemeye vermek."
            ],
            "correctOption": 0,
            "explanation": "'Gezegene fatura çıkarmak' majoziy ma'noda tabiatga katta zarar, tovon (bedel) to'latish demakdir."
          },
          {
            "id": "s09-p4-q6",
            "type": "cikarim",
            "question": "Yazarın çözüm olarak sunduğu 'yavaş moda' (slow fashion) anlayışının özellikleri nelerdir?",
            "options": [
              "Her gün yeni bir kıyafet alarak ekonomiye can vermek.",
              "Sadece çok pahalı markalardan alışveriş yapmak.",
              "Kullan-at yerine uzun ömürlü, geri dönüştürülebilir ve çevreye duyarlı kıyafetler seçmek.",
              "Modayı hiç takip etmeden eski kıyafetlerle gezmek."
            ],
            "correctOption": 2,
            "explanation": "Oxirgi gapda yechim: 'daha dayanıklı, geri dönüştürülebilir ve etik şartlarda üretilmiş kıyafetleri tercih etmek' deb yozilgan."
          }
        ]
      },
      {
        "id": "s09-p5",
        "title": "Zeigarnik Etkisi: Yarım Kalan İşler Neden Unutulmaz?",
        "category": "Psikoloji",
        "level": "C1",
        "content": "Hiç bitiremediğiniz bir projenin veya yarım kalan bir ilişkinin zihninizi sürekli meşgul ettiği oldu mu? Tamamlanmış işleri kolayca unuturken, yarım kalanların beynimize kazınmasına psikolojide 'Zeigarnik Etkisi' adı verilir. 1920'lerde Rus psikolog Bluma Zeigarnik, bir restorandaki garsonları izlerken bu durumu fark etmiştir. Garsonlar, ödenmemiş (yarım kalmış) uzun sipariş listelerini hafızalarında kusursuzca tutabilirken, hesap ödendiği an (işlem tamamlandığında) tüm siparişi tamamen unuttuklarını keşfetmiştir. Beynimiz, bir işe başladığında 'bilişsel bir gerilim' yaratır ve o iş bitene kadar bu gerilim sistemi uyanık tutarak görevi hatırlamamızı sağlar. Dizi senaristleri bu etkiyi çok iyi bilirler; bölümleri her zaman en heyecanlı yerde keserek (cliffhanger), seyircinin bir sonraki haftaya kadar diziyi düşünmesini sağlarlar. Zeigarnik etkisi, doğru kullanıldığında işlerimizi bitirmemiz için bir motivasyon kaynağı olabilirken, kontrol edilemediğinde stres ve anksiyete yaratabilir.",
        "questions": [
          {
            "id": "s09-p5-q1",
            "type": "ana_fikir",
            "question": "Metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Garsonlar, dünyadaki en güçlü hafızaya sahip meslek grubudur.",
              "Beynimiz, tamamlanmamış ve yarım kalmış işleri, bitirilmiş işlere göre daha fazla hatırlama (takıntı yapma) eğilimindedir.",
              "Dizi izlemek insan psikolojisini her zaman olumsuz etkiler.",
              "Restoranlarda hesap ödenmeden kalkmak ciddi bir suçtur."
            ],
            "correctOption": 1,
            "explanation": "Asosiy g'oya tugallanmagan ishlarning xotiraga kuchliroq saqlanishi (Zeigarnik effekti) dir."
          },
          {
            "id": "s09-p5-q2",
            "type": "multiple_choice",
            "question": "Bluma Zeigarnik, bu psikolojik etkiyi nerede ve kimleri gözlemleyerek keşfetmiştir?",
            "options": [
              "Laboratuvarda fareleri izlerken.",
              "Hastanede hastaları tedavi ederken.",
              "Bir restoranda sipariş alan ve hesap kesen garsonları izlerken.",
              "Üniversitede sınava giren öğrencileri izlerken."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'bir restorandaki garsonları izlerken bu durumu fark etmiştir' deb yozilgan."
          },
          {
            "id": "s09-p5-q3",
            "type": "multiple_choice",
            "question": "Zeigarnik Etkisine göre beynimiz bir iş tamamlandığında nasıl bir tepki verir?",
            "options": [
              "O işi asla unutmaz ve rüyalarda görmeye başlar.",
              "Bilişsel gerilim sona erer ve beyin o işin detaylarını hafızadan siler (unutur).",
              "Beyin hemen yeni ve daha zor bir iş aramaya başlar.",
              "Kişi şiddetli bir baş ağrısı çeker."
            ],
            "correctOption": 1,
            "explanation": "Garsonlar 'hesap ödendiği an tüm siparişi tamamen unuttuklarını keşfetmiştir' ve ish bitsa zo'riqish yo'qoladi."
          },
          {
            "id": "s09-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'bilişsel gerilim' (cognitive tension) ifadesiyle anlatılmak istenen durum nedir?",
            "options": [
              "Kaslardaki fiziksel yorgunluk ve ağrı.",
              "Beynin bir görevi bitirme zorunluluğu nedeniyle hissettiği odaklanmışlık, zihinsel uyanıklık ve huzursuzluk hali.",
              "İnsanların birbirleriyle şiddetli tartışmaya girmesi.",
              "Yeterli uyumamak."
            ],
            "correctOption": 1,
            "explanation": "Bilişsel gerilim - kognitiv zo'riqish bo'lib, miyaning bir ishni xotirada uyanık (faol) ushlab turish holatidir."
          },
          {
            "id": "s09-p5-q5",
            "type": "cikarim",
            "question": "Bir dizi senaristinin Zeigarnik etkisini kullanarak bölümü en heyecanlı yerde (yarım) bitirmesinin amacı nedir?",
            "options": [
              "Dizinin çekim maliyetlerini (para) azaltmak.",
              "Oyuncuların dinlenmesine fırsat vermek.",
              "Seyircinin zihninde bir 'tamamlanmamışlık' hissi yaratarak diziyi unutmamalarını ve yeni bölümü merak etmelerini sağlamak.",
              "Reklamların daha fazla izlenmesini sağlamak."
            ],
            "correctOption": 2,
            "explanation": "Senaristlar yarım keserek (cliffhanger) tomoshabinni keyingi haftagacha serial haqida o'ylashga majbur qiladilar."
          },
          {
            "id": "s09-p5-q6",
            "type": "multiple_choice",
            "question": "Zeigarnik etkisinin insan hayatındaki olumsuz (negatif) yönü ne olabilir?",
            "options": [
              "Çok fazla uyumaya neden olması.",
              "Kişiyi mükemmeliyetçi yaparak işleri hızlı bitirmesini sağlaması.",
              "Yarım kalan işlerin sürekli akılda dönüp durarak strese ve kaygıya (anksiyeteye) yol açması.",
              "Kişinin tamamen hafızasını kaybetmesine neden olması."
            ],
            "correctOption": 2,
            "explanation": "Matn so'ngida: 'kontrol edilemediğinde stres ve anksiyete yaratabilir' deb salbiy oqibati yozilgan."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-10",
    "sectionNumber": 10,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_10.json",
    "passages": [
      {
        "id": "s10-p1",
        "title": "Hastane Ziyaretçi Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli hasta yakınları, hastalarımızın sağlığı ve hastanemizin düzeni için lütfen aşağıdaki kurallara uyunuz:\n1. Hasta ziyaret saatleri her gün 14:00 - 16:00 ve 19:00 - 21:00 arasındadır. Bu saatler dışında servislere ziyaretçi alınmaz.\n2. 12 yaşından küçük çocukların, enfeksiyon riski taşıdıkları için hasta odalarına girmesi kesinlikle yasaktır.\n3. Hastalarımızın diyet programlarının bozulmaması için dışarıdan yiyecek ve içecek getirilmesi yasaktır.\n4. Hastane içinde ve odalarda yüksek sesle konuşmak, diğer hastaları rahatsız edeceği için yasaktır.\n5. Hastanın odasına aynı anda en fazla iki ziyaretçinin girmesine izin verilir; ziyaret süresi 15 dakikayı geçmemelidir.\nGeçmiş olsun dileklerimizle.",
        "questions": [
          {
            "id": "s10-p1-q1",
            "type": "multiple_choice",
            "question": "Hastane ziyaretleri akşam en geç saat kaça kadar yapılabilir?",
            "options": [
              "16:00",
              "19:00",
              "21:00",
              "22:00"
            ],
            "correctOption": 2,
            "explanation": "Akşam ziyaret saatleri 19:00 - 21:00 arasındadır."
          },
          {
            "id": "s10-p1-q2",
            "type": "multiple_choice",
            "question": "Çocukların hasta ziyaretine getirilmesinin yasak olma nedeni nedir?",
            "options": [
              "Çok fazla gürültü yapmaları",
              "Enfeksiyon (hastalık bulaşma) riski taşıması",
              "Hastane koridorlarında kaybolmaları",
              "Çocukların hastaneden korkması"
            ],
            "correctOption": 1,
            "explanation": "Enfeksiyon riski taşıdıkları için kesinlikle yasaktır."
          },
          {
            "id": "s10-p1-q3",
            "type": "multiple_choice",
            "question": "Ziyaretçilerin dışarıdan yemek getirmesi neden yasaktır?",
            "options": [
              "Hastane kantininin satış yapabilmesi için",
              "Odaların kirlenmesini önlemek için",
              "Hastaların özel diyet programlarının bozulmaması için",
              "Yemek kokusunun doktorları rahatsız etmesi"
            ],
            "correctOption": 2,
            "explanation": "Hastalarımızın diyet programlarının bozulmaması için yasaktır."
          },
          {
            "id": "s10-p1-q4",
            "type": "multiple_choice",
            "question": "Aynı anda bir hasta odasında en fazla kaç ziyaretçi bulunabilir?",
            "options": [
              "Sınır yoktur",
              "Sadece 1 kişi",
              "En fazla 2 kişi",
              "En fazla 5 kişi"
            ],
            "correctOption": 2,
            "explanation": "Aynı anda en fazla iki ziyaretçinin girmesine izin verilir."
          },
          {
            "id": "s10-p1-q5",
            "type": "multiple_choice",
            "question": "İdeal bir hasta ziyareti ne kadar sürmelidir?",
            "options": [
              "Yarım saat",
              "15 dakikayı geçmemelidir",
              "Sadece 5 dakika",
              "1 saat"
            ],
            "correctOption": 1,
            "explanation": "Ziyaret süresi 15 dakikayı geçmemelidir."
          },
          {
            "id": "s10-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin temel mesajı aşağıdakilerden hangisidir?",
            "options": [
              "Hastanenin çok kalabalık olduğunu duyurmak",
              "Hastaların moralini yüksek tutmak",
              "Hastanede düzeni sağlamak ve hastaları korumak",
              "Yeni ziyaret saatlerini protesto etmek"
            ],
            "correctOption": 2,
            "explanation": "Metin, düzeni sağlamak ve enfeksiyon/diyet gibi konularda hastaları korumak için yazılmıştır."
          }
        ]
      },
      {
        "id": "s10-p2",
        "title": "Farklı Öğrenme Stilleri",
        "category": "Eğitim / Eşleştirme",
        "level": "B1",
        "content": "A) Ali: Ben bir şeyi sadece dinleyerek asla anlayamam. Öğretmenin anlattıklarını mutlaka tahtada şemalarla, resimlerle veya renkli haritalarla görmem gerekir. Ders çalışırken kendi notlarımı fosforlu kalemlerle çizerim.\n\nB) Zeynep: Benim için ders dinlemek bir zevktir. Okuldaki dersleri sadece hoca anlatırken dinleyerek kavrarım. Evde çalışırken de kitapları sessizce okumak yerine sesli okur veya ders kayıtlarını dinleyerek çalışırım.\n\nC) Can: Bütün gün sırada oturmak bana göre değil. Ben dokunarak ve uygulayarak öğrenirim. Mesela fen dersindeki bir deneyi sadece kitaptan okumak yerine, laboratuvarda malzemelere dokunarak kendim yapmalıyım.\n\nD) Elif: Benim en iyi arkadaşım kağıt ve kalemdir. Ne kadar çok okursam o kadar iyi öğrenirim. Bir konuyu anlamak için önce kitaptan okur, sonra kendi cümlelerimle defterime uzun uzun özetler yazarım.",
        "questions": [
          {
            "id": "s10-p2-q1",
            "type": "matching_paragraph",
            "question": "Öğrenmek için renkleri, çizimleri ve görsel materyalleri tercih eden kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 0,
            "explanation": "Ali şemalar, resimler ve fosforlu kalemler kullandığını belirtmiştir (Görsel öğrenici)."
          },
          {
            "id": "s10-p2-q2",
            "type": "matching_paragraph",
            "question": "Ders çalışırken yazarak not çıkarmayı (özetlemeyi) en etkili yöntem olarak gören kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 3,
            "explanation": "Elif, defterine uzun uzun özetler yazdığını belirtmiştir (Okuma/Yazma öğrenicisi)."
          },
          {
            "id": "s10-p2-q3",
            "type": "matching_paragraph",
            "question": "Yeni bir bilgiyi pratik yaparak ve deneyimleyerek (dokunarak) öğrenen kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 2,
            "explanation": "Can laboratuvarda deney malzemelerine dokunarak yaptığını söylemiştir (Kinestetik)."
          },
          {
            "id": "s10-p2-q4",
            "type": "matching_paragraph",
            "question": "Kitap okurken bile bilgiyi hafızasına almak için kendi sesini kullanmayı tercih eden kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 1,
            "explanation": "Zeynep kitapları sessizce okumak yerine sesli okuduğunu belirtmiştir (İşitsel)."
          },
          {
            "id": "s10-p2-q5",
            "type": "matching_paragraph",
            "question": "Sınıfta uzun süre sabit ve hareketsiz oturmaktan sıkılan kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 2,
            "explanation": "Can 'Bütün gün sırada oturmak bana göre değil' demiştir."
          },
          {
            "id": "s10-p2-q6",
            "type": "matching_paragraph",
            "question": "Sadece dinlemenin kendisine yetmediğini, konuyu görselleştirmesi gerektiğini belirten kişi kimdir?",
            "options": [
              "A) Ali",
              "B) Zeynep",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 0,
            "explanation": "Ali 'sadece dinleyerek asla anlayamam... tahtada şemalarla görmem gerekir' demiştir."
          }
        ]
      },
      {
        "id": "s10-p3",
        "title": "Suyun Şifası: Türk Hamamı",
        "category": "Kültür ve Tarih",
        "level": "B2",
        "content": "Türk kültüründe temizlik ve yıkanma geleneğinin en önemli simgelerinden biri Türk hamamlarıdır. Kökeni Roma ve Bizans hamamlarına (thermae) dayansa da, Selçuklu ve Osmanlı dönemlerinde İslam'ın temizlik anlayışıyla birleşerek eşsiz bir yapıya kavuşmuştur. Geleneksel bir Türk hamamı; soğukluk (giyinme alanı), ılıklık (vücudun sıcağa alıştığı yer) ve sıcaklık (terleme ve yıkanma alanı) olmak üzere üç ana bölümden oluşur. Sıcaklığın ortasında, insanların üzerine uzanıp terlediği mermerden yapılmış geniş bir 'göbek taşı' bulunur. Hamamlar, Osmanlı döneminde sadece bir yıkanma yeri değil, aynı zamanda kadınların sosyalleştiği, eğlencelerin düzenlendiği (gelin hamamı gibi) ve önemli haberlerin paylaşıldığı birer sosyal merkezdi. Günümüzde modern evlerdeki banyolar hamamların günlük işlevini azaltsa da, turistler ve geleneksel bir rahatlama arayanlar için hamam kültürü hala canlılığını korumaktadır.",
        "questions": [
          {
            "id": "s10-p3-q1",
            "type": "true_false_not_given",
            "question": "Türk hamamının mimari kökeni tamamen Türklere ait olup başka bir medeniyetten etkilenmemiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Kökeni Roma ve Bizans hamamlarına dayandığı belirtilmiştir."
          },
          {
            "id": "s10-p3-q2",
            "type": "true_false_not_given",
            "question": "Hamamın 'ılıklık' adı verilen bölümünde insanların vücudu yüksek sıcaklığa yavaşça alıştırılır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'Ilıklık (vücudun sıcağa alıştığı yer)' olarak tanımlanmıştır."
          },
          {
            "id": "s10-p3-q3",
            "type": "true_false_not_given",
            "question": "Göbek taşı, hamama gelenlerin üzerinde yemek yedikleri büyük bir masadır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. İnsanların üzerine uzanıp terlediği mermerden yapılmış bir taştır."
          },
          {
            "id": "s10-p3-q4",
            "type": "true_false_not_given",
            "question": "Osmanlı döneminde hamamlar sadece fiziksel temizlik için değil, sosyal iletişim için de kullanılıyordu.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. Kadınların sosyalleştiği, önemli haberlerin paylaşıldığı birer sosyal merkezdi."
          },
          {
            "id": "s10-p3-q5",
            "type": "true_false_not_given",
            "question": "Gelin hamamı eğlencelerinde genellikle canlı müzik ve yemek ikramı yapılırdı.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Gelin hamamı kelimesi geçse de, canlı müzik veya yemek ikramı detayları metinde yoktur."
          },
          {
            "id": "s10-p3-q6",
            "type": "true_false_not_given",
            "question": "Modern banyoların yaygınlaşması, insanların hamamlara olan günlük ihtiyacını azaltmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'Modern evlerdeki banyolar hamamların günlük işlevini azaltsa da...' denilmiştir."
          }
        ]
      },
      {
        "id": "s10-p4",
        "title": "Sürücüsüz Araçlar: Kim Karar Verecek?",
        "category": "Teknoloji ve Etik",
        "level": "C1",
        "content": "Yapay zekanın en büyük ürünlerinden biri olan otonom (sürücüsüz) araçlar, trafik kazalarını %90 oranında azaltma potansiyeline sahiptir. [ 1 ]. Ancak bilim insanları ve mühendisler, otonom araçların tasarımı aşamasında çok büyük bir ahlaki ikilemle (etik problemle) karşı karşıyadır. Bu ikilem, felsefedeki ünlü 'Tramvay Problemi'ne dayanmaktadır. Örneğin, sürücüsüz bir araç yolda ilerlerken aniden yola beş çocuk atladığını varsayalım. Aracın fren yapacak mesafesi yoktur. Araç çocukları ezmemek için direksiyonu kırarsa, yol kenarındaki duvara çarpacak ve içindeki yolcuyu kesin olarak öldürecektir. [ 2 ]. Bir yazılım, yolcunun hayatını mı yoksa yoldaki yayaların hayatını mı korumaya programlanmalıdır? Mercedes-Benz gibi bazı firmalar, araçlarının ne pahasına olursa olsun sadece kendi yolcusunu korumaya programlanacağını açıklamış ve büyük tepki toplamıştır. Bu sorunun cevabı henüz bulunabilmiş değildir.",
        "questions": [
          {
            "id": "s10-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Çünkü bu araçlar alkollü araç kullanma, uykusuzluk ve dikkatsizlik gibi insan kaynaklı hataları ortadan kaldırır.",
              "Otonom araçlar genellikle benzin yerine elektrikle çalışmaktadır.",
              "Bu araçların fiyatları henüz çok yüksek olduğu için kimse satın alamamaktadır.",
              "Trafik ışıklarının tamamen kaldırılması planlanmaktadır."
            ],
            "correctOption": 0,
            "explanation": "Önceki cümlede trafik kazalarını %90 azaltacağı söylendiği için, bunun nedenini açıklayan (insan kaynaklı hataları ortadan kaldırması) seçenek en uygunudur."
          },
          {
            "id": "s10-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Çocuklar bu duruma çok gülecek ve kaçacaklardır.",
              "Otomobilin radyosu bu kaza anında hemen kapanacaktır.",
              "İşte bu saniyede aracın yapay zekası kimi feda edeceğine nasıl karar verecektir?",
              "Sürücüsüz araçlar asla bu kadar hızlı gitmez."
            ],
            "correctOption": 2,
            "explanation": "Olası senaryo (5 çocuk vs. araç içindeki yolcu) verildikten sonra, yapay zekanın bu seçimi (kimi feda edeceği) nasıl yapacağı sorusu gelmelidir."
          },
          {
            "id": "s10-p4-q3",
            "type": "multiple_choice",
            "question": "Sürücüsüz araçların trafik kazalarını %90 oranında azaltacağı düşünülmektedir. Bu durum hangi nedene dayanmaktadır?",
            "options": [
              "Araçların çok yavaş gitmesine.",
              "Sadece boş yollarda kullanılmasına.",
              "Kazaların çoğuna neden olan insan faktörünün (uykusuzluk, dikkat dağınıklığı) devreden çıkmasına.",
              "Yolların eskisinden daha geniş yapılmasına."
            ],
            "correctOption": 2,
            "explanation": "İnsan kaynaklı hatalar ortadan kalktığı için kazaların azalacağı öngörülür."
          },
          {
            "id": "s10-p4-q4",
            "type": "multiple_choice",
            "question": "Otonom araç üreticilerinin çözmeye çalıştığı 'Tramvay Problemi' temelde ne ile ilgilidir?",
            "options": [
              "Araçların yollardaki tramvaylara çarpma tehlikesi.",
              "Kaçınılmaz bir kaza anında yapay zekanın kimin yaşayıp kimin öleceğine nasıl karar vereceği (ahlaki tercih).",
              "Araçların batarya sürelerinin ne kadar dayanacağı.",
              "Yolcuların arabada sıkılıp sıkılmayacağı."
            ],
            "correctOption": 1,
            "explanation": "Tramvay problemi, felsefi ve ahlaki bir seçim (kimin yaşayıp kimin öleceği) ikilemidir."
          },
          {
            "id": "s10-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'ikilem' kelimesi hangi anlama gelmektedir?",
            "options": [
              "Birbirine tamamen benzeyen iki şey.",
              "Çözümü olmayan matematiksel bir denklem.",
              "Kişiyi birbirinden farklı ve genellikle ikisi de olumsuz (veya zor) iki seçenek arasında bırakan durum.",
              "İki kişinin aynı anda konuşması."
            ],
            "correctOption": 2,
            "explanation": "İkilem (dilemma), iki zor seçenek arasında kalma durumudur."
          },
          {
            "id": "s10-p4-q6",
            "type": "cikarim",
            "question": "Metinden çıkarılabilecek sonuca göre, tüketiciler bir otonom araç satın alırken ne beklemektedir?",
            "options": [
              "Aracın kaza anında yolcuları değil yayaları kurtarmasını beklerler.",
              "Kaza durumunda, aracın ne olursa olsun öncelikle kendi içindeki yolcuyu (satın alanı) kurtarmasını beklerler.",
              "Aracın tamamen yavaş gidip hiç kaza yapmamasını isterler.",
              "Aracın sadece elektrikle çalışmasını önemserler."
            ],
            "correctOption": 1,
            "explanation": "Mercedes'in sadece kendi yolcusunu koruma kararı ve insanların bunu tartışması, aracı satın alan kişinin öncelikle kendi can güvenliğini isteyeceğini işaret eder."
          }
        ]
      },
      {
        "id": "s10-p5",
        "title": "İyileşme Beklentisi: Plasebo Etkisi",
        "category": "Psikoloji ve Tıp",
        "level": "C1",
        "content": "Bir doktorun size verdiği hapın aslında içinde hiçbir etken madde bulunmayan sadece şekerden ibaret bir hap olduğunu öğrenseniz ne düşünürsünüz? İşin ilginç yanı, tıpta 'Plasebo Etkisi' adı verilen bu fenomen, içinde ilaç olmayan şeker haplarının bile hastaları gerçekten iyileştirebildiğini kanıtlamaktadır. Kişi ilacı içtiğinde, doktoruna ve ilaca olan güçlü inancı sayesinde beyni, ağrıyı kesen ve vücudu rahatlatan 'endorfin' hormonları salgılamaya başlar. Baş ağrısı, stres, depresyon ve hatta bazı mide rahatsızlıklarında hastaların %30'unun sadece plasebo hapları ile iyileştiği gözlemlenmiştir. Ancak plasebonun bir karanlık tarafı da vardır: 'Nosebo Etkisi'. Eğer bir hasta, kendisine verilen ilacın yan etkileri olacağına veya hastalığının kötüleşeceğine inanırsa, ilaç zararsız bile olsa kişi gerçekten o yan etkileri yaşamaya başlar. Sonuç olarak beynimizin telkin gücü, vücudumuzun iyileşme veya hastalanma sürecinde sandığımızdan çok daha büyük bir komutandır.",
        "questions": [
          {
            "id": "s10-p5-q1",
            "type": "ana_fikir",
            "question": "Bu metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Doktorlar hastalara her zaman yalan söyleyerek sahte ilaç verirler.",
              "Şeker hapları dünyadaki tüm hastalıkların kesin çözümüdür.",
              "İnsan beyninin iyileşeceğine veya kötüleşeceğine olan inancı, vücudun fiziksel tepkilerini doğrudan etkiler.",
              "Modern tıp henüz hiçbir hastalığı tedavi edememektedir."
            ],
            "correctOption": 2,
            "explanation": "Metnin ana fikri, zihnin ve inancın (telkin gücünün) vücudun iyileşme sürecine olan muazzam etkisidir."
          },
          {
            "id": "s10-p5-q2",
            "type": "multiple_choice",
            "question": "Plasebo etkisinde hastanın iyileşmesini sağlayan gerçek mekanizma nedir?",
            "options": [
              "Hapın içindeki güçlü kimyasal maddeler.",
              "Şekerin vücuttaki mikrop ve virüsleri yok etmesi.",
              "Hastanın iyileşeceğine inanması sonucu beynin endorfin gibi doğal iyileştirici hormonlar salgılaması.",
              "Doktorun hastayla uzun uzun konuşması."
            ],
            "correctOption": 2,
            "explanation": "Doktoruna ve ilaca olan inancı sayesinde beyin endorfin salgılar."
          },
          {
            "id": "s10-p5-q3",
            "type": "multiple_choice",
            "question": "Plasebo etkisi daha çok hangi tür rahatsızlıklarda başarılı sonuçlar vermektedir?",
            "options": [
              "Kırık kemiklerde ve ameliyat gerektiren durumlarda.",
              "Baş ağrısı, stres, depresyon ve mide rahatsızlıklarında.",
              "Genetik hastalıklarda (körlük vb.).",
              "Zehirlenme durumlarında."
            ],
            "correctOption": 1,
            "explanation": "Metinde 'Baş ağrısı, stres, depresyon ve hatta bazı mide rahatsızlıklarında' etkili olduğu söylenmiştir."
          },
          {
            "id": "s10-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'telkin gücü' ifadesi ne anlama gelmektedir?",
            "options": [
              "Birine bağırarak emir vermek.",
              "Bir fikri, inancı veya hissi sürekli tekrarlayarak bilinçaltına yerleştirmek (aşılama).",
              "İnsanların zihnini okuma yeteneği.",
              "Bir ilacın fiyatının yüksek olması."
            ],
            "correctOption": 1,
            "explanation": "Telkin, bir inancı aşılayarak zihni yönlendirme gücüdür."
          },
          {
            "id": "s10-p5-q5",
            "type": "multiple_choice",
            "question": "Plasebonun karanlık yüzü olan 'Nosebo Etkisi' nedir?",
            "options": [
              "Hastanın ilacı kullanmayı unutması.",
              "Kişinin zararsız bir ilacın bile kendisine zarar vereceğine inanıp bu olumsuz etkileri fiziksel olarak yaşaması.",
              "Hapların sadece gündüzleri etki etmesi.",
              "Hastanın doktordan korkarak hastaneden kaçması."
            ],
            "correctOption": 1,
            "explanation": "İlacın yan etkileri olacağına inanırsa, ilaç zararsız olsa da bu etkileri yaşamaya (Nosebo) başlar."
          },
          {
            "id": "s10-p5-q6",
            "type": "cikarim",
            "question": "Bu metinden çıkarılabilecek en önemli sonuç aşağıdakilerden hangisidir?",
            "options": [
              "Sadece pahalı ilaçlar insanları iyileştirebilir.",
              "Hastaların doktora ve tedaviye duyduğu güven, iyileşme sürecinin kritik ve biyolojik bir parçasıdır.",
              "Eczanelerdeki tüm ilaçlar aslında şekerden yapılmaktadır.",
              "İnsanlar sadece yan etkilerden korktukları için hasta olurlar."
            ],
            "correctOption": 1,
            "explanation": "Doktora ve ilaca inanç, beyni hormon salgılamaya ittiği için iyileşmenin biyolojik ve kritik parçasıdır."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-11",
    "sectionNumber": 11,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_11.json",
    "passages": [
      {
        "id": "s11-p1",
        "title": "Akıllı Bisiklet Kiralama Sistemi Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Şehrimizin akıllı bisiklet (BİSİM) istasyonlarını kullanırken aşağıdaki kurallara dikkat etmeniz gerekmektedir:\n1. Bisiklet kiralayabilmek için sisteme kayıtlı bir kredi kartınızın veya ulaşım kartınızın olması zorunludur. Nakit ödeme kabul edilmez.\n2. Bisiklet kullanım yaş sınırı 15'tir. 15 yaşından küçüklerin kiralama yapmasına sistem izin vermez.\n3. Kiralama işlemi başladığında kredi kartınızdan 50 TL depozito çekilir. Bisikleti sorunsuz teslim ettiğinizde kullanım ücreti kesilip kalan para kartınıza iade edilir.\n4. Bisikletler, şehrin farklı noktalarındaki herhangi bir boş istasyona kilitlenerek (yeşil ışık yanana kadar) iade edilebilir.\n5. Bisiklete kasıtlı zarar veren veya 24 saat içinde iade etmeyen kullanıcılar hakkında yasal işlem başlatılacaktır.",
        "questions": [
          {
            "id": "s11-p1-q1",
            "type": "multiple_choice",
            "question": "Bisiklet kiralama ödemeleri nasıl yapılmaktadır?",
            "options": [
              "Sadece nakit parayla",
              "Sadece mobil uygulamadan",
              "Kredi kartı veya ulaşım kartı ile",
              "Sürücü belgesi gösterilerek"
            ],
            "correctOption": 2,
            "explanation": "Kredi kartınızın veya ulaşım kartınızın olması zorunludur. Nakit ödeme kabul edilmez."
          },
          {
            "id": "s11-p1-q2",
            "type": "multiple_choice",
            "question": "13 yaşındaki bir çocuk tek başına bisiklet kiralayabilir mi?",
            "options": [
              "Evet, eğer iyi bisiklet sürebiliyorsa",
              "Evet, ulaşım kartı varsa",
              "Hayır, yaş sınırı 15'tir.",
              "Hayır, sadece hafta sonları kiralayabilir."
            ],
            "correctOption": 2,
            "explanation": "Bisiklet kullanım yaş sınırı 15'tir."
          },
          {
            "id": "s11-p1-q3",
            "type": "multiple_choice",
            "question": "Sistem kiralama başında neden 50 TL depozito çekmektedir?",
            "options": [
              "Tüm bisikletlerin fiyatı 50 TL olduğu için",
              "Güvence bedeli olarak (sorunsuz teslimde iade edilmek üzere)",
              "Kask kiralamak için",
              "Üye kayıt ücreti olduğu için"
            ],
            "correctOption": 1,
            "explanation": "Depozito çekilir, sorunsuz teslim edildiğinde iade edilir."
          },
          {
            "id": "s11-p1-q4",
            "type": "multiple_choice",
            "question": "Kullanıcı kiraladığı bisikleti geri verirken (iade ederken) neye dikkat etmelidir?",
            "options": [
              "Mutlaka kiraladığı aynı istasyona geri vermelidir.",
              "İstasyona taktıktan sonra yeşil ışığın yanmasını beklemelidir.",
              "Anahtarı görevliye teslim etmelidir.",
              "İade işlemi için birini aramalıdır."
            ],
            "correctOption": 1,
            "explanation": "İstasyona kilitlenerek (yeşil ışık yanana kadar) iade edilebilir."
          },
          {
            "id": "s11-p1-q5",
            "type": "multiple_choice",
            "question": "Bisikleti 2 gün (48 saat) boyunca teslim etmeyen bir kullanıcıya ne olur?",
            "options": [
              "Sadece indirim hakkını kaybeder.",
              "Bisiklet tamamen onun olur.",
              "Hakkında yasal işlem (dava) başlatılır.",
              "50 TL daha öder ve sorunu çözer."
            ],
            "correctOption": 2,
            "explanation": "24 saat içinde iade etmeyen kullanıcılar hakkında yasal işlem başlatılacaktır."
          },
          {
            "id": "s11-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin amacı nedir?",
            "options": [
              "Vatandaşları bisiklet kullanmanın sağlığa faydaları hakkında bilgilendirmek",
              "Bisiklet kiralama kurallarını ve sistemin nasıl işlediğini anlatmak",
              "Bisiklet yollarının haritasını vermek",
              "Şehirdeki trafik sorununa çözüm bulmak"
            ],
            "correctOption": 1,
            "explanation": "Bu metin sistemin kiralama ve iade kurallarını (nasıl işlediğini) anlatır."
          }
        ]
      },
      {
        "id": "s11-p2",
        "title": "Geleceğin Çalışma Modelleri",
        "category": "İş Hayatı / Eşleştirme",
        "level": "B1",
        "content": "A) Hasan: Benim şirketim tamamen 'Uzaktan (Remote)' sisteme geçti. İşim sadece bilgisayar ve internet gerektiriyor. Bu yüzden İstanbul'dan taşınıp sahil kasabasına yerleştim. İşe gitme süresini (trafik) sıfıra indirdiğim için çok mutluyum.\n\nB) Ayşe: Ben 'Geleneksel Ofis' çalışanı olmaktan yanayım. Yüz yüze iletişim, kahve molasındaki sohbetler ve ofisin ciddi atmosferi olmadan odaklanamıyorum. Evdeyken sürekli dikkatim dağılıyor.\n\nC) Burak: Ben bir şirkete bağlı olmadan 'Freelance' (Bağımsız) çalışıyorum. Kendi çalışma saatlerimi ve hangi projelerde yer alacağımı sadece ben seçiyorum. Bazen gece yarılarına kadar çalışıp, gündüzleri uyuyorum.\n\nD) Deniz: Benim şirketim 'Hibrit' model kullanıyor. Haftanın 2 günü ofise gidip toplantılarımızı yapıyoruz, kalan 3 gün ise evden çalışıyoruz. Bence bu model, hem ofis sosyalliğini hem de ev rahatlığını birleştiren en mükemmel sistem.",
        "questions": [
          {
            "id": "s11-p2-q1",
            "type": "matching_paragraph",
            "question": "Sadece evden çalıştığı için büyük şehirden taşınan kişi kimdir?",
            "options": [
              "A) Hasan",
              "B) Ayşe",
              "C) Burak",
              "D) Deniz"
            ],
            "correctOption": 0,
            "explanation": "Hasan sahil kasabasına yerleştiğini belirtmiştir."
          },
          {
            "id": "s11-p2-q2",
            "type": "matching_paragraph",
            "question": "Hiçbir şirkete (patrona) bağlı olmayan ve kendi çalışma saatlerini kendi belirleyen kişi kimdir?",
            "options": [
              "A) Hasan",
              "B) Ayşe",
              "C) Burak",
              "D) Deniz"
            ],
            "correctOption": 2,
            "explanation": "Burak bağımsız (freelance) çalıştığını, saatleri kendisi seçtiğini söylemiştir."
          },
          {
            "id": "s11-p2-q3",
            "type": "matching_paragraph",
            "question": "Ev ortamında disiplin kuramayan ve işine odaklanmakta zorlanan kişi kimdir?",
            "options": [
              "A) Hasan",
              "B) Ayşe",
              "C) Burak",
              "D) Deniz"
            ],
            "correctOption": 1,
            "explanation": "Ayşe evdeyken sürekli dikkatinin dağıldığını söylemiştir."
          },
          {
            "id": "s11-p2-q4",
            "type": "matching_paragraph",
            "question": "Hem ofis hayatını hem de uzaktan çalışmayı belirli günlerde uygulayan kişi kimdir?",
            "options": [
              "A) Hasan",
              "B) Ayşe",
              "C) Burak",
              "D) Deniz"
            ],
            "correctOption": 3,
            "explanation": "Deniz haftanın 2 günü ofise, 3 günü evden (hibrit model) çalıştığını söylemiştir."
          },
          {
            "id": "s11-p2-q5",
            "type": "matching_paragraph",
            "question": "İş arkadaşlarıyla yüz yüze iletişimi ve kahve molalarını çok önemseyen kişi kimdir?",
            "options": [
              "A) Hasan",
              "B) Ayşe",
              "C) Burak",
              "D) Deniz"
            ],
            "correctOption": 1,
            "explanation": "Ayşe yüz yüze iletişimi ve kahve sohbetlerini sevdiğini belirtmiştir."
          },
          {
            "id": "s11-p2-q6",
            "type": "matching_paragraph",
            "question": "Çalışma modelinin esnekliği sayesinde gece çalışıp gündüz uyuyabilen kişi kimdir?",
            "options": [
              "A) Hasan",
              "B) Ayşe",
              "C) Burak",
              "D) Deniz"
            ],
            "correctOption": 2,
            "explanation": "Burak bazen gece çalıştığını bazen gündüz uyuduğunu ifade etmiştir."
          }
        ]
      },
      {
        "id": "s11-p3",
        "title": "Taşa Yazılan Tarih: Mimar Sinan ve Süleymaniye",
        "category": "Tarih ve Kültür",
        "level": "B2",
        "content": "Osmanlı mimarisinin dehası kabul edilen Mimar Sinan, kariyeri boyunca yüzlerce şaheser bırakmıştır. Bunların en önemlilerinden biri, Kanuni Sultan Süleyman adına İstanbul'da inşa edilen Süleymaniye Camii'dir. Sadece bir ibadethane değil; hastane, kütüphane, hamam ve okullardan oluşan devasa bir külliyedir. Mimar Sinan, camiyi inşa ederken inanılmaz mühendislik çözümleri üretmiştir. Örneğin, caminin içindeki devasa kandillerden (mum türü) çıkan isin (kara dumanın) duvarları kirletmemesi için hava akımlarını hesaplayarak dumanı ana kapının üstündeki 'İs Odası'na yönlendirmiştir. Burada toplanan kaliteli islerden o dönemin hattatları (yazı ustaları) için mürekkep elde edilmiştir. Ayrıca akustik (ses yayılımı) kusursuz olsun diye kubbeye ve duvarların içine içi boş küpler (testiler) yerleştirmiştir. Dahası, örümceklerin camiye ağ yapmasını engellemek için avizelerin arasına devekuşu yumurtaları koymuştur. Süleymaniye, yüzyıllardır yaşanan büyük depremlere rağmen tek bir çatlak bile almadan ayakta durmaktadır.",
        "questions": [
          {
            "id": "s11-p3-q1",
            "type": "true_false_not_given",
            "question": "Süleymaniye sadece bir cami olarak inşa edilmiş, çevresinde başka bir yapı bulunmamaktadır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Sadece ibadethane değil; hastane, kütüphane, okuldan oluşan bir külliyedir."
          },
          {
            "id": "s11-p3-q2",
            "type": "true_false_not_given",
            "question": "İs Odası, camide çıkan yangınları söndürmek için tasarlanmış özel bir odadır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Kandillerden çıkan isin toplanması ve duvarları kirletmemesi için tasarlanmıştır."
          },
          {
            "id": "s11-p3-q3",
            "type": "true_false_not_given",
            "question": "Mimar Sinan, is odasında toplanan duman kalıntılarının atılmayıp mürekkep yapımında kullanıldığını hesaplamıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'kaliteli islerden hattatları için mürekkep elde edilmiştir' deniliyor."
          },
          {
            "id": "s11-p3-q4",
            "type": "true_false_not_given",
            "question": "Duvarların içine içi boş küpler yerleştirilmesinin sebebi, olası depremlerde binanın ağırlığını hafifletmektir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Küpler (testiler) binayı hafifletmek için değil, akustik (ses yayılımı) kusursuz olsun diye yerleştirilmiştir."
          },
          {
            "id": "s11-p3-q5",
            "type": "true_false_not_given",
            "question": "Devekuşu yumurtaları, bazı böceklerin ve örümceklerin camiye girmesini veya ağ yapmasını engellemektedir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. Örümceklerin ağ yapmasını engellemek için avizelerin arasına konulmuştur."
          },
          {
            "id": "s11-p3-q6",
            "type": "true_false_not_given",
            "question": "Mimar Sinan, Süleymaniye Camii'ni inşa etmek için 7 yıl uğraşmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Kaç yıl uğraştığına dair bir süre (örneğin 7 yıl) metinde geçmemektedir."
          }
        ]
      },
      {
        "id": "s11-p4",
        "title": "Görünmez Tehlike: Karbon Ayak İzi",
        "category": "Çevre ve Bilim",
        "level": "C1",
        "content": "Son yıllarda küresel iklim krizini tartışırken sıkça duyduğumuz kavramlardan biri 'Karbon Ayak İzi'dir (Carbon Footprint). Bu terim, bir bireyin, şirketin veya ülkenin günlük faaliyetleri sonucunda atmosfere saldığı karbondioksit (CO2) ve diğer sera gazlarının toplam miktarını ifade eder. [ 1 ]. Satın aldığımız kıyafetlerin fabrikada üretilip gemilerle ülkemize taşınması, evde tükettiğimiz elektrik, kullandığımız araba ve hatta çöpe attığımız fazla yiyecekler bile karbon ayak izimizi büyütür. [ 2 ]. Bu nedenle çevreciler, karbon ayak izini küçültmek için toplu taşımayı kullanmayı, et tüketimini azaltmayı ve geri dönüşüme önem vermeyi tavsiye ediyor. Ancak bazı eleştirmenler, Karbon Ayak İzi kavramının aslında büyük petrol şirketleri tarafından icat edildiğini iddia etmektedir. Onlara göre şirketler, çevresel felaketlerin sorumluluğunu milyarlarca sıradan insana (tüketiciye) yıkarak kendi devasa suçlarını gizlemeye çalışmaktadır.",
        "questions": [
          {
            "id": "s11-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Bununla birlikte orman yangınları karbondioksit seviyesini azaltır.",
              "Çoğu insan sadece fabrika bacalarının doğayı kirlettiğini düşünse de, aslında her birimizin görünmez bir karbon faturası vardır.",
              "Uzay araştırmaları çok fazla oksijen gerektirmektedir.",
              "Günümüzde bazı otomobiller hiç yakıt tüketmemektedir."
            ],
            "correctOption": 1,
            "explanation": "Bo'shliqdan so'ng odamlarning kundalik ishlari (kiyafet almak, elektrik tüketmek) zarar berishi aytilyapti, shuning uchun 'har birimizning görünmez bir faturamız vardır' gapi mos keladi."
          },
          {
            "id": "s11-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Dahası, tüketilen bu ürünlerin oluşturduğu gazlar, dünyayı tıpkı bir sera gibi sararak gezegenin ısınmasına yol açar.",
              "Plastik şişeler doğada yaklaşık bin yılda çözülmektedir.",
              "Okyanuslardaki plastik kirliliği balıkları zehirlemektedir.",
              "Dünyadaki temiz içme suyu hızla tükenmektedir."
            ],
            "correctOption": 0,
            "explanation": "Karbon ayak izining nimalardan kattalashishi aytilgach, bu gazlarning dunyoga nima qilishi (sera gibi sarıp ısınmasına yol açması) tushuntirilishi kerak."
          },
          {
            "id": "s11-p4-q3",
            "type": "multiple_choice",
            "question": "Karbon Ayak İzi (Carbon Footprint) kavramının en doğru tanımı aşağıdakilerden hangisidir?",
            "options": [
              "İnsanların kumda bıraktığı gerçek ayak izi.",
              "Bir fabrikadan çıkan zehirli sıvı atıklar.",
              "İnsan, kurum veya ülkelerin faaliyetleri sonucu atmosfere salınan toplam sera gazı ve CO2 miktarı.",
              "Kömür madenlerinde çalışan işçilerin bıraktığı izler."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'atmosfere saldığı karbondioksit ve sera gazlarının toplam miktarı' deb aniq ta'rif berilgan."
          },
          {
            "id": "s11-p4-q4",
            "type": "multiple_choice",
            "question": "Metne göre sıradan bir insanın karbon ayak izini artıran etkenlerden biri değildir?",
            "options": [
              "Uzak ülkelerden gelen (taşınan) ürünleri satın almak",
              "Evde çok fazla elektrik tüketmek",
              "Yiyecekleri israf edip çöpe atmak",
              "Ağaç fidanları dikmek"
            ],
            "correctOption": 3,
            "explanation": "Ağaç fidanları dikmek karbon izini küçültür, artırmaz."
          },
          {
            "id": "s11-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'suçlarını yıkmak' (sorumluluğu başkasına yıkmak) deyimi ne anlama gelmektedir?",
            "options": [
              "Bir binayı balyozla yıkıp yok etmek.",
              "Kendi yaptığı hataların bedelini ve sorumluluğunu başkalarına yüklemek.",
              "Birini çok fazla eleştirip ağlatmak.",
              "Çok fazla kıyafet (çamaşır) yıkamak."
            ],
            "correctOption": 1,
            "explanation": "Suçunu birine yıkmak - aybini birovga to'nkash demakdir."
          },
          {
            "id": "s11-p4-q6",
            "type": "cikarim",
            "question": "Eleştirmenlerin petrol şirketlerini suçlama sebebi (iddiası) temel olarak nedir?",
            "options": [
              "Petrol şirketlerinin petrolü çok pahalıya satması.",
              "Şirketlerin doğayı asıl kirleten taraf (asıl suçlu) olmalarına rağmen, 'karbon ayak izi' diyerek suçu sıradan tüketicinin üzerine atmaları.",
              "Şirketlerin geri dönüşüm fabrikalarını kapatması.",
              "Petrol şirketlerinin ormanları tamamen yok etmesi."
            ],
            "correctOption": 1,
            "explanation": "Oxirgi gapda: 'çevresel felaketlerin sorumluluğunu milyarlarca sıradan insana (tüketiciye) yıkarak kendi devasa suçlarını gizlemeye çalışmaktadır' deyilgan."
          }
        ]
      },
      {
        "id": "s11-p5",
        "title": "Celladına Aşık Olmak: Stockholm Sendromu",
        "category": "Psikoloji ve Sosyoloji",
        "level": "C1",
        "content": "Psikolojide bazı terimler tuhaf ve trajik gerçek olaylardan ismini almaktadır. Bunların en ünlüsü olan 'Stockholm Sendromu', ismini 1973 yılında İsveç'in Stockholm kentinde yaşanan bir banka soygunundan almıştır. Dört banka çalışanı, silahlı soyguncular tarafından altı gün boyunca bankanın kasasında rehin (tutsak) tutulmuştur. Ancak polis operasyon yapıp rehineleri kurtardığında beklenmedik bir şey oldu. Rehineler, kendilerini kaçıranlara karşı öfke duymak yerine polise direnmiş, hapse giren soyguncuları savunmuş ve hatta onların avukat masraflarını bile ödemiştir. Psikologlara göre bu anlaşılması zor durum; aşırı korku, çaresizlik ve ölüm tehdidi altında kalan kurbanın, kendisini rehin alan kişiye bağlanmasıdır. Kurban, saldırganın gösterdiği en ufak bir merhameti (örneğin su vermesi veya o gün öldürmemesi) büyük bir lütuf gibi algılayarak ona minnet duymaya başlar. Günümüzde bu terim sadece banka soygunları için değil; aile içi şiddet, baskıcı rejimler ve zehirli (toksik) ilişkilerde kurbanın, kendisine zarar veren kişiden kopamaması durumunu açıklamak için de kullanılmaktadır.",
        "questions": [
          {
            "id": "s11-p5-q1",
            "type": "ana_fikir",
            "question": "Metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Banka soyguncuları genellikle çok iyi insanlardır.",
              "Kurbanın, aşırı çaresizlik ve korku durumunda hayatta kalma içgüdüsüyle kendisini esir alan (zarar veren) kişiye duygusal olarak bağlanmasıdır.",
              "Stockholm şehri dünyadaki en tehlikeli şehirdir.",
              "Aile içi şiddetin temel sebebi maddi imkansızlıklardır."
            ],
            "correctOption": 1,
            "explanation": "Stockholm Sendromunun tanımı ve kurbanın saldırgana bağlanması anlatılmaktadır."
          },
          {
            "id": "s11-p5-q2",
            "type": "multiple_choice",
            "question": "Stockholm'deki banka soygununda psikologları şaşırtan olay (beklenmedik şey) ne olmuştur?",
            "options": [
              "Soyguncuların tüm parayı bankada bırakıp kaçması.",
              "Polisin soyguncuları yakalayamaması.",
              "Rehinelerin, kendilerini esir alan soyguncuları savunması ve avukat paralarını ödemesi.",
              "Rehinelerin kasadaki paraları gizlice çalması."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'Rehineler, polise direnmiş, soyguncuları savunmuş ve avukat masraflarını bile ödemiştir' deyilgan."
          },
          {
            "id": "s11-p5-q3",
            "type": "multiple_choice",
            "question": "Psikologlara göre Stockholm Sendromunun ortaya çıkmasının temel sebebi nedir?",
            "options": [
              "Soyguncuların çok yakışıklı olması.",
              "Kurbanın aşırı korku ve çaresizlik (ölüm tehdidi) altında saldırganın ufak bir iyiliğini merhamet olarak algılaması.",
              "Rehinelerin polisi hiç sevmemesi.",
              "Kurbanların akıl hastası olması."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'aşırı korku, çaresizlik... en ufak bir merhameti büyük bir lütuf gibi algılayarak ona minnet duymaya başlar' yozilgan."
          },
          {
            "id": "s11-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'lütuf' kelimesi hangi anlama gelmektedir?",
            "options": [
              "Ceza veya kötülük.",
              "Karşılık beklemeden yapılan çok büyük iyilik veya bağış.",
              "Silahlı saldırı.",
              "Gereksiz ve boş konuşma."
            ],
            "correctOption": 1,
            "explanation": "Lütuf (arabchadan) - iltifot, katta marhamat, ehson ma'nolarini anglatadi."
          },
          {
            "id": "s11-p5-q5",
            "type": "cikarim",
            "question": "Metinden yola çıkarak aşağıdakilerden hangisi Stockholm Sendromu'na bir örnek olabilir?",
            "options": [
              "Bir çalışanın patronundan nefret edip işten ayrılması.",
              "Sürekli eşinden şiddet gören bir kadının, 'aslında o iyi biri' diyerek eşini terk edememesi ve onu polise şikayet etmekten kaçınması.",
              "Bir hırsızın hapishaneden kaçmayı başarması.",
              "Bir öğrencinin sınav stresi yüzünden uyuyamaması."
            ],
            "correctOption": 1,
            "explanation": "Matn oxirida bu termin aile içi şiddet va toksik ilişkilerde qurbonning o'ziga zarar berganga bog'lanishida ishlatilishi aytilgan."
          },
          {
            "id": "s11-p5-q6",
            "type": "multiple_choice",
            "question": "Yazara göre saldırganın kurbana sadece bir bardak su vermesi kurban tarafından nasıl yorumlanmaktadır?",
            "options": [
              "Çok normal bir hareket olarak.",
              "Saldırganın korktuğunun bir kanıtı olarak.",
              "Ölüm tehdidi altındayken yapıldığı için çok büyük bir merhamet ve iyilik olarak.",
              "Saldırganın suyla kurbanı zehirlemeye çalıştığı şüphesiyle."
            ],
            "correctOption": 2,
            "explanation": "'saldırganın gösterdiği en ufak bir merhameti (örneğin su vermesi...) büyük bir lütuf gibi algılayarak...' deyilgan."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-12",
    "sectionNumber": 12,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_12.json",
    "passages": [
      {
        "id": "s12-p1",
        "title": "Bahar Sitesi Apartman Yaşam Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli site sakinleri, huzurlu ve temiz bir ortamda yaşamak için aşağıdaki kurallara uyulması zorunludur:\n1. Gürültü Yönetmeliği gereği, akşam saat 22:00'den sabah 08:00'e kadar yüksek sesle müzik dinlemek, matkap çalıştırmak veya gürültülü ev işleri yapmak yasaktır.\n2. Çöpler, her akşam 19:00 ile 20:00 saatleri arasında kapı önüne, ağzı sıkıca bağlanmış poşetler içinde bırakılmalıdır. Bu saatler dışında kapı önüne çöp konulamaz.\n3. Balkonlardan halı, kilim veya masa örtüsü silkelemek çevre temizliğini bozduğu için kesinlikle yasaktır.\n4. Site bahçesine veya otoparka evcil hayvanların tuvaletini yapmasına izin verilmemelidir. Evcil hayvanlar sadece site dışındaki park alanında gezdirilmelidir.\n5. Otoparkta her daire için ayrılmış numaralı alanlar vardır. Lütfen sadece kendi numaranızın bulunduğu alana aracınızı park ediniz.",
        "questions": [
          {
            "id": "s12-p1-q1",
            "type": "multiple_choice",
            "question": "Bir site sakini akşam saat 23:00'te hangi eylemi yapamaz?",
            "options": [
              "Kitap okumak",
              "Matkap çalıştırıp duvara çivi çakmak",
              "Televizyonu sessizce izlemek",
              "Uyuyup dinlenmek"
            ],
            "correctOption": 1,
            "explanation": "22:00'den sonra matkap çalıştırmak veya gürültülü ev işleri yapmak yasaktır."
          },
          {
            "id": "s12-p1-q2",
            "type": "multiple_choice",
            "question": "Çöpler hangi saat aralığında kapı önüne bırakılmalıdır?",
            "options": [
              "Sabah 08:00 - 09:00",
              "Öğlen 12:00 - 13:00",
              "Akşam 19:00 - 20:00",
              "İstenilen her an bırakılabilir"
            ],
            "correctOption": 2,
            "explanation": "Çöpler her akşam 19:00 ile 20:00 saatleri arasında bırakılmalıdır."
          },
          {
            "id": "s12-p1-q3",
            "type": "multiple_choice",
            "question": "Balkonlardan halı veya örtü silkelemenin yasak olma sebebi nedir?",
            "options": [
              "Halıların renginin solması",
              "Çevre temizliğini bozması ve alt komşuları rahatsız etmesi",
              "Halıların çok ağır olması",
              "Gürültüye neden olması"
            ],
            "correctOption": 1,
            "explanation": "Çevre temizliğini bozduğu için kesinlikle yasaktır."
          },
          {
            "id": "s12-p1-q4",
            "type": "multiple_choice",
            "question": "Köpeği olan bir site sakini onu nerede gezdirmelidir?",
            "options": [
              "Site bahçesinde",
              "Kendi balkonunda",
              "Otoparkın içinde",
              "Site dışındaki park alanında"
            ],
            "correctOption": 3,
            "explanation": "Evcil hayvanlar sadece site dışındaki park alanında gezdirilmelidir."
          },
          {
            "id": "s12-p1-q5",
            "type": "multiple_choice",
            "question": "Araç park yeri ile ilgili kural nedir?",
            "options": [
              "Erken gelen istediği yere park edebilir.",
              "Herkes sadece kendi dairesine ayrılmış numaralı alana park etmelidir.",
              "Otopark sadece misafirler içindir.",
              "Araçlar bahçeye park edilmelidir."
            ],
            "correctOption": 1,
            "explanation": "Lütfen sadece kendi numaranızın bulunduğu alana aracınızı park ediniz."
          },
          {
            "id": "s12-p1-q6",
            "type": "multiple_choice",
            "question": "Bu kuralların konulmasındaki temel amaç nedir?",
            "options": [
              "Apartman aidatlarını yükseltmek",
              "Güvenlik kameralarını test etmek",
              "Komşular arasında huzurlu ve temiz bir yaşam ortamı sağlamak",
              "Site yönetiminin gücünü göstermek"
            ],
            "correctOption": 2,
            "explanation": "Huzurlu ve temiz bir ortamda yaşamak için bu kurallar konulmuştur."
          }
        ]
      },
      {
        "id": "s12-p2",
        "title": "İşe Gitme Yöntemleri (Ulaşım Tercihleri)",
        "category": "Sosyal Yaşam / Eşleştirme",
        "level": "B1",
        "content": "A) Onur: Benim evim iş yerime yaklaşık 15 kilometre uzaklıkta. Her sabah kendi aracımla yola çıkıyorum. İstanbul trafiği bazen çok bunaltıcı olsa da, kendi müziklerimi dinleyerek, rahat koltuğumda kimseye temas etmeden seyahat etmek bana daha cazip geliyor.\n\nB) Aylin: Ben tam bir çevreciyim! İşe giderken hiçbir şekilde karbon emisyonu (egzoz gazı) üretmek istemiyorum. Her gün 5 kilometre pedal çevirerek bisikletimle işe gidiyorum. Bu sayede hem spor yapmış oluyorum hem de doğayı koruyorum.\n\nC) Murat: Ben toplu taşımanın gücüne inanıyorum. İş yerime gitmek için her gün metroyu kullanıyorum. Metro yer altından gittiği için trafiğe hiç takılmıyorum. Kulaklığımı takıp, kitabımı okuyarak tam 30 dakikada ofisime varıyorum.\n\nD) Elif: Şanslıyım ki evim iş yerime sadece iki sokak uzaklıkta. Bu yüzden hiçbir araç kullanmıyorum. Her sabah temiz havayı içime çekerek 10 dakika tempolu yürüyüş yapıyorum. Yol üstündeki fırından simidimi alıp ofise taze bir başlangıç yapıyorum.",
        "questions": [
          {
            "id": "s12-p2-q1",
            "type": "matching_paragraph",
            "question": "Hangi kişi ulaşımda çevre dostu (egzoz gazı çıkarmayan) bir araç kullanmayı ve fiziksel aktivite yapmayı tercih etmektedir?",
            "options": [
              "A) Onur",
              "B) Aylin",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 1,
            "explanation": "Aylin çevreci olduğunu ve bisikletle pedal çevirerek işe gittiğini belirtmiştir."
          },
          {
            "id": "s12-p2-q2",
            "type": "matching_paragraph",
            "question": "Trafik sıkışıklığı yaşamamak için yer altı ulaşım ağını (toplu taşımayı) kullanan kişi kimdir?",
            "options": [
              "A) Onur",
              "B) Aylin",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 2,
            "explanation": "Murat metroyu kullandığı için trafiğe takılmadığını söylemiştir."
          },
          {
            "id": "s12-p2-q3",
            "type": "matching_paragraph",
            "question": "Konfor alanından çıkmadan, kalabalıktan uzak (izole) bir şekilde işe gitmeyi seven kişi kimdir?",
            "options": [
              "A) Onur",
              "B) Aylin",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 0,
            "explanation": "Onur kendi arabasıyla, rahat koltuğunda kimseye temas etmeden seyahat ettiğini ifade etmiştir."
          },
          {
            "id": "s12-p2-q4",
            "type": "matching_paragraph",
            "question": "İş yeri çok yakın olduğu için hiçbir araca ihtiyaç duymayan kişi kimdir?",
            "options": [
              "A) Onur",
              "B) Aylin",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 3,
            "explanation": "Elif evi çok yakın olduğu için yürüyüş yaptığını belirtmiştir."
          },
          {
            "id": "s12-p2-q5",
            "type": "matching_paragraph",
            "question": "Yolculuk sırasında kitap okuyarak zamanını değerlendiren kişi kimdir?",
            "options": [
              "A) Onur",
              "B) Aylin",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 2,
            "explanation": "Murat metroda kitabını okuyarak ofisine vardığını söylemiştir."
          },
          {
            "id": "s12-p2-q6",
            "type": "matching_paragraph",
            "question": "Trafikte sıkışıp kalmasına rağmen özel aracından vazgeçmeyen kişi kimdir?",
            "options": [
              "A) Onur",
              "B) Aylin",
              "C) Murat",
              "D) Elif"
            ],
            "correctOption": 0,
            "explanation": "Onur trafik bunaltıcı olsa da kendi aracıyla gitmeyi cazip bulmaktadır."
          }
        ]
      },
      {
        "id": "s12-p3",
        "title": "Toprağın Ateşle Dansı: Çini Sanatı",
        "category": "Kültür ve Sanat",
        "level": "B2",
        "content": "Anadolu'nun en köklü ve renkli el sanatlarından biri olan çinicilik, toprağa şekil verilip fırınlanması ve ardından renkli motiflerle süslenmesi işlemidir. Kökeni Karahanlılar ve Büyük Selçuklulara kadar uzanan bu sanat, Osmanlı döneminde özellikle İznik ve Kütahya'da altın çağını yaşamıştır. İznik çinilerinin en büyük özelliği, üretiminde yüksek oranda kuvars madeni kullanılmasıdır. Kuvars, çiniye cam gibi parlak bir görünüm kazandırır ve yüzyıllar geçse bile renklerin solmamasını (canlı kalmasını) sağlar. Çinilerde genellikle lale, karanfil, gül gibi bitkisel motifler ve geometrik desenler kullanılır. Sultanahmet Camii, iç duvarlarını süsleyen 20 binden fazla mavi çini nedeniyle Avrupalılar tarafından 'Blue Mosque' (Mavi Cami) olarak adlandırılır. Günümüzde UNESCO tarafından koruma altına alınan çini sanatı, usta-çırak ilişkisiyle nesilden nesile aktarılmaya devam etmektedir.",
        "questions": [
          {
            "id": "s12-p3-q1",
            "type": "true_false_not_given",
            "question": "Çini sanatı sadece Osmanlı Devleti döneminde ortaya çıkmış bir el sanatıdır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Kökeni Karahanlılar ve Büyük Selçuklulara kadar uzandığı belirtilmiştir."
          },
          {
            "id": "s12-p3-q2",
            "type": "true_false_not_given",
            "question": "İznik çinilerinin parlaklığını ve kalıcılığını sağlayan temel madde kuvarstır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'Kuvars, çiniye cam gibi parlak bir görünüm kazandırır... renklerin solmamasını sağlar' denilmiştir."
          },
          {
            "id": "s12-p3-q3",
            "type": "true_false_not_given",
            "question": "Çini motiflerinde insan ve hayvan figürleri (yüzleri) çok sık kullanılmaktadır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'genellikle lale, karanfil, gül gibi bitkisel motifler ve geometrik desenler kullanılır' deyilgan."
          },
          {
            "id": "s12-p3-q4",
            "type": "true_false_not_given",
            "question": "Sultanahmet Camii'nin 'Mavi Cami' olarak bilinmesinin sebebi, dış cephesinin tamamen maviye boyanmış olmasıdır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Dış cephe değil, 'iç duvarlarını süsleyen 20 binden fazla mavi çini nedeniyle' bu ismi almıştır."
          },
          {
            "id": "s12-p3-q5",
            "type": "true_false_not_given",
            "question": "Günümüzde çini sanatını öğrenmek isteyenler için Türkiye'nin her şehrinde ücretsiz kurslar vardır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Bepul kurslar haqida hech qanday ma'lumot berilmagan."
          },
          {
            "id": "s12-p3-q6",
            "type": "true_false_not_given",
            "question": "Çini sanatı, günümüzde geleneksel yöntemlerle ustadan çırağa aktarılarak yaşatılmaktadır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'usta-çırak ilişkisiyle nesilden nesile aktarılmaya devam etmektedir' ifadesi yer alır."
          }
        ]
      },
      {
        "id": "s12-p4",
        "title": "Dijital İkiz (Digital Twin) Teknolojisi",
        "category": "Teknoloji ve Gelecek",
        "level": "C1",
        "content": "Nesnelerin İnterneti (IoT) ve yapay zekanın birleşmesiyle ortaya çıkan 'Dijital İkiz' (Digital Twin) kavramı, endüstriyel üretimi kökünden değiştirmektedir. Dijital ikiz, fiziksel bir ürünün, makinenin veya koca bir fabrikanın sanal ortamdaki birebir kopyasıdır. [ 1 ]. Üzerindeki binlerce sensörden veri alan uçak motoru, sanal ortamdaki ikizine sürekli canlı bilgi gönderir. Mühendisler, fiziksel motora hiç dokunmadan sanal kopya üzerinde testler yapar, arızaları önceden tahmin eder ve motorun ne zaman bakıma gireceğini kesin olarak hesaplar. [ 2 ]. Şehir planlamacıları, bir şehrin dijital ikizini yaratarak yeni yapılacak bir otoyolun trafiği veya rüzgar akışını nasıl etkileyeceğini yıllar öncesinden simüle edebilmektedir. Bu teknoloji, deneme-yanılma maliyetlerini ortadan kaldırarak şirketlere milyarlarca dolar tasarruf sağlamaktadır.",
        "questions": [
          {
            "id": "s12-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Bunu daha iyi anlamak için uçuş halindeki bir yolcu uçağının motorunu hayal edelim.",
              "Günümüzde bilgisayar oyunları tamamen sanal gerçeklik gözlükleriyle oynanmaktadır.",
              "Ancak bu kopyaların bilgisayarlarda saklanması çok fazla hafıza gerektirir.",
              "İnsanların da sosyal medyada dijital ikizleri bulunmaktadır."
            ],
            "correctOption": 0,
            "explanation": "Bo'shliqdan keyin 'uçak motoru' haqida misol keltirilgan. Demak, tushunish uchun samolyot motorini tasavvur qilaylik degan jumla mos tushadi."
          },
          {
            "id": "s12-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Uçaklar okyanus üzerinde uçarken çok fazla yakıt tüketirler.",
              "Ancak dijital ikiz teknolojisi sadece endüstriyel makinelerle sınırlı değildir; koca şehirlerin yönetimine bile uygulanmaktadır.",
              "Pilotlar bu simülasyonları kullanarak uçak kullanmayı öğrenirler.",
              "Sanal motorun çalışması için gerçek motorun tamamen kapatılması gerekir."
            ],
            "correctOption": 1,
            "explanation": "Keyingi gapda shahar rejalashtiruvchilari (şehir planlamacıları) haqida, ya'ni shaharlarni boshqarish haqida gapirilgan. Bu moslashuvni talab qiladi."
          },
          {
            "id": "s12-p4-q3",
            "type": "multiple_choice",
            "question": "Dijital ikiz teknolojisinin mühendislere sağladığı en büyük kolaylık nedir?",
            "options": [
              "Fiziksel ürüne (makineye) hiç dokunmadan, gerçek zamanlı verilerle sanal testler ve arıza tahminleri yapabilmeleri.",
              "Fabrikalarda işçi çalıştırmalarına gerek kalmaması.",
              "Uçak motorlarını sadece bilgisayar programlarıyla üretebilmeleri.",
              "Kullanılmış makineleri sıfır makineler gibi satabilmeleri."
            ],
            "correctOption": 0,
            "explanation": "Fiziksel motora hiç dokunmadan sanal kopya üzerinde testler yapar, arızaları önceden tahmin eder."
          },
          {
            "id": "s12-p4-q4",
            "type": "multiple_choice",
            "question": "Şehir planlamacıları dijital ikiz teknolojisini ne amaçla kullanmaktadır?",
            "options": [
              "Yeni evler inşa edip satmak için.",
              "Hava durumunu değiştirip yağmur yağdırmak için.",
              "Yeni yapılacak projelerin (otoyol vb.) şehrin trafiğini veya rüzgarını nasıl etkileyeceğini önceden simüle etmek (denemek) için.",
              "Vatandaşların internet kullanımını sınırlandırmak için."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'yeni yapılacak bir otoyolun trafiği veya rüzgar akışını nasıl etkileyeceğini yıllar öncesinden simüle edebilmektedir' deb yozilgan."
          },
          {
            "id": "s12-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'simüle etmek' kelimesi hangi anlama gelmektedir?",
            "options": [
              "Bir şeyin gerçeğine benzeyen yapay (sanal) bir modelini oluşturup onu taklit ederek çalıştırmak.",
              "Bir problemi tamamen çözüp yok etmek.",
              "Gizlice izlemek ve dinlemek.",
              "Bir cihazın elektriğini kesmek."
            ],
            "correctOption": 0,
            "explanation": "Simülasyon (simüle etmek) biror narsaning haqiqiy hayotdagi nusxasini virtual tarzda taklit qilishdir."
          },
          {
            "id": "s12-p4-q6",
            "type": "cikarim",
            "question": "Metne göre bu teknolojinin şirketlere milyarlarca dolar tasarruf sağlamasının asıl sebebi nedir?",
            "options": [
              "Mühendis maaşlarının düşürülmesi.",
              "Gerçek hayatta pahalıya mal olacak fiziksel deneme-yanılma süreçlerinin ve beklenmedik arızaların sanal ortamda bedavaya tespit edilmesi.",
              "Vergilerin dijital şirketlerden alınmaması.",
              "Bilgisayarların hiç elektrik harcamadan çalışması."
            ],
            "correctOption": 1,
            "explanation": "Matn oxirida 'deneme-yanılma maliyetlerini ortadan kaldırarak şirketlere tasarruf sağlamaktadır' deyilgan."
          }
        ]
      },
      {
        "id": "s12-p5",
        "title": "Kafesteki Zihin: Öğrenilmiş Çaresizlik",
        "category": "Psikoloji",
        "level": "C1",
        "content": "Hayatınızda ne kadar çabalarsanız çabalayın bazı şeyleri asla değiştiremeyeceğinize inanıp pes ettiğiniz oldu mu? Psikolojide bu duruma 'Öğrenilmiş Çaresizlik' (Learned Helplessness) adı verilir. Amerikalı psikolog Martin Seligman, 1960'larda köpekler üzerinde yaptığı deneylerle bu kavramı literatüre kazandırmıştır. Deneyin ilk aşamasında köpeklere hafif elektrik şokları verilmiş ve bir grup köpeğe bu şoktan kaçma şansı tanınmazken, diğer gruba düğmeye basarak şoku durdurma imkanı verilmiştir. İkinci aşamada ise tüm köpekler, ortasında kısa bir engel bulunan yeni bir kafese alınmıştır. Şoku düğmeyle durdurmayı öğrenen köpekler, engel üzerinden atlayarak hemen kurtulurken; ilk aşamada çaresiz kalan köpekler, kaçma imkanları olmasına rağmen sadece yere yatıp şoku kabullenmişlerdir. Çünkü geçmişte ne yaparlarsa yapsınlar acıyı durduramadıklarını 'öğrenmişler' ve umutlarını kaybetmişlerdir. İnsanlarda da başarısızlıklar üst üste geldiğinde ortaya çıkan bu sendrom, klinik depresyonun en temel sebeplerinden biridir.",
        "questions": [
          {
            "id": "s12-p5-q1",
            "type": "ana_fikir",
            "question": "Bu metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Hayvanlar üzerinde deney yapmak etik olarak tamamen yanlıştır.",
              "Sürekli başarısızlık veya çaresizlik yaşayan canlılar (ve insanlar), zamanla durumu kabullenip ellerine fırsat geçse bile mücadele etmeyi bırakırlar.",
              "Köpekler dünyanın en zeki ve eğitilebilir hayvanlarıdır.",
              "Depresyon sadece ilaç kullanılarak tedavi edilebilen fiziksel bir hastalıktır."
            ],
            "correctOption": 1,
            "explanation": "Asosiy e'tibor 'Öğrenilmiş Çaresizlik' tushunchasiga va umidni yo'qotib, harakatdan to'xtashga (pes etish) qaratilgan."
          },
          {
            "id": "s12-p5-q2",
            "type": "multiple_choice",
            "question": "Seligman'ın deneyinde, ilk aşamada kaçma şansı verilmeyen köpekler ikinci aşamada nasıl davranmıştır?",
            "options": [
              "Engelin üzerinden atlayarak hızla kaçmışlardır.",
              "Araştırmacılara saldırarak deneyden kurtulmuşlardır.",
              "Kafesteki kısa engeli aşabilecekleri halde kaçmamış, yere yatıp acıyı (şoku) kabullenmişlerdir.",
              "Düğmeye basarak şoku kapatmışlardır."
            ],
            "correctOption": 2,
            "explanation": "İlk aşamada çaresiz kalan köpekler, kaçma imkanları olmasına rağmen sadece yere yatıp şoku kabullenmişlerdir."
          },
          {
            "id": "s12-p5-q3",
            "type": "multiple_choice",
            "question": "Çaresiz kalan köpeklerin ikinci aşamada engel atlamayı denememesinin asıl sebebi nedir?",
            "options": [
              "Fiziksel olarak çok yorulmuş ve hastalanmış olmaları.",
              "Geçmiş tecrübelerinden dolayı 'ne yaparsam yapayım sonucu değiştiremem' inancını zihinlerine yerleştirmiş (öğrenmiş) olmaları.",
              "Engelin atlanamayacak kadar yüksek olması.",
              "Elektrik şokunu sevmeye başlamaları."
            ],
            "correctOption": 1,
            "explanation": "Geçmişte ne yaparlarsa yapsınlar acıyı durduramadıklarını 'öğrenmişler' ve umutlarını kaybetmişlerdir."
          },
          {
            "id": "s12-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'pes etmek' deyimi hangi anlamda kullanılmıştır?",
            "options": [
              "Bir konuda yenilgiyi kabul edip, çaba göstermekten (mücadeleden) vazgeçmek.",
              "Birine fiziksel olarak saldırmak.",
              "Bir işi en mükemmel şekilde bitirmek.",
              "Sürekli şikayet ederek başkalarını suçlamak."
            ],
            "correctOption": 0,
            "explanation": "Pes etmek - taslim bo'lish, voz kechish degani."
          },
          {
            "id": "s12-p5-q5",
            "type": "multiple_choice",
            "question": "Yazara göre öğrenilmiş çaresizlik sendromu insan hayatında hangi ciddi sağlık sorununa yol açmaktadır?",
            "options": [
              "Kalp krizine",
              "Klinik depresyona",
              "Görme kaybına",
              "Uyurgezerliğe"
            ],
            "correctOption": 1,
            "explanation": "Metnin sonunda 'klinik depresyonun en temel sebeplerinden biridir' denilmiştir."
          },
          {
            "id": "s12-p5-q6",
            "type": "cikarim",
            "question": "Bu metinden (Öğrenilmiş Çaresizlik teorisinden) yola çıkarak aşağıdaki insan davranışlarından hangisi açıklanabilir?",
            "options": [
              "Bir öğrencinin sınavdan yüksek not alınca çok sevinip arkadaşlarına kutlama yemeği ısmarlaması.",
              "Matematik sınavından üç kez üst üste zayıf (kötü) not alan bir öğrencinin, 'Ne kadar çalışırsam çalışayım matematiği yapamıyorum' diyerek ders çalışmayı tamamen bırakması.",
              "Bir çalışanın patronundan zam isteyip hemen kabul edilmesi.",
              "Bir sporcunun maçı kazandıktan sonra antrenmanlarını artırması."
            ],
            "correctOption": 1,
            "explanation": "Muvaffaqiyatsizlik ketma-ket kelgach, 'baribir eplay olmayman' deb harakatni to'xtatish — o'rganilgan nochorlikning aniq misolidir."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-13",
    "sectionNumber": 13,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_13.json",
    "passages": [
      {
        "id": "s13-p1",
        "title": "Hızlı Tren (YHT) Seyahat Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli yolcularımız, Yüksek Hızlı Tren'de (YHT) konforlu bir yolculuk için aşağıdaki kurallara dikkat etmenizi rica ederiz:\n1. Bilet kontrolleri peron girişinde yapılacağı için trenin kalkış saatinden en az 15 dakika önce istasyonda bulunmanız gerekmektedir.\n2. Yanınıza en fazla 1 adet büyük boy valiz ve 1 adet el çantası alabilirsiniz. Fazla bagajlar için ekstra ücret ödenmesi zorunludur.\n3. Seyahat sırasında vagonlarda yüksek sesle telefonla konuşmak, diğer yolcuları rahatsız etmemek adına yasaktır.\n4. Kafeterya vagonu hariç, yolcu koltuklarında kokulu sıcak yemek (örneğin döner, kebap) yenilmesine izin verilmez.\n5. Evcil hayvanlar (kedi, köpek vb.) ancak özel taşıma çantalarında ve bilet alınması şartıyla tren içine kabul edilmektedir.\nİyi yolculuklar dileriz.",
        "questions": [
          {
            "id": "s13-p1-q1",
            "type": "multiple_choice",
            "question": "Yolcular trenin kalkışından ne kadar süre önce istasyonda olmalıdır?",
            "options": [
              "1 saat önce",
              "Yarım saat (30 dakika) önce",
              "En az 15 dakika önce",
              "Sadece 5 dakika önce"
            ],
            "correctOption": 2,
            "explanation": "Kalkış saatinden en az 15 dakika önce istasyonda bulunmanız gerekmektedir."
          },
          {
            "id": "s13-p1-q2",
            "type": "multiple_choice",
            "question": "Yanında 2 adet büyük boy valiz olan bir yolcu ne yapmak zorundadır?",
            "options": [
              "Valizlerden birini çöpe atmalıdır.",
              "Fazla bagaj için ekstra ücret (para) ödemelidir.",
              "İkinci valizi başka bir vagona koymalıdır.",
              "Sadece ayakta yolculuk edebilir."
            ],
            "correctOption": 1,
            "explanation": "En fazla 1 adet büyük boy valiz hakkı vardır, fazlası için ekstra ücret ödenmesi zorunludur."
          },
          {
            "id": "s13-p1-q3",
            "type": "multiple_choice",
            "question": "Tren yolculuğunda nerede kokulu sıcak yemek (döner vb.) yenilebilir?",
            "options": [
              "Kendi koltuğunda",
              "Trenin tuvaletinde",
              "Sadece kafeterya vagonunda",
              "Yolcu vagonunun koridorunda"
            ],
            "correctOption": 2,
            "explanation": "Kafeterya vagonu hariç, yolcu koltuklarında kokulu sıcak yemek yenilmesine izin verilmez."
          },
          {
            "id": "s13-p1-q4",
            "type": "multiple_choice",
            "question": "Kedisi ile yolculuk yapmak isteyen bir kişi hangi kurala uymak zorundadır?",
            "options": [
              "Kedisini kucağında taşımalıdır.",
              "Kediyi kafeteryada bırakmalıdır.",
              "Özel taşıma çantasında bulundurmalı ve hayvan için de bilet almalıdır.",
              "Evcil hayvanların trene binmesi tamamen yasaktır."
            ],
            "correctOption": 2,
            "explanation": "Evcil hayvanlar ancak özel taşıma çantalarında ve bilet alınması şartıyla kabul edilmektedir."
          },
          {
            "id": "s13-p1-q5",
            "type": "multiple_choice",
            "question": "Trende yüksek sesle telefonla konuşmanın yasaklanma sebebi nedir?",
            "options": [
              "Trenin elektronik sistemini bozması.",
              "Diğer yolcuları rahatsız etmesi.",
              "Sürücünün dikkatini dağıtması.",
              "Telefonda sinyal (şebeke) olmaması."
            ],
            "correctOption": 1,
            "explanation": "Diğer yolcuları rahatsız etmemek adına yasaktır."
          },
          {
            "id": "s13-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin temel amacı nedir?",
            "options": [
              "Bilet fiyatlarındaki zammı açıklamak",
              "Tren istasyonunun adresini vermek",
              "Yolcuları seyahat kuralları hakkında uyarmak",
              "Kafeterya menüsünü tanıtmak"
            ],
            "correctOption": 2,
            "explanation": "Metin, yolcuları kurallar (bagaj, hayvan, sessizlik vb.) hakkında uyarmak için yazılmıştır."
          }
        ]
      },
      {
        "id": "s13-p2",
        "title": "Farklı Müzik Türleri ve Etkileri",
        "category": "Kültür / Eşleştirme",
        "level": "B1",
        "content": "A) Deniz: Ben Klasik Müzik dinlemeden günümü geçiremem. Mozart ve Beethoven favorim. Özellikle ders çalışırken veya karmaşık bir işe odaklanmam gerektiğinde, sözsüz enstrümantal müzikler beynimi dinlendiriyor ve dikkatimi toplamama inanılmaz yardımcı oluyor.\n\nB) Can: Rock ve Heavy Metal benim vazgeçilmezim! Elektro gitar soloları ve baterinin güçlü ritimleri içimdeki enerjiyi dışa vurmama sağlıyor. Özellikle spor yaparken veya canım bir şeye çok sıkkınken bu sert müzikleri dinleyerek stres atıyorum.\n\nC) Zeynep: Benim ruhum Caz (Jazz) müziğine ait. Saksafon ve piyanonun o tahmin edilemez, doğaçlama (improvize) ritimleri bana özgürlüğü hissettiriyor. Akşamları kahvemi alıp loş bir ışıkta caz dinlemek, bütün günün yorgunluğunu siliyorum.\n\nD) Emre: Ben Pop ve Elektronik müzik seviyorum. Şarkıların sözlerinden ziyade, enerjik altyapısı ve akılda kalıcı basit melodileri beni cezbediyor. Arabada giderken şarkılara bağıra bağıra eşlik etmeyi ve arkadaşlarımla dans etmeyi çok seviyorum.",
        "questions": [
          {
            "id": "s13-p2-q1",
            "type": "matching_paragraph",
            "question": "Hangi kişi müziği dikkat gerektiren (ders çalışma vb.) zihinsel aktiviteler sırasında bir odaklanma aracı olarak kullanmaktadır?",
            "options": [
              "A) Deniz",
              "B) Can",
              "C) Zeynep",
              "D) Emre"
            ],
            "correctOption": 0,
            "explanation": "Deniz klasik müziğin dikkatini toplamasına yardımcı olduğunu belirtmiştir."
          },
          {
            "id": "s13-p2-q2",
            "type": "matching_paragraph",
            "question": "Elektro gitar ve bateri gibi enstrümanların sert (güçlü) ritimleriyle stres atan kişi kimdir?",
            "options": [
              "A) Deniz",
              "B) Can",
              "C) Zeynep",
              "D) Emre"
            ],
            "correctOption": 1,
            "explanation": "Can, Rock ve Metal müzikle (elektro gitar/bateri) stres attığını söylemiştir."
          },
          {
            "id": "s13-p2-q3",
            "type": "matching_paragraph",
            "question": "Müziğin kurallara bağlı kalmayan, doğaçlama (anlık yaratılan) yapısından hoşlanan kişi kimdir?",
            "options": [
              "A) Deniz",
              "B) Can",
              "C) Zeynep",
              "D) Emre"
            ],
            "correctOption": 2,
            "explanation": "Zeynep, caz müziğindeki tahmin edilemez, doğaçlama ritimleri sevdiğini belirtmiştir."
          },
          {
            "id": "s13-p2-q4",
            "type": "matching_paragraph",
            "question": "Müzikteki derin anlamlar veya sözler yerine, eğlenceli ritimlere ve dans etmeye odaklanan kişi kimdir?",
            "options": [
              "A) Deniz",
              "B) Can",
              "C) Zeynep",
              "D) Emre"
            ],
            "correctOption": 3,
            "explanation": "Emre pop müzikteki akılda kalıcı melodileri ve dans etmeyi sevdiğini ifade etmiştir."
          },
          {
            "id": "s13-p2-q5",
            "type": "matching_paragraph",
            "question": "Günün yorgunluğunu sakin bir ortamda (loş ışıkta) saksafon dinleyerek atan kişi kimdir?",
            "options": [
              "A) Deniz",
              "B) Can",
              "C) Zeynep",
              "D) Emre"
            ],
            "correctOption": 2,
            "explanation": "Zeynep akşamları kahvesiyle loş ışıkta caz (saksafon) dinlediğini söylemiştir."
          },
          {
            "id": "s13-p2-q6",
            "type": "matching_paragraph",
            "question": "Fiziksel antrenman (spor) yaparken yüksek enerjili müziklere ihtiyaç duyan kişi kimdir?",
            "options": [
              "A) Deniz",
              "B) Can",
              "C) Zeynep",
              "D) Emre"
            ],
            "correctOption": 1,
            "explanation": "Can spor yaparken bu sert müzikleri dinleyerek stres attığını belirtmiştir."
          }
        ]
      },
      {
        "id": "s13-p3",
        "title": "Tarihin İlk Barış İmparası: Kadeş Antlaşması",
        "category": "Tarih ve Kültür",
        "level": "B2",
        "content": "Tarihin en eski ve en büyük imparatorluklarından ikisi olan Mısır ve Hititler, M.Ö. 13. yüzyılda bugünkü Suriye topraklarına (Kuzey Suriye) hakim olmak için büyük bir savaşa tutuştular. Kadeş Savaşı adıyla bilinen bu kanlı mücadelede, dönemin en gelişmiş savaş arabaları (atlı arabalar) kullanıldı. İki taraf da birbirine tam bir üstünlük sağlayamayınca, M.Ö. 1259 yılında aralarında 'Kadeş Antlaşması' imzalandı. Bu antlaşmanın tarihteki en büyük önemi, insanlık tarihinin bilinen ve metni günümüze ulaşan ilk 'yazılı ve eşit şartlı' barış antlaşması olmasıdır. Antlaşma metni gümüş tabletlere çivi yazısı ile (Akadca dilinde) yazılmıştır. Metinde sadece savaşı bitirme kararı değil, aynı zamanda tarafların dışarıdan gelecek bir saldırıda birbirlerine yardım (ittifak) sözü verdikleri de açıkça görülmektedir. Orijinali İstanbul Arkeoloji Müzesi'nde sergilenen kil tabletin devasa bir kopyası, barışın sembolü olarak günümüzde New York'taki Birleşmiş Milletler binasının duvarını süslemektedir.",
        "questions": [
          {
            "id": "s13-p3-q1",
            "type": "true_false_not_given",
            "question": "Mısır ve Hitit İmparatorlukları arasındaki savaş, Anadolu topraklarına sahip olmak için yapılmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Savaş Anadolu için değil, Kuzey Suriye topraklarına hakim olmak için yapılmıştır."
          },
          {
            "id": "s13-p3-q2",
            "type": "true_false_not_given",
            "question": "Kadeş Antlaşması, insanlık tarihinde metni günümüze kadar ulaşan ilk yazılı barış antlaşmasıdır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'insanlık tarihinin bilinen ve metni günümüze ulaşan ilk yazılı... barış antlaşması' denilmiştir."
          },
          {
            "id": "s13-p3-q3",
            "type": "true_false_not_given",
            "question": "Kadeş Savaşı sonucunda Hititler kesin bir zafer kazanmış ve Mısır ordusunu yok etmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'İki taraf da birbirine tam bir üstünlük sağlayamayınca...' barış yapıldığı belirtilmiştir."
          },
          {
            "id": "s13-p3-q4",
            "type": "true_false_not_given",
            "question": "Antlaşmada taraflar sadece savaşmamaya değil, aynı zamanda ortak düşmana karşı birbirlerini savunmaya da söz vermişlerdir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'dışarıdan gelecek bir saldırıda birbirlerine yardım (ittifak) sözü verdikleri...' yazılıdır."
          },
          {
            "id": "s13-p3-q5",
            "type": "true_false_not_given",
            "question": "Gümüş tabletler üzerine yazılan antlaşma metnini, dönemin en iyi şairleri (yazarları) kaleme almıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Matnni kim (shoirmi yoki kimmir) yozgani haqida ma'lumot berilmagan."
          },
          {
            "id": "s13-p3-q6",
            "type": "true_false_not_given",
            "question": "Bugün Birleşmiş Milletler binasında bulunan Kadeş tableti, İstanbul'daki müzeden çalınıp Amerika'ya götürülmüştür.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Orijinali İstanbul'da sergilenir, BM binasındaki sadece devasa bir 'kopyasıdır'."
          }
        ]
      },
      {
        "id": "s13-p4",
        "title": "Gözle Görülmeyen Devrim: Nanoteknoloji",
        "category": "Teknoloji ve Tıp",
        "level": "C1",
        "content": "Nanoteknoloji, maddenin atomik veya moleküler seviyede (metrenin milyarda biri ölçeğinde) kontrol edilip değiştirilmesine olanak tanıyan bir bilim dalıdır. [ 1 ]. Bu minik ölçekte altın, karbon veya gümüş gibi bilindik elementler; inanılmaz derecede hafif, sert ve farklı kimyasal özelliklere sahip yeni süper-malzemelere dönüşmektedir. Nanoteknolojinin en heyecan verici uygulama alanı ise şüphesiz tıptır. [ 2 ]. Geçmişte kanser tedavisinde kullanılan kemoterapi, hem kanserli hem de sağlıklı hücreleri yok ederek hastanın vücuduna ciddi zararlar veriyordu. Ancak günümüzde geliştirilen 'nano-robotlar', hastanın kan dolaşımına enjekte edildikten sonra sadece kanserli hücreleri bulup ilacı doğrudan o hücrenin içine zerk (enjekte) edebilmektedir. Bu hedefe yönelik nokta atışı tedavi, sağlıklı hücrelerin zarar görmesini engellemekte ve yan etkileri tamamen ortadan kaldırma potansiyeli taşımaktadır.",
        "questions": [
          {
            "id": "s13-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Böylesine küçük bir boyutu anlamak için, tek bir saç telinin yaklaşık 100.000 nanometre kalınlığında olduğunu düşünebiliriz.",
              "Ancak nanoteknoloji çok pahalı olduğu için sadece uzay endüstrisinde kullanılır.",
              "Fizik kuralları büyük maddeler ile küçük maddeler arasında hiçbir fark göstermez.",
              "Günümüzde teleskoplar kullanılarak bu küçük maddeler rahatça görülebilmektedir."
            ],
            "correctOption": 0,
            "explanation": "Bo'shliqdan oldin 'metrenin milyarda biri ölçeğinde' deb hajmi tushuntirildi, buni tasavvur qilish uchun 'saç teli (soch tolasi)' misoli juda mantiqiydir."
          },
          {
            "id": "s13-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Tarım sektöründe nanoteknoloji kullanılarak devasa sebzeler yetiştirilmektedir.",
              "Binaların dış cephe boyaları nanoteknoloji sayesinde kendi kendini temizlemektedir.",
              "Çünkü nano-boyuttaki cihazlar, insan hücresinin içine kolayca girebilecek kadar küçüktür.",
              "Tıpta hastalıkların tanısı artık tamamen psikolojik testlerle yapılmaktadır."
            ],
            "correctOption": 2,
            "explanation": "Keyingi gapda tibbiyot va dori vositalarini to'g'ridan-to'g'ri hujayraga kiritish haqida gapirilgan. 'hücrenin içine kolayca girebilecek kadar küçüktür' jumlasi buni bog'laydi."
          },
          {
            "id": "s13-p4-q3",
            "type": "multiple_choice",
            "question": "Nanoteknolojiyi kullanarak maddeleri çok küçük (nano) boyutlara indirdiğimizde ne tür bir değişim yaşanmaktadır?",
            "options": [
              "Maddeler tamamen gaz haline dönüşür ve havaya karışır.",
              "Maddeler orijinal kimyasal özelliklerini değiştirip çok daha hafif, sert ve farklı süper-malzemelere dönüşür.",
              "Maddelerin fiyatı ucuzlar ve kalitesi düşer.",
              "Maddeler radyoaktif hale gelip çevreye zarar vermeye başlar."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'inanılmaz derecede hafif, sert ve farklı kimyasal özelliklere sahip yeni süper-malzemelere dönüşmektedir' deyilgan."
          },
          {
            "id": "s13-p4-q4",
            "type": "multiple_choice",
            "question": "Geleneksel kanser tedavisi olan 'kemoterapi'nin metinde vurgulanan en büyük olumsuz yönü nedir?",
            "options": [
              "Sadece çok zengin hastaların ulaşabileceği bir tedavi olması.",
              "Kanserli hücrelerle birlikte sağlam ve sağlıklı hücreleri de yok ederek vücuda zarar vermesi.",
              "Tedavinin çok uzun yıllar sürmesi ve hastanede yatmayı gerektirmesi.",
              "Sadece kadınlarda işe yaraması."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'hem kanserli hem de sağlıklı hücreleri yok ederek hastanın vücuduna ciddi zararlar veriyordu' yozilgan."
          },
          {
            "id": "s13-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'zerk etmek (enjekte etmek)' ifadesi hangi eylemi tanımlar?",
            "options": [
              "Bir sıvıyı (ilacı vb.) iğne veya özel bir araç yardımıyla vücudun (hücrenin) içine basınçla vermek.",
              "Bir yarayı sargı beziyle sıkıca sarmak.",
              "Hastayı ameliyat masasında uyutmak.",
              "Vücuttaki zararlı mikropları su ile yıkayarak temizlemek."
            ],
            "correctOption": 0,
            "explanation": "Zerk etmek (arabcha), enjekte etmek (fransuzcha) - dorini shprits yoki shunga o'xshash narsa bilan tana/hujayra ichiga kiritish."
          },
          {
            "id": "s13-p4-q6",
            "type": "cikarim",
            "question": "Metinden çıkarılabilecek sonuca göre, nano-robotların tıp dünyasına getireceği en büyük yenilik aşağıdakilerden hangisidir?",
            "options": [
              "Doktorların ameliyatlarda robotlara dönüşerek yorulmadan çalışabilmesi.",
              "İlaçların hastaneye gidilmeden hastanın kendi kendine üretebilmesi.",
              "İlacın sadece hastalıklı hücreye doğrudan (nokta atışı) gönderilerek, sağlam vücut dokularının korunması (yan etkilerin sıfırlanması).",
              "Kanser hastalıklarının tamamen yeryüzünden silindiğinin ilan edilmesi."
            ],
            "correctOption": 2,
            "explanation": "Nano-robotlarning yutug'i faqat kasal hujayraga 'nokta atışı' (aniq nishonga) hujum qilib, yon ta'sirlarni yo'qotishidir."
          }
        ]
      },
      {
        "id": "s13-p5",
        "title": "Güzellik Ön Yargısı: Halo Etkisi (Halo Effect)",
        "category": "Psikoloji ve Sosyoloji",
        "level": "C1",
        "content": "Psikolojide bilişsel bir ön yargı olan 'Halo Etkisi', bir kişinin sadece tek bir olumlu özelliğine (genellikle dış görünüşüne veya fiziksel çekiciliğine) bakarak, o kişinin diğer tüm karakter özelliklerinin de olumlu olduğuna inanma yanılgısıdır. 1920'lerde psikolog Edward Thorndike tarafından tanımlanan bu etki, günlük hayatımızın birçok alanında gizlice kararlarımızı yönlendirir. Yapılan araştırmalar; fiziksel olarak çekici ve yakışıklı/güzel bulunan insanların, öğretmenleri tarafından daha 'zeki', mahkemelerdeki jüriler tarafından daha 'masum' ve iş görüşmelerinde yöneticiler tarafından daha 'yetenekli ve dürüst' olarak algılandığını kesin olarak kanıtlamıştır. Halo etkisi öylesine güçlüdür ki, mantıklı veriler zıddını söylese bile beynimiz güzel olanın aynı zamanda 'iyi ve doğru' olduğu inancından vazgeçmek istemez. Pazarlama dünyası da bu zafiyetimizi çok iyi kullanır; ürünlerin kalitesinden bağımsız olarak, sırf reklamda çok sevilen veya çekici bir ünlü oynadığı için o ürüne gözü kapalı güvenir ve satın alırız.",
        "questions": [
          {
            "id": "s13-p5-q1",
            "type": "ana_fikir",
            "question": "Metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Güzel ve yakışıklı insanlar doğuştan daha zeki ve yeteneklidir.",
              "Pazarlama uzmanları ünlüleri reklamlarda oynamaya zorlamaktadır.",
              "İnsan beyni, birinin (veya bir şeyin) fiziksel güzelliğine/çekiciliğine aldanarak onun diğer tüm karakter özelliklerinin de iyi olduğunu varsayma yanılgısına düşer.",
              "Mahkemelerde alınan kararlar her zaman adaletlidir."
            ],
            "correctOption": 2,
            "explanation": "Asosiy e'tibor 'Halo Etkisi' orqali insonlarning faqat go'zallikka (yoki bir yaxshi xislatga) qarab barcha narsani yaxshi deb o'ylash adashishiga qaratilgan."
          },
          {
            "id": "s13-p5-q2",
            "type": "multiple_choice",
            "question": "Araştırmalara göre mahkemelerdeki jüriler (karar vericiler) fiziksel olarak çekici insanlara nasıl yaklaşmaktadır?",
            "options": [
              "Onlara daha ağır cezalar vermektedirler.",
              "Onların mahkemeye gelmesini yasaklamaktadırlar.",
              "Onların suç işleme potansiyellerini yüksek bulup, güvenilmez görmektedirler.",
              "Güzelliklerinden etkilenerek onların 'daha masum' (suçsuz) olduğuna inanma eğilimi göstermektedirler."
            ],
            "correctOption": 3,
            "explanation": "Matnda 'jüriler tarafından daha masum... olarak algılandığını kesin olarak kanıtlamıştır' deyilgan."
          },
          {
            "id": "s13-p5-q3",
            "type": "multiple_choice",
            "question": "Beynimiz, mantıklı kanıtlar (veriler) karşısında bile Halo etkisinden neden vazgeçememektedir?",
            "options": [
              "Çünkü insanlar gerçekleri öğrenmekten çok korkarlar.",
              "Çünkü beynimiz 'güzel olan şeyin aynı zamanda iyi ve doğru olduğu' inancına körü körüne sarılma zafiyeti taşır.",
              "Çünkü beynimizin kapasitesi çok küçüktür.",
              "Çünkü dış görünüş her zaman karakteri %100 doğru yansıtır."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'mantıklı veriler zıddını söylese bile beynimiz güzel olanın aynı zamanda iyi ve doğru olduğu inancından vazgeçmek istemez' yozilgan."
          },
          {
            "id": "s13-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'bilişsel bir ön yargı' (cognitive bias) ifadesinde geçen 'ön yargı' ne anlama gelmektedir?",
            "options": [
              "Bir kişi veya konu hakkında eldeki gerçek verilere dayanmadan, peşin (önceden) verilmiş genellikle yanlış veya duygusal karar.",
              "Mahkemede davanın çok uzun sürmesi.",
              "Bir insanın sürekli geçmişi düşünerek üzülmesi.",
              "Çok zeki insanların ortak özelliği."
            ],
            "correctOption": 0,
            "explanation": "Ön yargı (stereotip/noo'rin xulosa) haqiqiy ma'lumotga ega bo'lmasdan oldindan hukm chiqarishdir."
          },
          {
            "id": "s13-p5-q5",
            "type": "multiple_choice",
            "question": "Pazarlama dünyası (markalar) Halo etkisini kullanarak insanlara ürünlerini nasıl satmaktadır?",
            "options": [
              "Ürünleri çok ucuza, neredeyse bedavaya vererek.",
              "Ürünün kalitesinden ziyade, reklamda çekici ve çok sevilen ünlüleri (aktör, şarkıcı) kullanarak tüketicinin güvenini kazanarak.",
              "Marketlerde gizli müzikler çalarak.",
              "İnsanları telefonla arayıp tehdit ederek."
            ],
            "correctOption": 1,
            "explanation": "Matn so'ngida 'reklamda çok sevilen veya çekici bir ünlü oynadığı için o ürüne gözü kapalı güvenir' deb tushuntirilgan."
          },
          {
            "id": "s13-p5-q6",
            "type": "cikarim",
            "question": "Halo etkisi (Halo effect) teorisini göz önüne aldığımızda, bir iş mülakatında aşağıdaki adaylardan hangisinin (yetenekleri eşit olsa bile) işe alınma ihtimali daha yüksektir?",
            "options": [
              "Mülakata geç kalan ama dürüst olduğunu söyleyen aday.",
              "Kıyafetleri uyumsuz ve bakımsız olan aday.",
              "Fiziksel olarak çok çekici (şık ve yakışıklı/güzel) görünen aday.",
              "Mülakatta sürekli espri yapan ama sorulan soruları bilemeyen aday."
            ],
            "correctOption": 2,
            "explanation": "Go'zallikka (tashqi ko'rinishga) qarab insonni iqtidorliroq deb o'ylash Halo effektining asosidir."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-14",
    "sectionNumber": 14,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_14.json",
    "passages": [
      {
        "id": "s14-p1",
        "title": "Uçak İçi (Kabin) Güvenlik Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli yolcularımız, güvenli ve konforlu bir uçuş için lütfen aşağıdaki kurallara dikkat ediniz:\n1. Uçuş süresince 'Kemerlerinizi Bağlayın' ışığı yandığında yerinize oturmanız ve kemerinizi takmanız zorunludur.\n2. Uçağın kalkış ve inişi sırasında dizüstü bilgisayar (laptop) gibi büyük elektronik cihazlarınızı kapatıp çantanıza koymalısınız. Cep telefonları ise 'uçak modu'nda kullanılabilir.\n3. Uçak tuvaletleri dahil olmak üzere uçağın hiçbir yerinde sigara, elektronik sigara veya tütün ürünleri içmek kesinlikle yasaktır.\n4. El bagajlarınızı başınızın üzerindeki kapalı dolaplara veya önünüzdeki koltuğun altına (koridoru kapatmayacak şekilde) yerleştiriniz.\n5. Acil çıkış kapılarının önünde oturan yolcuların, acil bir durumda kabin ekibine (hosteslere) yardımcı olması gerekmektedir.\nİyi uçuşlar dileriz.",
        "questions": [
          {
            "id": "s14-p1-q1",
            "type": "multiple_choice",
            "question": "Yolcular emniyet kemerlerini ne zaman kesinlikle takmalıdır?",
            "options": [
              "Uçak havalimanına indiğinde",
              "Kemerlerinizi bağlayın uyarı ışığı yandığında",
              "Yemek servisi yapılırken",
              "Sadece uyurken"
            ],
            "correctOption": 1,
            "explanation": "Kemerlerinizi Bağlayın ışığı yandığında takmak zorunludur."
          },
          {
            "id": "s14-p1-q2",
            "type": "multiple_choice",
            "question": "Kalkış sırasında cep telefonu kullanımı için hangi kural geçerlidir?",
            "options": [
              "Tamamen kapatılması zorunludur.",
              "Sadece uçak moduna alınarak kullanılabilir.",
              "Telefonla yüksek sesle konuşulabilir.",
              "Sadece pencere kenarında oturanlar kullanabilir."
            ],
            "correctOption": 1,
            "explanation": "Cep telefonları ise 'uçak modu'nda kullanılabilir denmiştir."
          },
          {
            "id": "s14-p1-q3",
            "type": "multiple_choice",
            "question": "Dizüstü bilgisayarlar (laptoplar) kalkış ve iniş sırasında neden kapalı olmalıdır?",
            "options": [
              "Büyük elektronik cihazların bu aşamalarda çantada kapalı olması kuralı vardır.",
              "Uçağın internetini yavaşlattığı için.",
              "Şarjları çok çabuk bittiği için.",
              "Diğer yolcuları rahatsız ettiği için."
            ],
            "correctOption": 0,
            "explanation": "Kalkış ve inişi sırasında dizüstü bilgisayar gibi büyük elektronik cihazlarınızı kapatıp çantanıza koymalısınız."
          },
          {
            "id": "s14-p1-q4",
            "type": "multiple_choice",
            "question": "Uçak içinde sigara içmekle ilgili kural nedir?",
            "options": [
              "Sadece tuvaletlerde içilebilir.",
              "Sadece elektronik sigara içilebilir.",
              "Hiçbir yerde ve hiçbir şekilde sigara içilemez.",
              "Sadece uzun uçuşlarda içilebilir."
            ],
            "correctOption": 2,
            "explanation": "Uçağın hiçbir yerinde sigara, elektronik sigara veya tütün ürünleri içmek kesinlikle yasaktır."
          },
          {
            "id": "s14-p1-q5",
            "type": "multiple_choice",
            "question": "Acil çıkış kapısında oturan yolcuların sorumluluğu nedir?",
            "options": [
              "Camı açıp uçağı havalandırmak.",
              "Acil bir durumda kabin ekibine yardımcı olmak.",
              "Diğer yolculara yemek dağıtmak.",
              "Sadece kendi can güvenliğini düşünmek."
            ],
            "correctOption": 1,
            "explanation": "Acil çıkış kapılarının önünde oturan yolcuların kabin ekibine yardımcı olması gerekmektedir."
          },
          {
            "id": "s14-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin okunma (veya dinlenme) amacı nedir?",
            "options": [
              "Uçak biletlerinin nasıl alınacağını anlatmak.",
              "Havalimanındaki mağazaları tanıtmak.",
              "Yolcuların uçuş güvenliğini ve düzenini sağlamak.",
              "Kabin ekibinin maaşlarını açıklamak."
            ],
            "correctOption": 2,
            "explanation": "Güvenli ve konforlu bir uçuş (güvenlik ve düzen) için kuralları belirtmektir."
          }
        ]
      },
      {
        "id": "s14-p2",
        "title": "Tatil İçin Konaklama Tercihleri",
        "category": "Seyahat / Eşleştirme",
        "level": "B1",
        "content": "A) Serkan: Bütün yıl çok çalışıyorum ve tatilde hiçbir şeye dokunmak istemiyorum. Bu yüzden 'Her Şey Dahil' 5 yıldızlı lüks otelleri tercih ederim. Yemeğimi önüme getirsinler, odamı temizlesinler, havuz kenarında bana kokteyl sunsunlar yeter.\n\nB) Elif: Ben tatilde yerel halk gibi yaşamayı severim. Otellerin yapay atmosferinden hiç hoşlanmam. Gittiğim şehirde 'Airbnb' üzerinden bir ev kiralarım, sabahları kendi kahvaltımı o yörenin pazarından aldığım malzemelerle kendi mutfağımda yaparım.\n\nC) Can: Tatilde konaklamaya büyük paralar harcamak bana çok saçma geliyor. Amacım sadece uyumak. Bu yüzden 'Hostel' adı verilen paylaşımlı odalarda (ranzalarda) kalırım. Ayrıca buralar dünyanın her yerinden gezginlerle tanışıp sosyalleşmek için harikadır.\n\nD) Aylin: Beton duvarların arasında kalmaktan nefret ederim. En sevdiğim tatil, sırt çantamı alıp ormanın içine veya göl kenarına 'Çadır' kurmaktır. Sabahları kuş sesleriyle uyanmak ve geceleri ateş yakıp yıldızları izlemek bana huzur veriyor.",
        "questions": [
          {
            "id": "s14-p2-q1",
            "type": "matching_paragraph",
            "question": "Konaklama masrafını (parayı) en aza indirip yeni insanlarla tanışmayı hedefleyen kişi kimdir?",
            "options": [
              "A) Serkan",
              "B) Elif",
              "C) Can",
              "D) Aylin"
            ],
            "correctOption": 2,
            "explanation": "Can, büyük paralar harcamayı saçma bulduğunu ve Hostel'de kalarak sosyalleştiğini belirtmiştir."
          },
          {
            "id": "s14-p2-q2",
            "type": "matching_paragraph",
            "question": "Tatilde hiçbir ev işi yapmadan sadece dinlenmek ve hizmet edilmesini isteyen kişi kimdir?",
            "options": [
              "A) Serkan",
              "B) Elif",
              "C) Can",
              "D) Aylin"
            ],
            "correctOption": 0,
            "explanation": "Serkan, hiçbir şeye dokunmak istemediğini ve her şey dahil otelleri sevdiğini söylemiştir."
          },
          {
            "id": "s14-p2-q3",
            "type": "matching_paragraph",
            "question": "Otel odası yerine tamamen doğayla iç içe olmayı ve açık havada uyumayı tercih eden kişi kimdir?",
            "options": [
              "A) Serkan",
              "B) Elif",
              "C) Can",
              "D) Aylin"
            ],
            "correctOption": 3,
            "explanation": "Aylin, çadır kurup ormanda veya göl kenarında kalmayı sevdiğini belirtmiştir."
          },
          {
            "id": "s14-p2-q4",
            "type": "matching_paragraph",
            "question": "Gittiği şehrin yerel kültürünü deneyimlemek için günlük kiralık ev (Airbnb) tutan kişi kimdir?",
            "options": [
              "A) Serkan",
              "B) Elif",
              "C) Can",
              "D) Aylin"
            ],
            "correctOption": 1,
            "explanation": "Elif, yerel halk gibi yaşamak için ev kiraladığını ve kendi kahvaltısını yaptığını anlatmıştır."
          },
          {
            "id": "s14-p2-q5",
            "type": "matching_paragraph",
            "question": "Tatilde yemeğini yerel pazarlardan alarak kendi pişirmeyi seven kişi kimdir?",
            "options": [
              "A) Serkan",
              "B) Elif",
              "C) Can",
              "D) Aylin"
            ],
            "correctOption": 1,
            "explanation": "Elif, pazardan malzeme alıp kahvaltısını kendi mutfağında hazırladığını söylemiştir."
          },
          {
            "id": "s14-p2-q6",
            "type": "matching_paragraph",
            "question": "Tatilde lüks ve rahatlığa (havuz, kokteyl vb.) en çok önem veren kişi kimdir?",
            "options": [
              "A) Serkan",
              "B) Elif",
              "C) Can",
              "D) Aylin"
            ],
            "correctOption": 0,
            "explanation": "Serkan 5 yıldızlı lüks otellerde havuz kenarında kokteyl içmek istediğini söylemiştir."
          }
        ]
      },
      {
        "id": "s14-p3",
        "title": "Ticaretin Devrimi: Paranın İcadı",
        "category": "Tarih ve Ekonomi",
        "level": "B2",
        "content": "Para icat edilmeden önce insanlar, ihtiyaçlarını karşılamak için 'takas (barter)' yöntemini kullanıyorlardı. Örneğin, buğdayı olan bir çiftçi, bir çömlek almak için elindeki buğdayı çömlekçiyle değiştirmek zorundaydı. Ancak bu sistem, iki tarafın da aynı anda birbirinin ürününe ihtiyaç duymasını gerektirdiği için çok zordu. İnsanlık tarihini değiştiren adım, M.Ö. 7. yüzyılda Anadolu'da yaşayan Lidyalılar tarafından atıldı. Lidyalılar, altın ve gümüş karışımı olan 'elektron' adlı madeni eritip üzerine krallarının mührünü (aslan başı figürü) basarak tarihteki ilk madeni parayı (sikke) icat ettiler. Paranın icadı, ticaretin hızlanmasını, malların değerinin standart bir şekilde ölçülmesini ve zenginliğin biriktirilmesini (tasarruf edilmesini) sağladı. Lidyalıların başkenti Sardes (bugünkü Manisa), paranın icadıyla birlikte dönemin en zengin ve en kalabalık ticaret merkezlerinden biri haline geldi.",
        "questions": [
          {
            "id": "s14-p3-q1",
            "type": "true_false_not_given",
            "question": "Para icat edilmeden önce insanlar alışveriş yapamıyor, sadece kendi ürettiklerini tüketiyorlardı.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Alışveriş yapabiliyorlardı, ancak bunu ürünleri birbirleriyle değiştirerek (takas yöntemiyle) yapıyorlardı."
          },
          {
            "id": "s14-p3-q2",
            "type": "true_false_not_given",
            "question": "Takas (barter) yönteminin en büyük zorluğu, ürünlerin ağırlıklarının farklı olmasıydı.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Zorluk ağırlık değil, 'iki tarafın da aynı anda birbirinin ürününe ihtiyaç duymasını' gerektirmesiydi."
          },
          {
            "id": "s14-p3-q3",
            "type": "true_false_not_given",
            "question": "Tarihteki ilk madeni paralar sadece saf altından üretilmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'altın ve gümüş karışımı olan elektron adlı madeni' eritip yaptıkları belirtilmiştir."
          },
          {
            "id": "s14-p3-q4",
            "type": "true_false_not_given",
            "question": "İlk madeni paraların (sikkelerin) üzerinde Lidyalıların inandığı tanrıların resimleri bulunuyordu.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'krallarının mührünü (aslan başı figürü) basarak' yapıldığı söylenmiştir."
          },
          {
            "id": "s14-p3-q5",
            "type": "true_false_not_given",
            "question": "Paranın icadı sayesinde ticari malların değeri artık belli bir standarda kavuşmuştur.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'malların değerinin standart bir şekilde ölçülmesini... sağladı' denilmiştir."
          },
          {
            "id": "s14-p3-q6",
            "type": "true_false_not_given",
            "question": "Lidyalılar, parayı icat ettikten sonra savaşlarda paralı asker (kiralık asker) kullanmaya başlamışlardır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Paralı askerler hakkında metinde hiçbir bilgi yoktur."
          }
        ]
      },
      {
        "id": "s14-p4",
        "title": "Yapay Zeka ve Sanatın İmtihanı",
        "category": "Teknoloji ve Sanat",
        "level": "C1",
        "content": "Yapay zeka (YZ), uzun yıllar boyunca matematiksel hesaplamalar ve mantıksal işlemlerle anıldı. [ 1 ]. Ancak Midjourney ve DALL-E gibi görüntü oluşturucu YZ programlarının hayatımıza girmesiyle, sanat dünyasında eşi benzeri görülmemiş bir deprem yaşandı. Bir kişinin bilgisayar ekranına sadece birkaç kelime (prompt) yazarak saniyeler içinde Van Gogh veya Picasso tarzında muazzam bir tablo üretebilmesi, 'Sanat nedir?' ve 'Sanatçı kimdir?' sorularını yeniden tartışmaya açtı. [ 2 ]. Geleneksel sanatçılar, YZ'nin daha önce insanlar tarafından çizilmiş milyonlarca eseri izinsiz (telif hakkı ödemeden) 'kopyalayıp harmanlayarak' eser ürettiğini, bunun bir yaratıcılık değil 'hırsızlık' olduğunu savunmaktadır. YZ destekçileri ise bu durumu fotoğraf makinesinin icadına benzetmektedir: Fotoğraf makinesi icat edildiğinde de ressamlar resim sanatının öldüğünü iddia etmişti, ancak fotoğraf başlı başına yeni bir sanat dalı oldu. Yapay zeka sanat mıdır yoksa sadece karmaşık bir algoritma mıdır sorusunun cevabını muhtemelen zaman verecektir.",
        "questions": [
          {
            "id": "s14-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Yapay zeka günümüzde en çok hastanelerde kullanılmaktadır.",
              "Kimse bir bilgisayarın yaratıcılık ve estetik gerektiren alanlara (örneğin resim veya şiir) girebileceğine inanmıyordu.",
              "Eskiden sadece çok pahalı bilgisayarlar işlem yapabiliyordu.",
              "Matematik her zaman sanatın temel taşı olmuştur."
            ],
            "correctOption": 1,
            "explanation": "Bo'shliqdan oldin YZ faqat matematika bilan eslangani, keyin esa san'at dunyosidagi inqilobi aytilyapti. Shuning uchun 'hech kim kompyuter san'atga kira oladi deb o'ylamagandi' jumlasi juda mos keladi."
          },
          {
            "id": "s14-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Bu yeni teknoloji sayesinde artık sergilerde sadece bilgisayarlar satılmaktadır.",
              "Birçok insan bu durumu heyecanla karşılarken, pek çok ressam ve illüstratör bu teknolojiye şiddetle karşı çıkmaktadır.",
              "Fotoğraf makineleri gün geçtikçe daha net fotoğraflar çekmektedir.",
              "Artık boyalar ve fırçalar çevre dostu malzemelerden üretiliyor."
            ],
            "correctOption": 1,
            "explanation": "Keyingi gapda 'Geleneksel sanatçılar... bunun hırsızlık olduğunu savunmaktadır' deyilgani uchun, rassomlarning qarshilik ko'rsatishi (şiddetle karşı çıkması) haqidagi gap mos tushadi."
          },
          {
            "id": "s14-p4-q3",
            "type": "multiple_choice",
            "question": "Geleneksel sanatçıların yapay zekaya (YZ) karşı çıkmasındaki en büyük yasal (veya etik) gerekçe nedir?",
            "options": [
              "Yapay zekanın eserleri çok çirkin çizmesi.",
              "YZ'nin eski sanatçıların milyonlarca eserini telif hakkı (izin) almadan izinsiz kopyalayıp kullanması.",
              "Yapay zeka programlarının çok pahalı olması.",
              "YZ'nin fırça ve boya kullanmadan sanat yapması."
            ],
            "correctOption": 1,
            "explanation": "Matnda rassomlarning bu holatni 'izinsiz (telif hakkı ödemeden) kopyalayıp harmanlayarak eser ürettiğini' aytishlari keltirilgan."
          },
          {
            "id": "s14-p4-q4",
            "type": "multiple_choice",
            "question": "Yapay zeka destekçileri, yapay zeka sanatını tarihteki hangi buluşa (icada) benzetmektedir?",
            "options": [
              "Matbaanın icadına",
              "Televizyonun icadına",
              "Fotoğraf makinesinin icadına",
              "Bilgisayarın icadına"
            ],
            "correctOption": 2,
            "explanation": "Matnda 'YZ destekçileri ise bu durumu fotoğraf makinesinin icadına benzetmektedir' deb ochiq aytilgan."
          },
          {
            "id": "s14-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'harmanlamak' kelimesi hangi anlama gelmektedir?",
            "options": [
              "Bir şeyi tamamen yakıp yok etmek.",
              "Farklı şeyleri bir araya getirip karıştırarak (sentezleyerek) yeni bir bütün oluşturmak.",
              "Bir resmi duvara asmak.",
              "Bilgisayar kodlarını silmek."
            ],
            "correctOption": 1,
            "explanation": "Harmanlamak - turli narsalarni bir-biriga aralashtirib (sintez qilib) bir butun yaratishdir."
          },
          {
            "id": "s14-p4-q6",
            "type": "cikarim",
            "question": "Yazarın metinden çıkardığı nihai (son) sonuç aşağıdakilerden hangisidir?",
            "options": [
              "Yapay zeka kesinlikle bir sanat hırsızıdır ve yasaklanmalıdır.",
              "Yapay zeka sadece birkaç kelime (prompt) ile gerçek sanatı yaratabilir.",
              "Yapay zekanın ürettiklerinin sanat olup olmadığı konusundaki bu büyük felsefi tartışmayı kesin bir sonuca bağlamak şu an için mümkün değildir.",
              "Ressamlar fotoğraf makinesinden korktukları gibi yapay zekadan da haksız yere korkmaktadırlar."
            ],
            "correctOption": 2,
            "explanation": "Oxirgi gapda: 'sanat mıdır... sorusunun cevabını muhtemelen zaman verecektir' deb yakuniy xulosa vaqti kelmagani bildirilgan."
          }
        ]
      },
      {
        "id": "s14-p5",
        "title": "Modern Çağın Hastalığı: Tükenmişlik Sendromu",
        "category": "Psikoloji ve İş Hayatı",
        "level": "C1",
        "content": "Son yıllarda çalışma hayatında sıkça duyduğumuz 'Tükenmişlik Sendromu' (Burnout), basit bir bedensel yorgunluktan çok daha fazlasıdır. 1970'lerde psikolog Herbert Freudenberger tarafından tanımlanan bu durum, uzun süreli ve çözülemeyen iş stresi sonucunda ortaya çıkan fiziksel, duygusal ve zihinsel bir tükenme halidir. Birey, sadece mesaisinin bitmesini beklemekle kalmaz, aynı zamanda yaptığı işe karşı derin bir alaycılık (sinizm), yabancılaşma ve 'Benim bu işe hiçbir katkım yok' hissi yaşamaya başlar. Eskiden sadece doktorlar, hemşireler veya öğretmenler gibi insanlarla yoğun iletişim kuran mesleklerde görüldüğü zannedilen bu sendrom, günümüzde sürekli dijital olarak 'ulaşılabilir' olmanın (e-postalara veya mesajlara gece bile cevap vermek zorunda kalmanın) getirdiği baskıyla her sektörden çalışanı etkilemektedir. Dinlenmek (örneğin hafta sonu tatili yapmak) normal bir yorgunluğu geçirirken, tükenmişlik sendromunu tedavi edemez. Çünkü sorun fiziksel dinlenmeyle değil; iş yükünün azaltılması, değer görme ihtiyacı ve iş-özel hayat dengesinin yeniden kurulmasıyla çözülebilir.",
        "questions": [
          {
            "id": "s14-p5-q1",
            "type": "ana_fikir",
            "question": "Metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Sadece çok çalışan insanlar yorulur.",
              "Tükenmişlik sendromu basit bir yorgunluk değil, kronik iş stresi ve değer görememenin yarattığı derin bir duygusal çöküntüdür.",
              "Doktorlar ve öğretmenler dünyadaki en şanslı meslek gruplarıdır.",
              "Hafta sonu tatilleri insanları daha fazla strese sokmaktadır."
            ],
            "correctOption": 1,
            "explanation": "Asosiy g'oya tükenmişlik (burnout) ning shunchaki charchoq emas, balki chuqur emotsional va ishdagi inqiroz ekanligidadir."
          },
          {
            "id": "s14-p5-q2",
            "type": "multiple_choice",
            "question": "Tükenmişlik Sendromu (Burnout) ile normal fiziksel yorgunluk arasındaki en temel fark nedir?",
            "options": [
              "Tükenmişlik sendromunun birkaç saatlik uykuyla kolayca geçmesi.",
              "Normal yorgunluğun dinlenmekle (tatille) geçmesi, tükenmişliğin ise sadece dinlenmeyle iyileşememesi.",
              "Normal yorgunluğun sadece kadınlarda görülmesi.",
              "Tükenmişlik sendromunun kas ağrılarına yol açması."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'Dinlenmek normal bir yorgunluğu geçirirken, tükenmişlik sendromunu tedavi edemez' deyilgan."
          },
          {
            "id": "s14-p5-q3",
            "type": "multiple_choice",
            "question": "Eskiden sadece doktor ve öğretmenlerde görüldüğü düşünülen bu sendromun, günümüzde her sektörde yaygınlaşmasının asıl nedeni nedir?",
            "options": [
              "Çalışanların aldıkları maaşların çok yükselmesi.",
              "İnsanların artık eskisinden daha zayıf olması.",
              "Dijitalleşme nedeniyle insanların mesai saatleri dışında bile telefon ve maillerle sürekli işe bağlı kalması (ulaşılabilir olması).",
              "Ofis sandalyelerinin rahatsız edici olması."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'sürekli dijital olarak ulaşılabilir olmanın... getirdiği baskıyla her sektörden çalışanı etkilemektedir' yozilgan."
          },
          {
            "id": "s14-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'sinizm (alaycılık)' kelimesi bu metin bağlamında (iş hayatında) neyi ifade eder?",
            "options": [
              "Çalışanın iş arkadaşlarıyla sürekli şakalaşması.",
              "Çalışanın yaptığı işin değerine, kurumuna veya amaçlarına karşı inancını yitirerek onları umursamaması veya küçümsemesi.",
              "Kişinin patronuna hakaret etmesi.",
              "Kişinin sürekli komik hikayeler anlatması."
            ],
            "correctOption": 1,
            "explanation": "Sinizm (alaycılık) bu kontekstda ishni, uning qadrini va institutni mensimaslik, kinoya bilan (ahamiyatsiz deb) qarash holatini bildiradi."
          },
          {
            "id": "s14-p5-q5",
            "type": "cikarim",
            "question": "Yazara göre, tükenmişlik sendromu yaşayan bir çalışanı tekrar sağlığına kavuşturmak (işe kazandırmak) için bir şirket ne yapmalıdır?",
            "options": [
              "Ona sadece bir hafta sonu izin vermelidir.",
              "İş yükünü azaltmalı, emeğinin değerini ona hissettirmeli ve mesai saatleri dışında çalışanı rahatsız etmemelidir.",
              "Maaşını tamamen kesmelidir.",
              "Ona daha büyük sorumluluklar ve yeni işler vermelidir."
            ],
            "correctOption": 1,
            "explanation": "Oxirgi gapda yechim sifatida: 'iş yükünün azaltılması, değer görme ihtiyacı ve iş-özel hayat dengesinin yeniden kurulması' ko'rsatilgan."
          },
          {
            "id": "s14-p5-q6",
            "type": "multiple_choice",
            "question": "Tükenmişlik sendromu yaşayan bir çalışanın zihninde genellikle hangi düşünce oluşmaktadır?",
            "options": [
              "Ben bu şirketin en önemli ve en değerli kişisiyim.",
              "Kısa süre sonra şirketin yöneticisi olacağım.",
              "Benim yaptığım bu işin hiçbir anlamı ve katkısı yok.",
              "Mesai saatleri çok kısa, daha fazla çalışmalıyım."
            ],
            "correctOption": 2,
            "explanation": "Matnda xodimda 'Benim bu işe hiçbir katkım yok' hissi yaşamaya başlar deb yozilgan."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-15",
    "sectionNumber": 15,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_15.json",
    "passages": [
      {
        "id": "s15-p1",
        "title": "Öğrenci Yemekhanesi Kullanım Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli öğrencilerimiz, üniversite yemekhanesinde düzenin sağlanması ve hijyenik bir ortam oluşması için aşağıdaki kurallara dikkat ediniz:\n1. Yemekhanemiz sadece hafta içi günlerde (Pazartesi-Cuma) 11:30 ile 14:00 saatleri arasında öğle yemeği servisi yapmaktadır.\n2. Yemek alabilmek için öğrenci kimlik kartınızı (akıllı kartınızı) turnikelerden okutmanız zorunludur. Nakit ödeme kabul edilmemektedir.\n3. Yemek dağıtım alanında düzeni sağlamak için lütfen sıraya giriniz ve sıradaki diğer öğrencilerin hakkını gasp etmeyiniz.\n4. Yemek yediğiniz tepsileri masada bırakmayınız. Yemeğiniz bittikten sonra tepsilerinizi ve boş tabaklarınızı 'Bulaşık Toplama İstasyonu'na kendiniz götürünüz.\n5. İsrafı önlemek adına, lütfen sadece tüketebileceğiniz kadar ekmek ve yemek alınız.\nAfiyet olsun.",
        "questions": [
          {
            "id": "s15-p1-q1",
            "type": "multiple_choice",
            "question": "Yemekhane hafta sonu (Cumartesi-Pazar) hangi saatler arasında hizmet vermektedir?",
            "options": [
              "11:30 - 14:00",
              "08:00 - 12:00",
              "12:00 - 15:00",
              "Hafta sonu hizmet vermemektedir (Kapalıdır)"
            ],
            "correctOption": 3,
            "explanation": "Metinde 'sadece hafta içi günlerde (Pazartesi-Cuma)' hizmet verildiği yazmaktadır."
          },
          {
            "id": "s15-p1-q2",
            "type": "multiple_choice",
            "question": "Öğrenciler yemek ücretini nasıl ödemelidir?",
            "options": [
              "Sadece nakit parayla",
              "Öğrenci kimlik kartlarını (akıllı kart) okutarak",
              "Kredi kartıyla",
              "Yemekler tamamen ücretsizdir"
            ],
            "correctOption": 1,
            "explanation": "Öğrenci kimlik kartınızı okutmanız zorunludur. Nakit kabul edilmez."
          },
          {
            "id": "s15-p1-q3",
            "type": "multiple_choice",
            "question": "Yemek sırasındayken hangi davranış yasaktır?",
            "options": [
              "Sıraya girmek",
              "Beklerken kitap okumak",
              "Sırayı bozup başkalarının önüne geçmek (hakkını gasp etmek)",
              "Arkadaşıyla konuşmak"
            ],
            "correctOption": 2,
            "explanation": "Lütfen sıraya giriniz ve sıradaki diğer öğrencilerin hakkını gasp etmeyiniz (onların önüne geçmeyiniz)."
          },
          {
            "id": "s15-p1-q4",
            "type": "multiple_choice",
            "question": "Yemeğini bitiren bir öğrencinin yapması gereken doğru davranış nedir?",
            "options": [
              "Tepsiyi ve tabakları masada bırakıp gitmek.",
              "Boş tabakları çöpe atmak.",
              "Tepsiyi alıp 'Bulaşık Toplama İstasyonu'na götürmek.",
              "Temizlik görevlisini çağırıp masayı sildirmek."
            ],
            "correctOption": 2,
            "explanation": "Tepsilerinizi ve boş tabaklarınızı Bulaşık Toplama İstasyonu'na kendiniz götürünüz."
          },
          {
            "id": "s15-p1-q5",
            "type": "multiple_choice",
            "question": "İsrafı (gereksiz harcamayı) önlemek için öğrencilerden ne istenmektedir?",
            "options": [
              "Yemeklerin yarısını çöpe atmaları",
              "Sadece yiyebilecekleri (tüketebilecekleri) kadar yemek ve ekmek almaları",
              "Yemekleri evlerine götürmeleri",
              "Hiç ekmek yememeleri"
            ],
            "correctOption": 1,
            "explanation": "Sadece tüketebileceğiniz kadar ekmek ve yemek alınız deyilgan."
          },
          {
            "id": "s15-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin hedef kitlesi kimdir?",
            "options": [
              "Yemekhane aşçıları",
              "Üniversite öğrencileri",
              "Üniversitenin rektörü",
              "Lokanta sahipleri"
            ],
            "correctOption": 1,
            "explanation": "Değerli öğrencilerimiz, diyerek üniversite öğrencilerine hitap etmektedir."
          }
        ]
      },
      {
        "id": "s15-p2",
        "title": "Kitap Okuma Alışkanlıkları",
        "category": "Kültür / Eşleştirme",
        "level": "B1",
        "content": "A) Ceren: Ben klasik bir okuyucuyum. Benim için kitap dediğin şey kağıttan yapılmalıdır. O yeni basılmış kağıt kokusunu içime çekmek ve sayfaları parmaklarımla çevirmek okumanın en güzel yanıdır. Elektronik ekranlardan okurken hiç keyif alamıyorum.\n\nB) Murat: İş gereği çok fazla seyahat ediyorum ve yanımda ağır kitaplar taşımak istemiyorum. Bu yüzden 'E-Kitap (Elektronik Kitap) Okuyucu' cihazı kullanıyorum. İncecik bir cihazın içinde binlerce kitabı taşıyabilmek, özellikle geceleri ışığı kapatıp karanlıkta okuyabilmek büyük bir kolaylık.\n\nC) Seda: Maalesef kitap okumak için oturup zaman ayırmaya hiç vaktim yok. Ben çözümü 'Sesli Kitaplar'da (Audiobook) buldum. İşe giderken otobüste, evde temizlik yaparken veya yürüyüşte kulaklığımı takıyor ve profesyonel tiyatrocuların seslendirdiği kitapları dinliyorum.\n\nD) Emre: Sadece uzun uzun yazılardan oluşan kitaplar beni çabuk sıkıyor. Ben olayların görsel olarak desteklendiği Çizgi Roman (Comic Book) ve Mangaları tercih ediyorum. Çizimlerdeki karakterlerin yüz ifadelerini görmek hikayeyi daha çok yaşamamı sağlıyor.",
        "questions": [
          {
            "id": "s15-p2-q1",
            "type": "matching_paragraph",
            "question": "Zaman darlığı (vakit eksikliği) nedeniyle okumak yerine kitapları dinlemeyi tercih eden kişi kimdir?",
            "options": [
              "A) Ceren",
              "B) Murat",
              "C) Seda",
              "D) Emre"
            ],
            "correctOption": 2,
            "explanation": "Seda vakti olmadığı için sesli kitap (audiobook) dinlediğini söylemiştir."
          },
          {
            "id": "s15-p2-q2",
            "type": "matching_paragraph",
            "question": "Fiziksel olarak kağıda dokunmayı ve kitabın kokusunu sevmeyi okumanın bir parçası sayan kişi kimdir?",
            "options": [
              "A) Ceren",
              "B) Murat",
              "C) Seda",
              "D) Emre"
            ],
            "correctOption": 0,
            "explanation": "Ceren kağıt kokusunu ve sayfaları çevirmeyi sevdiğini belirtmiştir."
          },
          {
            "id": "s15-p2-q3",
            "type": "matching_paragraph",
            "question": "Sadece metin (yazı) okumayı sıkıcı bulup, hikayeyi görsel çizimlerle takip etmeyi seven kişi kimdir?",
            "options": [
              "A) Ceren",
              "B) Murat",
              "C) Seda",
              "D) Emre"
            ],
            "correctOption": 3,
            "explanation": "Emre uzun yazılardan sıkıldığını ve Çizgi Roman/Manga tercih ettiğini söylemiştir."
          },
          {
            "id": "s15-p2-q4",
            "type": "matching_paragraph",
            "question": "Fiziksel kitapların ağırlığından kurtulmak ve binlerce kitabı yanında taşımak için dijital cihaz kullanan kişi kimdir?",
            "options": [
              "A) Ceren",
              "B) Murat",
              "C) Seda",
              "D) Emre"
            ],
            "correctOption": 1,
            "explanation": "Murat ağır kitap taşımamak için e-kitap okuyucu kullandığını ifade etmiştir."
          },
          {
            "id": "s15-p2-q5",
            "type": "matching_paragraph",
            "question": "Çok görevli (multitasking) çalışarak, ev işi yaparken veya yolda yürürken edebiyattan kopmayan kişi kimdir?",
            "options": [
              "A) Ceren",
              "B) Murat",
              "C) Seda",
              "D) Emre"
            ],
            "correctOption": 2,
            "explanation": "Seda temizlik yaparken veya otobüste kulaklıkla kitap dinlediğini anlatmıştır."
          },
          {
            "id": "s15-p2-q6",
            "type": "matching_paragraph",
            "question": "Cihazının ekran ışığı sayesinde gece karanlığında bile kitap okuyabilen kişi kimdir?",
            "options": [
              "A) Ceren",
              "B) Murat",
              "C) Seda",
              "D) Emre"
            ],
            "correctOption": 1,
            "explanation": "Murat e-kitap cihazı sayesinde geceleri ışığı kapatıp karanlıkta okuduğunu belirtmiştir."
          }
        ]
      },
      {
        "id": "s15-p3",
        "title": "Avrupa'yı Aydınlatan İcat: Matbaa",
        "category": "Tarih ve Teknoloji",
        "level": "B2",
        "content": "Kitapların elle ve çok yavaş bir şekilde kopyalandığı (yazıldığı) Orta Çağ'da, bilgiye ulaşmak sadece çok zengin soyluların ve din adamlarının ayrıcalığıydı. Bir kitabın yazılması bazen aylar sürdüğü için kitap fiyatları neredeyse küçük bir ev fiyatına eşitti. Bu durumu değiştiren kişi, 1450 yılında Almanya'da metal harfleri hareket ettirerek (hareketli tip) baskı yapabilen ilk matbaa makinesini icat eden Johannes Gutenberg oldu. Gutenberg'in bu makineyle bastığı ilk eser, meşhur 'Gutenberg İncili'dir. Matbaanın icadı sayesinde kitaplar hızlı ve ucuz bir şekilde binlerce adet çoğaltılabilmiştir. Bu teknolojik devrim, bilginin sıradan halk kitlelerine ulaşmasını sağlamış; bilim, sanat ve felsefede Avrupa'yı dönüştüren Rönesans (Yeniden Doğuş) hareketinin en büyük hazırlayıcısı olmuştur. Eğer matbaa icat edilmeseydi, insanlık karanlık çağdan çıkıp modern bilime bu kadar hızlı ulaşamazdı.",
        "questions": [
          {
            "id": "s15-p3-q1",
            "type": "true_false_not_given",
            "question": "Matbaa icat edilmeden önce Avrupa'da kitaplar sadece el yazısıyla tek tek kopyalanıyordu.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'Kitapların elle ve çok yavaş bir şekilde kopyalandığı...' denilmektedir."
          },
          {
            "id": "s15-p3-q2",
            "type": "true_false_not_given",
            "question": "Orta Çağ'da kitapların çok pahalı olmasının nedeni, sayfalarının altından yapılmış olmasıdır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Altın olduğu için değil, 'Bir kitabın yazılması bazen aylar sürdüğü için' pahalı olduğu belirtilmiştir."
          },
          {
            "id": "s15-p3-q3",
            "type": "true_false_not_given",
            "question": "Johannes Gutenberg'in icat ettiği matbaa makinesinin özelliği, metal harflerin hareket ettirilerek (dizilerek) yan yana getirilmesidir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'metal harfleri hareket ettirerek (hareketli tip) baskı yapabilen' ifadesi vardır."
          },
          {
            "id": "s15-p3-q4",
            "type": "true_false_not_given",
            "question": "Gutenberg, icat ettiği matbaa sayesinde hayatının son yıllarında çok zengin bir adam olmuştur.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Gutenbergning boyib ketgani yoki umrining oxiri haqida ma'lumot yo'q."
          },
          {
            "id": "s15-p3-q5",
            "type": "true_false_not_given",
            "question": "Gutenberg'in matbaasında basılan ilk kitap, tıp tarihi hakkında yazılmış bir ansiklopedidir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Bastığı ilk eser 'Gutenberg İncili'dir (dini kitob)."
          },
          {
            "id": "s15-p3-q6",
            "type": "true_false_not_given",
            "question": "Matbaanın icadı, bilginin yayılmasını kolaylaştırarak Avrupa'da Rönesans'ın başlamasına büyük katkı sağlamıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'Rönesans hareketinin en büyük hazırlayıcısı olmuştur' denilmiştir."
          }
        ]
      },
      {
        "id": "s15-p4",
        "title": "Metaverse: Sanal Gerçeklikte Yeni Yaşam",
        "category": "Teknoloji ve Gelecek",
        "level": "C1",
        "content": "İnternetin 1990'lardaki ilk hali sadece yazıları okuyabildiğimiz, 2000'lerdeki hali ise fotoğraflar ve videolar paylaşabildiğimiz bir mecra iken; geleceğin interneti olarak adlandırılan 'Metaverse' tamamen içine girebildiğimiz 3 boyutlu bir sanal evrendir. [ 1 ]. Bu evrende insanlar klavye ve fare kullanmak yerine Sanal Gerçeklik (VR) gözlükleri takarak kendi üç boyutlu 'avatar'larıyla (sanal karakterleriyle) var olurlar. Metaverse'ün sadece oyun oynanan bir yer olduğu düşüncesi tamamen yanlıştır; şu an dev şirketler bu sanal evrende toplantılar düzenlemekte, konserler verilmekte ve hatta dijital kıyafetler satılmaktadır. [ 2 ]. Kimilerine göre bu durum, insanların fiziksel dünyadaki acı gerçeklerden kaçmak için sanal bir cennete sığınmasıdır (kaçış psikolojisi). Ancak teknoloji şirketleri, Metaverse'ün fiziksel sınırları (mesafeleri) kaldırarak eğitimde, tıpta ve ticarette fırsat eşitliği yaratacak devrimsel bir araç olduğunu savunmaktadır.",
        "questions": [
          {
            "id": "s15-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Yani ekranın dışından bakmak yerine, ekranın içine (sanal dünyanın kendisine) adım atarız.",
              "Günümüzde mektup göndermek e-posta atmaktan daha güvenlidir.",
              "Ancak sanal gerçeklik gözlükleri göz sağlığını çok hızlı bozmaktadır.",
              "Eski bilgisayarlar çok yavaş olduğu için 3 boyutlu oyunları açamazdı."
            ],
            "correctOption": 0,
            "explanation": "Bo'shliqdan oldin 'tamamen içine girebildiğimiz 3 boyutlu bir sanal evrendir' deyilgan, buni 'ekranın içine adım atarız' jumlasi mukammal davom ettiradi."
          },
          {
            "id": "s15-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Çocuklar dışarıda top oynamayı sanal oyunlara tercih etmektedir.",
              "Hatta bazı yatırımcılar Metaverse dünyasında milyonlarca dolar ödeyerek sanal arsalar ve emlak satın almaktadır.",
              "Bu gözlüklerin bataryaları yarım saatte tükenmektedir.",
              "Gelecekte internetin tamamen yasaklanması beklenmektedir."
            ],
            "correctOption": 1,
            "explanation": "Kompaniyalar u yerda uchrashuv o'tkazib, kiyim sotayotgani aytilgach, yana qanday savdolar (sanal arsalar, emlak) bo'layotgani mantiqan mos tushadi."
          },
          {
            "id": "s15-p4-q3",
            "type": "multiple_choice",
            "question": "Yazara göre internetin önceki evreleri ile 'Metaverse' arasındaki temel fark nedir?",
            "options": [
              "Metaverse'ün internetten çok daha yavaş olması.",
              "Eskiden sadece içeriklere ekrandan bakarken, Metaverse'te içeriğin (sanal evrenin) bizzat içinde (3 boyutlu) var olunması.",
              "Metaverse'ün sadece bilgisayar mühendisleri tarafından kullanılabilmesi.",
              "Eski internetin ücretsiz, Metaverse'ün çok pahalı olması."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'ekranın dışından bakmak yerine... tamamen içine girebildiğimiz' tushuntirilgan."
          },
          {
            "id": "s15-p4-q4",
            "type": "multiple_choice",
            "question": "Metaverse dünyasında insanların kendilerini temsil etmek için kullandıkları sanal karakterlere ne ad verilir?",
            "options": [
              "Robot",
              "Klon",
              "Avatar",
              "Hologram"
            ],
            "correctOption": 2,
            "explanation": "Matnda 'üç boyutlu avatarlarıyla (sanal karakterleriyle) var olurlar' deyilgan."
          },
          {
            "id": "s15-p4-q5",
            "type": "kelime",
            "question": "Metinde eleştirmenlerin Metaverse için kullandığı 'kaçış psikolojisi' ifadesi neyi anlatmaktadır?",
            "options": [
              "Sanal gerçeklik oyunlarında polislerden kaçmayı.",
              "İnsanların gerçek hayattaki zorluklardan (acı gerçeklerden) yüz çevirip sanal dünyanın sunduğu sahte mutluluğa sığınmasını.",
              "Gözlükleri çıkarıp gerçek hayata geri dönmeyi.",
              "Şehirden uzaklaşıp doğada yaşamayı (kamp yapmayı)."
            ],
            "correctOption": 1,
            "explanation": "Kaçış psikolojisi (Escapism) haqiqiy hayotdagi qiyinchiliklardan virtual olamga qochib berkinishdir."
          },
          {
            "id": "s15-p4-q6",
            "type": "cikarim",
            "question": "Teknoloji şirketlerine göre Metaverse, fırsat eşitliğini (eğitim vb.) nasıl sağlayacaktır?",
            "options": [
              "Herkesi zorla aynı okullara göndererek.",
              "Zenginlerden vergi almayarak.",
              "Fiziksel sınırları ve mesafeleri ortadan kaldırarak dünyanın öbür ucundaki bir eğitime veya imkana sanal olarak erişim sağlayarak.",
              "Herkese bedava bilgisayar dağıtarak."
            ],
            "correctOption": 2,
            "explanation": "Matn so'ngida 'fiziksel sınırları (mesafeleri) kaldırarak... fırsat eşitliği yaratacak' deyilgan."
          }
        ]
      },
      {
        "id": "s15-p5",
        "title": "Kendini Kandırma Sanatı: Bilişsel Çelişki",
        "category": "Psikoloji",
        "level": "C1",
        "content": "Sigara içmenin kansere yol açtığını ve ölümcül olduğunu çok iyi bilen bir doktorun, her gün bir paket sigara içmeye devam etmesi size ne kadar mantıklı geliyor? 1957 yılında psikolog Leon Festinger, insanın inançları (düşünceleri) ile davranışları birbiriyle çatıştığında ortaya çıkan bu derin içsel huzursuzluğa 'Bilişsel Çelişki' (Cognitive Dissonance) adını vermiştir. İnsan beyni çelişkileri (tutarsızlıkları) sevmez. Doktor, 'Ben sağlığı çok iyi bilen zeki bir insanım' inancıyla 'Kendimi zehirleyen bir sigara içiyorum' eylemi arasında sıkışır. Bu rahatsız edici duygudan kurtulmanın en mantıklı yolu davranışı değiştirmek (sigarayı bırakmak) olsa da, beyin genellikle daha kolay bir yol seçer: Kendini haklı çıkarma (rasyonalizasyon). Doktor kendi kendine 'Zaten stresli bir işim var, sigara beni rahatlatıyor' veya 'Benim dedem de sigara içerdi ama 90 yaşına kadar yaşadı' gibi bahaneler üreterek inancı ile davranışı arasındaki o rahatsız edici boşluğu kapatır. Özetle bilişsel çelişki, hatalarımızı düzeltmek yerine kendi yalanlarımıza inanmamıza neden olan kusurlu bir savunma mekanizmasıdır.",
        "questions": [
          {
            "id": "s15-p5-q1",
            "type": "ana_fikir",
            "question": "Bu metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Sigara içmek çok faydalı bir stres atma yöntemidir.",
              "Doktorlar genellikle stresli işleri yüzünden sağlıklı yaşayamazlar.",
              "İnsanlar düşünceleri ve eylemleri çeliştiğinde, davranışlarını düzeltmek yerine genellikle bahaneler (rasyonalizasyon) üreterek kendilerini kandırırlar.",
              "Psikolog Leon Festinger tıp tarihinin en önemli doktorudur."
            ],
            "correctOption": 2,
            "explanation": "Bilişsel çelişki (kognitiv dissonans) asosiy g'oyasi: inson harakatini to'g'rilash o'rniga miyasi bahona o'ylab topib o'zini aldaydi."
          },
          {
            "id": "s15-p5-q2",
            "type": "multiple_choice",
            "question": "Bilişsel Çelişki (Cognitive Dissonance) tam olarak ne zaman ortaya çıkar?",
            "options": [
              "İnsanlar çok fazla yemek yediklerinde.",
              "Kişinin sahip olduğu inançları (bildikleri) ile fiziksel eylemleri (davranışları) birbiriyle ters düştüğünde (çatıştığında).",
              "Sadece doktorlar hastalandığında.",
              "İki farklı insan bir konu üzerinde şiddetli bir kavgaya tutuştuğunda."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'insanın inançları ile davranışları birbiriyle çatıştığında' deb aniq yozilgan."
          },
          {
            "id": "s15-p5-q3",
            "type": "multiple_choice",
            "question": "Metindeki sigara içen doktor örneğinde, zihnin bilişsel çelişkiyi çözmek için bulması gereken asıl en mantıklı (sağlıklı) yol nedir?",
            "options": [
              "Sigaranın markasını değiştirmek.",
              "Doktorluk mesleğinden istifa etmek.",
              "Stresli ortamlardan uzak durmak.",
              "Çelişki yaratan kötü davranışı tamamen değiştirmek (sigarayı bırakmak)."
            ],
            "correctOption": 3,
            "explanation": "Matnda 'Bu rahatsız edici duygudan kurtulmanın en mantıklı yolu davranışı değiştirmek (sigarayı bırakmak) olsa da...' deyilgan."
          },
          {
            "id": "s15-p5-q4",
            "type": "kelime",
            "question": "Metinde geçen 'rasyonalizasyon (kendini haklı çıkarma)' kavramının açıklaması aşağıdakilerden hangisidir?",
            "options": [
              "Yapılan mantıksız veya yanlış bir davranışa, akla yatkın gibi görünen sahte bahaneler bularak kendini rahatlatmak.",
              "Matematiksel problemleri çok hızlı bir şekilde çözmek.",
              "Kendi hatalarını başkalarının önünde itiraf edip onlardan özür dilemek.",
              "Sürekli sağlıklı yiyecekler tüketmek."
            ],
            "correctOption": 0,
            "explanation": "Ratsionalizatsiya - noto'g'ri ishimizni mantiqiy qilib ko'rsatish uchun miya o'ylab topadigan yolg'on/bahonadir."
          },
          {
            "id": "s15-p5-q5",
            "type": "cikarim",
            "question": "Bilişsel Çelişki mekanizmasına göre, çevre kirliliğine çok karşı olduğunu (çevreci) savunan ama her yere kendi büyük benzinli aracıyla giden birisinin nasıl bir savunma (bahane) yapması beklenir?",
            "options": [
              "Hemen arabasını satıp bisiklet kullanmaya başlaması.",
              "'Benim tek bir arabamın çıkardığı gazdan ne olacak, asıl büyük fabrikalar dünyayı kirletiyor' diyerek kendini haklı çıkarması.",
              "Çevreci bir derneğe bağış yaparak suçunu affettirmesi.",
              "İnsanlara çevre hakkında yalan söylediğini itiraf etmesi."
            ],
            "correctOption": 1,
            "explanation": "O'zini oqlash (rasyonalizasyon) uchun odamlar shunday bahona topadilar (dedam ham chekardi, bitta menda nima bo'lardi vb.)."
          },
          {
            "id": "s15-p5-q6",
            "type": "multiple_choice",
            "question": "Yazar, bilişsel çelişkiyi sonuç olarak nasıl tanımlamaktadır?",
            "options": [
              "İnsanı hayatta başarılı kılan en önemli özellik.",
              "Hatalarımızı düzeltmek yerine kendi yalanlarımıza inanmamıza neden olan kusurlu bir savunma mekanizması.",
              "Zihni stresten uzak tutan harika bir tedavi.",
              "Sadece akıl hastalarında görülen nadir bir virüs."
            ],
            "correctOption": 1,
            "explanation": "Matn so'ngida aynan shu jumlalar: 'kendi yalanlarımıza inanmamıza neden olan kusurlu bir savunma mekanizmasıdır' ishlatilgan."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-16",
    "sectionNumber": 16,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_16.json",
    "passages": [
      {
        "id": "s16-p1",
        "title": "Üniversite Kampüs Trafik Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli öğrenciler ve personelimiz, kampüs içindeki yaya güvenliğini ve trafik akışını sağlamak için aşağıdaki kurallara uyulması zorunludur:\n1. Kampüs içindeki tüm yollarda araçlar için maksimum hız sınırı 30 km/s olarak belirlenmiştir.\n2. Araçlar sadece çizgilerle belirlenmiş otopark alanlarına park edilmelidir. Kaldırımlara veya çimlere park eden araçlar çekici ile kaldırılacaktır.\n3. Kampüs giriş kapılarında üniversite kimlik kartını (öğrenci/personel kartı) güvenlik görevlilerine göstermek zorunludur.\n4. Yaya geçitlerinde geçiş üstünlüğü her zaman yayalarındır. Sürücüler yaya geçitlerinde mutlaka durarak yol vermelidir.\n5. Motosiklet ve bisiklet kullanıcıları sürüş esnasında mutlaka kask takmalıdır.\nKurallara uymayanların kampüse araçla giriş izinleri iptal edilecektir.",
        "questions": [
          {
            "id": "s16-p1-q1",
            "type": "multiple_choice",
            "question": "Kampüs içindeki yollarda bir aracın çıkabileceği en yüksek hız ne kadardır?",
            "options": [
              "20 km/s",
              "30 km/s",
              "50 km/s",
              "Hız sınırı yoktur"
            ],
            "correctOption": 1,
            "explanation": "Maksimum hız sınırı 30 km/s olarak belirlenmiştir."
          },
          {
            "id": "s16-p1-q2",
            "type": "multiple_choice",
            "question": "Yanlış yere (kaldırım veya çimlere) park eden bir araca ne işlem yapılır?",
            "options": [
              "Aracın camı kırılır.",
              "Araç çekici ile bulunduğu yerden kaldırılır.",
              "Sadece para cezası yazılır.",
              "Araç sahibine hediye verilir."
            ],
            "correctOption": 1,
            "explanation": "Kaldırımlara veya çimlere park eden araçlar çekici ile kaldırılacaktır."
          },
          {
            "id": "s16-p1-q3",
            "type": "multiple_choice",
            "question": "Kampüse girmek isteyen bir kişi girişte ne yapmalıdır?",
            "options": [
              "Güvenlik görevlisine kimlik kartını (öğrenci/personel) göstermelidir.",
              "Giriş ücreti ödemelidir.",
              "Arabasının bagajını açmalıdır.",
              "Güvenlik görevlisiyle fotoğraf çektirmelidir."
            ],
            "correctOption": 0,
            "explanation": "Üniversite kimlik kartını güvenlik görevlilerine göstermek zorunludur."
          },
          {
            "id": "s16-p1-q4",
            "type": "multiple_choice",
            "question": "Yaya geçidinde (zebra crossing) trafik kuralı nedir?",
            "options": [
              "Sürücüler kornaya basarak yayaları uyarmalıdır.",
              "Yayalar araçların geçmesini beklemelidir.",
              "Geçiş üstünlüğü yayalarındır, sürücüler durup yol vermelidir.",
              "Yaya geçitleri sadece acil durumlar içindir."
            ],
            "correctOption": 2,
            "explanation": "Yaya geçitlerinde geçiş üstünlüğü her zaman yayalarındır. Sürücüler mutlaka durarak yol vermelidir."
          },
          {
            "id": "s16-p1-q5",
            "type": "multiple_choice",
            "question": "Motosiklet ve bisiklet süren kişiler için zorunlu olan kural nedir?",
            "options": [
              "Sadece gece sürmeleri",
              "Mutlaka kask takmaları",
              "Yanlarında yolcu taşımamaları",
              "Sadece spor kıyafet giymeleri"
            ],
            "correctOption": 1,
            "explanation": "Sürüş esnasında mutlaka kask takmalıdır."
          },
          {
            "id": "s16-p1-q6",
            "type": "multiple_choice",
            "question": "Kurallara uymayan sürücülerin karşılaşacağı en büyük ceza nedir?",
            "options": [
              "Üniversiteden atılmak",
              "Araçlarının boyanması",
              "Kampüse araçla giriş izinlerinin iptal edilmesi",
              "Kütüphaneye girememe cezası"
            ],
            "correctOption": 2,
            "explanation": "Kurallara uymayanların kampüse araçla giriş izinleri iptal edilecektir."
          }
        ]
      },
      {
        "id": "s16-p2",
        "title": "Stresle Başa Çıkma Yöntemleri",
        "category": "Sosyal Yaşam / Eşleştirme",
        "level": "B1",
        "content": "A) Hakan: Benim işim çok stresli ve gün sonunda beynim tamamen duruyor. Stresten kurtulmak için en iyi yolum spordur. Akşamları kum torbasını yumruklamak veya ağırlık kaldırmak (fitness) içimdeki o negatif enerjiyi tamamen boşaltmamı sağlıyor.\n\nB) Aylin: Ben stresli olduğumda insanlardan uzaklaşır, yalnız kalmak isterim. Odamın kapısını kapatır, telefonumu sessize alır ve saatlerce sadece resim çizerim. Renklerle oynamak ve kağıda odaklanmak bana terapi gibi geliyor.\n\nC) Can: Stresle tek başıma başa çıkamam. Ne zaman canım bir şeye sıkılsa veya kendimi baskı altında hissetsem, en yakın arkadaşımı ararım. Bir kafede oturup saatlerce derdimi anlatmak (konuşmak) üzerimdeki yükü hafifletiyor.\n\nD) Elif: Benim stres savarım tamamen evcil hayvanlarımdır. İş yerinde yaşadığım kötü bir olaydan sonra eve gelip kedimi kucağıma almak, onun mırıltısını dinlemek ve köpeğimle parkta yürüyüşe çıkmak beni anında sakinleştirir.",
        "questions": [
          {
            "id": "s16-p2-q1",
            "type": "matching_paragraph",
            "question": "Stresli zamanlarında yalnız kalmayı ve sanatsal üretim (çizim) yapmayı tercih eden kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 1,
            "explanation": "Aylin insanlardan uzaklaşıp yalnız kaldığını ve resim çizdiğini belirtmiştir."
          },
          {
            "id": "s16-p2-q2",
            "type": "matching_paragraph",
            "question": "İçindeki olumsuz (negatif) enerjiyi ağır fiziksel aktiviteler ve spor yaparak atan kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 0,
            "explanation": "Hakan kum torbasını yumrukladığını ve ağırlık kaldırdığını söylemiştir."
          },
          {
            "id": "s16-p2-q3",
            "type": "matching_paragraph",
            "question": "Stresten kurtulmak için hayvanların (kedi, köpek) sevgisine ve varlığına ihtiyaç duyan kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 3,
            "explanation": "Elif kedisini kucağına almanın ve köpeğiyle yürümenin onu sakinleştirdiğini anlatmıştır."
          },
          {
            "id": "s16-p2-q4",
            "type": "matching_paragraph",
            "question": "Problemlerini kendi içinde çözmek yerine güvendiği biriyle konuşarak (dertleşerek) rahatlayan kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 2,
            "explanation": "Can tek başına başa çıkamadığını ve en yakın arkadaşına derdini anlattığını belirtmiştir."
          },
          {
            "id": "s16-p2-q5",
            "type": "matching_paragraph",
            "question": "Stresliyken telefonunu kapatıp dış dünyayla iletişimini tamamen kesen kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 1,
            "explanation": "Aylin telefonunu sessize aldığını ve insanlardan uzaklaştığını söylemiştir."
          },
          {
            "id": "s16-p2-q6",
            "type": "matching_paragraph",
            "question": "Stresini sosyal bir ortamda (kafede vb.) sohbet ederek azaltan kişi kimdir?",
            "options": [
              "A) Hakan",
              "B) Aylin",
              "C) Can",
              "D) Elif"
            ],
            "correctOption": 2,
            "explanation": "Can bir kafede oturup saatlerce derdini anlattığını ifade etmiştir."
          }
        ]
      },
      {
        "id": "s16-p3",
        "title": "Mikropların Katili: Penisilin'in Keşfi",
        "category": "Tarih ve Bilim",
        "level": "B2",
        "content": "Tıp tarihinin akışını değiştiren en büyük keşiflerden biri, 1928 yılında İskoç bilim insanı Alexander Fleming tarafından tamamen bir 'tesadüf' eseri yapılmıştır. Fleming, laboratuvarında zararlı bakteriler (stafilokok) üzerinde çalışıyordu. Tatile çıkarken petri kaplarını temizlemeyi unutan Fleming, geri döndüğünde kaplardan birinin içinde yeşil bir küf (mantar) oluştuğunu fark etti. İşin mucizevi kısmı, bu küfün etrafındaki bütün zararlı bakterilerin ölmüş (parçalanmış) olmasıydı. Fleming bu küfe 'Penicillium notatum' adını verdi. Başlangıçta bilim dünyası bu keşfe fazla ilgi göstermedi. Ancak İkinci Dünya Savaşı sırasında yaralı askerlerin enfeksiyon kaparak ölmesini engellemek için acil bir ilaca ihtiyaç duyulduğunda, penisilin seri üretime geçirildi. Savaşta binlerce askerin hayatını kurtaran bu ilk antibiyotik, zatürre ve menenjit gibi ölümcül hastalıkları da tarihe karıştırdı. Fleming bu başarısıyla 1945 yılında Nobel Tıp Ödülü'nü kazandı.",
        "questions": [
          {
            "id": "s16-p3-q1",
            "type": "true_false_not_given",
            "question": "Alexander Fleming, penisilini yıllar süren planlı ve dikkatli deneyler sonucunda laboratuvarda bilinçli olarak icat etmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'tamamen bir tesadüf eseri yapılmıştır' ve temizlemeyi unuttuğu için oluştuğu yazılmıştır."
          },
          {
            "id": "s16-p3-q2",
            "type": "true_false_not_given",
            "question": "Fleming'in petri kabında oluşan yeşil küf, etrafındaki zararlı bakterileri yok etmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'bu küfün etrafındaki bütün zararlı bakterilerin ölmüş olmasıydı' denilmiştir."
          },
          {
            "id": "s16-p3-q3",
            "type": "true_false_not_given",
            "question": "Penisilin keşfedildiği 1928 yılında hemen tüm dünyada seri üretime geçmiş ve satılmaya başlanmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Başlangıçta bilim dünyası fazla ilgi göstermedi, İkinci Dünya Savaşı'nda seri üretime geçirildi."
          },
          {
            "id": "s16-p3-q4",
            "type": "true_false_not_given",
            "question": "İkinci Dünya Savaşı'nda yaralı askerlerin enfeksiyondan ölmesini engellemek penisilinin önemini artırmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. Savaşta yaralı askerler için acil ilaca ihtiyaç duyulduğunda seri üretime geçirildiği belirtilmiştir."
          },
          {
            "id": "s16-p3-q5",
            "type": "true_false_not_given",
            "question": "Fleming, Nobel Ödülü'nü aldıktan sonra elde ettiği parayı yoksullara bağışlamıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Mukofot puli bilan nima qilgani haqida hech qanday ma'lumot yo'q."
          },
          {
            "id": "s16-p3-q6",
            "type": "true_false_not_given",
            "question": "Penisilin; zatürre, menenjit ve kanser gibi birçok ölümcül hastalığı kesin olarak tedavi etmektedir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Zatürre ve menenjit için söylense de, 'kanser' tedavisi ile ilgili bir bilgi yoktur, kanseri antibiyotik tedavi etmez."
          }
        ]
      },
      {
        "id": "s16-p4",
        "title": "Dikey Tarım (Vertical Farming): Şehirde Hasat Zamanı",
        "category": "Ekoloji ve Tarım",
        "level": "C1",
        "content": "Dünya nüfusunun 2050 yılına kadar 10 milyara ulaşması bekleniyor ve geleneksel tarım arazileri artık insanlığı beslemeye yetmiyor. [ 1 ]. Dikey tarım; sebze ve meyvelerin geniş tarlalarda değil, gökdelenler, eski fabrikalar veya kargo konteynerleri gibi kapalı alanlarda kat kat raflar (katmanlar) halinde yetiştirilmesi sistemidir. Bu sistemde toprak (güneş ışığı) kullanılmaz; bitkiler ihtiyaç duydukları besini özel sularla (hidroponik) ve LED ışıklandırmalarla alırlar. [ 2 ]. Geleneksel tarıma kıyasla dikey tarım, su kullanımını %95 oranında azaltırken ürün verimliliğini on kat artırmaktadır. Ayrıca ürünler kapalı ve steril ortamda yetiştiği için zararlı böcek ilaçlarına (pestisit) hiç ihtiyaç duyulmaz. En büyük avantajı ise gıdanın tam olarak tüketileceği yerde (şehirlerin kalbinde) üretilmesi sayesinde nakliye masraflarını ve karbon emisyonunu sıfıra indirmesidir. Dikey tarımın şu anki tek dezavantajı, yapay LED ışıkların tükettiği yüksek elektrik maliyetidir.",
        "questions": [
          {
            "id": "s16-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Bununla birlikte çiftçiler köylerden şehirlere göç etmeye devam ediyor.",
              "Bu gıda krizini çözmek ve şehirlere taze ürün sağlamak için bilim insanları 'Dikey Tarım' konseptini geliştirdiler.",
              "Uzayda tarım yapmak henüz çok pahalı ve tehlikeli bir yöntemdir.",
              "Dünyadaki birçok orman tarım arazisi açmak için yakılmaktadır."
            ],
            "correctOption": 1,
            "explanation": "İlk cümlede tarım arazilerinin yetmediği (gıda krizi) belirtilmiştir, çözüm olarak da dikey tarım konsepti sunulmalıdır."
          },
          {
            "id": "s16-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Dikey tarım tesisleri dışarıdan çok çirkin görünmektedir.",
              "Bu sayede bitkilerin büyüme hızı mevsim şartlarına ve hava durumuna (yağmur, kuraklık) bağlı kalmaktan kurtulur.",
              "Konteynerlerin içi sadece kış aylarında sıcak tutulur.",
              "LED ışıkların radyasyon yaydığı iddia edilmektedir."
            ],
            "correctOption": 1,
            "explanation": "Toprak ve güneş kullanılmadan (kapalı sistemde) yetiştirildiği için bitkilerin mevsim şartlarına (dış etkenlere) bağlı kalmayacağı belirtilmelidir."
          },
          {
            "id": "s16-p4-q3",
            "type": "multiple_choice",
            "question": "Metne göre dikey tarımda (vertical farming) sebzeler nasıl yetiştirilir?",
            "options": [
              "Dağların zirvelerindeki geniş açık tarlalarda.",
              "Toprak kullanmadan, kapalı alanlarda üst üste dizilmiş raflarda özel su ve LED ışıklarla.",
              "Evlerin balkonlarındaki küçük saksılarda doğal güneş ışığıyla.",
              "Sadece nehir ve göl kenarlarındaki çamurlu topraklarda."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'gökdelenler... kapalı alanlarda kat kat raflar... toprak kullanılmaz... LED ışıklandırmalarla' deyilgan."
          },
          {
            "id": "s16-p4-q4",
            "type": "multiple_choice",
            "question": "Dikey tarımın çevreye ve tüketiciye sağladığı faydalardan biri değildir?",
            "options": [
              "Üretimde su tasarrufunu %95 oranında artırması.",
              "Böcek ilacı (pestisit) kullanılmadığı için ürünlerin daha sağlıklı olması.",
              "Elektrik enerjisi kullanımını tamamen sıfıra indirmesi.",
              "Gıdalar şehir içinde üretildiği için nakliye kaynaklı karbon kirliliğini engellemesi."
            ],
            "correctOption": 2,
            "explanation": "Elektrik sarfiyatını sıfırlamaz, aksine metnin sonunda tek dezavantajının 'yüksek elektrik maliyeti' olduğu belirtilmiştir."
          },
          {
            "id": "s16-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'steril ortam' ifadesi hangi anlama gelmektedir?",
            "options": [
              "Çok karanlık ve soğuk olan yer.",
              "Mikroplardan, zararlı canlılardan ve dış etkilerden arındırılmış temiz ortam.",
              "İnsanların yaşayamayacağı zehirli alan.",
              "Sadece bilim insanlarının girmesine izin verilen gizli oda."
            ],
            "correctOption": 1,
            "explanation": "Steril - mikroblardan va tashqi zararlardan xoli toza muhit."
          },
          {
            "id": "s16-p4-q6",
            "type": "cikarim",
            "question": "Bu metinden çıkarılabilecek sonuca göre dikey tarımın gıda güvenliği açısından en büyük yeniliği nedir?",
            "options": [
              "Dünyadaki herkesin bedava yemek yemesini sağlaması.",
              "İklim değişikliklerinden, mevsimlerden (kış-yaz) veya kuraklıktan etkilenmeden yılın 365 günü üretim yapılabilmesi.",
              "Sadece en zengin insanların alabileceği kadar pahalı sebzeler üretmesi.",
              "Tarımı sadece robotlara bırakarak çiftçilik mesleğini yok etmesi."
            ],
            "correctOption": 1,
            "explanation": "Kapalı ortamda quyosh va tuproqsiz bo'lgani uchun, ob-havo qanday bo'lishidan qat'iy nazar uzluksiz hosil beradi (10 baravar hosildor)."
          }
        ]
      },
      {
        "id": "s16-p5",
        "title": "Sosyal Medyanın Güzellik Baskısı: Beden Algısı Bozukluğu",
        "category": "Psikoloji",
        "level": "C1",
        "content": "Aynaya baktığınızda burnunuzun çok büyük, cildinizin çok lekeli veya vücudunuzun çok kilolu olduğunu düşünüp saatlerce kendinizi inceliyor musunuz? Psikiyatride 'Beden Algısı Bozukluğu' (Dismorfofobi) olarak adlandırılan bu rahatsızlık, kişinin fiziksel görünümündeki küçük (veya hayali) bir kusuru saplantı haline getirmesidir. Son 10 yılda sosyal medyanın (özellikle Instagram ve TikTok) yükselişi, bu hastalığın gençler arasındaki oranını patlama noktasına getirmiştir. Çünkü sosyal medyada sergilenen pürüzsüz ciltler, ince beller ve kusursuz yüz hatları genellikle filtreler, fotoğraf düzenleme programları (Photoshop) ve estetik müdahalelerle elde edilmiş 'sahte' görüntülerdir. Gerçek dünyada yaşayan bir birey, kendini bu sanal ve ulaşılmaz 'mükemmellik' standardıyla kıyasladığında, kendi doğal bedeninden iğrenmeye ve ciddi özgüven kayıpları yaşamaya başlar. Plastik cerrahlara göre günümüzde gençler artık bir ünlüye benzemek için değil, 'Snapchat filtrelerindeki hallerine' benzemek için estetik ameliyat masasına yatmaktadır. Bu zehirli döngüden kurtulmanın yolu, sosyal medyada gördüklerimizin kurgulanmış bir illüzyon (tiyatro) olduğunu fark etmek ve gerçekçi beden olumlaması yapmaktır.",
        "questions": [
          {
            "id": "s16-p5-q1",
            "type": "ana_fikir",
            "question": "Metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Estetik ameliyatlar insanları her zaman daha mutlu eder.",
              "Sosyal medyadaki sahte ve filtreli mükemmellik algısı, gençlerde kendi bedenlerinden nefret etme ve saplantılı algı bozukluklarına neden olmaktadır.",
              "Günümüzde gençler sadece ünlü aktörlere benzemek istemektedir.",
              "Instagram ve TikTok uygulamaları tamamen kapatılmalıdır."
            ],
            "correctOption": 1,
            "explanation": "Asosiy g'oya ijtimoiy tarmoqlardagi soxta mukammallik (filtre) yoshlarda tana haqidagi tasavvurni buzib, psixologik kasallikka sabab bo'layotganidir."
          },
          {
            "id": "s16-p5-q2",
            "type": "multiple_choice",
            "question": "Beden Algısı Bozukluğu (Dismorfofobi) hastalığı yaşayan birinin temel davranışı nedir?",
            "options": [
              "Sürekli spor yapıp hiç yemek yememesi.",
              "Dış görünüşündeki küçük veya hayali bir kusuru saplantı (takıntı) haline getirip kendini sürekli eleştirmesi.",
              "Başkalarının dış görünüşüyle alay etmesi.",
              "Aynalara bakmaktan tamamen kaçınması."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'fiziksel görünümündeki küçük (veya hayali) bir kusuru saplantı haline getirmesidir' deb aniq ta'riflangan."
          },
          {
            "id": "s16-p5-q3",
            "type": "multiple_choice",
            "question": "Plastik cerrahlara göre gençlerin estetik ameliyat olma motivasyonundaki yeni ve şaşırtıcı eğilim nedir?",
            "options": [
              "Sadece burun estetiği yaptırmak istemeleri.",
              "Çok sevdikleri bir şarkıcıya (ünlüye) benzemek için ameliyat olmaları.",
              "Sosyal medyadaki filtreli (Snapchat) fotoğraflarındaki kendi kurgusal hallerine benzemek istemeleri.",
              "Ameliyatların ücretsiz olduğunu düşünmeleri."
            ],
            "correctOption": 2,
            "explanation": "Gençler artık bir ünlüye benzemek için değil, 'Snapchat filtrelerindeki hallerine' benzemek için estetik ameliyat oluyorlar."
          },
          {
            "id": "s16-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'illüzyon' kelimesi hangi anlama gelmektedir?",
            "options": [
              "Bir şeyin çok hızlı hareket etmesi.",
              "Gerçekte olmayan bir şeyi varmış gibi gösteren sahte görüntü, yanılsama.",
              "Psikolojik bir rahatsızlık.",
              "Ameliyat sırasında kullanılan tıbbi bir alet."
            ],
            "correctOption": 1,
            "explanation": "İllüzyon - aslida mavjud bo'lmagan soxta tasavvur (sarob, yanılsama) degani."
          },
          {
            "id": "s16-p5-q5",
            "type": "cikarim",
            "question": "Yazara göre, sosyal medyanın yarattığı bu psikolojik hasardan (zehirli döngüden) korunmanın yöntemi nedir?",
            "options": [
              "Daha fazla estetik ameliyat yaptırarak o standarda ulaşmaya çalışmak.",
              "Sosyal medyadaki görüntülerin gerçek dışı, düzenlenmiş (sahte) kurgular olduğunun bilincine varmak.",
              "Sadece çok güzel ve yakışıklı insanları takip etmek.",
              "Ekrana hiç bakmadan sürekli uyumak."
            ],
            "correctOption": 1,
            "explanation": "Matn oxirida yechim sifatida: 'sosyal medyada gördüklerimizin kurgulanmış bir illüzyon olduğunu fark etmek' deyilgan."
          },
          {
            "id": "s16-p5-q6",
            "type": "multiple_choice",
            "question": "Gençlerin kendi doğal bedenlerinden iğrenmeye başlamasının asıl tetikleyicisi nedir?",
            "options": [
              "Çevrelerindeki gerçek insanların onlarla dalga geçmesi.",
              "Okuldaki öğretmenlerinin baskısı.",
              "Kendilerini sosyal medyada sergilenen ve filtrelerle yaratılmış ulaşılmaz 'mükemmellik' standardı ile kıyaslamaları.",
              "Gerçekten çok hasta olmaları."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'kendini bu sanal ve ulaşılmaz 'mükemmellik' standardıyla kıyasladığında... özgüven kayıpları yaşamaya başlar' yozilgan."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-17",
    "sectionNumber": 17,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_17.json",
    "passages": [
      {
        "id": "s17-p1",
        "title": "Halk Kütüphanesi Ödünç Kitap Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Kütüphanemizden daha fazla kişinin yararlanabilmesi için kitap ödünç alma kurallarına lütfen dikkat ediniz:\n1. Üyeler tek seferde en fazla 3 adet kitap ödünç alabilirler.\n2. Kitapların iade süresi 15 gündür. Süre bitmeden kütüphaneye gelerek veya internet sitesi üzerinden süreyi bir kez daha (15 gün) uzatabilirsiniz.\n3. Zamanında iade edilmeyen her kitap için günlük 2 TL gecikme cezası uygulanır. Gecikme cezası 50 TL'yi aşan üyelerin kartları iptal edilir.\n4. Ödünç alınan kitapların sayfalarının yırtılması veya kitabın kaybedilmesi durumunda, üye kitabın güncel satış fiyatını ödemek zorundadır.\n5. Dergiler, ansiklopediler ve nadir eserler (eski el yazmaları) kütüphane dışına çıkarılamaz; sadece okuma salonunda incelenebilir.",
        "questions": [
          {
            "id": "s17-p1-q1",
            "type": "multiple_choice",
            "question": "Bir kütüphane üyesi aynı anda en fazla kaç kitap alabilir?",
            "options": [
              "1 adet",
              "3 adet",
              "5 adet",
              "Sınır yoktur"
            ],
            "correctOption": 1,
            "explanation": "Üyeler tek seferde en fazla 3 adet kitap ödünç alabilirler."
          },
          {
            "id": "s17-p1-q2",
            "type": "multiple_choice",
            "question": "Kitabını 15 gün içinde okuyup bitiremeyen bir kişi ne yapmalıdır?",
            "options": [
              "Kitabı gizlice kütüphaneye bırakıp kaçmalıdır.",
              "Kitabı yeni bir kitapla değiştirmelidir.",
              "Kütüphaneye gelerek veya internetten iade süresini 15 gün daha uzatmalıdır.",
              "Gecikme cezası ödememek için kitabı yırtmalıdır."
            ],
            "correctOption": 2,
            "explanation": "İnternet sitesi üzerinden veya gelerek süreyi bir kez daha (15 gün) uzatabilirsiniz."
          },
          {
            "id": "s17-p1-q3",
            "type": "multiple_choice",
            "question": "Kitabı 5 gün geç iade eden bir kişi ne kadar ceza öder?",
            "options": [
              "Ceza ödemez.",
              "5 TL",
              "10 TL",
              "50 TL"
            ],
            "correctOption": 2,
            "explanation": "Günlük 2 TL ceza vardır. 5 x 2 = 10 TL öder."
          },
          {
            "id": "s17-p1-q4",
            "type": "multiple_choice",
            "question": "Kütüphaneden aldığı kitabı kaybeden veya yırttan bir kişinin sorumluluğu nedir?",
            "options": [
              "Sadece bir daha kütüphaneye gelmemektir.",
              "Polise şikayet edilir.",
              "Kendi evinden başka bir kitap getirmelidir.",
              "Kaybedilen kitabın güncel satış fiyatını kütüphaneye ödemelidir."
            ],
            "correctOption": 3,
            "explanation": "Kitabın güncel satış fiyatını ödemek zorundadır."
          },
          {
            "id": "s17-p1-q5",
            "type": "multiple_choice",
            "question": "Aşağıdaki eserlerden hangisi kütüphane dışına (eve) götürülebilir?",
            "options": [
              "Tarihi el yazmaları (nadir eserler)",
              "Ansiklopediler",
              "Normal okuma kitapları (romanlar vb.)",
              "Aylık dergiler"
            ],
            "correctOption": 2,
            "explanation": "Dergiler, ansiklopediler ve nadir eserler kütüphane dışına çıkarılamaz. Geriye normal kitaplar kalır."
          },
          {
            "id": "s17-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin temel yazılış amacı nedir?",
            "options": [
              "Kütüphanenin adresini tarif etmek",
              "Yeni çıkan kitapların reklamını yapmak",
              "Kitap ödünç alma ve iade etme düzenini sağlamak",
              "İnsanlara zorla kitap okutmak"
            ],
            "correctOption": 2,
            "explanation": "Bu kurallar ödünç kitap düzenini (ödünç alma/iade etme) sağlamak için yazılmıştır."
          }
        ]
      },
      {
        "id": "s17-p2",
        "title": "Üniversite Sınavına Hazırlık Taktikleri",
        "category": "Eğitim / Eşleştirme",
        "level": "B1",
        "content": "A) Mert: Sınavlara hazırlanırken benim tek güvendiğim şey bolca deneme sınavı (pratik test) çözmektir. Konu anlatımı dinlemek beni çok sıkıyor. Hata yaptığım soruların cevaplarına bakarak konuyu test üzerinden kendi kendime öğreniyorum.\n\nB) Buse: Ben tamamen disiplin ve plana inanırım. Duvarımda aylar öncesinden hazırlanmış renkli bir çalışma programı vardır. Her gün saat kaçta kalkacağım, hangi konuya çalışıp kaç soru çözeceğim dakikası dakikasına bellidir. Planım bozulursa çok stres olurum.\n\nC) Ozan: Benim en iyi çalışma taktiğim 'başkasına anlatmak'tır. Bir konuyu kendi başıma okuduktan sonra evdeki kardeşimi veya arkadaşlarımı karşıma oturtur, sanki öğretmenmişim gibi konuyu onlara anlatırım. Anlatırken bilgilerin beynime kazındığını hissediyorum.\n\nD) Aylin: Uzun süre masa başında kalmak bana göre değil. Ben 'Pomodoro' tekniğini kullanıyorum. 25 dakika odaklanarak çalışıp, ardından 5 dakika mutlaka müzik dinleyerek ara veriyorum. Kısa ve yoğun çalışma seansları benim dikkatimi her zaman yüksek tutuyor.",
        "questions": [
          {
            "id": "s17-p2-q1",
            "type": "matching_paragraph",
            "question": "Konuları, karşısında biri varmış gibi yüksek sesle öğreterek pekiştiren kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 2,
            "explanation": "Ozan, birilerini karşına oturtup öğretmenmiş gibi anlatarak çalıştığını söylemiştir."
          },
          {
            "id": "s17-p2-q2",
            "type": "matching_paragraph",
            "question": "Uzun süre odaklanamayan, bu yüzden çalışmasını kısa zaman dilimlerine ve molalara bölen kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 3,
            "explanation": "Aylin uzun süre masa başında kalamadığını ve 25 dakika çalışıp 5 dakika ara verdiğini belirtmiştir."
          },
          {
            "id": "s17-p2-q3",
            "type": "matching_paragraph",
            "question": "Başarısını tamamen katı (esnemeyen) bir zaman yönetimine ve programa bağlayan kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 1,
            "explanation": "Buse disiplin ve plana inandığını, dakikası dakikasına uyduğunu ifade etmiştir."
          },
          {
            "id": "s17-p2-q4",
            "type": "matching_paragraph",
            "question": "Teori (konu dinlemek) yerine doğrudan soru ve deneme çözerek (pratik yaparak) öğrenen kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 0,
            "explanation": "Mert konu dinlemekten sıkıldığını ve bolca deneme çözerek test üzerinden öğrendiğini belirtmiştir."
          },
          {
            "id": "s17-p2-q5",
            "type": "matching_paragraph",
            "question": "Çalışma saatlerinde günlük programından saptığında (programı bozulduğunda) endişelenen kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 1,
            "explanation": "Buse 'Planım bozulursa çok stres olurum' demiştir."
          },
          {
            "id": "s17-p2-q6",
            "type": "matching_paragraph",
            "question": "Çalışırken hata yaptığı (yanlış çözdüğü) soruların üzerinden konuları kavrayan kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 0,
            "explanation": "Mert, hata yaptığı soruların cevaplarına bakarak konuyu öğrendiğini söylemiştir."
          }
        ]
      },
      {
        "id": "s17-p3",
        "title": "Radyoaktivitenin Annesi: Marie Curie",
        "category": "Tarih ve Biyografi",
        "level": "B2",
        "content": "Polonya asıllı Fransız fizikçi ve kimyager Marie Curie, bilim tarihinin en önemli ve efsanevi kadın figürüdür. 19. yüzyılın sonlarında eşi Pierre Curie ile birlikte uranyum madeni üzerinde çalışırken 'radyoaktivite' kavramını keşfetmiş ve polonyum ile radyum elementlerini bulmuştur. Bilim dünyasında kadınların ciddiye alınmadığı bir dönemde, 1903 yılında Nobel Fizik Ödülü'nü (eşinin ısrarıyla) kazanarak bu ödülü alan ilk kadın olmuştur. Daha da inanılmazı, 1911 yılında bu kez Nobel Kimya Ödülü'nü tek başına kazanarak tarihte iki farklı bilim dalında Nobel kazanan tek insan unvanına erişmesidir. Curie, çalışmalarının patentini alıp zengin olmak yerine, radyum elementinin tıp dünyasında (özellikle kanser tümörlerinin tedavisinde) kullanılması için tüm formüllerini insanlığa ücretsiz olarak bağışlamıştır. Ne yazık ki, yıllarca laboratuvarda korunmasız bir şekilde radyasyona maruz kalması nedeniyle lösemi hastalığına yakalanmış ve 1934 yılında hayatını kaybetmiştir. Bilim uğruna kendi hayatını feda etmesi, onu ölümsüzleştirmiştir.",
        "questions": [
          {
            "id": "s17-p3-q1",
            "type": "true_false_not_given",
            "question": "Marie Curie, radyoaktivite üzerine yaptığı ilk çalışmaları eşi Pierre Curie ile birlikte gerçekleştirmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. '19. yüzyılın sonlarında eşi Pierre Curie ile birlikte... çalışırken' deyilgan."
          },
          {
            "id": "s17-p3-q2",
            "type": "true_false_not_given",
            "question": "Marie Curie, dünyada Nobel Ödülü'nü kazanan ilk insandır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. İlk insan emas, 'bu ödülü alan ilk kadın olmuştur' deyilgan."
          },
          {
            "id": "s17-p3-q3",
            "type": "true_false_not_given",
            "question": "Curie, tarihte iki farklı bilim dalında (Fizik ve Kimya) Nobel Ödülü kazanan tek insandır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'iki farklı bilim dalında Nobel kazanan tek insan unvanına erişmesidir' deb yozilgan."
          },
          {
            "id": "s17-p3-q4",
            "type": "true_false_not_given",
            "question": "Marie Curie, radyum elementinin telif hakkını satarak çok büyük bir servet kazanmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'patentini alıp zengin olmak yerine... insanlığa ücretsiz olarak bağışlamıştır' deyilgan."
          },
          {
            "id": "s17-p3-q5",
            "type": "true_false_not_given",
            "question": "Radyum elementi günümüzde hala sadece kanser tedavisinde kullanılmaktadır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. 'Özellikle kanser tümörlerinin tedavisinde' deb aytilgan, lekin Hali ham FAQAT shu maqsad uchun ishlashi haqida ma'lumot yo'q."
          },
          {
            "id": "s17-p3-q6",
            "type": "true_false_not_given",
            "question": "Curie'nin ölüm nedeni, üzerinde çalıştığı radyoaktif elementlerin vücuduna verdiği kalıcı zarardır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'radyasyona maruz kalması nedeniyle lösemi hastalığına yakalanmış ve... hayatını kaybetmiştir' yozilgan."
          }
        ]
      },
      {
        "id": "s17-p4",
        "title": "Abonelik Tuzağı: Hiç Kullanmadığımız Şeylere Neden Para Ödüyoruz?",
        "category": "Ekonomi ve Psikoloji",
        "level": "C1",
        "content": "Dijital çağın en karlı iş modeli şüphesiz ki 'Abonelik Sistemi'dir (Subscription Economy). Eskiden filmleri, müzikleri veya yazılımları tek seferlik bir ücret ödeyerek satın alırdık. Günümüzde ise şirketler, ürünü bize satmak yerine aylık küçük ücretler karşılığında kiralamayı tercih ediyor. Netflix, Spotify veya spor salonu üyelikleri bu modelin en iyi örnekleridir. [ 1 ]. Tüketici psikolojisinde buna 'Kayıptan Kaçınma' (Loss Aversion) zafiyeti denir. Aylık 50 TL gibi küçük bir rakam, beynimize o hizmeti iptal etmenin yaratacağı 'belki yarın izlerim' veya 'belki haftaya spora başlarım' şeklindeki potansiyel kayıp hissinden daha az acı verir. [ 2 ]. Otomatik ödeme talimatları sayesinde bu küçük ücretler, biz farkına bile varmadan yıllarca kredi kartımızdan çekilmeye devam eder. Ekonomistlere göre ortalama bir birey, her ay hiç kullanmadığı dijital platformlara yüzlerce lira ödeyerek şirketlerin devasa servetler kazanmasına 'uykuda' katkı sağlamaktadır.",
        "questions": [
          {
            "id": "s17-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Müzik dinlemek insanları her zaman rahatlatır.",
              "Ancak işin ilginç tarafı, çoğu insanın aylar boyunca bu platformları hiç kullanmamasına rağmen aboneliklerini iptal etmemesidir.",
              "Korsan film izlemek yasal olarak büyük bir suçtur.",
              "Eskiden sadece gazeteler için abonelik yapılırdı."
            ],
            "correctOption": 1,
            "explanation": "Bo'shliqdan oldin abonementlarning turlari (Netflix, Spotify) sanaldi, keyin esa buni psixologik 'Kayıptan Kaçınma' deyishini izohladi. Demak o'rtaga 'odamlar buni ishlatmasa ham bekor qilmasligi' jumlasi tushishi kerak."
          },
          {
            "id": "s17-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Buna ek olarak, şirketler iptal işlemlerini kasıtlı olarak karmaşık ve zor hale getirerek süreci uzatırlar.",
              "Spora gitmek sağlıklı bir yaşam için çok önemlidir.",
              "İnsanlar maaşlarını genellikle ayın ilk haftasında alırlar.",
              "Televizyon dizileri son yıllarda çok kalitesizleşmiştir."
            ],
            "correctOption": 0,
            "explanation": "Keyingi gapda 'Otomatik ödeme' orqali yillar davomida pul yechilishi aytiladi, unga bog'lash uchun 'iptal (bekor qilish) ni qiyinlashtirishlari' buni mukammal to'ldiradi."
          },
          {
            "id": "s17-p4-q3",
            "type": "multiple_choice",
            "question": "Abonelik (Subscription) ekonomisinin eskiden kullanılan alışveriş modelinden en büyük farkı nedir?",
            "options": [
              "Ürünlerin eskisine göre daha pahalı olması.",
              "Kişinin ürüne tamamen sahip olmak (tek seferde satın almak) yerine, küçük aylık ödemelerle ürünü veya hizmeti kiralaması.",
              "Sadece interneti olmayan kişilere hizmet vermesi.",
              "Alışverişin sadece nakit parayla yapılması."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'tek seferlik bir ücret ödeyerek satın alırdık. Günümüzde ise... aylık küçük ücretler karşılığında kiralamayı tercih ediyor' deyilgan."
          },
          {
            "id": "s17-p4-q4",
            "type": "kelime",
            "question": "Metindeki 'Kayıptan Kaçınma' (Loss Aversion) ifadesi neyi anlatmaktadır?",
            "options": [
              "Bir insanın parasını veya eşyasını çaldırmaktan korkması.",
              "Küçük bir maddi bedel ödemeyi, o hizmete erişim hakkını kaybetmenin yaratacağı rahatsızlık ve pişmanlık hissine tercih etme psikolojisi.",
              "Şirketlerin zarar etmemek için fiyatları artırması.",
              "İnsanların kalabalıkta kaybolma korkusu."
            ],
            "correctOption": 1,
            "explanation": "Kayıptan Kaçınma - bir narsani butunlay yo'qotgandan ko'ra, kichik pul to'lab ushlab turishni ma'qul ko'rish."
          },
          {
            "id": "s17-p4-q5",
            "type": "multiple_choice",
            "question": "Metne göre insanların kullanmadıkları abonelikleri iptal etmemesinin bir diğer teknik nedeni nedir?",
            "options": [
              "Otomatik ödeme talimatları sayesinde paranın hesaptan sessizce ve fark edilmeden çekilmesi.",
              "İptal edenlere hapishane cezası verilmesi.",
              "Müşteri hizmetlerinin sürekli telefonla arayıp insanları ikna etmesi.",
              "İnternetin çok yavaş olması."
            ],
            "correctOption": 0,
            "explanation": "Matnda 'Otomatik ödeme talimatları sayesinde... biz farkına bile varmadan yıllarca kredi kartımızdan çekilmeye devam eder' deyilgan."
          },
          {
            "id": "s17-p4-q6",
            "type": "cikarim",
            "question": "Yazara göre 'uykuda katkı sağlamak' ifadesiyle tüketicilerin hangi durumu eleştirilmektedir?",
            "options": [
              "Gece geç saatlerde internetten çok fazla dizi izlemeleri.",
              "İnsanların uyurken televizyonu açık bırakarak elektrik israfı yapmaları.",
              "Tüketicilerin finansal farkındalıklarının olmaması ve kendi ceplerinden çıkan parayı sorgulamadan (bilinçsizce) şirketleri zengin etmeleri.",
              "Bankaların çok fazla kredi vermesi."
            ],
            "correctOption": 2,
            "explanation": "Uykuda (uyquda) pul to'lash — bu o'z byudjetini nazorat qilmaslik (bilinçsizlik) ni bildiradi."
          }
        ]
      },
      {
        "id": "s17-p5",
        "title": "Hayvan Deneyleri: Bilimin Karanlık Yüzü",
        "category": "Biyoloji ve Etik",
        "level": "C1",
        "content": "Modern tıbbın, farmakolojinin ve hatta kozmetik endüstrisinin günümüzdeki seviyesine ulaşmasında hayvan deneylerinin rolü tartışılmazdır. Aşılar, kanser ilaçları ve ameliyat teknikleri geliştirilirken her yıl milyonlarca fare, tavşan, köpek ve maymun laboratuvarlarda kullanılmakta (ve çoğu zaman feda edilmektedir). Bilim insanlarının büyük bir kısmı, insan hayatını kurtarmak ve hastalıkları yenmek için hayvan deneklerinin 'gerekli bir kötülük' olduğunu savunmaktadır. Çünkü bir ilacın insan vücudundaki karmaşık yan etkileri bilgisayar simülasyonlarıyla henüz tam olarak ölçülememektedir. Ancak Hayvan Hakları Savunucuları, hisseden ve acı çeken canlıların insanların refahı için laboratuvarlarda işkence görmesinin ahlaki (etik) bir felaket olduğunu belirtmektedir. Üstelik bir farede işe yarayan bir ilacın, genetik farklılıklar nedeniyle insanlarda başarılı olma garantisi de yoktur. Günümüzde 'organ-on-a-chip' (çip üstünde organ) gibi insan hücrelerinden üretilen mikro-sistemler, hayvan deneylerine umut verici bir alternatif olarak yükselmektedir; ancak tamamen onların yerini alması için daha uzun yıllar gerekmektedir.",
        "questions": [
          {
            "id": "s17-p5-q1",
            "type": "ana_fikir",
            "question": "Metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Hayvan deneyleri hiçbir bilimsel işe yaramayan gereksiz bir uygulamadır.",
              "Çip üstünde organ teknolojisi sayesinde hayvan deneyleri bugün tamamen yasaklanmıştır.",
              "Hayvan deneyleri, insan sağlığı için tıbbi bir zorunluluk (gerekli bir kötülük) olarak görülse de, ciddi ahlaki ve etik tartışmalara yol açmaktadır.",
              "Hayvanlar, laboratuvarda çalışmaktan acı duymazlar."
            ],
            "correctOption": 2,
            "explanation": "Matnda hayvonlarda tajriba qilishning foydasi (tibbiyot) va uning axloqiy zarari o'rtasidagi ziddiyat ochib berilgan."
          },
          {
            "id": "s17-p5-q2",
            "type": "multiple_choice",
            "question": "Bilim insanlarının hayvan deneylerini savunmasındaki temel argüman (gerekçe) nedir?",
            "options": [
              "Hayvanların deneylerde kullanılmasının çok ucuz olması.",
              "Bilgisayar simülasyonlarının, yeni bir ilacın insan vücudundaki tüm karmaşık yan etkilerini henüz tam olarak ölçememesi.",
              "Hayvanların insanlardan daha zeki olması.",
              "Kozmetik ürünlerinin sadece hayvanlar üzerinde test edilebilmesi."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'bir ilacın insan vücudundaki karmaşık yan etkileri bilgisayar simülasyonlarıyla henüz tam olarak ölçülememektedir' deyilgan."
          },
          {
            "id": "s17-p5-q3",
            "type": "multiple_choice",
            "question": "Hayvan hakları savunucularının hayvan deneylerine karşı çıkmasındaki en büyük dayanağı (sebebi) nedir?",
            "options": [
              "Hayvanların çok fazla yemek yiyerek laboratuvar bütçesini tüketmesi.",
              "Sadece köpeklerin değil, kedilerin de deneylerde kullanılması gerektiğini düşünmeleri.",
              "Acı çeken ve hisseden canlıların, sadece insanların faydası (refahı) için eziyet görmesinin ahlaki olarak yanlış olması.",
              "Hayvanların hastanelerde doktorları ısırması."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'hisseden ve acı çeken canlıların insanların refahı için laboratuvarlarda işkence görmesinin ahlaki bir felaket olduğunu' yozilgan."
          },
          {
            "id": "s17-p5-q4",
            "type": "kelime",
            "question": "Metinde geçen 'gerekli bir kötülük' (necessary evil) ifadesi neyi anlatmaktadır?",
            "options": [
              "Çok kötü insanların yaptığı zalimce davranışlar.",
              "Özünde hoş olmayan veya ahlaken rahatsız edici olan ancak daha büyük bir iyiliği (insan hayatını) kurtarmak için yapılması zorunlu görülen eylem.",
              "Laboratuvarda çalışan bilim insanlarının kötü niyetli olması.",
              "Hayvan hastalıklarının insanlara bulaşması."
            ],
            "correctOption": 1,
            "explanation": "Gerekli kötülük - umuman olganda yomon narsa, lekin yaxshi maqsad (insonni qutqarish) uchun majburan qilinadigan ish."
          },
          {
            "id": "s17-p5-q5",
            "type": "cikarim",
            "question": "Metne göre, bir kanser ilacının laboratuvardaki fareler üzerinde çok başarılı olması ne anlama gelir?",
            "options": [
              "İlacın insanlarda da %100 başarılı olacağı anlamına gelir.",
              "İlacın derhal eczanelerde satılabileceği anlamına gelir.",
              "Genetik farklılıklardan dolayı, farenin iyileşmesinin ilacın insanda da kesin işe yarayacağı anlamına gelmez.",
              "Farenin bir daha asla hastalanmayacağı anlamına gelir."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'bir farede işe yarayan bir ilacın, genetik farklılıklar nedeniyle insanlarda başarılı olma garantisi de yoktur' deyilgan."
          },
          {
            "id": "s17-p5-q6",
            "type": "multiple_choice",
            "question": "Gelecekte hayvan deneylerini tamamen bitirmesi umut edilen yenilikçi teknoloji hangisidir?",
            "options": [
              "Teleskoplarla uzay araştırmaları yapmak.",
              "İnsan hücrelerinden üretilen 'çip üstünde organ' (organ-on-a-chip) gibi mikro-sistemler geliştirmek.",
              "Ameliyatlarda büyük robot kollar kullanmak.",
              "İlaçları sadece bitkiler (yapraklar) üzerinde denemek."
            ],
            "correctOption": 1,
            "explanation": "Metnin sonunda 'organ-on-a-chip gibi insan hücrelerinden üretilen mikro-sistemler'in alternatif olacağı belirtilmiştir."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-18",
    "sectionNumber": 18,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_18.json",
    "passages": [
      {
        "id": "s18-p1",
        "title": "Banka Şubesi Müşteri Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli müşterilerimiz, şubemizde işlemlerinizin hızlı ve güvenli bir şekilde yapılabilmesi için aşağıdaki kurallara dikkat ediniz:\n1. Şubemiz hafta içi her gün 09:00 - 17:00 saatleri arasında hizmet vermektedir. Öğle arası (12:30 - 13:30) gişeler kapalıdır.\n2. İşlem yapabilmek için giriş kapısındaki makinadan sıra numarası (fiş) almanız zorunludur.\n3. Güvenlik ve gizlilik nedeniyle gişelerde işlem yapan diğer müşterilere 1 metreden fazla yaklaşmak (kırmızı çizgiyi geçmek) yasaktır.\n4. Şube içerisinde güvenlik kameraları bulunduğundan, maske, kask veya yüzü tamamen kapatan şapkalarla içeri girilmesine izin verilmez.\n5. 10.000 TL ve üzeri nakit para çekim işlemlerinizi bir gün önceden şubemize haber vermeniz gerekmektedir.\nAnlayışınız için teşekkür ederiz.",
        "questions": [
          {
            "id": "s18-p1-q1",
            "type": "multiple_choice",
            "question": "Banka şubesinde saat 13:00'te işlem yapmak isteyen bir müşteri ne ile karşılaşır?",
            "options": [
              "Hemen işlemini yapabilir.",
              "Gişeler kapalı olduğu için beklemek zorundadır.",
              "Sadece ATM'den para çekebilir.",
              "İki katı masraf ödemek zorundadır."
            ],
            "correctOption": 1,
            "explanation": "Öğle arası (12:30 - 13:30) gişeler kapalıdır."
          },
          {
            "id": "s18-p1-q2",
            "type": "multiple_choice",
            "question": "Banka şubesine giren bir müşterinin ilk yapması gereken işlem nedir?",
            "options": [
              "Gişe memuruyla konuşmak",
              "Güvenlik görevlisine kimlik göstermek",
              "Girişteki makinadan sıra numarası (fiş) almak",
              "Müdürün odasına gitmek"
            ],
            "correctOption": 2,
            "explanation": "Giriş kapısındaki makinadan sıra numarası (fiş) almanız zorunludur."
          },
          {
            "id": "s18-p1-q3",
            "type": "multiple_choice",
            "question": "Şube içindeki 'kırmızı çizgi' kuralının temel nedeni nedir?",
            "options": [
              "Yerlerin yeni silinmiş olması",
              "Güvenlik ve müşteri gizliliğini korumak",
              "Çocukların koşmasını engellemek",
              "Kamera açısını kapatmamak"
            ],
            "correctOption": 1,
            "explanation": "Güvenlik ve gizlilik nedeniyle kırmızı çizgiyi geçmek yasaktır."
          },
          {
            "id": "s18-p1-q4",
            "type": "multiple_choice",
            "question": "Güvenlik kuralları gereği banka şubesine girerken hangisi yasaktır?",
            "options": [
              "Büyük çantayla girmek",
              "Güneş gözlüğü takmak",
              "Motosiklet kaskı veya yüzü kapatan şapka takmak",
              "Telefonla konuşmak"
            ],
            "correctOption": 2,
            "explanation": "Maske, kask veya yüzü tamamen kapatan şapkalarla içeri girilmesine izin verilmez."
          },
          {
            "id": "s18-p1-q5",
            "type": "multiple_choice",
            "question": "Büyük miktarda (örneğin 15.000 TL) nakit para çekecek olan bir müşteri ne yapmalıdır?",
            "options": [
              "Parayı iki taksitte çekmelidir.",
              "Bu işlemi bir gün önceden bankaya bildirmelidir.",
              "Sadece genel müdürlükten para çekebilir.",
              "Banka müdürüne rüşvet vermelidir."
            ],
            "correctOption": 1,
            "explanation": "10.000 TL ve üzeri nakit para çekim işlemlerinizi bir gün önceden şubemize haber vermeniz gerekmektedir."
          },
          {
            "id": "s18-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin temel mesajı aşağıdakilerden hangisidir?",
            "options": [
              "Banka kredilerinin faiz oranlarını açıklamak",
              "Yeni açılan bir banka şubesini tanıtmak",
              "Banka şubesindeki işlem kurallarını ve güvenliği sağlamak",
              "Müşterilere yatırım tavsiyeleri vermek"
            ],
            "correctOption": 2,
            "explanation": "Şubede işlemlerin hızlı ve güvenli yapılabilmesi için kuralları belirtmektir."
          }
        ]
      },
      {
        "id": "s18-p2",
        "title": "Sosyal Medya ve Haber Tüketim Alışkanlıkları",
        "category": "Sosyal Yaşam / Eşleştirme",
        "level": "B1",
        "content": "A) Tolga: Dünyadaki gelişmeleri öğrenmek için geleneksel yöntemlerden vazgeçmiyorum. Her sabah kahvaltımı yaparken basılı gazete okumak benim ritüelim. Televizyon haberlerinin çok taraflı, internetteki bilgilerin ise çoğunlukla yalan (teyit edilmemiş) olduğuna inanıyorum.\n\nB) Aylin: Haber okumak için uzun yazılar okumaya hiç tahammülüm yok. Ben dünyayı sadece Twitter (X) üzerinden, kısa cümlelerle ve son dakika bildirimleriyle (hashtag) takip ediyorum. Trend konulara bakıp günün özetini 5 dakikada anlıyorum.\n\nC) Canan: Gündemi takip etmek benim için sadece uzman görüşleri dinlemek demektir. Uzun haber bültenleri yerine işe giderken Spotify'dan siyaset, teknoloji ve ekonomi üzerine derinlemesine analiz yapan podcast'leri (sesli yayınları) dinliyorum.\n\nD) Emre: Haberleri sıkıcı siyasi tartışmalarla değil, mizah ve eğlenceyle (komediyle) almayı seviyorum. Geleneksel kanalları izlemem, bunun yerine YouTube'daki hicivli (alaycı) haber programlarını veya komedyenlerin gündem değerlendirmelerini izliyorum.",
        "questions": [
          {
            "id": "s18-p2-q1",
            "type": "matching_paragraph",
            "question": "Güncel gelişmeleri sadece dinleyerek ve uzman analizleriyle (podcast) takip eden kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Aylin",
              "C) Canan",
              "D) Emre"
            ],
            "correctOption": 2,
            "explanation": "Canan, Spotify'dan uzman analizleri yapan podcast'leri dinlediğini söylemiştir."
          },
          {
            "id": "s18-p2-q2",
            "type": "matching_paragraph",
            "question": "Haberleri okurken veya izlerken klasik yöntemleri (kağıt gazeteyi) tercih eden kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Aylin",
              "C) Canan",
              "D) Emre"
            ],
            "correctOption": 0,
            "explanation": "Tolga, her sabah kahvaltısında basılı gazete okumanın ritüeli olduğunu belirtmiştir."
          },
          {
            "id": "s18-p2-q3",
            "type": "matching_paragraph",
            "question": "Sıkıcı gündem maddelerini komedi, alay (hiciv) ve eğlenceyle harmanlayan programları izleyen kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Aylin",
              "C) Canan",
              "D) Emre"
            ],
            "correctOption": 3,
            "explanation": "Emre, mizah ve eğlenceyle (hicivli) haber programlarını izlediğini ifade etmiştir."
          },
          {
            "id": "s18-p2-q4",
            "type": "matching_paragraph",
            "question": "Uzun yazılara dayanamayan, gündemi çok hızlı ve kısa yoldan (trendler/hashtagler) öğrenen kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Aylin",
              "C) Canan",
              "D) Emre"
            ],
            "correctOption": 1,
            "explanation": "Aylin, Twitter üzerinden kısa cümlelerle ve trend konulara bakarak (5 dakikada) özetlediğini söylemiştir."
          },
          {
            "id": "s18-p2-q5",
            "type": "matching_paragraph",
            "question": "İnternetteki haberlerin çoğunlukla yalan (teyit edilmemiş) olduğunu savunan kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Aylin",
              "C) Canan",
              "D) Emre"
            ],
            "correctOption": 0,
            "explanation": "Tolga, internetteki bilgilerin çoğunlukla yalan (teyit edilmemiş) olduğuna inandığını söylemiştir."
          },
          {
            "id": "s18-p2-q6",
            "type": "matching_paragraph",
            "question": "Zaman kazanmak için yolculuk yaparken (işe giderken) dünyadaki gelişmeleri takip eden kişi kimdir?",
            "options": [
              "A) Tolga",
              "B) Aylin",
              "C) Canan",
              "D) Emre"
            ],
            "correctOption": 2,
            "explanation": "Canan, işe giderken Spotify'dan podcast dinlediğini söylemiştir."
          }
        ]
      },
      {
        "id": "s18-p3",
        "title": "İnsanlığın İlk Devrimi: Tarıma Geçiş",
        "category": "Tarih ve Teknoloji",
        "level": "B2",
        "content": "İnsanlık tarihinin yaklaşık %90'lık kısmında atalarımız, sadece avlanarak ve doğadaki yabani bitkileri toplayarak (avcı-toplayıcı) göçebe bir hayat sürmüştür. Ancak M.Ö. 10.000 yıllarında, bugün 'Bereketli Hilal' olarak bilinen Mezopotamya (Güneydoğu Anadolu, Suriye ve Irak) bölgesinde tarihin ilk büyük devrimi yaşandı: Tarım Devrimi (Neolitik Devrim). İnsanlar buğday ve arpa gibi yabani tahılları evcilleştirip tarlalara ekmeyi ve koyun, keçi gibi hayvanları çiftliklerde yetiştirmeyi öğrendiler. Bu devrim sayesinde insanlar sürekli göç etmekten kurtulup kalıcı (yerleşik) köyler ve şehirler inşa etmeye başladılar. Üretilen fazla (artı) yiyecekler depolandığı için nüfus hızla arttı ve herkesin tarlada çalışmasına gerek kalmadı. Böylece askerler, tüccarlar, rahipler ve zanaatkarlar gibi yeni meslek grupları ortaya çıktı. Tarım devrimi insanlığı açlıktan kurtarıp medeniyetleri kursa da, bazı bilim insanlarına göre yoğun karbonhidrat tüketimi ve kalabalık yaşam, insanlarda daha önce görülmeyen salgın hastalıklara ve diş çürüklerine neden olmuştur.",
        "questions": [
          {
            "id": "s18-p3-q1",
            "type": "true_false_not_given",
            "question": "İnsanlık, varoluşundan hemen sonra tarım yapmaya ve yerleşik hayata geçmeye başlamıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. İnsanlık tarihinin %90'lık kısmında göçebe hayat sürülmüştür."
          },
          {
            "id": "s18-p3-q2",
            "type": "true_false_not_given",
            "question": "Tarım Devrimi'nin ilk kez başladığı coğrafya 'Bereketli Hilal' olarak adlandırılan Mezopotamya bölgesidir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. Bereketli Hilal olarak bilinen Mezopotamya'da yaşandığı belirtilmiştir."
          },
          {
            "id": "s18-p3-q3",
            "type": "true_false_not_given",
            "question": "Tarım Devrimi sayesinde insanlar sadece buğday değil, pamuk da üretmeye başlamıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Pamuk üretimi hakkında metinde hiçbir bilgi yoktur."
          },
          {
            "id": "s18-p3-q4",
            "type": "true_false_not_given",
            "question": "Tarımsal üretim sayesinde yiyeceklerin depolanması, toplumda yeni meslek gruplarının doğmasını (iş bölümünü) sağlamıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. Artı yiyecekler depolandığı için herkesin tarlada çalışmasına gerek kalmadı ve yeni meslekler ortaya çıktı."
          },
          {
            "id": "s18-p3-q5",
            "type": "true_false_not_given",
            "question": "Tarım devriminden sonra insanlık tarihindeki savaşlar tamamen sona ermiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. Savaşların sona erdiğine dair bir ifade bulunmamaktadır."
          },
          {
            "id": "s18-p3-q6",
            "type": "true_false_not_given",
            "question": "Tarım devrimi ile yerleşik hayata geçilmesi, insanlarda yeni sağlık sorunlarının (salgın hastalıkların) ortaya çıkmasına zemin hazırlamıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. Metnin sonunda kalabalık yaşam ve karbonhidrat tüketiminin salgın hastalıklara ve diş çürüklerine neden olduğu belirtilmiştir."
          }
        ]
      },
      {
        "id": "s18-p4",
        "title": "Sosyal Medyanın Görünmez Zindanı: Yankı Odaları",
        "category": "Teknoloji ve Sosyoloji",
        "level": "C1",
        "content": "İnternette geçirdiğiniz zaman boyunca sosyal medya platformlarının size sadece sizin hoşunuza giden, siyasi görüşünüze veya ilgi alanlarınıza uyan içerikleri gösterdiğini hiç fark ettiniz mi? Facebook, X (Twitter) ve Instagram'ın arka planında çalışan algoritmalar, kullanıcıların uygulamada daha uzun süre kalmasını (ve reklam izlemesini) sağlamak için 'Yankı Odaları' (Echo Chambers) adı verilen dijital fanuslar inşa eder. [ 1 ]. Kişi, kendi düşüncelerinin onaylandığı içeriklere beğeni attıkça, algoritma ona sürekli benzer fikirleri ve aynı haber kaynaklarını sunar. Bunun sonucunda kullanıcı, dünyadaki herkesin kendisiyle aynı fikirde olduğu ve farklı düşünenlerin kesinlikle 'aptal veya kötü niyetli' olduğu yanılgısına düşer. [ 2 ]. Toplum bilimcilere (sosyologlara) göre yankı odaları, modern demokrasilerin önündeki en büyük tehditlerden biridir. Çünkü farklı görüşlere, tartışmalara ve ortak uzlaşmaya kapalı olan bu sanal kutuplaşma ortamı, toplumsal nefret söylemlerini besleyip gerçek dünyadaki bölünmeleri şiddetlendirmektedir.",
        "questions": [
          {
            "id": "s18-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Örneğin, bilgisayar oyunları oynayan çocuklar bu algoritmalardan daha çok etkilenir.",
              "Bu sistem, kullanıcının karşısına çıkan farklı, aykırı veya rahatsız edici görüşleri tamamen gizler ve siler.",
              "Sosyal medya platformları genellikle bu verileri satarak para kazanmaz.",
              "Bu uygulamalar sayesinde insanlar istedikleri ürünleri anında satın alabilirler."
            ],
            "correctOption": 1,
            "explanation": "Bo'shliqdan oldin 'Yankı odaları (dijital fanuslar) inşa eder' deyilgan, buni 'aykırı görüşleri tamamen gizler ve siler' gapi izohlab keladi."
          },
          {
            "id": "s18-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Böylece birey, gerçeklikten koparak sadece kendi sesini duyduğu izole (kapalı) bir bilgi hapishanesine hapsolur.",
              "Televizyon izleyicileri bu durumdan daha az etkilenmektedir.",
              "İnsanlar internette alışveriş yaparken genellikle yorumları dikkatlice okurlar.",
              "Farklı dilleri öğrenmek algoritmaların etkisini azaltabilir."
            ],
            "correctOption": 0,
            "explanation": "Kullanıcının 'herkesin kendisiyle aynı fikirde olduğu yanılgısına düşmesi'nin natijasi 'kendi sesini duyduğu izole bir bilgi hapishanesine hapsolur' deb mantiqan davom ettiriladi."
          },
          {
            "id": "s18-p4-q3",
            "type": "multiple_choice",
            "question": "Sosyal medya algoritmalarının kullanıcılara sadece onların hoşuna giden içerikleri (yankı odaları) sunmasının temel ticari amacı nedir?",
            "options": [
              "Kullanıcıları daha zeki ve kültürlü yapmak.",
              "Kullanıcıların uygulamayı hızla kapatıp gerçek hayata dönmesini sağlamak.",
              "Kullanıcıların uygulamada sıkılmadan daha uzun süre kalmalarını ve dolayısıyla daha fazla reklam görmelerini (para kazandırmalarını) sağlamak.",
              "Kullanıcıların psikolojisini korumak ve onları mutlu etmek."
            ],
            "correctOption": 2,
            "explanation": "Metinde 'kullanıcıların uygulamada daha uzun süre kalmasını (ve reklam izlemesini) sağlamak için' ifadesi açıkça geçmektedir."
          },
          {
            "id": "s18-p4-q4",
            "type": "multiple_choice",
            "question": "Metne göre 'Yankı Odası' (Echo Chamber) tuzağına düşen bir kullanıcının farklı görüşlere sahip (kendisinden farklı düşünen) insanlara bakış açısı nasıldır?",
            "options": [
              "Onların fikirlerine saygı duyar ve öğrenmeye çalışır.",
              "Onların kesinlikle aptal veya kötü niyetli olduğuna inanır.",
              "Onlarla hemen yüz yüze tanışıp tartışmak ister.",
              "Farklı fikirleri gördükçe kendi fikrinden hemen vazgeçer."
            ],
            "correctOption": 1,
            "explanation": "Metinde 'farklı düşünenlerin kesinlikle aptal veya kötü niyetli olduğu yanılgısına düşer' yazmaktadır."
          },
          {
            "id": "s18-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'fanus' kelimesi (dijital fanuslar inşa eder) hangi amaçla kullanılmıştır?",
            "options": [
              "Şeffaf ama dış dünyadan tamamen kapalı (izole) bir ortamı mecazi olarak anlatmak için.",
              "Işık ve aydınlatma teknolojilerini anlatmak için.",
              "Sosyal medyanın çok kırılgan ve hassas olduğunu göstermek için.",
              "Çiçek ve bitki yetiştirmeyi (sera etkisi) örnek vermek için."
            ],
            "correctOption": 0,
            "explanation": "Fanus (shisha qopqoq) bu yerda tashqi muhitdan (boshqa fikrlardan) uzib qo'yuvchi kapalı ortamni majoziy ifodalaydi."
          },
          {
            "id": "s18-p4-q6",
            "type": "cikarim",
            "question": "Sosyologlara göre Yankı Odaları'nın demokrasiler için en büyük tehlikesi aşağıdakilerden hangisidir?",
            "options": [
              "İnsanların oy vermek için evden çıkmak istememesi.",
              "İnternet bağlantısının çok pahalı olması.",
              "Toplumdaki insanların farklı fikirlere kapanarak karşılıklı uzlaşmayı unutması ve sosyal kutuplaşmanın, nefretin (bölünmenin) artması.",
              "Siyasetçilerin sadece televizyona çıkarak halka seslenmesi."
            ],
            "correctOption": 2,
            "explanation": "Sosyologlar bunu 'farklı görüşlere kapalı olan bu sanal kutuplaşma ortamı, toplumsal nefret söylemlerini besleyip gerçek dünyadaki bölünmeleri şiddetlendirmektedir' diyerek açıklar."
          }
        ]
      },
      {
        "id": "s18-p5",
        "title": "Uyuyan Genler: Körelmiş Organlarımızın Sırrı",
        "category": "Biyoloji ve Evrim",
        "level": "C1",
        "content": "İnsan vücudu, milyonlarca yıllık evrimsel bir yolculuğun eşsiz bir eseridir; ancak kusursuz değildir. Vücudumuzda, uzak atalarımız için bir zamanlar hayati öneme sahip olan ancak bugün hiçbir işlevi kalmayan bazı parçalar taşırız. Biyologlar bunlara 'Körelmiş Organlar' (Vestigial Organs) adını verir. En bilinen örneklerinden biri 'Yirmi Yaş Dişleri'dir. Atalarımız ateşi bulmadan önce sert ve çiğ etleri, kabuklu bitkileri çiğneyebilmek için geniş çenelere ve fazladan öğütücü dişlere (20 yaş dişlerine) ihtiyaç duyuyordu. Ancak ateşin bulunmasıyla yiyeceklerin pişirilip yumuşatılması, insan çenesinin binlerce yıl içinde küçülmesine neden oldu. Bugün çenemize sığmayan ve çoğunlukla gömülü kalıp ameliyatla alınması gereken bu dişler, tamamen evrimsel bir mirastır. Benzer şekilde 'Apandisit' de, atalarımızın sindirmesi zor olan bitkisel (selüloz) lifleri öğütmesine yarayan büyük bir organın küçülmüş kalıntısıdır. İnsan anatomisindeki bu işlevsiz kalıntılar, doğanın mühendisliğinde eski projelerin tamamen silinmediğini, sadece rafa kaldırıldığını (uykuya alındığını) göstermektedir.",
        "questions": [
          {
            "id": "s18-p5-q1",
            "type": "ana_fikir",
            "question": "Bu metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Yirmi yaş dişlerinin çekilmesi oldukça tehlikeli bir ameliyattır.",
              "İnsan vücudu tamamen kusursuz ve hatalardan arınmış bir makinedir.",
              "Vücudumuzda taşıdığımız işlevsiz (körelmiş) organlar, insanın binlerce yıllık evrimsel (tarihsel) geçmişinin ve değişiminin kalıntılarıdır.",
              "Ateşin bulunması insanlık tarihindeki en büyük felaket olmuştur."
            ],
            "correctOption": 2,
            "explanation": "Metnin ana fikri, körelmiş organların (Yirmi yaş dişleri, Apandisit vb.) insanın evrimsel geçmişinden kalan işlevsiz miraslar olduğudur."
          },
          {
            "id": "s18-p5-q2",
            "type": "multiple_choice",
            "question": "Eski çağlarda (atalarımızda) 'Yirmi Yaş Dişleri'nin var olma ve kullanılma amacı neydi?",
            "options": [
              "Sadece konuşmayı ve ses çıkarmayı kolaylaştırmak.",
              "Ateş bulunmadığı dönemde sert, çiğ etleri ve kabuklu bitkileri çiğneyip parçalamak.",
              "Yüzün daha güzel (estetik) görünmesini sağlamak.",
              "Düşmanlara karşı bir savunma silahı olarak kullanmak."
            ],
            "correctOption": 1,
            "explanation": "Metinde 'sert ve çiğ etleri, kabuklu bitkileri çiğneyebilmek için... ihtiyaç duyuyordu' denilmiştir."
          },
          {
            "id": "s18-p5-q3",
            "type": "multiple_choice",
            "question": "İnsan çenesinin zamanla küçülmesinin (ve yirmi yaş dişlerinin çeneye sığmamasının) en büyük nedeni nedir?",
            "options": [
              "İnsanların daha az konuşmaya başlaması.",
              "Et yemeyi tamamen bırakıp sadece ot yemeye başlamaları.",
              "Ateşin icadıyla yiyeceklerin pişirilip yumuşatılması ve güçlü çenelere olan ihtiyacın ortadan kalkması.",
              "İklim değişiklikleri nedeniyle insanların boylarının kısalması."
            ],
            "correctOption": 2,
            "explanation": "Ateşin bulunmasıyla yiyeceklerin pişirilip yumuşatılması, çenenin küçülmesine neden olmuştur."
          },
          {
            "id": "s18-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'rafa kaldırmak' deyimi hangi anlama gelmektedir?",
            "options": [
              "Bir eşyayı yüksek bir yere koyarak saklamak.",
              "Bir projeyi, fikri veya işlevi şimdilik iptal etmek, uygulamadan kaldırıp bir kenara bırakmak (uykuya almak).",
              "Ev temizliği yaparken tozları silmek.",
              "Kitap okuma alışkanlığını bırakmak."
            ],
            "correctOption": 1,
            "explanation": "Rafa kaldırmak (majoziy) - biror narsani endi keraksiz deb vaqtinchalik yoki butunlay chetga surib qo'yish (uykuya alma)."
          },
          {
            "id": "s18-p5-q5",
            "type": "multiple_choice",
            "question": "Metne göre 'Apandisit' organının eski insanlardaki işlevi (görevi) neydi?",
            "options": [
              "Kanı temizlemek.",
              "Sindirimi zor olan bitkisel lifleri (selüloz) öğütmek.",
              "Kalp atışlarını düzenlemek.",
              "Bağışıklık sistemini güçlendirmek."
            ],
            "correctOption": 1,
            "explanation": "Metinde 'sindirmesi zor olan bitkisel (selüloz) lifleri öğütmesine yarayan büyük bir organın küçülmüş kalıntısıdır' denilmiştir."
          },
          {
            "id": "s18-p5-q6",
            "type": "cikarim",
            "question": "Bu metinden çıkarılabilecek en mantıklı sonuç aşağıdakilerden hangisidir?",
            "options": [
              "Bilim insanları yirmi yaş dişlerini ilaçla yok edecek formülü bulmuştur.",
              "Evrim süreci (doğa), kullanılmayan özellikleri hemen ertesi gün tamamen silip atmaktadır.",
              "İnsan anatomisi değişmez değildir; teknolojik (ateş) veya beslenme alışkanlıklarındaki değişimler zamanla insan biyolojisini de şekillendirmiştir.",
              "Bütün insanların apandisit organını derhal aldırması gerekmektedir."
            ],
            "correctOption": 2,
            "explanation": "Beslenme (olov va pishirish) o'zgarishi biologiyani, iyak va tishlar (anatomiya)ni shakllantirib, o'zgartirgani ko'rsatilgan."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-19",
    "sectionNumber": 19,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_19.json",
    "passages": [
      {
        "id": "s19-p1",
        "title": "Milli Müze Güvenlik ve Ziyaret Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Değerli ziyaretçilerimiz, müzemizdeki paha biçilmez tarihi eserlerin korunması için aşağıdaki güvenlik kurallarına uymanız önemle rica olunur:\n1. Müzeye girişte sırt çantaları, büyük valizler ve şemsiyeler kesinlikle içeri alınmaz. Bu eşyalarınızı ücretsiz emanet dolaplarına bırakmanız zorunludur.\n2. Eserlerin boya pigmentlerine (renklerine) zarar verdiği için, müze içerisindeki hiçbir salonda 'Flaşlı Fotoğraf Çekmek' veya 'Tripod kullanmak' serbest değildir.\n3. Vitrinlere, heykellere ve tablolara dokunmak, güvenlik sensörlerinin (alarmların) çalmasına neden olacağı için yasaktır.\n4. Müze içinde yiyecek ve kapaksız içecek (sıcak kahve, çay) tüketilmesi yasaktır. Sadece şişe su ile girilebilir.\n5. Kaybolan çocuklar için danışma masasına başvurunuz, güvenlik anonsu (çağrısı) yapılacaktır.\nAnlayışınız için teşekkür ederiz.",
        "questions": [
          {
            "id": "s19-p1-q1",
            "type": "multiple_choice",
            "question": "Müzeye büyük bir sırt çantasıyla gelen bir ziyaretçi ne yapmalıdır?",
            "options": [
              "Çantayı sırtından çıkarıp elinde taşımalıdır.",
              "Çantayı müzenin kapısının dışına (sokağa) bırakmalıdır.",
              "Çantasını ücretsiz emanet dolaplarına bırakmalıdır.",
              "Çantasının içini güvenlik görevlisine gösterip içeri girmelidir."
            ],
            "correctOption": 2,
            "explanation": "Sırt çantaları, büyük valizler ve şemsiyeler ücretsiz emanet dolaplarına bırakılmalıdır."
          },
          {
            "id": "s19-p1-q2",
            "type": "multiple_choice",
            "question": "Müzede flaşlı fotoğraf çekmenin yasaklanma nedeni nedir?",
            "options": [
              "Tarihi eserlerin boyalarına (renklerine) zarar vermesi.",
              "Diğer ziyaretçilerin gözlerini rahatsız etmesi.",
              "Fotoğrafların sosyal medyada paylaşılmasını engellemek.",
              "Müzedeki güvenlik kameralarını bozması."
            ],
            "correctOption": 0,
            "explanation": "Eserlerin boya pigmentlerine (renklerine) zarar verdiği için yasaktır."
          },
          {
            "id": "s19-p1-q3",
            "type": "multiple_choice",
            "question": "Eserlere (heykellere ve vitrinlere) dokunan bir ziyaretçi neye yol açar?",
            "options": [
              "Eserin temizlenmesine",
              "Güvenlik alarmlarının (sensörlerinin) çalmasına",
              "Eserin kendisine verilmesine",
              "Müzenin kapanmasına"
            ],
            "correctOption": 1,
            "explanation": "Dokunmak, güvenlik sensörlerinin (alarmların) çalmasına neden olacağı için yasaktır."
          },
          {
            "id": "s19-p1-q4",
            "type": "multiple_choice",
            "question": "Müze salonlarına ziyaretçilerin sadece ne ile girmesine izin verilmektedir?",
            "options": [
              "Sıcak çay",
              "Açık bardakta kahve",
              "Şişe su",
              "Sandviç (yiyecek)"
            ],
            "correctOption": 2,
            "explanation": "Sadece şişe su ile girilebilir."
          },
          {
            "id": "s19-p1-q5",
            "type": "multiple_choice",
            "question": "Çocuğunu kaybeden bir anne veya baba müzede nereye başvurmalıdır?",
            "options": [
              "Müzenin dışındaki polise",
              "Danışma masasına",
              "Müze kafeteryasına",
              "Hediyelik eşya dükkanına"
            ],
            "correctOption": 1,
            "explanation": "Kaybolan çocuklar için danışma masasına başvurunuz."
          },
          {
            "id": "s19-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin okunma (yazılma) amacı nedir?",
            "options": [
              "Müze giriş biletlerinin satılmasını sağlamak.",
              "Ziyaretçileri müze kuralları ve güvenlik hakkında bilgilendirmek.",
              "Tarihi eserlerin nereden getirildiğini anlatmak.",
              "Müze çalışanlarına iş kurallarını hatırlatmak."
            ],
            "correctOption": 1,
            "explanation": "Eserlerin korunması için ziyaretçilerin güvenlik kurallarına uyması amacıyla yazılmıştır."
          }
        ]
      },
      {
        "id": "s19-p2",
        "title": "Kariyer Hedefleri ve İş Beklentileri",
        "category": "İş Hayatı / Eşleştirme",
        "level": "B1",
        "content": "A) Yusuf: Yeni bir iş ararken benim için en önemli kriter 'Maaş ve Yan Haklar'dır. Eğlenceli bir ortam veya esnek çalışma saatleri umrumda değil. Eğer şirket bana yüksek bir maaş, prim (bonus) sistemi ve özel sağlık sigortası sunuyorsa, günde 12 saat bile disiplinle çalışabilirim.\n\nB) Elif: Ben bir işin 'Sosyal ve Yaratıcı' ortamına bakarım. Çalışma arkadaşlarımın aynı zamanda yakın dostum olmasını isterim. Sessiz ve gri renkli sıkıcı plazalarda yapamam. Rahat kıyafetlerle gidebileceğim, fikirlerimi özgürce söyleyebileceğim ve kahve eşliğinde toplantı yapılan reklam ajansları tam bana göre.\n\nC) Kerem: Ben 'İş Güvencesi' (Kalıcılık) arayan biriyim. Ekonomik krizlerde bile işten çıkarılma korkusu yaşamak istemiyorum. Bu yüzden düşük maaşlı bile olsa, çalışma saatleri düzenli (sabah 8 akşam 5) olan bir devlet kurumunda memur olarak yıllarca aynı pozisyonda çalışmayı tercih ederim.\n\nD) Ayşe: Benim hedefim 'Kariyer Yükselişi'dir. Ben sürekli aynı masada aynı işi yapmak istemem. Şirketin bana eğitimler vererek beni yöneticiliğe hazırlaması gerekir. Terfi imkanının (yükselmenin) olmadığı, yeni şeyler öğrenemediğim hiçbir şirkette 1 yıldan fazla kalamam.",
        "questions": [
          {
            "id": "s19-p2-q1",
            "type": "matching_paragraph",
            "question": "Eğlenceli ve resmi olmayan (rahat) bir ofis atmosferi arayan kişi kimdir?",
            "options": [
              "A) Yusuf",
              "B) Elif",
              "C) Kerem",
              "D) Ayşe"
            ],
            "correctOption": 1,
            "explanation": "Elif, sıkıcı plazaları sevmediğini, rahat kıyafetler ve yaratıcı dost ortamı aradığını belirtmiştir."
          },
          {
            "id": "s19-p2-q2",
            "type": "matching_paragraph",
            "question": "İşten kovulma (çıkarılma) riskinin en düşük olduğu güvenilir bir iş arayan kişi kimdir?",
            "options": [
              "A) Yusuf",
              "B) Elif",
              "C) Kerem",
              "D) Ayşe"
            ],
            "correctOption": 2,
            "explanation": "Kerem iş güvencesi (kalıcılık) aradığını ve devlet memuru olmayı tercih ettiğini söylemiştir."
          },
          {
            "id": "s19-p2-q3",
            "type": "matching_paragraph",
            "question": "Maddi geliri (yüksek ücreti) her şeyden üstün tutan ve bunun için çok çalışmayı kabul eden kişi kimdir?",
            "options": [
              "A) Yusuf",
              "B) Elif",
              "C) Kerem",
              "D) Ayşe"
            ],
            "correctOption": 0,
            "explanation": "Yusuf maaş ve yan hakları (prim, sigorta) en önemli kriter sayıp, günde 12 saat çalışabileceğini söylemiştir."
          },
          {
            "id": "s19-p2-q4",
            "type": "matching_paragraph",
            "question": "Sürekli yeni beceriler öğrenip, şirketin yönetici (liderlik) kadrosuna tırmanmayı hedefleyen kişi kimdir?",
            "options": [
              "A) Yusuf",
              "B) Elif",
              "C) Kerem",
              "D) Ayşe"
            ],
            "correctOption": 3,
            "explanation": "Ayşe terfi (yükselme) imkanı ve yöneticilik eğitimi aradığını belirtmiştir."
          },
          {
            "id": "s19-p2-q5",
            "type": "matching_paragraph",
            "question": "Maaşının düşük olmasını umursamayan, yeter ki çalışma saatleri (8-5) düzenli olsun diyen kişi kimdir?",
            "options": [
              "A) Yusuf",
              "B) Elif",
              "C) Kerem",
              "D) Ayşe"
            ],
            "correctOption": 2,
            "explanation": "Kerem düşük maaşlı da olsa saatleri düzenli bir devlet işini istediğini söylemiştir."
          },
          {
            "id": "s19-p2-q6",
            "type": "matching_paragraph",
            "question": "İş ortamının yaratıcılığı destekleyen ve fikirlerini özgürce söyleyebileceği bir yer olmasını isteyen kişi kimdir?",
            "options": [
              "A) Yusuf",
              "B) Elif",
              "C) Kerem",
              "D) Ayşe"
            ],
            "correctOption": 1,
            "explanation": "Elif yaratıcı ortam, fikirlerin özgürce söylendiği reklam ajansı tarzı yerler aradığını söylemiştir."
          }
        ]
      },
      {
        "id": "s19-p3",
        "title": "İmparatorlukların Gözdesi: Lale Devri",
        "category": "Tarih ve Kültür",
        "level": "B2",
        "content": "Lale, günümüzde Hollanda ile özdeşleşmiş (anılan) bir çiçek olsa da, aslında ana vatanı Asya'dır ve Osmanlı İmparatorluğu'nda çok önemli bir yere sahiptir. 18. yüzyılın başlarında, Osmanlı'da savaşların azaldığı ve Batı tarzı yeniliklerin (matbaa, elçilikler) başladığı döneme, bu çiçeğe duyulan büyük tutku nedeniyle 'Lale Devri' (1718-1730) adı verilmiştir. Bu dönemde İstanbul'un her yeri lale bahçeleriyle donatılmış, zenginler kendi aralarında nadir lale soğanları yetiştirmek için devasa paralar harcayarak yarışa girmişlerdir. Hatta lale soğanlarının fiyatı o kadar artmıştır ki, tek bir lale soğanı ile İstanbul'da büyük bir yalı (ev) satın alınabiliyordu. Ancak bu zenginlik ve gösteriş çılgınlığı, halkın fakirliğiyle çelişmeye başlayınca büyük bir toplumsal öfkeye neden oldu. 1730 yılında Patrona Halil adında bir hamam tellağının önderliğinde çıkan isyanla Lale Devri kanlı bir şekilde sona ermiş, padişah tahttan indirilmiş ve güzelim lale bahçeleri isyancılar tarafından yakılıp yıkılmıştır.",
        "questions": [
          {
            "id": "s19-p3-q1",
            "type": "true_false_not_given",
            "question": "Lale çiçeğinin orijinal ana vatanı (doğduğu yer) Hollanda'dır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Hollanda ile özdeşleşse de 'ana vatanı Asya'dır' denilmiştir."
          },
          {
            "id": "s19-p3-q2",
            "type": "true_false_not_given",
            "question": "Osmanlı'daki Lale Devri, Batı'daki yeniliklerin (matbaanın vb.) Osmanlı'ya getirilmeye başlandığı barışçıl bir dönemdir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'savaşların azaldığı ve Batı tarzı yeniliklerin (matbaa, elçilikler) başladığı döneme' denildiği ifade edilmiştir."
          },
          {
            "id": "s19-p3-q3",
            "type": "true_false_not_given",
            "question": "Lale Devri'nde sıradan halk da zenginleşmiş ve lale bahçeleri satın almıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. Zenginlerin çılgınlığı 'halkın fakirliğiyle çelişmeye başlayınca' öfke doğduğu söyleniyor."
          },
          {
            "id": "s19-p3-q4",
            "type": "true_false_not_given",
            "question": "O dönemde bazı nadir lale soğanlarının fiyatı, bir evin fiyatına eşitti.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'tek bir lale soğanı ile İstanbul'da büyük bir yalı (ev) satın alınabiliyordu' denilmiştir."
          },
          {
            "id": "s19-p3-q5",
            "type": "true_false_not_given",
            "question": "Lale Devri'ni bitiren Patrona Halil İsyanı, Avrupalı devletlerin kışkırtmasıyla (desteğiyle) çıkmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. İsyanın yabancı (Avrupalı) devletlerce çıkarıldığına dair metinde bir bilgi yoktur."
          },
          {
            "id": "s19-p3-q6",
            "type": "true_false_not_given",
            "question": "İsyan sonucunda sadece yönetim (padişah) değişmemiş, aynı zamanda sembolik lale bahçeleri de yok edilmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'padişah tahttan indirilmiş ve güzelim lale bahçeleri isyancılar tarafından yakılıp yıkılmıştır' denilmiştir."
          }
        ]
      },
      {
        "id": "s19-p4",
        "title": "Planlı Eskitme: Eşyalarımız Neden Çabuk Bozuluyor?",
        "category": "Ekonomi ve Psikoloji",
        "level": "C1",
        "content": "Büyükbabanızın aldığı buzdolabının 40 yıl sorunsuz çalıştığını, ancak sizin aldığınız akıllı telefonun veya çamaşır makinesinin garanti süresi (2 yıl) biter bitmez aniden bozulduğunu hiç fark ettiniz mi? Bu bir tesadüf değil, 'Planlı Eskitme' (Planned Obsolescence) adı verilen zalim bir endüstriyel stratejinin sonucudur. [ 1 ]. Satışları artırmak isteyen üreticiler, birleşerek ampullerin ömrünü bilinçli olarak maksimum 1000 saatle sınırlayan 'Phoebus Karteli'ni kurdular. Günümüzde ise planlı eskitme sadece donanımları zayıf üreterek değil, 'yazılım' güncellemeleriyle de yapılıyor. Örneğin, bir akıllı telefon markası yeni modelini piyasaya sürdüğünde, eski modelleri bilinçli olarak yavaşlatan (bataryayı tüketen) bir güncelleme göndererek sizi yeni telefonu almaya mecbur bırakır. [ 2 ]. İnsanları sürekli yenisini tüketmeye zorlayan bu ekonomik model, sadece cebimizdeki parayı çalmakla kalmıyor; aynı zamanda her yıl doğaya milyonlarca ton 'Elektronik Çöp' (E-Atık) atılmasına neden olarak çevresel bir felaket yaratıyor.",
        "questions": [
          {
            "id": "s19-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Buzdolapları evlerde en çok elektrik tüketen aletlerdir.",
              "Bu kavram ilk kez 1920'lerde, ampul üreticilerinin ömür boyu yanan ampuller üretmenin kendilerini iflas ettireceğini anlamasıyla ortaya çıkmıştır.",
              "Günümüzde fabrikalarda sadece robotlar çalışmaktadır.",
              "Tüketiciler genellikle eşyaları garanti süresi içinde bozmayı severler."
            ],
            "correctOption": 1,
            "explanation": "Bo'shliqdan so'ng 'ampullerin ömrünü sınırlayan Phoebus Karteli' haqida gap ketgan. Demak, 1920 yillardagi lampochka ishlab chiqaruvchilar va ularning inqirozi haqidagi jumla eng mos keladi."
          },
          {
            "id": "s19-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Veya cihazınızın çok ufak bir parçası kırıldığında, tamir fiyatı yeni bir cihaz fiyatına denk tutularak tamir etmeniz engellenir.",
              "İnsanlar eski telefonlarını sadece anı olarak saklamayı tercih etmektedir.",
              "Telefon kılıfları telefonu düşmelere karşı korur.",
              "Yazılımcılar genellikle çok yüksek maaş almaktadır."
            ],
            "correctOption": 0,
            "explanation": "Oldingi gapda telefonlarning yangisini olishga majbur qilinishi (dasturiy yangilanish orqali) aytildi. Keyin 'yoki tamir qilishni imkonsiz qilib, yangisini olishga majbur qilish' mantiqan mukammal qo'shimchadir."
          },
          {
            "id": "s19-p4-q3",
            "type": "multiple_choice",
            "question": "Planlı Eskitme (Planned Obsolescence) stratejisinin temel amacı nedir?",
            "options": [
              "Ürünleri olabildiğince kaliteli ve dayanıklı yaparak müşteri memnuniyetini artırmak.",
              "Geri dönüşüm fabrikalarına daha fazla malzeme (çöp) sağlamak.",
              "Ürünlerin ömrünü bilinçli (kasten) olarak kısaltarak tüketicileri sürekli yeni ürün satın almaya mecbur bırakmak.",
              "İnsanlara teknolojiyi daha hızlı öğretmek."
            ],
            "correctOption": 2,
            "explanation": "Matnda bu endüstriyel strateji orqali satışları artırmak (yangi mahsulot oldirish) ko'zlanganligi yozilgan."
          },
          {
            "id": "s19-p4-q4",
            "type": "multiple_choice",
            "question": "Metne göre akıllı telefon (veya bilgisayar) üreticileri yazılım güncellemelerini hangi gizli amaçla kullanabilmektedir?",
            "options": [
              "Cihazın daha iyi fotoğraf çekmesini sağlamak.",
              "Eski modelleri kasten yavaşlatarak ve bataryalarını tüketerek müşteriyi yeni modele yönlendirmek.",
              "Cihazın virüslere karşı güvenliğini artırmak.",
              "Telefonun daha az internet harcamasını sağlamak."
            ],
            "correctOption": 1,
            "explanation": "Eski modelleri bilinçli olarak yavaşlatan (bataryayı tüketen) bir güncelleme göndererek sizi yeni telefonu almaya mecbur bırakır."
          },
          {
            "id": "s19-p4-q5",
            "type": "kelime",
            "question": "Metindeki 'kartel' (Phoebus Karteli) kelimesi hangi anlama gelmektedir?",
            "options": [
              "Aynı sektördeki büyük şirketlerin, fiyatları veya ürün kalitesini kontrol etmek için aralarında yaptıkları gizli (ve genellikle yasadışı) anlaşma grubu.",
              "Ampul ve aydınlatma üreten fabrikanın marka ismi.",
              "Çevreyi koruyan bir sivil toplum örgütü.",
              "Devletin uyguladığı bir vergi türü."
            ],
            "correctOption": 0,
            "explanation": "Kartel - raqobatni yo'qotib, narx va sifatni manipulyatsiya qilish uchun yirik kompaniyalar tuzgan monopol (gizli) ittifoqdir."
          },
          {
            "id": "s19-p4-q6",
            "type": "cikarim",
            "question": "Yazara göre, Planlı Eskitme modelinin bireysel ekonomik zarardan (cepteki parayı almaktan) öte, en büyük küresel tehlikesi nedir?",
            "options": [
              "İnsanların sürekli teknoloji mağazalarında vakit kaybetmesi.",
              "Sürekli çöpe atılan kısa ömürlü cihazların devasa 'Elektronik Çöp' dağları yaratarak gezegeni (doğayı) zehirlemesi.",
              "Evlerde koyacak yer kalmaması.",
              "İnsanların eski eşyalara çok fazla bağlanması."
            ],
            "correctOption": 1,
            "explanation": "Metnin sonunda 'her yıl doğaya milyonlarca ton Elektronik Çöp (E-Atık) atılmasına neden olarak çevresel bir felaket yaratıyor' diyerek küresel tehlikeyi (doğayı zehirlemesini) vurgulamaktadır."
          }
        ]
      },
      {
        "id": "s19-p5",
        "title": "Vücudumuzdaki Yabancılar: Mikrobiyom Gerçeği",
        "category": "Biyoloji ve Genetik",
        "level": "C1",
        "content": "Aynaya baktığınızda sadece 'kendinizi' gördüğünüzü sanıyorsanız yanılıyorsunuz. Bilimsel gerçek şu ki; vücudunuzda insan hücresinden daha fazla sayıda bakteri, virüs ve mantar hücresi (mikrop) yaşamaktadır. İnsan bağırsağında ve cildinde yaşayan bu devasa trilyonlarca mikrop topluluğuna 'Mikrobiyom' adı verilir. Yüzlerce yıl boyunca tıp dünyası, bakterileri sadece bizi hasta eden 'düşmanlar' olarak gördü ve onları antibiyotiklerle tamamen yok etmeye çalıştı. Ancak son 20 yılda yapılan devrim niteliğindeki araştırmalar, bağırsak bakterilerimizin sadece yiyecekleri sindirmemize yardımcı olmadığını; aynı zamanda bağışıklık sistemimizi eğittiğini, ruh halimizi belirlediğini (depresyon/mutluluk) ve hatta obezite (kilo alma) üzerinde doğrudan kontrol sahibi olduklarını kanıtladı. Mutluluk hormonu olarak bilinen Serotonin'in %90'ı beyinde değil, doğrudan bağırsaktaki iyi bakteriler tarafından üretilir. Günümüzde modern diyetlerin (aşırı şeker ve işlenmiş gıda) bağırsaktaki bu dost bakteri ormanını tahrip ettiği ve otoimmün hastalıklara davetiye çıkardığı bilinmektedir.",
        "questions": [
          {
            "id": "s19-p5-q1",
            "type": "ana_fikir",
            "question": "Bu metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Tüm bakteriler ve mikroplar insan sağlığı için zararlıdır ve antibiyotikle yok edilmelidir.",
              "İnsan vücudu sadece insan hücrelerinden değil, sağlığımız, psikolojimiz ve bağışıklığımız için hayati öneme sahip trilyonlarca dost mikrobun oluşturduğu 'mikrobiyom'dan oluşmaktadır.",
              "Bakteriler sadece insanların cilt yüzeyinde yaşayabilirler.",
              "Antibiyotikler dünyanın en zararlı ve en tehlikeli ilaçlarıdır."
            ],
            "correctOption": 1,
            "explanation": "Asosiy e'tibor 'Mikrobiyom'ning inson vujudi va psixologiyasi uchun qanchalik muhim yordamchilar (dost mikroplar) ekanligidadir."
          },
          {
            "id": "s19-p5-q2",
            "type": "multiple_choice",
            "question": "Metne göre vücudumuzdaki 'Mikrobiyom' (bakteriler) neleri kontrol etme gücüne sahiptir?",
            "options": [
              "Sadece sindirim sistemini (yediklerimizi öğütmeyi).",
              "Sadece saçımızın ve tırnaklarımızın ne kadar hızlı uzayacağını.",
              "Sindirim sistemini, bağışıklık sistemini, ruh halimizi (psikolojiyi) ve obeziteyi (kilomuzu).",
              "İnsanların genetik kodlarını ve göz rengini."
            ],
            "correctOption": 2,
            "explanation": "Matnda: 'yiyecekleri sindirmemize... bağışıklık sistemimizi eğittiğini, ruh halimizi belirlediğini ve obezite üzerinde kontrol sahibi' oldukları yozilgan."
          },
          {
            "id": "s19-p5-q3",
            "type": "multiple_choice",
            "question": "İnsana mutluluk hissi veren 'Serotonin' hormonuyla ilgili metinde verilen şaşırtıcı bilimsel gerçek nedir?",
            "options": [
              "Serotoninin tamamen psikolojik olduğu ve hormon olmadığı.",
              "Serotoninin vücudun dışında üretilip ilaç olarak alındığı.",
              "Mutluluk hormonunun %90'ının beyinde değil, bağırsaklardaki bakteriler tarafından üretildiği.",
              "Sadece çok şeker yiyen insanlarda serotonin salgılandığı."
            ],
            "correctOption": 2,
            "explanation": "Serotonin'in %90'ı beyinde değil, doğrudan bağırsaktaki iyi bakteriler tarafından üretilir."
          },
          {
            "id": "s19-p5-q4",
            "type": "kelime",
            "question": "Metindeki 'tahrip etmek' kelimesi hangi anlama gelmektedir?",
            "options": [
              "Bir şeyi korumak ve güçlendirmek.",
              "Bir yapıya veya canlı sisteme zarar vermek, bozmak, yıkmak.",
              "Bakterileri incelemek için laboratuvara götürmek.",
              "Yeni bir şey icat etmek."
            ],
            "correctOption": 1,
            "explanation": "Tahrip etmek (arabcha) - vayron qilish, zarar yetkazish demakdir."
          },
          {
            "id": "s19-p5-q5",
            "type": "cikarim",
            "question": "Metinden çıkarılabilecek sonuca göre, sürekli hazır (işlenmiş) gıda ve aşırı şeker tüketen bir kişinin en büyük sorunu ne olabilir?",
            "options": [
              "Bağırsağındaki faydalı mikrobiyom ormanına zarar verdiği için bağışıklığının düşmesi ve depresyona veya hastalıklara yatkın hale gelmesi.",
              "Midesinde yeni ve süper güçlü bakteriler oluşması.",
              "Hiçbir şekilde kilo alamaması ve sürekli zayıflaması.",
              "Gözlerinde ve cildinde inanılmaz bir güzelleşme yaşanması."
            ],
            "correctOption": 0,
            "explanation": "Aşırı şeker ve işlenmiş gıdanın bu dost bakteri ormanını tahrip ettiği (yo'q qilgani) va otoimmün (immunitet) hastalıklara yo'l ochgani aytilgan, demak kasallik va tushkunlik (depresyon) ortadi."
          },
          {
            "id": "s19-p5-q6",
            "type": "multiple_choice",
            "question": "Tıp dünyasının geçmişteki (eskiden kalma) bakterilere bakış açısı nasıldı?",
            "options": [
              "Onların tamamen yok olmasından korkuyorlardı.",
              "Bakterileri sadece bizi hasta eden 'düşmanlar' olarak görüp antibiyotikle yok etmeye çalışıyorlardı.",
              "Bakterileri ameliyatlarda ağrı kesici olarak kullanıyorlardı.",
              "Bakterilerin beyni kontrol ettiğini çok eskiden beri biliyorlardı."
            ],
            "correctOption": 1,
            "explanation": "Yüzlerce yıl boyunca tıp dünyası, bakterileri sadece 'düşmanlar' olarak gördü ve antibiyotiklerle yok etmeye çalıştı."
          }
        ]
      }
    ]
  },
  {
    "id": "reading-section-20",
    "sectionNumber": 20,
    "status": "active",
    "sourceFile": "turkuaz_bmba_okuma_exam_20.json",
    "passages": [
      {
        "id": "s20-p1",
        "title": "Halk Kütüphanesi Ödünç Kitap Kuralları",
        "category": "Duyuru ve Kurallar",
        "level": "A2",
        "content": "Kütüphanemizden daha fazla kişinin yararlanabilmesi için kitap ödünç alma kurallarına lütfen dikkat ediniz:\n1. Üyeler tek seferde en fazla 3 adet kitap ödünç alabilirler.\n2. Kitapların iade süresi 15 gündür. Süre bitmeden kütüphaneye gelerek veya internet sitesi üzerinden süreyi bir kez daha (15 gün) uzatabilirsiniz.\n3. Zamanında iade edilmeyen her kitap için günlük 2 TL gecikme cezası uygulanır. Gecikme cezası 50 TL'yi aşan üyelerin kartları iptal edilir.\n4. Ödünç alınan kitapların sayfalarının yırtılması veya kitabın kaybedilmesi durumunda, üye kitabın güncel satış fiyatını ödemek zorundadır.\n5. Dergiler, ansiklopediler ve nadir eserler (eski el yazmaları) kütüphane dışına çıkarılamaz; sadece okuma salonunda incelenebilir.",
        "questions": [
          {
            "id": "s20-p1-q1",
            "type": "multiple_choice",
            "question": "Bir kütüphane üyesi aynı anda en fazla kaç kitap alabilir?",
            "options": [
              "1 adet",
              "3 adet",
              "5 adet",
              "Sınır yoktur"
            ],
            "correctOption": 1,
            "explanation": "Üyeler tek seferde en fazla 3 adet kitap ödünç alabilirler."
          },
          {
            "id": "s20-p1-q2",
            "type": "multiple_choice",
            "question": "Kitabını 15 gün içinde okuyup bitiremeyen bir kişi ne yapmalıdır?",
            "options": [
              "Kitabı gizlice kütüphaneye bırakıp kaçmalıdır.",
              "Kitabı yeni bir kitapla değiştirmelidir.",
              "Kütüphaneye gelerek veya internetten iade süresini 15 gün daha uzatmalıdır.",
              "Gecikme cezası ödememek için kitabı yırtmalıdır."
            ],
            "correctOption": 2,
            "explanation": "İnternet sitesi üzerinden veya gelerek süreyi bir kez daha (15 gün) uzatabilirsiniz."
          },
          {
            "id": "s20-p1-q3",
            "type": "multiple_choice",
            "question": "Kitabı 5 gün geç iade eden bir kişi ne kadar ceza öder?",
            "options": [
              "Ceza ödemez.",
              "5 TL",
              "10 TL",
              "50 TL"
            ],
            "correctOption": 2,
            "explanation": "Günlük 2 TL ceza vardır. 5 x 2 = 10 TL öder."
          },
          {
            "id": "s20-p1-q4",
            "type": "multiple_choice",
            "question": "Kütüphaneden aldığı kitabı kaybeden veya yırttan bir kişinin sorumluluğu nedir?",
            "options": [
              "Sadece bir daha kütüphaneye gelmemektir.",
              "Polise şikayet edilir.",
              "Kendi evinden başka bir kitap getirmelidir.",
              "Kaybedilen kitabın güncel satış fiyatını kütüphaneye ödemelidir."
            ],
            "correctOption": 3,
            "explanation": "Kitabın güncel satış fiyatını ödemek zorundadır."
          },
          {
            "id": "s20-p1-q5",
            "type": "multiple_choice",
            "question": "Aşağıdaki eserlerden hangisi kütüphane dışına (eve) götürülebilir?",
            "options": [
              "Tarihi el yazmaları (nadir eserler)",
              "Ansiklopediler",
              "Normal okuma kitapları (romanlar vb.)",
              "Aylık dergiler"
            ],
            "correctOption": 2,
            "explanation": "Dergiler, ansiklopediler ve nadir eserler kütüphane dışına çıkarılamaz. Geriye normal kitaplar kalır."
          },
          {
            "id": "s20-p1-q6",
            "type": "multiple_choice",
            "question": "Bu metnin temel yazılış amacı nedir?",
            "options": [
              "Kütüphanenin adresini tarif etmek",
              "Yeni çıkan kitapların reklamını yapmak",
              "Kitap ödünç alma ve iade etme düzenini sağlamak",
              "İnsanlara zorla kitap okutmak"
            ],
            "correctOption": 2,
            "explanation": "Bu kurallar ödünç kitap düzenini (ödünç alma/iade etme) sağlamak için yazılmıştır."
          }
        ]
      },
      {
        "id": "s20-p2",
        "title": "Üniversite Sınavına Hazırlık Taktikleri",
        "category": "Eğitim / Eşleştirme",
        "level": "B1",
        "content": "A) Mert: Sınavlara hazırlanırken benim tek güvendiğim şey bolca deneme sınavı (pratik test) çözmektir. Konu anlatımı dinlemek beni çok sıkıyor. Hata yaptığım soruların cevaplarına bakarak konuyu test üzerinden kendi kendime öğreniyorum.\n\nB) Buse: Ben tamamen disiplin ve plana inanırım. Duvarımda aylar öncesinden hazırlanmış renkli bir çalışma programı vardır. Her gün saat kaçta kalkacağım, hangi konuya çalışıp kaç soru çözeceğim dakikası dakikasına bellidir. Planım bozulursa çok stres olurum.\n\nC) Ozan: Benim en iyi çalışma taktiğim 'başkasına anlatmak'tır. Bir konuyu kendi başıma okuduktan sonra evdeki kardeşimi veya arkadaşlarımı karşıma oturtur, sanki öğretmenmişim gibi konuyu onlara anlatırım. Anlatırken bilgilerin beynime kazındığını hissediyorum.\n\nD) Aylin: Uzun süre masa başında kalmak bana göre değil. Ben 'Pomodoro' tekniğini kullanıyorum. 25 dakika odaklanarak çalışıp, ardından 5 dakika mutlaka müzik dinleyerek ara veriyorum. Kısa ve yoğun çalışma seansları benim dikkatimi her zaman yüksek tutuyor.",
        "questions": [
          {
            "id": "s20-p2-q1",
            "type": "matching_paragraph",
            "question": "Konuları, karşısında biri varmış gibi yüksek sesle öğreterek pekiştiren kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 2,
            "explanation": "Ozan, birilerini karşına oturtup öğretmenmiş gibi anlatarak çalıştığını söylemiştir."
          },
          {
            "id": "s20-p2-q2",
            "type": "matching_paragraph",
            "question": "Uzun süre odaklanamayan, bu yüzden çalışmasını kısa zaman dilimlerine ve molalara bölen kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 3,
            "explanation": "Aylin uzun süre masa başında kalamadığını ve 25 dakika çalışıp 5 dakika ara verdiğini belirtmiştir."
          },
          {
            "id": "s20-p2-q3",
            "type": "matching_paragraph",
            "question": "Başarısını tamamen katı (esnemeyen) bir zaman yönetimine ve programa bağlayan kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 1,
            "explanation": "Buse disiplin ve plana inandığını, dakikası dakikasına uyduğunu ifade etmiştir."
          },
          {
            "id": "s20-p2-q4",
            "type": "matching_paragraph",
            "question": "Teori (konu dinlemek) yerine doğrudan soru ve deneme çözerek (pratik yaparak) öğrenen kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 0,
            "explanation": "Mert konu dinlemekten sıkıldığını ve bolca deneme çözerek test üzerinden öğrendiğini belirtmiştir."
          },
          {
            "id": "s20-p2-q5",
            "type": "matching_paragraph",
            "question": "Çalışma saatlerinde günlük programından saptığında (programı bozulduğunda) endişelenen kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 1,
            "explanation": "Buse 'Planım bozulursa çok stres olurum' demiştir."
          },
          {
            "id": "s20-p2-q6",
            "type": "matching_paragraph",
            "question": "Çalışırken hata yaptığı (yanlış çözdüğü) soruların üzerinden konuları kavrayan kişi kimdir?",
            "options": [
              "A) Mert",
              "B) Buse",
              "C) Ozan",
              "D) Aylin"
            ],
            "correctOption": 0,
            "explanation": "Mert, hata yaptığı soruların cevaplarına bakarak konuyu öğrendiğini söylemiştir."
          }
        ]
      },
      {
        "id": "s20-p3",
        "title": "Radyoaktivitenin Annesi: Marie Curie",
        "category": "Tarih ve Biyografi",
        "level": "B2",
        "content": "Polonya asıllı Fransız fizikçi ve kimyager Marie Curie, bilim tarihinin en önemli ve efsanevi kadın figürüdür. 19. yüzyılın sonlarında eşi Pierre Curie ile birlikte uranyum madeni üzerinde çalışırken 'radyoaktivite' kavramını keşfetmiş ve polonyum ile radyum elementlerini bulmuştur. Bilim dünyasında kadınların ciddiye alınmadığı bir dönemde, 1903 yılında Nobel Fizik Ödülü'nü (eşinin ısrarıyla) kazanarak bu ödülü alan ilk kadın olmuştur. Daha da inanılmazı, 1911 yılında bu kez Nobel Kimya Ödülü'nü tek başına kazanarak tarihte iki farklı bilim dalında Nobel kazanan tek insan unvanına erişmesidir. Curie, çalışmalarının patentini alıp zengin olmak yerine, radyum elementinin tıp dünyasında (özellikle kanser tümörlerinin tedavisinde) kullanılması için tüm formüllerini insanlığa ücretsiz olarak bağışlamıştır. Ne yazık ki, yıllarca laboratuvarda korunmasız bir şekilde radyasyona maruz kalması nedeniyle lösemi hastalığına yakalanmış ve 1934 yılında hayatını kaybetmiştir. Bilim uğruna kendi hayatını feda etmesi, onu ölümsüzleştirmiştir.",
        "questions": [
          {
            "id": "s20-p3-q1",
            "type": "true_false_not_given",
            "question": "Marie Curie, radyoaktivite üzerine yaptığı ilk çalışmaları eşi Pierre Curie ile birlikte gerçekleştirmiştir.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. '19. yüzyılın sonlarında eşi Pierre Curie ile birlikte... çalışırken' deyilgan."
          },
          {
            "id": "s20-p3-q2",
            "type": "true_false_not_given",
            "question": "Marie Curie, dünyada Nobel Ödülü'nü kazanan ilk insandır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. İlk insan emas, 'bu ödülü alan ilk kadın olmuştur' deyilgan."
          },
          {
            "id": "s20-p3-q3",
            "type": "true_false_not_given",
            "question": "Curie, tarihte iki farklı bilim dalında (Fizik ve Kimya) Nobel Ödülü kazanan tek insandır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'iki farklı bilim dalında Nobel kazanan tek insan unvanına erişmesidir' deb yozilgan."
          },
          {
            "id": "s20-p3-q4",
            "type": "true_false_not_given",
            "question": "Marie Curie, radyum elementinin telif hakkını satarak çok büyük bir servet kazanmıştır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 1,
            "explanation": "Yanlış. 'patentini alıp zengin olmak yerine... insanlığa ücretsiz olarak bağışlamıştır' deyilgan."
          },
          {
            "id": "s20-p3-q5",
            "type": "true_false_not_given",
            "question": "Radyum elementi günümüzde hala sadece kanser tedavisinde kullanılmaktadır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 2,
            "explanation": "Metinde Yok. 'Özellikle kanser tümörlerinin tedavisinde' deb aytilgan, lekin Hali ham FAQAT shu maqsad uchun ishlashi haqida ma'lumot yo'q."
          },
          {
            "id": "s20-p3-q6",
            "type": "true_false_not_given",
            "question": "Curie'nin ölüm nedeni, üzerinde çalıştığı radyoaktif elementlerin vücuduna verdiği kalıcı zarardır.",
            "options": [
              "Doğru",
              "Yanlış",
              "Metinde Yok",
              "Hem doğru hem yanlış"
            ],
            "correctOption": 0,
            "explanation": "Doğru. 'radyasyona maruz kalması nedeniyle lösemi hastalığına yakalanmış ve... hayatını kaybetmiştir' yozilgan."
          }
        ]
      },
      {
        "id": "s20-p4",
        "title": "Abonelik Tuzağı: Hiç Kullanmadığımız Şeylere Neden Para Ödüyoruz?",
        "category": "Ekonomi ve Psikoloji",
        "level": "C1",
        "content": "Dijital çağın en karlı iş modeli şüphesiz ki 'Abonelik Sistemi'dir (Subscription Economy). Eskiden filmleri, müzikleri veya yazılımları tek seferlik bir ücret ödeyerek satın alırdık. Günümüzde ise şirketler, ürünü bize satmak yerine aylık küçük ücretler karşılığında kiralamayı tercih ediyor. Netflix, Spotify veya spor salonu üyelikleri bu modelin en iyi örnekleridir. [ 1 ]. Tüketici psikolojisinde buna 'Kayıptan Kaçınma' (Loss Aversion) zafiyeti denir. Aylık 50 TL gibi küçük bir rakam, beynimize o hizmeti iptal etmenin yaratacağı 'belki yarın izlerim' veya 'belki haftaya spora başlarım' şeklindeki potansiyel kayıp hissinden daha az acı verir. [ 2 ]. Otomatik ödeme talimatları sayesinde bu küçük ücretler, biz farkına bile varmadan yıllarca kredi kartımızdan çekilmeye devam eder. Ekonomistlere göre ortalama bir birey, her ay hiç kullanmadığı dijital platformlara yüzlerce lira ödeyerek şirketlerin devasa servetler kazanmasına 'uykuda' katkı sağlamaktadır.",
        "questions": [
          {
            "id": "s20-p4-q1",
            "type": "sentence_insertion",
            "question": "Metindeki [ 1 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Müzik dinlemek insanları her zaman rahatlatır.",
              "Ancak işin ilginç tarafı, çoğu insanın aylar boyunca bu platformları hiç kullanmamasına rağmen aboneliklerini iptal etmemesidir.",
              "Korsan film izlemek yasal olarak büyük bir suçtur.",
              "Eskiden sadece gazeteler için abonelik yapılırdı."
            ],
            "correctOption": 1,
            "explanation": "Bo'shliqdan oldin abonementlarning turlari (Netflix, Spotify) sanaldi, keyin esa buni psixologik 'Kayıptan Kaçınma' deyishini izohladi. Demak o'rtaga 'odamlar buni ishlatmasa ham bekor qilmasligi' jumlasi tushishi kerak."
          },
          {
            "id": "s20-p4-q2",
            "type": "sentence_insertion",
            "question": "Metindeki [ 2 ] numaralı boşluğa düşüncenin akışına göre aşağıdakilerden hangisi getirilmelidir?",
            "options": [
              "Buna ek olarak, şirketler iptal işlemlerini kasıtlı olarak karmaşık ve zor hale getirerek süreci uzatırlar.",
              "Spora gitmek sağlıklı bir yaşam için çok önemlidir.",
              "İnsanlar maaşlarını genellikle ayın ilk haftasında alırlar.",
              "Televizyon dizileri son yıllarda çok kalitesizleşmiştir."
            ],
            "correctOption": 0,
            "explanation": "Keyingi gapda 'Otomatik ödeme' orqali yillar davomida pul yechilishi aytiladi, unga bog'lash uchun 'iptal (bekor qilish) ni qiyinlashtirishlari' buni mukammal to'ldiradi."
          },
          {
            "id": "s20-p4-q3",
            "type": "multiple_choice",
            "question": "Abonelik (Subscription) ekonomisinin eskiden kullanılan alışveriş modelinden en büyük farkı nedir?",
            "options": [
              "Ürünlerin eskisine göre daha pahalı olması.",
              "Kişinin ürüne tamamen sahip olmak (tek seferde satın almak) yerine, küçük aylık ödemelerle ürünü veya hizmeti kiralaması.",
              "Sadece interneti olmayan kişilere hizmet vermesi.",
              "Alışverişin sadece nakit parayla yapılması."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'tek seferlik bir ücret ödeyerek satın alırdık. Günümüzde ise... aylık küçük ücretler karşılığında kiralamayı tercih ediyor' deyilgan."
          },
          {
            "id": "s20-p4-q4",
            "type": "kelime",
            "question": "Metindeki 'Kayıptan Kaçınma' (Loss Aversion) ifadesi neyi anlatmaktadır?",
            "options": [
              "Bir insanın parasını veya eşyasını çaldırmaktan korkması.",
              "Küçük bir maddi bedel ödemeyi, o hizmete erişim hakkını kaybetmenin yaratacağı rahatsızlık ve pişmanlık hissine tercih etme psikolojisi.",
              "Şirketlerin zarar etmemek için fiyatları artırması.",
              "İnsanların kalabalıkta kaybolma korkusu."
            ],
            "correctOption": 1,
            "explanation": "Kayıptan Kaçınma - bir narsani butunlay yo'qotgandan ko'ra, kichik pul to'lab ushlab turishni ma'qul ko'rish."
          },
          {
            "id": "s20-p4-q5",
            "type": "multiple_choice",
            "question": "Metne göre insanların kullanmadıkları abonelikleri iptal etmemesinin bir diğer teknik nedeni nedir?",
            "options": [
              "Otomatik ödeme talimatları sayesinde paranın hesaptan sessizce ve fark edilmeden çekilmesi.",
              "İptal edenlere hapishane cezası verilmesi.",
              "Müşteri hizmetlerinin sürekli telefonla arayıp insanları ikna etmesi.",
              "İnternetin çok yavaş olması."
            ],
            "correctOption": 0,
            "explanation": "Matnda 'Otomatik ödeme talimatları sayesinde... biz farkına bile varmadan yıllarca kredi kartımızdan çekilmeye devam eder' deyilgan."
          },
          {
            "id": "s20-p4-q6",
            "type": "cikarim",
            "question": "Yazara göre 'uykuda katkı sağlamak' ifadesiyle tüketicilerin hangi durumu eleştirilmektedir?",
            "options": [
              "Gece geç saatlerde internetten çok fazla dizi izlemeleri.",
              "İnsanların uyurken televizyonu açık bırakarak elektrik israfı yapmaları.",
              "Tüketicilerin finansal farkındalıklarının olmaması ve kendi ceplerinden çıkan parayı sorgulamadan (bilinçsizce) şirketleri zengin etmeleri.",
              "Bankaların çok fazla kredi vermesi."
            ],
            "correctOption": 2,
            "explanation": "Uykuda (uyquda) pul to'lash — bu o'z byudjetini nazorat qilmaslik (bilinçsizlik) ni bildiradi."
          }
        ]
      },
      {
        "id": "s20-p5",
        "title": "Hayvan Deneyleri: Bilimin Karanlık Yüzü",
        "category": "Biyoloji ve Etik",
        "level": "C1",
        "content": "Modern tıbbın, farmakolojinin ve hatta kozmetik endüstrisinin günümüzdeki seviyesine ulaşmasında hayvan deneylerinin rolü tartışılmazdır. Aşılar, kanser ilaçları ve ameliyat teknikleri geliştirilirken her yıl milyonlarca fare, tavşan, köpek ve maymun laboratuvarlarda kullanılmakta (ve çoğu zaman feda edilmektedir). Bilim insanlarının büyük bir kısmı, insan hayatını kurtarmak ve hastalıkları yenmek için hayvan deneklerinin 'gerekli bir kötülük' olduğunu savunmaktadır. Çünkü bir ilacın insan vücudundaki karmaşık yan etkileri bilgisayar simülasyonlarıyla henüz tam olarak ölçülememektedir. Ancak Hayvan Hakları Savunucuları, hisseden ve acı çeken canlıların insanların refahı için laboratuvarlarda işkence görmesinin ahlaki (etik) bir felaket olduğunu belirtmektedir. Üstelik bir farede işe yarayan bir ilacın, genetik farklılıklar nedeniyle insanlarda başarılı olma garantisi de yoktur. Günümüzde 'organ-on-a-chip' (çip üstünde organ) gibi insan hücrelerinden üretilen mikro-sistemler, hayvan deneylerine umut verici bir alternatif olarak yükselmektedir; ancak tamamen onların yerini alması için daha uzun yıllar gerekmektedir.",
        "questions": [
          {
            "id": "s20-p5-q1",
            "type": "ana_fikir",
            "question": "Metnin ana fikri aşağıdakilerden hangisidir?",
            "options": [
              "Hayvan deneyleri hiçbir bilimsel işe yaramayan gereksiz bir uygulamadır.",
              "Çip üstünde organ teknolojisi sayesinde hayvan deneyleri bugün tamamen yasaklanmıştır.",
              "Hayvan deneyleri, insan sağlığı için tıbbi bir zorunluluk (gerekli bir kötülük) olarak görülse de, ciddi ahlaki ve etik tartışmalara yol açmaktadır.",
              "Hayvanlar, laboratuvarda çalışmaktan acı duymazlar."
            ],
            "correctOption": 2,
            "explanation": "Matnda hayvonlarda tajriba qilishning foydasi (tibbiyot) va uning axloqiy zarari o'rtasidagi ziddiyat ochib berilgan."
          },
          {
            "id": "s20-p5-q2",
            "type": "multiple_choice",
            "question": "Bilim insanlarının hayvan deneylerini savunmasındaki temel argüman (gerekçe) nedir?",
            "options": [
              "Hayvanların deneylerde kullanılmasının çok ucuz olması.",
              "Bilgisayar simülasyonlarının, yeni bir ilacın insan vücudundaki tüm karmaşık yan etkilerini henüz tam olarak ölçememesi.",
              "Hayvanların insanlardan daha zeki olması.",
              "Kozmetik ürünlerinin sadece hayvanlar üzerinde test edilebilmesi."
            ],
            "correctOption": 1,
            "explanation": "Matnda 'bir ilacın insan vücudundaki karmaşık yan etkileri bilgisayar simülasyonlarıyla henüz tam olarak ölçülememektedir' deyilgan."
          },
          {
            "id": "s20-p5-q3",
            "type": "multiple_choice",
            "question": "Hayvan hakları savunucularının hayvan deneylerine karşı çıkmasındaki en büyük dayanağı (sebebi) nedir?",
            "options": [
              "Hayvanların çok fazla yemek yiyerek laboratuvar bütçesini tüketmesi.",
              "Sadece köpeklerin değil, kedilerin de deneylerde kullanılması gerektiğini düşünmeleri.",
              "Acı çeken ve hisseden canlıların, sadece insanların faydası (refahı) için eziyet görmesinin ahlaki olarak yanlış olması.",
              "Hayvanların hastanelerde doktorları ısırması."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'hisseden ve acı çeken canlıların insanların refahı için laboratuvarlarda işkence görmesinin ahlaki bir felaket olduğunu' yozilgan."
          },
          {
            "id": "s20-p5-q4",
            "type": "kelime",
            "question": "Metinde geçen 'gerekli bir kötülük' (necessary evil) ifades neyi anlatmaktadır?",
            "options": [
              "Çok kötü insanların yaptığı zalimce davranışlar.",
              "Özünde hoş olmayan veya ahlaken rahatsız edici olan ancak daha büyük bir iyiliği (insan hayatını) kurtarmak için yapılması zorunlu görülen eylem.",
              "Laboratuvarda çalışan bilim insanlarının kötü niyetli olması.",
              "Hayvan hastalıklarının insanlara bulaşması."
            ],
            "correctOption": 1,
            "explanation": "Gerekli kötülük - umuman olganda yomon narsa, lekin yaxshi maqsad (insonni qutqarish) uchun majburan qilinadigan ish."
          },
          {
            "id": "s20-p5-q5",
            "type": "cikarim",
            "question": "Metne göre, bir kanser ilacının laboratuvardaki fareler üzerinde çok başarılı olması ne anlama gelir?",
            "options": [
              "İlacın insanlarda da %100 başarılı olacağı anlamına gelir.",
              "İlacın derhal eczanelerde satılabileceği anlamına gelir.",
              "Genetik farklılıklardan dolayı, farenin iyileşmesinin ilacın insanda da kesin işe yarayacağı anlamına gelmez.",
              "Farenin bir daha asla hastalanmayacağı anlamına gelir."
            ],
            "correctOption": 2,
            "explanation": "Matnda 'bir farede işe yarayan bir ilacın, genetik farklılıklar nedeniyle insanlarda başarılı olma garantisi de yoktur' deyilgan."
          },
          {
            "id": "s20-p5-q6",
            "type": "multiple_choice",
            "question": "Gelecekte hayvan deneylerini tamamen bitirmesi umut edilen yenilikçi teknoloji hangisidir?",
            "options": [
              "Teleskoplarla uzay araştırmaları yapmak.",
              "İnsan hücrelerinden üretilen 'çip üstünde organ' (organ-on-a-chip) gibi mikro-sistemler geliştirmek.",
              "Ameliyatlarda büyük robot kollar kullanmak.",
              "İlaçları sadece bitkiler (yapraklar) üzerinde denemek."
            ],
            "correctOption": 1,
            "explanation": "Metnin sonunda 'organ-on-a-chip gibi insan hücrelerinden üretilen mikro-sistemler'in alternatif olacağı belirtilmiştir."
          }
        ]
      }
    ]
  }
]

export const READING_SECTION_COUNT = 20
export const QUESTIONS_PER_READING_SECTION = 30
export const ACTIVE_READING_SECTION_COUNT = uploadedReadingSections.filter((section) => section.status === 'active').length

function withFlatQuestions(section) {
  return {
    ...section,
    title: `Bo‘lim ${section.sectionNumber}`,
    questions: section.passages.flatMap((passage) => passage.questions.map((question) => ({
      ...question,
      passage: passage.content,
      sourceTitle: passage.title,
      level: passage.level,
      category: passage.category,
    }))),
  }
}

const loadedSections = uploadedReadingSections.map(withFlatQuestions)
const upcomingSections = Array.from(
  { length: Math.max(0, READING_SECTION_COUNT - loadedSections.length) },
  (_, index) => {
    const sectionNumber = loadedSections.length + index + 1
    return {
      id: `reading-section-${sectionNumber}`,
      sectionNumber,
      title: `Bo‘lim ${sectionNumber}`,
      status: 'upcoming',
      sourceFile: null,
      passages: [],
      questions: [],
    }
  },
)

export const readingExamSections = [...loadedSections, ...upcomingSections]
