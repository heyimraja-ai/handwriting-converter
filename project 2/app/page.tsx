'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setSelectedFile(file);
      setResult(''); // Clear previous results
    }
  };

  const handleConvert = async () => {
    if (!selectedFile || isLoading) return;
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("data", selectedFile, selectedFile.name);   // field name MUST be "data"
      fd.append("filename", selectedFile.name);
      fd.append("mime", selectedFile.type || "image/jpeg");

      const res = await fetch("/api/convert", { method: "POST", body: fd });
      const text = await res.text();
      setResult(text);
    } catch {
      setResult("Error: Failed to process image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result || result.startsWith('Error:')) return;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-text-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600">
      {/* Simplified Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-orange-600/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-amber-700/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-800/20 to-transparent" />
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 z-20">
        <div className="group cursor-pointer">
          <h2 className="text-2xl font-bold text-white drop-shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:text-yellow-200">
            <span className="bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent">
              Scrptbl
            </span>
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          {/* Glassmorphism Card */}
          <div className="rounded-3xl border border-white/20 bg-white/15 backdrop-blur-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Handwriting Converter
              </h1>
              <p className="text-white/80 text-lg">
                Upload an image with handwritten text to convert it to digital text
              </p>
            </div>

            {/* File Upload Area */}
            <div className="mb-6">
              <input
                type="file"
                id="file-input"
                accept="image/png,image/jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="file-input"
                className="block w-full p-8 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:scale-[1.02] text-center group"
              >
                <div className="text-white/80 group-hover:text-white transition-colors duration-300">
                  {selectedFile ? (
                    <div>
                      <div className="text-lg font-medium mb-2">Selected File:</div>
                      <div className="text-sm bg-white/20 group-hover:bg-white/30 rounded-lg p-3 inline-block transition-all duration-300">
                        {selectedFile.name}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">📄</div>
                      <div className="text-lg font-medium mb-2">Choose an image</div>
                      <div className="text-sm">PNG or JPG files only</div>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Convert Button */}
            <div className="mb-6">
              <button
                onClick={handleConvert}
                disabled={!selectedFile || isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                    Converting...
                  </div>
                ) : (
                  'Convert to Text'
                )}
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Converted Text:</h3>
                  {!result.startsWith('Error:') && (
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40"
                    >
                      Download
                    </button>
                  )}
                </div>
                <pre className="text-white/90 whitespace-pre-wrap text-sm leading-relaxed">
                  {result}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}