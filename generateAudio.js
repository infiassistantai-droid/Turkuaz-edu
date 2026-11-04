import axios from 'axios'
import { createWriteStream } from 'node:fs'
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const inputPath = path.join(projectRoot, 'src', 'data', 'dinlemaExamSection.json')
const outputDir = path.join(projectRoot, 'public', 'audio')
const voiceId = 'pNInz6obpgDQGcFmaJgB';
const apiKey = process.env.ELEVENLABS_API_KEY

async function ensureAudioFile(item, index) {
  const questionNumber = index + 1
  const fileName = `dinleme_sec1_q${questionNumber}.mp3`
  const audioPath = path.join(outputDir, fileName)
  const temporaryPath = `${audioPath}.part`
  const audioScript = typeof item.audio_script === 'string' ? item.audio_script.trim() : ''

  if (!audioScript) {
    throw new Error(`Question ${questionNumber} has no non-empty audio_script.`)
  }

  try {
    const existing = await stat(audioPath)
    if (existing.size > 0) {
      item.audioUrl = `/audio/${fileName}`
      console.log(`Using existing ${fileName}`)
      return
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  const response = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`,
    {
      text: audioScript,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
      },
    },
    {
      headers: {
        'xi-api-key': apiKey,
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
      timeout: 120_000,
    },
  )

  try {
    await pipeline(response.data, createWriteStream(temporaryPath))
    await rename(temporaryPath, audioPath)
  } catch (error) {
    await rm(temporaryPath, { force: true })
    throw error
  }

  item.audioUrl = `/audio/${fileName}`
  console.log(`Generated ${fileName}`)
}

async function main() {
  let inputText
  try {
    inputText = await readFile(inputPath, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Input file not found: ${inputPath}`)
    }
    throw error
  }

  let exam
  try {
    exam = JSON.parse(inputText)
  } catch (error) {
    throw new Error(`Input file is not valid JSON: ${error.message}`)
  }

  if (!Array.isArray(exam)) {
    throw new Error('Expected the input JSON to contain an array of question objects.')
  }

  for (const [index, item] of exam.entries()) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`Question ${index + 1} must be a JSON object.`)
    }
    if (typeof item.audio_script !== 'string' || !item.audio_script.trim()) {
      throw new Error(`Question ${index + 1} is missing a non-empty audio_script.`)
    }
  }

  if (!apiKey) {
    throw new Error('Missing ELEVENLABS_API_KEY. Set it in your environment; the key is intentionally not stored in this script.')
  }
  if (!voiceId || voiceId === 'YOUR_VOICE_ID_HERE') {
    throw new Error('Missing ELEVENLABS_VOICE_ID.')
  }

  await mkdir(outputDir, { recursive: true })
  for (const [index, item] of exam.entries()) {
    await ensureAudioFile(item, index)
  }

  const updatedPath = `${inputPath}.tmp`
  await writeFile(updatedPath, `${JSON.stringify(exam, null, 2)}\n`, 'utf8')
  await rename(updatedPath, inputPath)
  console.log(`Updated ${path.basename(inputPath)} with ${exam.length} audioUrl values.`)
}

main().catch(async (error) => {
  if (error.response && error.response.data) {
    let errorText = '';
    for await (const chunk of error.response.data) {
      errorText += chunk;
    }
    console.error("\n❌ ELEVENLABS API XATOSI:", errorText);
  } else {
    console.error(`Xatolik: ${error.message}`);
  }
  process.exitCode = 1;
})