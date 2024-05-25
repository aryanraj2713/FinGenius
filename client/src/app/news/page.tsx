"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import { Nav } from '@/components/nav';

interface Article {
    source: { id: string | null; name: string };
    author: string;
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    content: string;
}

const App: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(5);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/finance_news')
            .then(response => {
                setArticles(response.data.articles);
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, []);

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <Nav />
            <div className="container mx-auto p-4 mt-20">
                <h1 className="text-2xl font-bold mb-4">News Articles</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {articles.map(article => (
                        <ArticleCard key={article.url} article={article} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    return (
        <div className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-sm text-gray-600 mb-2"><strong>Source:</strong> {article.source.name}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Author:</strong> {article.author}</p>
            <p className="text-sm text-gray-600 mb-2"><strong>Published At:</strong> {new Date(article.publishedAt).toLocaleString()}</p>
            <p className="text-sm mb-4">{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Read more
            </a>
        </div>
    );
};

export default App;
