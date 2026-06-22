'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Location states
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting location...');

  // Get user location as soon as the app loads
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus('Location secured.');
        },
        (error) => {
          setLocationStatus('Location access denied. Manual search required.');
        }
      );
    } else {
      setLocationStatus('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleAnalyze = async () => {
    if (!symptoms) return;
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: symptoms }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.detail || "Server error occurred. Check your backend terminal.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Failed to connect to the backend. Is FastAPI running?");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">MediAI Rescue</h1>
          <p className="text-slate-500">AI-Powered Emergency Medical Assistant</p>
        </div>

        {/* Input Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Describe the emergency symptoms:
          </label>
          <textarea 
            className="w-full p-4 text-lg font-medium text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition shadow-inner"
            rows={4}
            placeholder="e.g., My chest feels tight and my left arm is numb..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 w-full bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing Severity...' : 'Get Emergency Protocol'}
          </button>
        </div>
        {/* Results Section */}
        {result && !error && (
          <div className="space-y-6 animate-fade-in">
            {/* Protocol Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Emergency Protocol</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  result.severity_level === 'Critical' ? 'bg-red-100 text-red-700' : 
                  result.severity_level === 'High' ? 'bg-orange-100 text-orange-700' : 
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {result.severity_level || 'Unknown'} Risk
                </span>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-1">Suspected Condition</p>
                <p className="text-lg font-medium text-slate-800">{result.suspected_condition || 'Pending Analysis'}</p>
              </div>

              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2">Immediate First Aid</p>
                <ul className="space-y-3">
                  {result.first_aid_steps?.map((step: string, index: number) => (
                    <li key={index} className="flex items-start bg-slate-50 p-3 rounded border border-slate-100">
                      <span className="text-emerald-500 mr-3 font-bold">•</span>
                      <span className="text-slate-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hospital Finder Card */}
            <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center">
                  <span className="mr-2">🏥</span> Nearby Hospitals
                </h3>
                <p className="text-sm text-slate-400 mt-1">{locationStatus}</p>
              </div>
              
              <a 
                href={location 
                  ? `https://www.google.com/maps/search/emergency+hospital/@${location.lat},${location.lng},14z` 
                  : `https://www.google.com/maps/search/emergency+hospital`}
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 sm:mt-0 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-2 px-6 rounded-lg transition"
              >
                Open Maps
              </a>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}