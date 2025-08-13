"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Copy, ArrowLeft } from 'lucide-react';

export default function SecretPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [secret, setSecret] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (!id) return;

        fetch(`https://keylock.onrender.com/api/secret/${id}`)
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

    const copyToClipboard = async () => {
        if (secret) {
            try {
                await navigator.clipboard.writeText(secret);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error('Failed to copy secret:', error);
            }
        }
    };

    const goBack = () => {
        window.history.back();
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{
                background: `
                    linear-gradient(180deg, 
                        #1C1917 0%, 
                        #292524 25%, 
                        #1C1917 50%, 
                        #0C0A09 75%, 
                        #000000 100%
                    )`,
            }}
        >
            <div className="max-w-2xl w-full">
                {loading && (
                    <div className="text-center space-y-4">
                        <div 
                            className="text-6xl mb-6"
                        >
                            🔐
                        </div>
                        <p 
                            className="text-xl"
                            style={{ color: "#A8A29E" }}
                        >
                            Retrieving your secret...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="text-center space-y-8">
                        <div className="space-y-4">
                            <div className="text-6xl">🔒</div>
                            <h1 
                                className="text-3xl font-bold"
                                style={{ color: "#F5F5F4" }}
                            >
                                Secret Not Found
                            </h1>
                            <p 
                                className="text-lg max-w-md mx-auto"
                                style={{ color: "#A8A29E" }}
                            >
                                {error}. This secret may have expired or reached its view limit.
                            </p>
                        </div>
                        <button
                            onClick={goBack}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                            style={{
                                backgroundColor: "#F97316",
                                color: "#F5F5F4",
                            }}
                        >
                            <ArrowLeft size={18} />
                            Go Back
                        </button>
                    </div>
                )}

                {secret && (
                    <div className="space-y-8">
                        <div className="text-center space-y-4">
                            <div className="text-6xl">🔓</div>
                            <h1 
                                className="text-3xl font-bold"
                                style={{ color: "#F5F5F4" }}
                            >
                                Your Secret Message
                            </h1>
                            <p 
                                className="text-sm"
                                style={{ color: "#A8A29E" }}
                            >
                                This message will only be shown once for security reasons.
                            </p>
                        </div>

                        <div 
                            className="p-8 rounded-2xl border border-[#44403C]"
                            style={{ backgroundColor: "rgba(255, 255, 254, 0.05)" }}
                        >
                            <div 
                                className="text-xl leading-relaxed text-center break-words"
                                style={{ color: "#F5F5F4" }}
                            >
                                {secret}
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={copyToClipboard}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                                style={{
                                    backgroundColor: "#F97316",
                                    color: "#F5F5F4",
                                }}
                            >
                                <Copy size={18} />
                                {copied ? "Copied!" : "Copy"}
                            </button>
                            <button
                                onClick={goBack}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 border border-[#44403C]"
                                style={{
                                    backgroundColor: "rgba(255, 255, 254, 0.05)",
                                    color: "#A8A29E",
                                }}
                            >
                                <ArrowLeft size={18} />
                                Done
                            </button>
                        </div>

                        <div 
                            className="text-sm text-center p-4 rounded-lg border border-[#44403C]"
                            style={{ 
                                backgroundColor: "rgba(255, 255, 254, 0.02)",
                                color: "#A8A29E" 
                            }}
                        >
                            <strong style={{ color: "#F97316" }}>Note:</strong> This secret has been retrieved and may no longer be accessible.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}