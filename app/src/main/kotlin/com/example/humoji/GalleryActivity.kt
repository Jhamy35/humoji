package com.example.humoji

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import com.example.humoji.adapters.HumojiAdapter
import com.example.humoji.databinding.ActivityGalleryBinding
import com.example.humoji.storage.HumojiStorage

class GalleryActivity : AppCompatActivity() {
    private lateinit var binding: ActivityGalleryBinding
    private lateinit var humojiStorage: HumojiStorage

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityGalleryBinding.inflate(layoutInflater)
        setContentView(binding.root)

        humojiStorage = HumojiStorage(this)
        setupUI()
        loadHumojis()
    }

    private fun setupUI() {
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = "My Humojis"

        binding.recyclerView.apply {
            layoutManager = GridLayoutManager(this@GalleryActivity, 3)
        }
    }

    private fun loadHumojis() {
        val humojis = humojiStorage.getAllHumojis()
        binding.recyclerView.adapter = HumojiAdapter(humojis) { humoji ->
            // Handle humoji click
            val intent = Intent(this, EditActivity::class.java)
            intent.putExtra("humoji_id", humoji.id)
            startActivity(intent)
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }
}