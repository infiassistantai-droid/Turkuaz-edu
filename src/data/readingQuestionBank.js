const trueFalseOptions = [
  { id: 'true', textKey: 'reading.quiz.true' },
  { id: 'false', textKey: 'reading.quiz.false' },
]

const multipleChoice = (materialId, number, options, correctAnswer) => ({
  type: 'multipleChoice',
  id: `${materialId}-q${number}`,
  questionKey: `reading.quiz.${materialId}.q${number}`,
  options: options.map((id) => ({ id, textKey: `reading.quiz.${materialId}.q${number}.${id}` })),
  correctAnswer,
})

const trueFalse = (materialId, number, correctAnswer) => ({
  type: 'trueFalse',
  id: `${materialId}-q${number}`,
  questionKey: `reading.quiz.${materialId}.q${number}`,
  options: trueFalseOptions,
  correctAnswer,
})

const fillBlank = (materialId, number) => ({
  type: 'fillBlank',
  id: `${materialId}-q${number}`,
  questionKey: `reading.quiz.${materialId}.q${number}`,
  answerKey: `reading.quiz.${materialId}.q${number}.answer`,
})

export const readingQuestionBank = {
  'daily-habits': [
    multipleChoice('daily-habits', 1, ['A', 'B', 'C', 'D'], 'A'),
    trueFalse('daily-habits', 2, 'true'),
    fillBlank('daily-habits', 3),
    multipleChoice('daily-habits', 4, ['A', 'B', 'C', 'D'], 'B'),
    trueFalse('daily-habits', 5, 'false'),
    fillBlank('daily-habits', 6),
    multipleChoice('daily-habits', 7, ['A', 'B', 'C', 'D'], 'C'),
    trueFalse('daily-habits', 8, 'true'),
    fillBlank('daily-habits', 9),
    multipleChoice('daily-habits', 10, ['A', 'B', 'C', 'D'], 'D'),
  ],
  'city-transport': [
    multipleChoice('city-transport', 1, ['A', 'B', 'C', 'D'], 'A'),
    trueFalse('city-transport', 2, 'true'),
    fillBlank('city-transport', 3),
    multipleChoice('city-transport', 4, ['A', 'B', 'C', 'D'], 'B'),
    trueFalse('city-transport', 5, 'true'),
    fillBlank('city-transport', 6),
    multipleChoice('city-transport', 7, ['A', 'B', 'C', 'D'], 'C'),
    trueFalse('city-transport', 8, 'false'),
    fillBlank('city-transport', 9),
    multipleChoice('city-transport', 10, ['A', 'B', 'C', 'D'], 'D'),
  ],
  'nature-and-people': [
    multipleChoice('nature-and-people', 1, ['A', 'B', 'C', 'D'], 'B'),
    trueFalse('nature-and-people', 2, 'false'),
    fillBlank('nature-and-people', 3),
    multipleChoice('nature-and-people', 4, ['A', 'B', 'C', 'D'], 'A'),
    trueFalse('nature-and-people', 5, 'true'),
    fillBlank('nature-and-people', 6),
    multipleChoice('nature-and-people', 7, ['A', 'B', 'C', 'D'], 'C'),
    trueFalse('nature-and-people', 8, 'false'),
    fillBlank('nature-and-people', 9),
    multipleChoice('nature-and-people', 10, ['A', 'B', 'C', 'D'], 'D'),
  ],
  'learning-to-read': [
    multipleChoice('learning-to-read', 1, ['A', 'B', 'C', 'D'], 'A'),
    trueFalse('learning-to-read', 2, 'true'),
    fillBlank('learning-to-read', 3),
    multipleChoice('learning-to-read', 4, ['A', 'B', 'C', 'D'], 'B'),
    trueFalse('learning-to-read', 5, 'false'),
    fillBlank('learning-to-read', 6),
    multipleChoice('learning-to-read', 7, ['A', 'B', 'C', 'D'], 'C'),
    trueFalse('learning-to-read', 8, 'true'),
    fillBlank('learning-to-read', 9),
    multipleChoice('learning-to-read', 10, ['A', 'B', 'C', 'D'], 'D'),
  ],
  'sharing-culture': [
    multipleChoice('sharing-culture', 1, ['A', 'B', 'C', 'D'], 'A'),
    trueFalse('sharing-culture', 2, 'false'),
    fillBlank('sharing-culture', 3),
    multipleChoice('sharing-culture', 4, ['A', 'B', 'C', 'D'], 'B'),
    trueFalse('sharing-culture', 5, 'true'),
    fillBlank('sharing-culture', 6),
    multipleChoice('sharing-culture', 7, ['A', 'B', 'C', 'D'], 'C'),
    trueFalse('sharing-culture', 8, 'false'),
    fillBlank('sharing-culture', 9),
    multipleChoice('sharing-culture', 10, ['A', 'B', 'C', 'D'], 'D'),
  ],
}
