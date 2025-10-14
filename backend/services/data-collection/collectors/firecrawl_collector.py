"""
Firecrawl MCP integration for web data collection

This collector uses Firecrawl (self-hosted on Docker Desktop at localhost:3002)
for web scraping, searching, crawling, and site mapping.
"""
import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime
from config import get_settings


class FirecrawlCollector:
    """
    Firecrawl API wrapper for data collection

    Uses self-hosted Firecrawl instance on Docker Desktop (localhost:3002)
    """

    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.FIRECRAWL_API_URL
        self.api_key = self.settings.FIRECRAWL_API_KEY
        self.timeout = self.settings.DEFAULT_TIMEOUT

    async def scrape_page(
        self,
        url: str,
        formats: List[str] = ["markdown"],
        only_main_content: bool = True
    ) -> Dict[str, Any]:
        """
        Scrape a single page using Firecrawl

        Args:
            url: Target URL to scrape
            formats: Output formats (markdown, html, rawHtml, links, screenshot)
            only_main_content: Extract only main content (remove headers, footers, nav)

        Returns:
            Dictionary containing scraped data
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    f"{self.base_url}/v1/scrape",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "url": url,
                        "formats": formats,
                        "onlyMainContent": only_main_content
                    }
                )
                response.raise_for_status()
                data = response.json()

                return {
                    "success": data.get("success", False),
                    "url": url,
                    "content": data.get("data", {}),
                    "metadata": data.get("metadata", {}),
                    "scraped_at": datetime.utcnow().isoformat()
                }

            except httpx.HTTPError as e:
                return {
                    "success": False,
                    "url": url,
                    "error": str(e),
                    "scraped_at": datetime.utcnow().isoformat()
                }

    async def search_web(
        self,
        query: str,
        limit: int = 10,
        scrape_options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Search the web and extract content from results

        Args:
            query: Search query
            limit: Number of results to return
            scrape_options: Optional scraping configuration

        Returns:
            Dictionary containing search results and scraped content
        """
        async with httpx.AsyncClient(timeout=self.timeout * 2) as client:
            try:
                payload = {
                    "query": query,
                    "limit": limit
                }

                if scrape_options:
                    payload["scrapeOptions"] = scrape_options

                response = await client.post(
                    f"{self.base_url}/v1/search",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json=payload
                )
                response.raise_for_status()
                data = response.json()

                return {
                    "success": data.get("success", False),
                    "query": query,
                    "results": data.get("data", []),
                    "count": len(data.get("data", [])),
                    "searched_at": datetime.utcnow().isoformat()
                }

            except httpx.HTTPError as e:
                return {
                    "success": False,
                    "query": query,
                    "error": str(e),
                    "searched_at": datetime.utcnow().isoformat()
                }

    async def crawl_site(
        self,
        url: str,
        max_pages: int = 50,
        allowed_domains: Optional[List[str]] = None,
        exclude_paths: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Crawl a website and extract content from multiple pages

        Args:
            url: Starting URL
            max_pages: Maximum pages to crawl
            allowed_domains: List of allowed domains
            exclude_paths: URL patterns to exclude

        Returns:
            Dictionary containing crawl job information
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                payload = {
                    "url": url,
                    "limit": max_pages,
                    "scrapeOptions": {
                        "formats": ["markdown"],
                        "onlyMainContent": True
                    }
                }

                if allowed_domains:
                    payload["allowedDomains"] = allowed_domains

                if exclude_paths:
                    payload["excludePaths"] = exclude_paths

                response = await client.post(
                    f"{self.base_url}/v1/crawl",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json=payload
                )
                response.raise_for_status()
                data = response.json()

                return {
                    "success": data.get("success", False),
                    "url": url,
                    "job_id": data.get("id"),
                    "status": "started",
                    "started_at": datetime.utcnow().isoformat()
                }

            except httpx.HTTPError as e:
                return {
                    "success": False,
                    "url": url,
                    "error": str(e),
                    "started_at": datetime.utcnow().isoformat()
                }

    async def check_crawl_status(self, job_id: str) -> Dict[str, Any]:
        """
        Check the status of a crawl job

        Args:
            job_id: Crawl job ID

        Returns:
            Dictionary containing job status and results
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.get(
                    f"{self.base_url}/v1/crawl/{job_id}",
                    headers={
                        "Authorization": f"Bearer {self.api_key}"
                    }
                )
                response.raise_for_status()
                data = response.json()

                return {
                    "success": True,
                    "job_id": job_id,
                    "status": data.get("status"),
                    "total_pages": data.get("total", 0),
                    "completed_pages": data.get("completed", 0),
                    "data": data.get("data", []),
                    "checked_at": datetime.utcnow().isoformat()
                }

            except httpx.HTTPError as e:
                return {
                    "success": False,
                    "job_id": job_id,
                    "error": str(e),
                    "checked_at": datetime.utcnow().isoformat()
                }

    async def map_site(
        self,
        url: str,
        include_subdomains: bool = False,
        limit: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Map a website to discover all URLs

        Args:
            url: Website URL to map
            include_subdomains: Include subdomains in mapping
            limit: Maximum URLs to discover

        Returns:
            Dictionary containing discovered URLs
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                payload = {
                    "url": url,
                    "includeSubdomains": include_subdomains
                }

                if limit:
                    payload["limit"] = limit

                response = await client.post(
                    f"{self.base_url}/v1/map",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json=payload
                )
                response.raise_for_status()
                data = response.json()

                return {
                    "success": data.get("success", False),
                    "url": url,
                    "urls": data.get("links", []),
                    "count": len(data.get("links", [])),
                    "mapped_at": datetime.utcnow().isoformat()
                }

            except httpx.HTTPError as e:
                return {
                    "success": False,
                    "url": url,
                    "error": str(e),
                    "mapped_at": datetime.utcnow().isoformat()
                }
