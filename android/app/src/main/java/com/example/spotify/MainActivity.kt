package com.example.spotify

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.spotify.data.SpotifyRepository
import com.example.spotify.player.AudioPlayerManager
import com.example.spotify.ui.MainScreen
import com.example.spotify.ui.SpotifyViewModel
import com.example.spotify.ui.theme.DarkBackground
import com.example.spotify.ui.theme.SpotifyTheme

class MainActivity : ComponentActivity() {

    private lateinit var viewModel: SpotifyViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val repository = SpotifyRepository(applicationContext)
        val playerManager = AudioPlayerManager(applicationContext)
        viewModel = SpotifyViewModel(repository, playerManager)

        setContent {
            SpotifyTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = DarkBackground
                ) {
                    MainScreen(viewModel = viewModel)
                }
            }
        }
    }
}
