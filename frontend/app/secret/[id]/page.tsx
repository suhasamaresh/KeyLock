"use client";

import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';

export default function SecretPage(){
    const params = useParams<{id: string}>();
    const id = params.id;

    const [secret, setSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading , setLoading] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);

    useEffect (() =>{
        if(!id) return;

        fetch(`https://keylock-1.onrender.com/api/secret/${id}`)
    .then(res => {
        if (!res.ok) {
            throw new Error('Secret not found or expired');
        }
        return res.json();
    })
    .then(data => {
        console.log("Backend response:", data); 
        const secretContent = data.secret || data.content || data.message || data;
        
        setSecret(secretContent);
        setLoading(false);
    })
    .catch(err => {
        setError(err.message);
        setLoading(false);
    });

    }, [id]);

    const copyToClipboard = async () =>{
        if(secret){
            try {
                await navigator.clipboard.writeText(secret);
                setCopied(true);
                setTimeout(()=> setCopied(false), 2000);
            } catch (error) {
                console.error('Failed to copy secret:', error);
            }
        }
    };

    const goBack = () =>{
        window.history.back();
    };

    return(
        <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#16161a" }}
    >
      <div className="max-w-2xl w-full">
        {loading && (
          <div className="text-center">
            <div 
              className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-4"
              style={{ borderColor: "#7f5af0 transparent transparent transparent" }}
            />
            <p 
              className="text-lg font-medium"
              style={{ color: "#94a1b2" }}
            >
              Retrieving your secret...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <div className="text-6xl">🔒</div>
              <h1 
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "#fffffe" }}
              >
                Secret Not Found
              </h1>
              <p 
                className="text-lg max-w-md mx-auto"
                style={{ color: "#94a1b2" }}
              >
                {error}. This secret may have expired or reached its view limit.
              </p>
            </div>
            <button
              onClick={goBack}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50"
              style={{
                backgroundColor: "#7f5af0",
                color: "#fffffe",
              }}
            >
              ← Go Back
            </button>
          </div>
        )}

        {secret && (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="text-5xl">🔓</div>
              <h1 
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "#fffffe" }}
              >
                Your Secret Message
              </h1>
              <p 
                className="text-sm"
                style={{ color: "#94a1b2" }}
              >
                This message will only be shown once for security reasons.
              </p>
            </div>

            <div 
              className="p-6 rounded-xl border border-opacity-20 border-gray-600"
              style={{ backgroundColor: "rgba(255, 255, 254, 0.05)" }}
            >
              <div 
                className="text-lg md:text-xl font-medium leading-relaxed text-center break-words"
                style={{ color: "#fffffe" }}
              >
                {secret}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50"
                style={{
                  backgroundColor: "#7f5af0",
                  color: "#fffffe",
                }}
              >
                {copied ? "✓ Copied!" : "📋 Copy Secret"}
              </button>
              <button
                onClick={goBack}
                className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 border border-opacity-20 border-gray-600"
                style={{
                  backgroundColor: "rgba(255, 255, 254, 0.05)",
                  color: "#94a1b2",
                }}
              >
                Done
              </button>
            </div>

            <div 
              className="text-xs text-center p-4 rounded-lg border border-opacity-10 border-gray-600"
              style={{ 
                backgroundColor: "rgba(255, 255, 254, 0.02)",
                color: "#94a1b2" 
              }}
            >
              <strong className='text-yellow-300'>Note:</strong> This secret has been retrieved and may no longer be accessible. 
              Make sure to save it somewhere secure if needed.
            </div>
          </div>
        )}
      </div>
    </div>
    )
};