package com.example.spotify.player

import android.annotation.SuppressLint
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import com.example.spotify.data.model.RepeatMode
import com.example.spotify.data.model.Track
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.random.Random

class AudioPlayerManager(private val context: Context) {

    private val handler = Handler(Looper.getMainLooper())

    private val _currentTrack = MutableStateFlow<Track?>(null)
    val currentTrack: StateFlow<Track?> = _currentTrack.asStateFlow()

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _currentTimeSeconds = MutableStateFlow(0f)
    val currentTimeSeconds: StateFlow<Float> = _currentTimeSeconds.asStateFlow()

    private val _durationSeconds = MutableStateFlow(0f)
    val durationSeconds: StateFlow<Float> = _durationSeconds.asStateFlow()

    private val _queue = MutableStateFlow<List<Track>>(emptyList())
    val queue: StateFlow<List<Track>> = _queue.asStateFlow()

    private val _queueIndex = MutableStateFlow(-1)
    val queueIndex: StateFlow<Int> = _queueIndex.asStateFlow()

    private val _isShuffle = MutableStateFlow(false)
    val isShuffle: StateFlow<Boolean> = _isShuffle.asStateFlow()

    private val _repeatMode = MutableStateFlow(RepeatMode.OFF)
    val repeatMode: StateFlow<RepeatMode> = _repeatMode.asStateFlow()

    private val _volume = MutableStateFlow(0.85f)
    val volume: StateFlow<Float> = _volume.asStateFlow()

    private val _isMuted = MutableStateFlow(false)
    val isMuted: StateFlow<Boolean> = _isMuted.asStateFlow()

    private val playedHistory = mutableListOf<Int>()
    private var webView: WebView? = null
    private var isPlayerReady = false
    private var pendingTrackId: String? = null

    // Fallback ticker for timeline in case iframe events delay
    private val timelineTicker = object : Runnable {
        override fun run() {
            if (_isPlaying.value && _durationSeconds.value > 0) {
                val nextPos = _currentTimeSeconds.value + 1f
                if (nextPos >= _durationSeconds.value) {
                    onTrackEnded()
                } else {
                    _currentTimeSeconds.value = nextPos
                    handler.postDelayed(this, 1000)
                }
            }
        }
    }

    init {
        initWebView()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun initWebView() {
        handler.post {
            try {
                webView = WebView(context).apply {
                    settings.javaScriptEnabled = true
                    settings.mediaPlaybackRequiresUserGesture = false
                    settings.cacheMode = WebSettings.LOAD_DEFAULT
                    settings.domStorageEnabled = true
                    webChromeClient = WebChromeClient()
                    webViewClient = object : WebViewClient() {}

                    addJavascriptInterface(object {
                        @JavascriptInterface
                        fun onReady() {
                            handler.post {
                                isPlayerReady = true
                                pendingTrackId?.let { id ->
                                    pendingTrackId = null
                                    loadVideoById(id)
                                }
                            }
                        }

                        @JavascriptInterface
                        fun onStateChange(state: Int) {
                            handler.post {
                                when (state) {
                                    1 -> { // Playing
                                        _isPlaying.value = true
                                        _isLoading.value = false
                                        startTimelineTicker()
                                    }
                                    2 -> { // Paused
                                        _isPlaying.value = false
                                        _isLoading.value = false
                                        stopTimelineTicker()
                                    }
                                    3 -> { // Buffering
                                        _isLoading.value = true
                                    }
                                    0 -> { // Ended
                                        _isPlaying.value = false
                                        _isLoading.value = false
                                        onTrackEnded()
                                    }
                                }
                            }
                        }

                        @JavascriptInterface
                        fun onProgress(current: Float, duration: Float) {
                            handler.post {
                                if (duration > 0) {
                                    _durationSeconds.value = duration
                                }
                                _currentTimeSeconds.value = current
                            }
                        }

                        @JavascriptInterface
                        fun onError(errorCode: Int) {
                            handler.post {
                                _isLoading.value = false
                                // Skip unplayable video
                                nextTrack()
                            }
                        }
                    }, "AndroidBridge")

                    val html = """
                        <!DOCTYPE html>
                        <html>
                        <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <script src="https://www.youtube.com/iframe_api"></script>
                        <script>
                        var player = null;
                        function onYouTubeIframeAPIReady() {
                            player = new YT.Player('yt-player', {
                                height: '100%',
                                width: '100%',
                                playerVars: {
                                    'autoplay': 1,
                                    'controls': 0,
                                    'disablekb': 1,
                                    'fs': 0,
                                    'rel': 0,
                                    'playsinline': 1,
                                    'origin': 'https://www.youtube.com'
                                },
                                events: {
                                    'onReady': function(e) { if(window.AndroidBridge) window.AndroidBridge.onReady(); },
                                    'onStateChange': function(e) { if(window.AndroidBridge) window.AndroidBridge.onStateChange(e.data); },
                                    'onError': function(e) { if(window.AndroidBridge) window.AndroidBridge.onError(e.data); }
                                }
                            });
                        }
                        function loadTrack(id) {
                            if (player && player.loadVideoById) {
                                player.loadVideoById(id);
                            }
                        }
                        function playTrack() {
                            if (player && player.playVideo) player.playVideo();
                        }
                        function pauseTrack() {
                            if (player && player.pauseVideo) player.pauseVideo();
                        }
                        function seekTo(sec) {
                            if (player && player.seekTo) player.seekTo(sec, true);
                        }
                        function setVol(v) {
                            if (player && player.setVolume) player.setVolume(v);
                        }
                        setInterval(function() {
                            if (player && player.getCurrentTime && player.getDuration) {
                                var c = player.getCurrentTime();
                                var d = player.getDuration();
                                if (window.AndroidBridge && typeof window.AndroidBridge.onProgress === 'function') {
                                    window.AndroidBridge.onProgress(c, d);
                                }
                            }
                        }, 500);
                        </script>
                        </head>
                        <body style="margin:0;padding:0;background:#000;">
                        <div id="yt-player" style="width:100%;height:100%;"></div>
                        </body>
                        </html>
                    """.trimIndent()

                    loadDataWithBaseURL("https://www.youtube.com", html, "text/html", "UTF-8", null)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun loadVideoById(trackId: String) {
        if (isPlayerReady) {
            val js = "loadTrack('$trackId');"
            webView?.evaluateJavascript(js, null)
        } else {
            pendingTrackId = trackId
        }
    }

    fun playTrack(track: Track, contextList: List<Track> = listOf(track)) {
        val list = if (contextList.isNotEmpty()) contextList else listOf(track)
        val index = list.indexOfFirst { it.id == track.id }.let { if (it >= 0) it else 0 }

        _queue.value = list
        _queueIndex.value = index
        playedHistory.clear()

        startPlayingTrack(track)
    }

    private fun startPlayingTrack(track: Track) {
        _currentTrack.value = track
        _currentTimeSeconds.value = 0f
        _durationSeconds.value = track.durationSeconds.toFloat()
        _isLoading.value = true
        _isPlaying.value = true

        loadVideoById(track.id)
        startTimelineTicker()
    }

    fun togglePlayPause() {
        if (_currentTrack.value == null) {
            // Pick first in queue or first in catalog if none
            val track = _queue.value.getOrNull(0) ?: com.example.spotify.data.Catalog.ALL_TRACKS.first()
            playTrack(track, com.example.spotify.data.Catalog.ALL_TRACKS)
            return
        }

        if (_isPlaying.value) {
            _isPlaying.value = false
            webView?.evaluateJavascript("pauseTrack();", null)
            stopTimelineTicker()
        } else {
            _isPlaying.value = true
            webView?.evaluateJavascript("playTrack();", null)
            startTimelineTicker()
        }
    }

    fun nextTrack() {
        val q = _queue.value
        if (q.isEmpty()) return

        val currentIndex = _queueIndex.value
        if (_isShuffle.value && q.size > 1) {
            var nextIndex = Random.nextInt(q.size)
            if (nextIndex == currentIndex) {
                nextIndex = (nextIndex + 1) % q.size
            }
            playedHistory.add(currentIndex)
            _queueIndex.value = nextIndex
            startPlayingTrack(q[nextIndex])
            return
        }

        if (currentIndex + 1 < q.size) {
            playedHistory.add(currentIndex)
            val nextIndex = currentIndex + 1
            _queueIndex.value = nextIndex
            startPlayingTrack(q[nextIndex])
        } else if (_repeatMode.value == RepeatMode.ALL) {
            playedHistory.add(currentIndex)
            _queueIndex.value = 0
            startPlayingTrack(q[0])
        } else if (_repeatMode.value == RepeatMode.ONE) {
            startPlayingTrack(q[currentIndex])
        } else {
            // End of queue
            _isPlaying.value = false
            stopTimelineTicker()
        }
    }

    fun previousTrack() {
        // If more than 3 seconds in, restart track
        if (_currentTimeSeconds.value > 3f) {
            seekTo(0f)
            return
        }

        if (playedHistory.isNotEmpty()) {
            val prevIndex = playedHistory.removeAt(playedHistory.size - 1)
            val q = _queue.value
            if (prevIndex in q.indices) {
                _queueIndex.value = prevIndex
                startPlayingTrack(q[prevIndex])
                return
            }
        }

        val currentIndex = _queueIndex.value
        val q = _queue.value
        if (currentIndex > 0 && q.isNotEmpty()) {
            val prevIndex = currentIndex - 1
            _queueIndex.value = prevIndex
            startPlayingTrack(q[prevIndex])
        } else {
            seekTo(0f)
        }
    }

    fun seekTo(seconds: Float) {
        val clamped = seconds.coerceIn(0f, _durationSeconds.value)
        _currentTimeSeconds.value = clamped
        webView?.evaluateJavascript("seekTo($clamped);", null)
    }

    fun toggleShuffle() {
        _isShuffle.value = !_isShuffle.value
    }

    fun toggleRepeat() {
        _repeatMode.value = when (_repeatMode.value) {
            RepeatMode.OFF -> RepeatMode.ALL
            RepeatMode.ALL -> RepeatMode.ONE
            RepeatMode.ONE -> RepeatMode.OFF
        }
    }

    fun setVolume(vol: Float) {
        val clamped = vol.coerceIn(0f, 1f)
        _volume.value = clamped
        _isMuted.value = (clamped == 0f)
        val intVol = (clamped * 100).toInt()
        webView?.evaluateJavascript("setVol($intVol);", null)
    }

    fun toggleMute() {
        val nowMuted = !_isMuted.value
        _isMuted.value = nowMuted
        val vol = if (nowMuted) 0 else (_volume.value * 100).toInt()
        webView?.evaluateJavascript("setVol($vol);", null)
    }

    fun addToQueue(track: Track) {
        _queue.value = _queue.value + track
    }

    fun playFromQueue(index: Int) {
        val q = _queue.value
        if (index in q.indices) {
            _queueIndex.value = index
            startPlayingTrack(q[index])
        }
    }

    private fun onTrackEnded() {
        when (_repeatMode.value) {
            RepeatMode.ONE -> {
                seekTo(0f)
                _isPlaying.value = true
                webView?.evaluateJavascript("playTrack();", null)
                startTimelineTicker()
            }
            else -> nextTrack()
        }
    }

    private fun startTimelineTicker() {
        handler.removeCallbacks(timelineTicker)
        handler.postDelayed(timelineTicker, 1000)
    }

    private fun stopTimelineTicker() {
        handler.removeCallbacks(timelineTicker)
    }
}
