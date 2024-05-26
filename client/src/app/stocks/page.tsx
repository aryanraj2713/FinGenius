"use client";
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Nav } from '@/components/nav';

interface NewsArticle {
    uuid: string;
    title: string;
    publisher: string;
    link: string;
    thumbnail: {
        resolutions: {
            url: string;
            width: number;
            height: number;
            tag: string;
        }[];
    };
    relatedTickers: string[];
}

const App: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [results, setResults] = useState<NewsArticle[] | null>(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/news/${searchQuery}`);
            setResults(Object.values(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <Nav />
            <div className="bg-gray-100 flex items-center justify-center mt-10 py-10">
                <div className="bg-white p-6 rounded shadow-md w-10/12">
                    <h1 className="text-2xl font-bold mb-4">Search for stock news</h1>
                    <div className="mb-4">
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Search for news..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="w-full bg-black text-white p-2 rounded hover:bg-gray-600"
                    >
                        Search
                    </button>
                    {results && (
                        <div className="mt-4">
                            <h2 className="text-xl font-bold mb-2">Results:</h2>
                            <div className="flex flex-wrap justify-evenly">
                                {results.map((article) => (
                                    <div key={article.uuid} className="bg-gray-100 p-4 rounded shadow max-w-sm mb-4 mx-2">
                                        <img
                                            src={article.thumbnail.resolutions[0].url}
                                            alt={article.title}
                                            className="w-full h-48 object-cover mb-2 rounded"
                                        />
                                        <h3 className="text-lg font-bold">{article.title}</h3>
                                        <p className="text-sm text-gray-600">{article.publisher}</p>
                                        <a
                                            href={article.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline mt-2 inline-block"
                                        >
                                            Read more
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;