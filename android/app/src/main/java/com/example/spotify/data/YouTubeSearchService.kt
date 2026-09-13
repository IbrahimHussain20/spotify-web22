package com.example.spotify.data

import com.example.spotify.data.model.Track
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

class YouTubeSearchService(private val repository: SpotifyRepository) {

    suspend fun search(query: String): List<Track> = withContext(Dispatchers.IO) {
        val trimmed = query.trim()
        if (trimmed.isEmpty()) return@withContext emptyList()

        val apiKey = repository.apiKey.value
        if (apiKey.isNotEmpty()) {
            val apiResults = searchViaDataApi(trimmed, apiKey)
            if (apiResults.isNotEmpty()) {
                return@withContext apiResults
            }
        }

        // Fallback: search curated Catalog
        return@withContext Catalog.searchCatalog(trimmed)
    }

    private fun searchViaDataApi(query: String, apiKey: String): List<Track> {
        return try {
            val encodedQuery = URLEncoder.encode(query, "UTF-8")
            val encodedKey = URLEncoder.encode(apiKey, "UTF-8")
            val endpoint = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&videoEmbeddable=true&q=$encodedQuery&key=$encodedKey"

            val url = URL(endpoint)
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 8000
                readTimeout = 8000
            }

            if (conn.responseCode == 200) {
                val response = conn.inputStream.bufferedReader().use { it.readText() }
                val root = JSONObject(response)
                val items = root.optJSONArray("items") ?: return emptyList()

                val results = mutableListOf<Track>()
                for (i in 0 until items.length()) {
                    val item = items.getJSONObject(i)
                    val idObj = item.optJSONObject("id")
                    val videoId = idObj?.optString("videoId") ?: continue
                    val snippet = item.optJSONObject("snippet") ?: continue
                    val title = snippet.optString("title", "Unknown Track")
                    val artist = snippet.optString("channelTitle", "YouTube")
                    val thumbnails = snippet.optJSONObject("thumbnails")
                    val highThumb = thumbnails?.optJSONObject("high")?.optString("url")
                    val thumbUrl = highThumb ?: "https://i.ytimg.com/vi/$videoId/hqdefault.jpg"

                    results.add(
                        Track(
                            id = videoId,
                            title = cleanHtmlEntities(title),
                            artist = cleanHtmlEntities(artist),
                            thumbnail = thumbUrl,
                            duration = "3:30",
                            album = "YouTube"
                        )
                    )
                }
                results
            } else {
                emptyList()
            }
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    private fun cleanHtmlEntities(str: String): String {
        return str.replace("&quot;", "\"")
            .replace("&amp;", "&")
            .replace("&#39;", "'")
            .replace("&lt;", "<")
            .replace("&gt;", ">")
    }
}
