
import React, { useState, useRef } from 'react';
import type { TokenDetails } from '../../types';
import { generateLogo, editLogo } from '../../services/geminiService';
import Loader from '../Loader';

interface Props {
  formData: TokenDetails;
  updateFormData: (data: Partial<TokenDetails>) => void;
}

const fileToBase64 = (file: File): Promise<{base64: string, mimeType: string}> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ base64: reader.result as string, mimeType: file.type });
        reader.onerror = error => reject(error);
    });
};

const Step2_TokenLogo: React.FC<Props> = ({ formData, updateFormData }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateLogo(prompt);
      updateFormData({ logoUrl: imageUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editPrompt || !formData.logoUrl.startsWith('data:image')) return;
    setIsLoading(true);
    setError(null);
    try {
      const mimeType = formData.logoUrl.match(/data:(.*);base64,/)?.[1] || 'image/png';
      const { newImage } = await editLogo(formData.logoUrl, mimeType, editPrompt);
      updateFormData({ logoUrl: newImage });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setError(null);
      try {
        const { base64 } = await fileToBase64(file);
        updateFormData({ logoUrl: base64 });
        setIsEditing(true);
      } catch (err) {
        setError("Failed to read file.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fade-in">
      <div className="flex flex-col items-center justify-center p-6 bg-gray-900/50 rounded-lg h-full">
        <div className="relative w-48 h-48 mb-4 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center">
            {isLoading ? <Loader /> : <img src={formData.logoUrl} alt="Token Logo" className="w-full h-full object-cover rounded-full" />}
        </div>
        <div className="flex gap-2">
            <button
                type="button"
                onClick={() => setIsEditing(p => !p)}
                disabled={!formData.logoUrl.startsWith('data:image/')}
                className="px-4 py-2 text-xs font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isEditing ? 'Generate New' : 'Edit Image'}
            </button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">
                Upload
            </button>
            <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        </div>
        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
      </div>
      <div className="space-y-6">
        {isEditing ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">Edit Your Logo</h3>
            <p className="text-sm text-gray-400 mb-4">Describe the changes you want to make to the current logo.</p>
            <textarea
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="e.g., 'Make the background a galaxy', 'Add a crown on top'"
              rows={3}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
            <button onClick={handleEdit} disabled={isLoading || !editPrompt} className="w-full mt-2 px-6 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
              {isLoading ? 'Editing...' : 'Apply Edits'}
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-2">Generate Logo with AI</h3>
            <p className="text-sm text-gray-400 mb-4">Describe the logo you want to create. Be descriptive for the best results.</p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'A minimalist phoenix rising, purple and green neon colors'"
              rows={3}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
            <button onClick={handleGenerate} disabled={isLoading || !prompt} className="w-full mt-2 px-6 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">
              {isLoading ? 'Generating...' : 'Generate Logo'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2_TokenLogo;
