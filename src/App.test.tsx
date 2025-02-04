import { sortBySentimentScore, SentimentResult } from './App';

describe('sortBySentimentScore', () => {
  const mockDataResults: SentimentResult[] = [
    {
      text: 'Neutral text',
      sentiment: 'NEUTRAL',
      sentimentScore: { Mixed: 0.1, Positive: 0.3, Neutral: 0.5, Negative: 0.1 }
    },
    {
      text: 'Very positive text',
      sentiment: 'POSITIVE',
      sentimentScore: { Mixed: 0.05, Positive: 0.9, Neutral: 0.04, Negative: 0.01 }
    },
    {
      text: 'Negative text',
      sentiment: 'NEGATIVE',
      sentimentScore: { Mixed: 0.1, Positive: 0.1, Neutral: 0.2, Negative: 0.6 }
    }
  ];

  test('[Test 1] Sorts the results by sentiment score correctly', () => {
    const sorted = sortBySentimentScore(mockDataResults);
    expect(sorted[0].text).toBe('Very positive text');
    expect(sorted[1].text).toBe('Neutral text');
    expect(sorted[2].text).toBe('Negative text');
  });

  test('[Test 2] Handle empty array', () => {
    const sorted = sortBySentimentScore([]);
    expect(sorted).toEqual([]);
  });

  test('[Test 3] Handle null/undefined input', () => {
    const sorted = sortBySentimentScore(null as any);
    expect(sorted).toEqual([]);
  });

  test('[Test 4] Handle array with one element', () => {
    const singleElementArray: SentimentResult[] = [mockDataResults[0]];
    const sorted = sortBySentimentScore(singleElementArray);
    expect(sorted).toEqual(singleElementArray);
  });

  test('[Test 5] Handle all same sentiment scores', () => {
    const sameScores: SentimentResult[] = [
      {
        text: 'Text A',
        sentiment: 'POSITIVE',
        sentimentScore: { Mixed: 0.1, Positive: 0.3, Neutral: 0.3, Negative: 0.3 }
      },
      {
        text: 'Text B',
        sentiment: 'POSITIVE',
        sentimentScore: { Mixed: 0.1, Positive: 0.3, Neutral: 0.3, Negative: 0.3 }
      }
    ];
    const sorted = sortBySentimentScore(sameScores);
    expect(sorted).toEqual(sameScores);
  });
});