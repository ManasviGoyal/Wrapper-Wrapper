import { useState, useEffect } from "react";

export default function ElectricPromptUI() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelStatus, setModelStatus] = useState("unloaded"); // unloaded, loading, ready, error
  const [modelLoadProgress, setModelLoadProgress] = useState(0);
  
  // Simulate model loading on component mount
  useEffect(() => {
    let loadInterval;
    
    const loadModel = () => {
      setModelStatus("loading");
      
      loadInterval = setInterval(() => {
        setModelLoadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          
          if (newProgress >= 100) {
            clearInterval(loadInterval);
            setModelStatus("ready");
            return 100;
          }
          
          return newProgress;
        });
      }, 400);
    };
    
    // Start loading after a brief delay
    const timer = setTimeout(() => {
      loadModel();
    }, 800);
    
    return () => {
      clearTimeout(timer);
      clearInterval(loadInterval);
    };
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate model processing with a timeout and progressively generate text
    let responseText = "";
    const finalResponse = `Response to query: "${prompt}"\n\nThe AI model has analyzed your request and generated this response. The system has processed your input parameters and synthesized the appropriate information based on available data.`;
    let charIndex = 0;
    
    // Set initial empty output
    setOutput("");
    
    // Wait a bit before starting to stream the response
    setTimeout(() => {
      const streamInterval = setInterval(() => {
        if (charIndex < finalResponse.length) {
          responseText += finalResponse.charAt(charIndex);
          setOutput(responseText);
          charIndex++;
        } else {
          clearInterval(streamInterval);
          setIsProcessing(false);
        }
      }, 30);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 p-8 text-gray-100">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">QUANTUM</h1>
          <p className="text-sm text-cyan-300">Advanced Language Processing Interface</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
          
          <div className="relative z-10">
            {modelStatus === "unloaded" && (
              <div className="text-center py-12">
                <p className="text-gray-400">Initializing system...</p>
              </div>
            )}
            
            {modelStatus === "loading" && (
              <div className="py-8">
                <div className="text-center mb-4">
                  <p className="text-cyan-300 font-medium">Loading Quantum Model</p>
                  <p className="text-sm text-gray-400">Please wait while the AI model is being loaded</p>
                </div>
                
                <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300" 
                    style={{ width: `${modelLoadProgress}%` }}
                  ></div>
                </div>
                
                <div className="mt-2 text-right text-xs text-cyan-300">
                  {Math.round(modelLoadProgress)}%
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2 justify-center text-xs text-gray-400">
                  <span>Loading weights...</span>
                  <span>Initializing parameters...</span>
                  <span>Calibrating neurons...</span>
                </div>
              </div>
            )}
            
            {modelStatus === "ready" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-cyan-300">
                      Enter your query:
                    </label>
                    <span className="text-xs px-2 py-1 rounded bg-green-900 text-green-400">
                      Model Ready
                    </span>
                  </div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-3 h-32 rounded-md bg-gray-900 text-gray-100 placeholder-gray-500 border border-gray-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition duration-200"
                    placeholder="Type your request here..."
                    required
                    disabled={isProcessing}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full py-2 px-4 rounded-md ${
                    isProcessing 
                      ? "bg-gray-700 text-gray-400" 
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                  } transition duration-200 shadow-md font-medium`}
                >
                  {isProcessing ? "Processing..." : "Execute Request"}
                </button>
              </form>
            )}
            
            {modelStatus === "error" && (
              <div className="text-center py-12">
                <p className="text-red-400">Failed to load model. Please refresh and try again.</p>
              </div>
            )}
            
            {isProcessing && modelStatus === "ready" && (
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-4 w-4 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  </div>
                  <p className="text-sm text-cyan-300">Processing your request...</p>
                </div>
                
                <div className="flex gap-2 mb-2 text-xs text-gray-400">
                  <span>Tokenizing input...</span>
                  <span>Passing through transformer layers...</span>
                  <span>Generating output...</span>
                </div>
              </div>
            )}
            
            {output && (
              <div className="mt-6 p-4 bg-gray-900 rounded-md border border-gray-700">
                <h3 className="text-sm font-medium mb-2 text-cyan-300">OUTPUT:</h3>
                <div className="whitespace-pre-wrap text-gray-300">{output}</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-xs text-gray-500 text-center">
          <span className="text-cyan-500">■</span> QUANTUM ENGINE v2.4.5 <span className="text-blue-500">■</span>
        </div>
      </div>
    </div>
  );
}
