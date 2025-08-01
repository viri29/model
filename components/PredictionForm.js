// components/PredictionForm.js
// Example Next.js component using SageMaker

import { useState } from 'react';

export default function PredictionForm() {
    const [features, setFeatures] = useState([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...features];
        newFeatures[index] = parseFloat(value) || 0;
        setFeatures(newFeatures);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ features }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get prediction');
            }

            setPrediction(data.prediction);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">SageMaker Prediction</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Input Features (10 values):
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {features.map((feature, index) => (
                            <input
                                key={index}
                                type="number"
                                step="0.1"
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Getting Prediction...' : 'Get Prediction'}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {prediction !== null && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    <strong>Prediction:</strong> {prediction.toFixed(4)}
                </div>
            )}
        </div>
    );
} 