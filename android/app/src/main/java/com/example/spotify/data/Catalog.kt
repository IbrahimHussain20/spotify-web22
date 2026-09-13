package com.example.spotify.data

import com.example.spotify.data.model.BrowseCategory
import com.example.spotify.data.model.Track

object Catalog {

    val ALL_TRACKS: List<Track> = listOf(
        Track("2Vv-BfVoq4g", "Perfect", "Ed Sheeran", duration = "4:42"),
        Track("JGwWNGJdvx8", "Shape of You", "Ed Sheeran", duration = "4:24"),
        Track("hT_nvWreIhg", "Counting Stars", "OneRepublic", duration = "4:17"),
        Track("kJQP7kiw5Fk", "Despacito", "Luis Fonsi", duration = "4:42"),
        Track("09R8_2nJtjg", "Sugar", "Maroon 5", duration = "5:02"),
        Track("OPf0YbXqDm0", "Uptown Funk", "Mark Ronson ft. Bruno Mars", duration = "4:31"),
        Track("fJ9rUzIMcZQ", "Bohemian Rhapsody", "Queen", duration = "5:59"),
        Track("RgKAFK5djSk", "See You Again", "Wiz Khalifa ft. Charlie Puth", duration = "3:50"),
        Track("YQHsXMglC9A", "Hello", "Adele", duration = "6:06"),
        Track("hLQl3WQQoQ0", "Someone Like You", "Adele", duration = "4:46"),
        Track("0KSOMA3QBU0", "Dark Horse", "Katy Perry", duration = "3:35"),
        Track("CevxZvSJLk8", "Roar", "Katy Perry", duration = "4:30"),
        Track("9bZkp7q19f0", "Gangnam Style", "PSY", duration = "4:13"),
        Track("UceaB4D0jpo", "Wake Me Up", "Avicii", duration = "4:32"),
        Track("IcrbM1l_BoI", "The Nights", "Avicii", duration = "3:00"),
        Track("YykjpeuMNEk", "Faded", "Alan Walker", duration = "3:33"),
        Track("60ItHLz5WEA", "Alone", "Alan Walker", duration = "2:44"),
        Track("y6120QOlsfU", "Sandstorm", "Darude", duration = "3:45"),
        Track("pRpeEdMmmQ0", "Waka Waka", "Shakira", duration = "3:31"),
        Track("kXYiU_JCYtU", "Numb", "Linkin Park", duration = "3:08"),
        Track("eVTXPUF4Oz4", "In The End", "Linkin Park", duration = "3:37"),
        Track("YVkUvmDQ3HY", "Without Me", "Eminem", duration = "4:52"),
        Track("uelHwf8o7_U", "Love The Way You Lie", "Eminem ft. Rihanna", duration = "4:24"),
        Track("fRh_vgS2dFE", "Sorry", "Justin Bieber", duration = "3:21"),
        Track("oyEuk8j8imI", "Love Yourself", "Justin Bieber", duration = "3:53"),
        Track("7wtfhZwyrcc", "Believer", "Imagine Dragons", duration = "3:25"),
        Track("ktvTqknDobU", "Radioactive", "Imagine Dragons", duration = "3:07"),
        Track("e-ORhEE9VVg", "Blank Space", "Taylor Swift", duration = "4:32"),
        Track("nfWlot6h_JM", "Shake It Off", "Taylor Swift", duration = "3:39"),
        Track("4NRXx6U8ABQ", "Blinding Lights", "The Weeknd", duration = "4:22"),
        Track("XXYlFuWEuKI", "Save Your Tears", "The Weeknd", duration = "3:36"),
        Track("hTWKbfoikeg", "Smells Like Teen Spirit", "Nirvana", duration = "4:39"),
        Track("Q3Kvu6Kgp88", "Summertime Sadness", "Lana Del Rey", duration = "4:02"),
        Track("k2qgadSvNyU", "Let Her Go", "Passenger", duration = "3:39"),
        Track("lp-EO5I60KA", "Thinking Out Loud", "Ed Sheeran", duration = "4:41"),
        Track("PT2_F-1esPk", "Closer", "The Chainsmokers ft. Halsey", duration = "4:05"),
        Track("dT2owtxkU8k", "Don't Let Me Down", "The Chainsmokers", duration = "3:28"),
        Track("2kqdl9NEynY", "Lose Yourself", "Eminem", duration = "5:27"),
        Track("C-du33DcWTI", "Stay", "Rihanna", duration = "3:30"),
        Track("e0GqVGvBkDA", "We Found Love", "Rihanna", duration = "3:36")
    )

    val TRENDING: List<Track> = ALL_TRACKS.take(10)

    val ARTIST_GROUPS: List<Pair<String, List<Track>>> = listOf(
        "Ed Sheeran" to ALL_TRACKS.filter { it.artist.contains("Ed Sheeran", ignoreCase = true) },
        "Taylor Swift" to ALL_TRACKS.filter { it.artist.contains("Taylor Swift", ignoreCase = true) },
        "The Weeknd" to ALL_TRACKS.filter { it.artist.contains("The Weeknd", ignoreCase = true) },
        "Imagine Dragons" to ALL_TRACKS.filter { it.artist.contains("Imagine Dragons", ignoreCase = true) },
        "Electronic Hits" to ALL_TRACKS.filter {
            it.artist.contains("Avicii", ignoreCase = true) ||
            it.artist.contains("Alan Walker", ignoreCase = true) ||
            it.artist.contains("Darude", ignoreCase = true)
        }
    )

    val BROWSE_CATEGORIES: List<BrowseCategory> = listOf(
        BrowseCategory("1", "Top Hits", 0xFFF59E0B, "Top Hits"),
        BrowseCategory("2", "Lo-Fi Beats", 0xFF6366F1, "Lo-Fi"),
        BrowseCategory("3", "Chill Vibes", 0xFF10B981, "Chill"),
        BrowseCategory("4", "Hip-Hop", 0xFFEF4444, "Hip-Hop"),
        BrowseCategory("5", "Electronic", 0xFFA855F7, "Electronic"),
        BrowseCategory("6", "Acoustic", 0xFF84CC16, "Acoustic"),
        BrowseCategory("7", "Pop", 0xFFEC4899, "Pop"),
        BrowseCategory("8", "R&B", 0xFF06B6D4, "R&B")
    )

    fun searchCatalog(query: String): List<Track> {
        val q = query.trim().lowercase()
        if (q.isEmpty()) return emptyList()

        val words = q.split("\\s+".toRegex()).filter { it.isNotEmpty() }
        return ALL_TRACKS.mapNotNull { track ->
            val title = track.title.lowercase()
            val artist = track.artist.lowercase()
            var score = 0
            if (title == q || "$artist $title" == q) score += 1000
            if (title.contains(q) || artist.contains(q)) score += 300
            for (w in words) {
                if (title == w) score += 200
                else if (title.startsWith(w)) score += 100
                else if (title.contains(w)) score += 50

                if (artist == w) score += 150
                else if (artist.startsWith(w)) score += 80
                else if (artist.contains(w)) score += 40
            }
            if (score > 0) track to score else null
        }
            .sortedByDescending { it.second }
            .map { it.first }
    }
}
