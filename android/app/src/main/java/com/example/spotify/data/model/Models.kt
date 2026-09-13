package com.example.spotify.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Track(
    val id: String,
    val title: String,
    val artist: String,
    val thumbnail: String = "https://i.ytimg.com/vi/$id/hqdefault.jpg",
    val duration: String,
    val album: String = "YouTube"
) {
    val durationSeconds: Int
        get() {
            val parts = duration.split(":").mapNotNull { it.toIntOrNull() }
            return when (parts.size) {
                2 -> parts[0] * 60 + parts[1]
                3 -> parts[0] * 3600 + parts[1] * 60 + parts[2]
                else -> 0
            }
        }
}

@Serializable
data class Playlist(
    val id: String,
    val name: String,
    val tracks: List<Track> = emptyList(),
    val createdAt: Long = System.currentTimeMillis()
)

enum class RepeatMode {
    OFF,
    ALL,
    ONE
}

data class BrowseCategory(
    val id: String,
    val name: String,
    val colorHex: Long,
    val searchQuery: String
)
