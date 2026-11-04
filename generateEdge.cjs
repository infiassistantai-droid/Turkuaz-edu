const { MsEdgeTTS, OUTPUT_FORMAT } = require("msedge-tts");
const fs = require("fs");
const path = require("path");

const jsonPath = path.join(__dirname, "src", "data", "dinlemaExamSection.json");
const testData = require(jsonPath);

async function generateAllAudios() {
    const tts = new MsEdgeTTS();
    await tts.setMetadata("tr-TR-EmelNeural", OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    
    console.log("🔊 Audio fayllarni yaratish boshlandi...\n");

    for (let i = 0; i < testData.length; i++) {
        const item = testData[i];
        const textToSpeak = item.audio_script;
        
        if (!textToSpeak) continue;

        const indexStr = String(i + 1).padStart(2, '0');
        const level = item.level || "Mix";
        
        const safeCategory = (item.category || "Test")
            .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/İ/g, 'I').replace(/Ğ/g, 'G').replace(/Ü/g, 'U').replace(/Ş/g, 'S').replace(/Ö/g, 'O').replace(/Ç/g, 'C')
            .replace(/[^a-zA-Z0-9]/g, "_");

        const fileName = `${indexStr}_${level}_${safeCategory}.mp3`;
        const filePath = path.join(__dirname, "public", "audio", fileName);
        
        // AQLLI QISMI: Agar fayl papkada oldindan bor bo'lsa, uni qayta ko'chirmaymiz!
        if (fs.existsSync(filePath)) {
            console.log(`⏭️ O'tkazib yuborildi (Allaqachon tayyor): ${fileName}`);
            item.audio_url = `/audio/${fileName}`;
            continue;
        }
        
        try {
            const { audioStream } = await tts.toStream(textToSpeak);
            const writeStream = fs.createWriteStream(filePath);
            
            audioStream.pipe(writeStream);
            
            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });
            
            console.log(`✅ Tayyor: ${fileName}`);
            item.audio_url = `/audio/${fileName}`;

        } catch (error) {
            console.error(`❌ ${fileName} yaratishda xatolik:`, error.message);
        }
    }
    
    fs.writeFileSync(jsonPath, JSON.stringify(testData, null, 2), 'utf-8');
    
    console.log("\n🎉 Barcha audiolari tartiblandi va JSON fayl avtomatik yangilandi!");
}

generateAllAudios();