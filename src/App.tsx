import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import AWS from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: "",
  secretAccessKey: ""
});

export interface SentimentResult {
    text: string;
    sentiment: string;
    sentimentScore: {
      Mixed: number;
      Positive: number;
      Neutral: number;
      Negative: number;
    };
  }
  

  //Function that sort the data by sentiment score
  export function sortBySentimentScore(results: SentimentResult[]): SentimentResult[] {
    if (!results || results.length === 0) return [];
  
    return [...results].sort((a, b) => {
      const scoreA = a.sentimentScore.Positive - (a.sentimentScore.Negative + a.sentimentScore.Mixed);
      const scoreB = b.sentimentScore.Positive - (b.sentimentScore.Negative + b.sentimentScore.Mixed);
      return scoreB - scoreA;
    });
  }
  
  const App: React.FC = () => {
    const [text, setText] = useState('');
    const [results, setResults] = useState<SentimentResult[]>([]);
    const comprehend = new AWS.Comprehend();
  
    //Analyze function that triggers on button click to check and send the request to the api
    const analyzeSentiment = async () => {
      if (!text.trim()) return;
  
      try {
        const params = { Text: text, LanguageCode: 'en' };
        const response = await comprehend.detectSentiment(params).promise();
        
        const newResult: SentimentResult = {
          text,
          sentiment: response.Sentiment || 'NEUTRAL',
          sentimentScore: {
            Mixed: response.SentimentScore?.Mixed || 0,
            Positive: response.SentimentScore?.Positive || 0,
            Neutral: response.SentimentScore?.Neutral || 0,
            Negative: response.SentimentScore?.Negative || 0
          }
        };
  
        setResults(sortBySentimentScore([...results, newResult]));
        setText('');
      } catch (error) {
        console.error('Sentiment analysis error:', error);
      }
    };
    
    //Rank each sentiment score and add some design to it
    const getSentimentEmojiDesign = (sentiment: string) => {
      switch (sentiment) {
        case 'POSITIVE': return '✅';
        case 'NEGATIVE': return '❌';
        case 'MIXED': return '⚠️';
        default: return '😐';
      }
    };
  
    return (
      <div>
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your sentence"
        />
        &nbsp;<button onClick={analyzeSentiment}>Analyze</button>
        
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              {result.text} - {result.sentiment} {getSentimentEmojiDesign(result.sentiment)}
              <span>
              &nbsp; Sentiment result: {result.sentimentScore.Positive} &nbsp; Positive Score: {(result.sentimentScore.Positive * 100).toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
  
  export default App;