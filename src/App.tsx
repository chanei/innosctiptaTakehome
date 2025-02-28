import { FC, useEffect, useState } from "react";
import axios from "axios";

type AppProps = {
  title: string
}

type FormattedArticleDataType = {
  id: string,
  title: string,
  description?: string,
  source?: string,
  url?: string
}

const APIKEYS = {
  NEWSAPI_KEY: process.env.REACT_APP_NEWSAPI_KEY,
  GUARDIANAPI_KEY: process.env.REACT_APP_GUARDIANAPI_KEY,
}

const NEWSAPI_URL = "https://newsapi.org/v2/everything";
const GUARDIANAPI_URL = "https://content.guardianapis.com/search";
const NEWSAPIORG_URL = "https://newsapi.org/v2/everything";


const App: FC<AppProps> = ({ title }) => {
  const [query, setQuery] = useState<string>("tesla");
  const [fromDate, setFromDate] = useState<string>("2025-01-28");
  const [articles, setArticles] = useState<FormattedArticleDataType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedApiSource, setSelectedApiSource] = useState<string>("all");

  const fetchArticleData = async () => {
    try {
      setLoading(true);
      setError(null);

      const newsapiUrl = `${NEWSAPI_URL}?q=${query}&from=${fromDate}&pageSize=10&sortBy=publishedAt&apiKey=${APIKEYS.NEWSAPI_KEY}`;
      const guardianapiUrl = `${GUARDIANAPI_URL}?q=${query}&from=${fromDate}&page-size=10&order-by=relevance&api-key=${APIKEYS.GUARDIANAPI_KEY}`;
      const newsapiorgUrl = `${NEWSAPIORG_URL}?q=${query}&from=${fromDate}&pageSize=10&sortBy=publishedAt&apiKey=${APIKEYS.NEWSAPI_KEY}`;

      let formattedData1: FormattedArticleDataType[] = [];
      let formattedData2: FormattedArticleDataType[] = [];
      let formattedData3: FormattedArticleDataType[] = [];

      if (selectedApiSource === "all" || selectedApiSource === "api1") {
        const res1 = await axios.get(newsapiUrl);
        formattedData1 = res1.data.articles.map((article: any) => ({
          id: article.source.id,
          title: article.title,
          description: article.description,
          source: article.source.name,
          url: article.url,
        }));
      }

      if (selectedApiSource === "all" || selectedApiSource === "api2") {
        const res2 = await axios.get(guardianapiUrl);
        formattedData2 = res2.data.response.results.map((result: any) => ({
          id: result.webPublicationDate,
          title: result.webTitle,
          description: result.webUrl,
          url: result.webUrl
        }));
      }

      if (selectedApiSource === "all" || selectedApiSource === "api3") {
        const res3 = await axios.get(newsapiorgUrl);
        formattedData3 = res3.data.articles.map((article: any) => ({
          id: article.source.id,
          title: article.title,
          description: article.description,
          source: article.source.name,
          url: article.url,
        }));
      }

      // merge the formated data
      const mergedData = [...formattedData1, ...formattedData2, ...formattedData3];
      setArticles(mergedData);
    } catch (err) {
      setError("Failed to fetch article data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleData();
  }, [])
  return <div>
    <h2>Search News</h2>
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter keyword (e.g., Tesla)"
      />
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <select value={selectedApiSource} onChange={(e) => setSelectedApiSource(e.target.value)}>
        <option value="all">All Sources</option>
        <option value="api1">NewsAPI</option>
        <option value="api2">The Guardian</option>
        <option value="api3">NewsAPI.org</option>
      </select>
      <button onClick={fetchArticleData} disabled={loading}>
        {loading ? "Loading..." : "Search"}
      </button>
    </div>

    {error && <p style={{ color: "red" }}>Error: {error}</p>}

    <h1>{title}</h1>
    <ul>
      {articles.map((item) => {
        return (
          <li key={item.id}>
            <strong>{item.title}</strong> <br /> {item.description}
            {item.source && <span> (Source: {item.source})</span>}
            <br />
            {item.url && (
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                Read more
              </a>
            )}
          </li>
        );
      })}
    </ul>
  </div>
}

export default App;
